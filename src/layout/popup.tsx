import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { Provider, useDispatch, useSelector } from "react-redux";
import { Store } from "webext-redux";
import { closeSidePanel, openSidePanel } from "../redux/slices/sidePanelSlice";
import { RootState } from "../redux/rootReducer";

const proxyStore = new Store();

const Popup = () => {
  const dispatch = useDispatch();
  const isSidePanelOpen = useSelector(
    (state: RootState) => state.sidePanel.isOpen
  );

  const aiLogo = chrome.runtime.getURL("src/assets/ai-logo.svg");
  const aiLogoRed = chrome.runtime.getURL("src/assets/ai-logo-red.svg");

  const toggleSidePanel = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (!activeTab?.id) {
        console.error("No active tab found.");
        return;
      }

      if (isSidePanelOpen) {
        chrome.runtime.sendMessage(
          { action: "closeSidePanel", tabId: activeTab.id },
          () => {
            dispatch(closeSidePanel());
          }
        );
      } else {
        chrome.runtime.sendMessage(
          { action: "openSidePanel", tabId: activeTab.id },
          () => {
            dispatch(openSidePanel());
          }
        );
      }
    });
  };

  useEffect(() => {
    let lastKnownState = isSidePanelOpen;

    const unsubscribe = proxyStore.subscribe(() => {
      const state = proxyStore.getState() as RootState;
      const currentSidePanelState = state.sidePanel.isOpen;

      if (currentSidePanelState !== lastKnownState) {
        lastKnownState = currentSidePanelState;
        dispatch(currentSidePanelState ? openSidePanel() : closeSidePanel());
      }
    });

    return () => {
      unsubscribe(); 
    };
  }, [dispatch]);

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
};

proxyStore.ready().then(() => {
  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <Provider store={proxyStore}>
      <React.StrictMode>
        <Popup />
      </React.StrictMode>
    </Provider>
  );
});
