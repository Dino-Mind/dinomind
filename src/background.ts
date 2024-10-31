chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setIcon({ path: "src/images/icon400.png" });
});

// To create specific event to change the icon
// chrome.runtime.onMessage.addListener((message) => {
//   if (message.action === "changeIcon") {
//     chrome.action.setIcon({ path: "/icons/alt-icon128.png" }); // Alternate icon
//   }
// });

chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error(error));
});

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

console.log(`this is background service worker`);

export {};
