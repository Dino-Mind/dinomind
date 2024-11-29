import React from "react";
import { TabName } from "../types";
import GradientButton from "../components/ui/GradientButton";

interface HeaderProps {
  onTabSelect: (tab: TabName) => void;
}

const Header: React.FC<HeaderProps> = ({ onTabSelect }) => (
  <div className="header-container">
    <GradientButton name="Content" onTabSelect={onTabSelect} />
    <GradientButton name="ChatBox" onTabSelect={onTabSelect} />
    <GradientButton name="Interest" onTabSelect={onTabSelect} />
  </div>
);

export default Header;
