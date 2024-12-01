import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { Provider, useDispatch } from "react-redux";
import { Store } from "webext-redux";

import Body from "./Body";
import Footer from "./Footer";
import ChatBox from "../components/chat-box/ChatBox";
import Content from "../components/content/Content";
import { setActiveTab } from "../redux/slices/uiSlice";
import { TabName } from "../types";
import "../styles/style.scss";

const proxyStore = new Store();

const Sidepanel = () => {
  const dispatch = useDispatch();

  const componentMap: Record<TabName, JSX.Element> = {
    ChatBox: <ChatBox />,
    Content: <Content />,
    // Interest: <Interest />,
  };

  useEffect(() => {
    dispatch(setActiveTab("Content"));

    const unsubscribe = proxyStore.subscribe(() => {
      const state = proxyStore.getState();
      dispatch(setActiveTab(state.ui.activeTab as TabName));
    });

    return () => unsubscribe();
  }, [dispatch]);

  return (
    <div className="sidepanel-container">
      <Body componentMap={componentMap} />
      <Footer />
    </div>
  );
};

const SidepanelRoot = () => {
  const [isStoreReady, setIsStoreReady] = useState(false);

  useEffect(() => {
    proxyStore.ready().then(() => {
      console.log("Initial proxyStore state:", proxyStore.getState());

      setIsStoreReady(true);
    });
  }, []);

  if (!isStoreReady) {
    return <div>Loading...</div>;
  }

  return (
    <Provider store={proxyStore}>
      <Sidepanel />
    </Provider>
  );
};

const sidePanelRoot = document.createElement("div");
sidePanelRoot.id = "sidepanel-root";
document.body.appendChild(sidePanelRoot);

ReactDOM.createRoot(sidePanelRoot).render(
  <React.StrictMode>
    <SidepanelRoot />
  </React.StrictMode>
);
