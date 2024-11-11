import React from "react";
import { TabName } from "../types";
import GradientButton from "../components/ui/GradientButton";

interface HeaderProps {
  onTabSelect: (tab: TabName) => void;
}

const Header: React.FC<HeaderProps> = ({ onTabSelect }) => (
  <div className="header-container">
    <GradientButton tabName="Content" onTabSelect={onTabSelect} />
    <GradientButton tabName="ChatBox" onTabSelect={onTabSelect} />
    <GradientButton tabName="Interest" onTabSelect={onTabSelect} />
  </div>
);

export default Header;
