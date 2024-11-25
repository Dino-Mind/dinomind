import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./redux/rootReducer";
import { createWrapStore } from "webext-redux";
import { setActiveTab } from "./redux/slices/uiSlice";
import { closeSidePanel, openSidePanel } from "./redux/slices/sidePanelSlice";

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

// Save chat data before the extension is closed
// const saveChatHistory = () => {
//   chrome.storage.local.get("chatHistory", (data) => {
//     console.log("Saving... global action");
//     // chrome.storage.local.set({ chatHistory2: data.chatHistory || [] });
//   });
// };

//SAVING CHAT DATA
// Listen for extension unload (popup or browser close)
chrome.runtime.onSuspend.addListener(() => {
  const data1 = "DATA 1 popup or browser close action saved";
  console.log("DATA 1 popup or browser close action");
  chrome.storage.local.set({ chatHistory1: data1 || [] });
});

// Listen for window closure
chrome.windows.onRemoved.addListener(() => {
  //WORKING
  const data2 = "DATA 2 window closure saved";
  console.log("DATA 2 window closure action");
  chrome.storage.local.set({ chatHistory2: data2 || [] });
});

// Listen for tab closure
chrome.tabs.onRemoved.addListener(() => {
  //WORKING
  const data3 = "DATA 3 tab closure saved";
  console.log("DATA 3 tab closure action");
  chrome.storage.local.set({ chatHistory3: data3 || [] });
});

//     //     // OPEN CLOSE sidepanel

// DEV_NOTE: updated via popup able to control sidepanel behaviour && Tied with redux state management

const getActiveTabId = async (): Promise<number | null> => {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (activeTab?.id) {
        resolve(activeTab.id);
      } else {
        resolve(null);
      }
    });
  });
};

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  let tabId = message.tabId || sender.tab?.id;

  if (!tabId) {
    tabId = await getActiveTabId();
    if (!tabId) {
      console.error("No active tab found.");
      sendResponse({ status: "error", message: "No active tab available." });
      return true;
    }
  }

  if (message.action === "openSidePanel") {
    chrome.sidePanel.setOptions({
      tabId,
      path: "sidepanel.html",
      enabled: true,
    });
    chrome.sidePanel.open({ tabId }).then(() => {
      store.dispatch(openSidePanel());
      sendResponse({ status: "success", isOpen: true });
    });

    //WORKING
    const data4 = "DATA 4 openWithextIcon saved";
    console.log("DATA 4 openWithextIcon action");
    chrome.storage.local.set({ chatHistory4: data4 || [] });
  } else if (message.action === "closeSidePanel") {
    chrome.sidePanel.setOptions({
      tabId,
      enabled: false,
    });

    store.dispatch(closeSidePanel());
    sendResponse({ status: "success", isOpen: false });
    //WORKING
    const data5 = "DATA 5 closeWithextIcon saved";
    console.log("DATA 5 closeWithextIcon action");
    chrome.storage.local.set({ chatHistory5: data5 || [] });
  }

  return true;
});

export {};
