import React from "react";
import ReactDOM from "react-dom/client";

import ChatBox from "../components/chatBox/ChatBox";
import History from "../components/history/History";
import "../styles/style.scss";

const sidePanelRoot = document.createElement("div");
sidePanelRoot.id = "sidepanel-root";
document.body.appendChild(sidePanelRoot);

ReactDOM.createRoot(sidePanelRoot).render(
  <React.StrictMode>
    <div className="content-container">
      <History />
      <ChatBox />
    </div>
  </React.StrictMode>
);
