import React, { useEffect, useState } from "react";
import { Copy, WandSparkles, ArrowDown, ArrowUp, Brain } from "lucide-react";
import { Button } from "./button";
import { useTranslate } from "@/hooks/useTranslate";
import { TranslateButton } from "./TranslateButton";

type ActionButtonProps = {
  content: string;
  openChat: React.MouseEventHandler<HTMLButtonElement>;
};

export const ActionButtons: React.FC<ActionButtonProps> = ({
  content,
  openChat,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState<string | null>(null);
  const [, setTranslated] = useState<string | null>(null); // TODO: orhun use translated text later
  const translator = useTranslate(targetLanguage);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    alert("Copied to clipboard!");
  };

  const handleTranslate = async (language: string) => {
    setTargetLanguage(language);
  };

  useEffect(() => {
    const loadTranslated = async () => {
      if (translator) {
        const text = await translator.translate(content);
        setTranslated(text);
        alert(text);
      }
    };

    loadTranslated();
  }, [content, translator]);

  return (
    <div className="py-2 gap-2 flex items-start">
      <Button
        onClick={handleCopy}
        className="bg-transparent border-none px-2 py-1 text-xs rounded-md shadow transition bg-gray-800 hover:bg-gray-600"
      >
        <Copy size={12} />
      </Button>

      <Button
        onClick={() => setMenuOpen(!menuOpen)}
        className="bg-transparent border-none px-2 py-1 text-xs rounded-md shadow transition  bg-gray-800 hover:bg-gray-600"
      >
        <WandSparkles size={12} />
      </Button>

      <Button
        onClick={() => setMenuOpen(!menuOpen)}
        className="bg-transparent border-none px-2 py-1 text-xs rounded-md shadow transition  bg-gray-800 hover:bg-gray-600"
      >
        <ArrowDown size={12} />
        Shorten
      </Button>

      <Button
        onClick={() => setMenuOpen(!menuOpen)}
        className="bg-transparent border-none px-2 py-1 text-xs rounded-md shadow transition  bg-gray-800 hover:bg-gray-600"
      >
        <ArrowUp size={12} />
        Lengthen
      </Button>
      <TranslateButton onTranslate={handleTranslate} />
      <Button
        onClick={openChat}
        className="bg-transparent border-none px-2 py-1 text-xs rounded-md shadow transition bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-300 hover:to-blue-400"
      >
        <Brain size={12} />
        Ask Nano
      </Button>
    </div>
  );
};

export default ActionButtons;
