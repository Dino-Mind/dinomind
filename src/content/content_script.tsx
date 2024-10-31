import React, { useState } from "react";
import ReactDOM from "react-dom/client";

import "../styles/style.scss";

function OpenSidePanelButton() {
  const [isContentOpen, setIsContentOpen] = useState(false);

  const aiLogo = chrome.runtime.getURL("src/assets/ai-logo.svg");
  const aiLogoRed = chrome.runtime.getURL("src/assets/ai-logo-red.svg");
  const settingsLogo = chrome.runtime.getURL("src/assets/settings-logo.svg");

  const openSidePanel = () => {
    if (!isContentOpen) {
      chrome.runtime.sendMessage({ action: "openSidePanel" });
      setIsContentOpen(true);
    } else {
      chrome.runtime.sendMessage({ action: "closeSidePanel" });
      setIsContentOpen(false);
    }
  };

  return (
    <button className="content-buttons">
      {isContentOpen ? (
        <img
          src={aiLogoRed}
          alt="AI_Logo_Red"
          className="content-button-logo"
          onClick={openSidePanel}
        />
      ) : (
        <img
          src={aiLogo}
          alt="AI_Logo"
          className="content-button-logo"
          onClick={openSidePanel}
        />
      )}
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
