import React from "react";

import { TabName } from "../types";
import "../styles/style.scss";

interface BodyProps {
  activeTab: TabName;
  componentMap: Record<TabName, JSX.Element>;
}

const Body: React.FC<BodyProps> = ({ activeTab, componentMap }) => {
  return (
    <div className="body-container">
      <div className="body-content">{componentMap[activeTab]}</div>
    </div>
  );
};

export default Body;
