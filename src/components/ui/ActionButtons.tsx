import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { Copy, WandSparkles, ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "./button";
import { useTranslate } from "@/hooks/useTranslate";
import { TranslateButton } from "./TranslateButton";
import { loadTagStatData, saveTagStatData } from "@/utils/dataUtils";

type ActionButtonProps = {
  content: string;
  tag: string;
  lastMessage?: string;
  onTranslate?: (targetLanguage: string, result: string) => void;
};

export const ActionButtons: React.FC<ActionButtonProps> = ({
  content,
  tag: tagProp,
  lastMessage,
  onTranslate,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState<string | null>(null);
  const [, setTranslated] = useState<string | null>(null);
  const [liked, setLiked] = useState<"like" | "dislike" | null>(null);

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
        const result = await translator.translate(lastMessage);
        setTranslated(result);
        onTranslate?.(targetLanguage!, result);
      }
    };

    loadTranslated();
  }, [content, translator]);

  const handleLike = (type: "like" | "dislike") => () => {
    setLiked(type);

    loadTagStatData((tagData) => {
      const tag = tagData.find((tag) => tag.tag === tagProp);
      if (tag) {
        tag[type] += 1;
        tag.ctr = tag.like / (tag.like + tag.dislike);
        tag.totalCount = tag.like + tag.dislike;
      } else {
        tagData.push({
          tag: content,
          like: 0,
          dislike: 0,
          ctr: 0,
          totalCount: 0,
        });
      }

      saveTagStatData(tagData);
    });
  };

  return (
    <div className="py-2 flex items-start justify-between w-full p-2 gap-2">
      <div className="flex gap-2">
        <Button
          onClick={handleCopy}
          className="bg-transparent px-2 py-1 text-xs rounded-md shadow transition border border-primary-xPrimary hover:border-primary-xSecondary"
        >
          <Copy size={12} />
        </Button>

        <Button
          onClick={() => setMenuOpen(!menuOpen)}
          className="bg-transparent px-2 py-1 text-xs rounded-md shadow transition border border-primary-xPrimary hover:border-primary-xSecondary"
        >
          <WandSparkles size={12} />
        </Button>

        <TranslateButton onTranslate={handleTranslate} />
      </div>

      <div className="flex gap-2">
        <motion.div
          animate={{
            scale: liked === "like" ? 1.1 : 1,
          }}
          transition={{ duration: 0.3 }}
          className="inline-flex"
        >
          <Button
            onClick={handleLike("like")}
            className="bg-transparent px-2 py-1 text-xs rounded-md shadow transition border border-primary-xPrimary hover:border-primary-xSecondary"
          >
            <ThumbsUp
              size={12}
              color={liked === "like" ? "green" : "currentColor"}
            />
          </Button>
        </motion.div>
        <motion.div
          animate={{
            scale: liked === "dislike" ? 1.1 : 1,
          }}
          transition={{ duration: 0.3 }}
          className="inline-flex"
        >
          <Button
            onClick={handleLike("dislike")}
            className="bg-transparent px-2 py-1 text-xs rounded-md shadow transition border border-primary-xPrimary hover:border-primary-xSecondary"
          >
            <ThumbsDown
              size={12}
              color={liked === "dislike" ? "red" : "currentColor"}
            />
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default ActionButtons;
