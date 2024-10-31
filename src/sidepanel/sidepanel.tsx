import React from "react";
import ReactDOM from "react-dom/client";

import "../styles/style.scss";
import ChatBox from "../components/chatBox/ChatBox";
import History from "../components/history/History";

const sidePanelRoot = document.createElement("div");
sidePanelRoot.id = "sidepanel-root";
document.body.appendChild(sidePanelRoot);

ReactDOM.createRoot(sidePanelRoot).render(
  <React.StrictMode>
    <History />
    <ChatBox />
  </React.StrictMode>
);
