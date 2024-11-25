import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";

function Popup() {
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);

  const aiLogo = chrome.runtime.getURL("src/assets/ai-logo.svg");
  const aiLogoRed = chrome.runtime.getURL("src/assets/ai-logo-red.svg");

  const toggleSidePanel = async () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (!activeTab?.id) {
        console.error("No active tab found.");
        return;
      }

      if (isSidePanelOpen) {
        chrome.runtime.sendMessage(
          { action: "closeSidePanel", tabId: activeTab.id },
          () => setIsSidePanelOpen(false)
        );
      } else {
        chrome.runtime.sendMessage(
          { action: "openSidePanel", tabId: activeTab.id },
          () => setIsSidePanelOpen(true)
        );
      }
    });
  };

  useEffect(() => {
    chrome.runtime.sendMessage({ action: "getSidePanelState" }, (response) => {
      if (response?.status === "success") {
        setIsSidePanelOpen(response.isOpen);
      } else {
        console.error("Failed to fetch side panel state:", response?.message);
      }
    });
  }, []);

  return (
    <div style={{ height: 300, width: 300 }}>
      <header>
        <p>This is Popup Page</p>
      </header>
      <button className="content-buttons">
        <img
          src={isSidePanelOpen ? aiLogoRed : aiLogo}
          alt="AI Logo"
          className="content-button-logo"
          onClick={toggleSidePanel}
        />
      </button>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);
