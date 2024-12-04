import React, { useEffect, useState } from "react";
import {
  Copy,
  WandSparkles,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { Button } from "./button";
import { useTranslate } from "@/hooks/useTranslate";
import { TranslateButton } from "./TranslateButton";
import {  loadTagStatData, saveTagStatData } from "@/utils/dataUtils";

type ActionButtonProps = {
  content: string;
  tag: string;
};

export const ActionButtons: React.FC<ActionButtonProps> = ({ content, tag: tagProp }) => {
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

  const handleLike = (type: "like" | "dislike") => () => {
    loadTagStatData((tagData) => {
      const tag = tagData.find((tag) => tag.tag === tagProp);
      if (tag) {
        tag[type] += 1;
        tag.ctr = tag.like / (tag.like + tag.dislike);
        tag.totalCount = tag.like + tag.dislike;
      } else {
        tagData.push({ tag: content, like: 0, dislike: 0, ctr: 0, totalCount: 0 });
      }

      saveTagStatData(tagData);
    })
  };

  return (
    <div className="py-2 gap-2 flex items-start justify-between w-full p-2 gap-2">
      <div>
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

        {/* <Button
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
      </Button> */}

        <TranslateButton onTranslate={handleTranslate} />
      </div>

      <div>
        <Button
          onClick={handleLike("like")}
          className="bg-transparent border-none px-2 py-1 text-xs rounded-md shadow transition bg-gray-800 hover:bg-gray-600"
        >
          <ThumbsUp size={12} />
        </Button>
        <Button
          onClick={handleLike("dislike")}
          className="bg-transparent border-none px-2 py-1 text-xs rounded-md shadow transition bg-gray-800 hover:bg-gray-600"
        >
          <ThumbsDown size={12} />
        </Button>
      </div>
    </div>
  );
};

export default ActionButtons;
