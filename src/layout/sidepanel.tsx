import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";

import { TabName } from "../types";

import Header from "../layout/Header";
import Body from "./Body";
import Footer from "./Footer";
import ChatBox from "../components/chatBox/ChatBox";
import Content from "../components/content/Content";
import Interest from "../components/interest/Interest";
import "../styles/style.scss";

const Sidepanel = () => {
  const [activeTab, setActiveTab] = useState<TabName>("ChatBox");

  const componentMap: Record<TabName, JSX.Element> = {
    ChatBox: <ChatBox />,
    Content: <Content />,
    Interest: <Interest />,
  };

  useEffect(() => {
    chrome.runtime.onMessage.addListener((message) => {
      if (
        message.type === "SET_ACTIVE_TAB" &&
        message.payload in componentMap
      ) {
        setActiveTab(message.payload as TabName);
      }
    });

    chrome.runtime.sendMessage({ type: "GET_ACTIVE_TAB" }, (response) => {
      if (response?.activeTab && response.activeTab in componentMap) {
        setActiveTab(response.activeTab as TabName);
      }
    });
  }, []);

  return (
    <div className="sidepanel-container">
      <Header onTabSelect={setActiveTab} />
      <Body activeTab={activeTab} componentMap={componentMap} />
      <Footer />
    </div>
  );
};

const sidePanelRoot = document.createElement("div");
sidePanelRoot.id = "sidepanel-root";
document.body.appendChild(sidePanelRoot);

ReactDOM.createRoot(sidePanelRoot).render(
  <React.StrictMode>
    <Sidepanel />
  </React.StrictMode>
);
