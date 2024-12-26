/// <reference types="chrome"/>
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./redux/rootReducer";
import { createWrapStore } from "webext-redux";

import {
  closeSidePanel,
  openSidePanel,
  saveChatHistory,
} from "./redux/slices/sidePanelSlice";

// Redux setup
const store = configureStore({
  reducer: rootReducer,
});
const wrapStore = createWrapStore();
wrapStore(store);

// Handle toolbar icon click
chrome.action.onClicked.addListener(() => {
  chrome.runtime.sendMessage({ action: "openSidePanel" });

  chrome.sidePanel.setOptions({ path: "sidepanel.html", enabled: true });

  chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error(error));
});

// Handle messages for opening/closing the side panel
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.action === "openSidePanel") {
    chrome.sidePanel.setOptions({ path: "sidepanel.html", enabled: true });

    chrome.sidePanel
      .setPanelBehavior({ openPanelOnActionClick: true })
      .catch((error) => console.error(error));

    // chrome.sidePanel.open();
    store.dispatch(openSidePanel());
    sendResponse({ status: "success", isOpen: true });
  } else if (message.action === "closeSidePanel") {
    chrome.sidePanel.setOptions({ enabled: false });
    store.dispatch(saveChatHistory());
    store.dispatch(closeSidePanel());
    sendResponse({ status: "success", isOpen: false });
  }
});

let currentTabId: number | null = null;

chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setIcon({ path: "src/assets/icons/icon400.png" });
});

chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (!chrome.runtime.lastError) {
      currentTabId = tab.id || null;
    }
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.active && changeInfo.url) {
    currentTabId = tabId;
  }
});

chrome.action.onClicked.addListener((tab) => {
  if (!tab.id) return;
  chrome.runtime.sendMessage({ action: "openSidePanel", tabId: tab.id });
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

    chrome.sidePanel.open({ tabId });
    sendResponse({ status: "success", isOpen: true });
    store.dispatch(openSidePanel());
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

// Context Menu for Summarize It
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "summarizeIt",
    title: "Explain",
    contexts: ["selection"],
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "summarizeIt" && info.selectionText && tab?.id) {
    chrome.tabs.sendMessage(tab.id, {
      action: "openSummarizeModal",
      text: info.selectionText,
    });
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "closeSummarizeModal" && sender.tab?.id) {
    chrome.tabs.sendMessage(sender.tab.id, {
      action: "closeSummarizeModal",
    });
    sendResponse({ status: "success" });
  }
});

export {};
