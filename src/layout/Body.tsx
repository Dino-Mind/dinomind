import React from "react";

import { Tabs } from "../components/ui/Tabs";
import { TabName } from "../types";
import "../styles/style.scss";

interface BodyProps {
  componentMap: Record<TabName, JSX.Element>;
}

const Body: React.FC<BodyProps> = ({ componentMap }) => {
  const tabs: { title: string; value: TabName; content: JSX.Element }[] = [
    { title: "Content", value: "Content", content: componentMap["Content"] },
    { title: "Chat", value: "ChatBox", content: componentMap["ChatBox"] },
  ];

  return (
    <Tabs
      tabs={tabs}
      containerClassName="tabs-container"
      activeTabClassName="active-tab"
      tabClassName="tab"
      contentClassName="tab-content"
    />
  );
};

export default Body;
