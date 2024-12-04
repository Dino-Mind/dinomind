import React, { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import ContentChat from "./ContentChat";
import { ActionButtons } from "./ActionButtons";

import { MeteorsFx } from "./fx/meteorsFx";
import { createSummaryForContent } from "@/utils/createSummaryForContent";

interface CardContentProps {
  isOpen: boolean;
  id: string;
  description: string;
  tag: string;
  summary?: string;
  onClose: () => void;
}

export const CardContent: React.FC<CardContentProps> = ({
  isOpen,
  id,
  description,
  summary,
  tag,
  onClose,
}) => {
  const words = tag.split(/\s+/).slice(1, 9); // Ignore the first "*"

  useEffect(() => {
    const fetchData = async () => {
      if (isOpen) {
        await createSummaryForContent(id, description);
      }
    };

    fetchData();
  }, [isOpen]);

  return (
    <div
      className={`fixed top-0 right-0 h-[100vh] w-[100vw] bg-primary-xBackground shadow-xl transform transition-all duration-300 ease-in-out z-50 ${
        isOpen
          ? "translate-x-0 opacity-100 visibility-visible"
          : "translate-x-full opacity-0 visibility-hidden"
      }`}
    >
      <div className="flex flex-col h-full z-[9999]">
        <div className="h-[80vh] flex flex-col justify-between p-6 text-white overflow-y-auto">
          <div className="flex flex-row justify-between items-center h-12">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-200 hover:rotate-180 transition-transform duration-300 text-2xl"
            >
              ✕
            </button>
{/* 
            <div className="flex gap-2 w-[80vw] items-center overflow-x-auto whitespace-nowrap">
              {words.map((word, idx) => (
                <ReactMarkdown
                  key={idx}
                  className="prose prose-invert bg-gray-700 text-gray-300 px-3 py-0.5 text-sm rounded-xl"
                >
                  {word}
                </ReactMarkdown>
              ))}
            </div> */}
          </div>

          {/* <div className="h-full py-4 overflow-auto">
            <ReactMarkdown className="prose prose-invert text-gray-300">
              {description}
            </ReactMarkdown>
          </div> */}

        </div>
        <ContentChat
          id={id}
          description={description}
          tag={tag}
          summary={summary}
        />
      </div>
      <MeteorsFx number={20} />
    </div>
  );
};
