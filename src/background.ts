// Set the active tab
let activeTab = "ChatBox";

const validComponents = ["ChatBox", "Content", "Interest"];

// Listen for retrieving the active tab
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "SET_ACTIVE_TAB") {
    const requestedTab = message.payload;

    if (validComponents.includes(requestedTab)) {
      activeTab = requestedTab;
      sendResponse({ status: "success", activeTab });
    } else {
      console.warn(`Invalid component name: ${requestedTab}`);
      sendResponse({ status: "error", message: "Invalid component name" });
    }
  } else if (message.type === "GET_ACTIVE_TAB") {
    sendResponse({ activeTab });
  }
  return true;
});

//Set the extension icon
chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setIcon({ path: "src/assets/icons/icon400.png" });
});

//Set up Open-Close Panel
chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error(error));
});

//Listen Open-Close Panel
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
