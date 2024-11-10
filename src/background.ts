import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./redux/rootReducer";
import { createWrapStore } from "webext-redux";
import { setActiveTab } from "./redux/slices/uiSlice";

const store = configureStore({
  reducer: rootReducer,
});
const wrapStore = createWrapStore();
wrapStore(store);

const validComponents = ["ChatBox", "Content", "Interest"];

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "SET_ACTIVE_TAB") {
    const requestedTab = message.payload;

    if (validComponents.includes(requestedTab)) {
      store.dispatch(setActiveTab(requestedTab));
      sendResponse({ status: "success", activeTab: requestedTab });
    } else {
      console.warn(`Invalid component name: ${requestedTab}`);
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

// Set up Open-Close Panel behavior
chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error(error));
});

// Listen for Open-Close Panel actions
chrome.runtime.onMessage.addListener((message, sender) => {
  const tabId = sender.tab?.id;

  if (message.action === "openSidePanel" && tabId) {
    chrome.sidePanel.setOptions({
      tabId,
      path: "sidepanel.html",
      enabled: true,
    });
    chrome.sidePanel.open({ tabId });
  } else if (message.action === "closeSidePanel" && tabId) {
    chrome.sidePanel.setOptions({
      tabId,
      enabled: false,
    });
  }
});

export {};
