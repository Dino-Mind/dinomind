import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./redux/rootReducer";
import { createWrapStore } from "webext-redux";
import { setActiveTab } from "./redux/slices/uiSlice";
import {
  closeSidePanel,
  openSidePanel,
  saveChatHistory,
  summarizeChatHistory,
} from "./redux/slices/sidePanelSlice";

const store = configureStore({
  reducer: rootReducer,
});
const wrapStore = createWrapStore();
wrapStore(store);

// Track the current active tab ID
let currentTabId: number | null = null;

chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (chrome.runtime.lastError) {
      return;
    }
    currentTabId = tab.id || null;
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.active && changeInfo.url) {
    currentTabId = tabId;
  }
});

/////////////////////// OPEN CLOSE sidepanel ///////////////////////
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.active && changeInfo.url) {
    currentTabId = tabId;
  }
});

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  const tabId = currentTabId || message.tabId || sender.tab?.id;

  if (!tabId) {
    sendResponse({ status: "error", message: "No active tab available." });
    return true;
  }

  if (message.action === "openSidePanel") {
    chrome.sidePanel.setOptions({
      tabId,
      path: "sidepanel.html",
      enabled: true,
    });

    await chrome.sidePanel.open({ tabId });

    store.dispatch(openSidePanel());
    sendResponse({ status: "success", isOpen: true });

    await store.dispatch(summarizeChatHistory());
  } else if (message.action === "closeSidePanel") {
    chrome.sidePanel.setOptions({
      tabId,
      enabled: false,
    });

    store.dispatch(saveChatHistory());
    store.dispatch(closeSidePanel());
    sendResponse({ status: "success", isOpen: false });
  }

  return true;
});

//SAVING CHAT DATA
// Listen for extension unload (popup or browser close)
chrome.runtime.onSuspend.addListener(() => {
  store.dispatch(saveChatHistory());
});

// Listen for window closure
chrome.windows.onRemoved.addListener(() => {
  store.dispatch(saveChatHistory());
});

// Listen for tab closure
chrome.tabs.onRemoved.addListener(() => {
  store.dispatch(saveChatHistory());
});

// Track the current active Component
const validComponents = ["ChatBox", "Content", "Interest"];

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "SET_ACTIVE_TAB") {
    const requestedTab = message.payload;

    if (validComponents.includes(requestedTab)) {
      store.dispatch(setActiveTab(requestedTab));
      sendResponse({ status: "success", activeTab: requestedTab });
    } else {
      sendResponse({ status: "error", message: "Invalid component name" });
    }
  } else if (message.type === "GET_ACTIVE_TAB") {
    const state = store.getState();
    sendResponse({ activeTab: state.ui.activeTab });
  }
  return true;
});

// Set the extension icon
chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setIcon({ path: "src/assets/icons/icon400.png" });
});

export {};
