import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { Provider, useDispatch, useSelector } from "react-redux";
import { Store } from "webext-redux";
import Header from "../layout/Header";
import Body from "./Body";
import Footer from "./Footer";
import ChatBox from "../components/chatBox/ChatBox";
import Content from "../components/content/Content";
import Interest from "../components/interest/Interest";
import { setActiveTab } from "../redux/slices/uiSlice";
import { TabName } from "../types";
import { RootState } from "../redux/rootReducer";
import "../styles/style.scss";

const proxyStore = new Store();

const Sidepanel = () => {
  const dispatch = useDispatch();
  const reduxActiveTab = useSelector((state: RootState) => state.ui.activeTab);
  const [activeTab, setActiveTabState] = useState<TabName>(
    reduxActiveTab as TabName
  );

  const componentMap: Record<TabName, JSX.Element> = {
    ChatBox: <ChatBox />,
    Content: <Content />,
    Interest: <Interest />,
  };

  const handleTabSelect = (tab: TabName) => {
    dispatch(setActiveTab(tab));
  };

  useEffect(() => {
    if (reduxActiveTab !== activeTab) {
      setActiveTabState(reduxActiveTab as TabName);
    }

    const unsubscribe = proxyStore.subscribe(() => {
      const state = proxyStore.getState();
      dispatch(setActiveTab(state.ui.activeTab as TabName));
    });

    return () => unsubscribe();
  }, [reduxActiveTab, activeTab, dispatch]);

  return (
    <div className="sidepanel-container">
      <Header onTabSelect={handleTabSelect} />
      <Body activeTab={activeTab} componentMap={componentMap} />
      <Footer />
    </div>
  );
};

proxyStore.ready().then(() => {
  const SidepanelRoot = () => {
    const [isStoreReady, setIsStoreReady] = useState(false);

    useEffect(() => {
      // We need to wait store to be ready ! (dispatch like functions causing errors otherwise)
      proxyStore.ready().then(() => {
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
});
