import { SettingOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React from "react";

const Footer: React.FC = () => {
  return (
    <div className="footer-container">
      <div className="footer-text">
        test explanation 'll change with the selected component test explanation
        'll change with the selected component 'll change with the selected
        component component component component
      </div>
      <div className="footer-buttons">
        <Button shape="circle" icon={<SettingOutlined />} />
      </div>
    </div>
  );
};

export default Footer;
