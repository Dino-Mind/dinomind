import React, { useState } from "react";
import ReactDOM from "react-dom/client";

import "../styles/style.scss";

function OpenSidePanelButton() {
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);

  const aiLogo = chrome.runtime.getURL("src/assets/ai-logo.svg");
  const aiLogoRed = chrome.runtime.getURL("src/assets/ai-logo-red.svg");
  const settingsLogo = chrome.runtime.getURL("src/assets/settings-logo.svg");

  const toggleSidePanel = () => {
    if (isSidePanelOpen) {
      chrome.runtime.sendMessage({ action: "closeSidePanel" });
      setIsSidePanelOpen(false);
    } else {
      chrome.runtime.sendMessage({ action: "openSidePanel" });
      setIsSidePanelOpen(true);
    }
  };

  return (
    <button className="content-buttons">
      <button className="content-buttons" onClick={toggleSidePanel}>
        <img
          src={isSidePanelOpen ? aiLogoRed : aiLogo}
          alt="AI Logo"
          className="content-button-logo"
        />
      </button>
      <img
        src={settingsLogo}
        alt="Settings Logo"
        className="content-button-logo"
      />
    </button>
  );
}

const buttonContainer = document.createElement("div");
document.body.appendChild(buttonContainer);

ReactDOM.createRoot(buttonContainer).render(<OpenSidePanelButton />);
