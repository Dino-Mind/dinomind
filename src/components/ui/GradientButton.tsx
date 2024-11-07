import React from "react";
import { Button } from "antd";
import { ButtonProps } from "antd/es/button";

import { TabName } from "../../types";
import "./style.scss";

interface GradientButtonProps extends ButtonProps {
  tabName: TabName;
  onTabSelect: (tab: TabName) => void;
}

const GradientButton: React.FC<GradientButtonProps> = ({
  tabName,
  onTabSelect,
  ...props
}) => {
  return (
    <Button
      {...props}
      className="gradient-button"
      onClick={() => onTabSelect(tabName)}
    >
      {tabName}
    </Button>
  );
};

export default GradientButton;
