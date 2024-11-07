import React from "react";
import { Button } from "antd";

import "./style.scss";
import Dino from "../dino/Dino";

const Content: React.FC = () => {
  return (
    <div className="content-container">
      <div className="content-box-title">
        Most Frequently Visited URLs (Last 7 Days)
      </div>
      <div className="content-boxes">
        <Button />
        <Button />
        <Button />
        <Button />
        <Button />
      </div>
    </div>
  );
};

export default Content;
