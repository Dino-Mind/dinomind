import { motion, AnimatePresence } from "framer-motion";

import { SettingOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { usePlaceholderAnimation } from "@/hooks/usePlaceholderAnimation";

const Footer: React.FC = () => {
  const placeholders = [
    "Stay connected with us...",
    "We love feedback!",
    "Follow us on social media!",
    "Your ideas inspire us!",
  ];

  const currentPlaceholder = usePlaceholderAnimation(placeholders);

  return (
    <div className="footer-container">
      <div className="footer-animation">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentPlaceholder}
            initial={{ y: 5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -5, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="footer-placeholder-text"
          >
            {currentPlaceholder}
          </motion.p>
        </AnimatePresence>
      </div>
      <div className="footer-buttons">
        <Button shape="circle" icon={<SettingOutlined />} />
      </div>
    </div>
  );
};

export default Footer;
