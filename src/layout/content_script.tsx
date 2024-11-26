import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { Store } from "webext-redux";
import { Provider, useDispatch, useSelector } from "react-redux";

import "../styles/style.scss";
import { RootState } from "../redux/rootReducer";
import { closeSidePanel, openSidePanel } from "../redux/slices/sidePanelSlice";
import { summarizeText } from "../utils/fetchGeminiSummarize";
import { Message } from "../types/messageType";

const proxyStore = new Store();

function OpenSidePanelButton() {
  const dispatch = useDispatch();
  const isSidePanelOpen = useSelector(
    (state: RootState) => state.sidePanel.isOpen
  );

  const aiLogo = chrome.runtime.getURL("src/assets/ai-logo.svg");
  const aiLogoRed = chrome.runtime.getURL("src/assets/ai-logo-red.svg");

  const toggleSidePanel = () => {
    if (isSidePanelOpen) {
      chrome.runtime.sendMessage({ action: "closeSidePanel" }, () => {
        dispatch(closeSidePanel());
      });
    } else {
      chrome.runtime.sendMessage({ action: "openSidePanel" }, () => {
        dispatch(openSidePanel());
      });
    }
  };

  useEffect(() => {
    const messageListener = (
      message: Message & { action?: string },
      sender: chrome.runtime.MessageSender,
      sendResponse: (response: { summary?: string; error?: string }) => void // Explicit type for sendResponse
    ) => {
      if (message.action === "summarizeText") {
        const { text } = message;
        summarizeText(text)
          .then((summary) => sendResponse({ summary }))
          .catch((error) => sendResponse({ error: error.message }));
        return true;
      }
    };

    chrome.runtime.onMessage.addListener(messageListener);
    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, []);

  useEffect(() => {
    proxyStore.ready().then(() => {
      proxyStore.subscribe(() => {
        const state = proxyStore.getState() as RootState;
        if (state.sidePanel.isOpen !== isSidePanelOpen) {
          dispatch(state.sidePanel.isOpen ? openSidePanel() : closeSidePanel());
        }
      });
    });
  }, [dispatch, isSidePanelOpen]);

  return (
    <button className="content-buttons">
      <button className="content-buttons" onClick={toggleSidePanel}>
        <img
          src={isSidePanelOpen ? aiLogoRed : aiLogo}
          alt="AI Logo"
          className="content-button-logo"
        />
      </button>
    </button>
  );
}

proxyStore.ready().then(() => {
  const buttonContainer = document.createElement("div");
  document.body.appendChild(buttonContainer);

  ReactDOM.createRoot(buttonContainer).render(
    <Provider store={proxyStore}>
      <React.StrictMode>
        <OpenSidePanelButton />
      </React.StrictMode>
    </Provider>
  );
});
