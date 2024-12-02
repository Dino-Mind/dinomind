import React, { useState } from "react";
import { Copy, WandSparkles, ArrowDown, ArrowUp, Languages } from "lucide-react";
import { Button } from "./button";

export const ActionButtons: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("Copied content!");
    alert("Copied to clipboard!");
  };

  return (
    <div className="py-2 gap-2 flex items-start">
      <Button
        onClick={handleCopy}
        className="bg-transparent border-none px-2 py-1 text-xs rounded-md shadow transition bg-gray-800 hover:bg-gray-600"
      >
        <Copy size={12}/>
      </Button>

      <Button
        onClick={() => setMenuOpen(!menuOpen)}
        className="bg-transparent border-none px-2 py-1 text-xs rounded-md shadow transition  bg-gray-800 hover:bg-gray-600"
      >
        <WandSparkles size={12}/>
      </Button>

      <Button
        onClick={() => setMenuOpen(!menuOpen)}
        className="bg-transparent border-none px-2 py-1 text-xs rounded-md shadow transition  bg-gray-800 hover:bg-gray-600"
      >
        <ArrowDown size={12}/>
        Shorten
      </Button>

      <Button
        onClick={() => setMenuOpen(!menuOpen)}
        className="bg-transparent border-none px-2 py-1 text-xs rounded-md shadow transition  bg-gray-800 hover:bg-gray-600"
      >
        <ArrowUp size={12} />
        Lengthen
      </Button>

      <Button
        onClick={() => setMenuOpen(!menuOpen)}
        className="bg-transparent border-none text-white px-2 py-1 text-xs rounded-md shadow transition  bg-gray-800 hover:bg-gray-600"
      >
        <Languages size={12} />
        Translate
      </Button>
    </div>
  );
};

export default ActionButtons;

