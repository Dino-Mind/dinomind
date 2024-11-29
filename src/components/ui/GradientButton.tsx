import React from "react";

import { TabName } from "../../types";
import "./style.scss";
import { Button, ButtonProps } from "./button";

interface GradientButtonProps extends ButtonProps {
  name: TabName;
  onTabSelect: (tab: TabName) => void;
}

const GradientButton: React.FC<GradientButtonProps> = ({
  name,
  onTabSelect,

}) => {
  return (
    <Button
    variant="secondary"
      onClick={() => onTabSelect(name)}
    >
      {name}
    </Button>
  );
};

export default GradientButton;
