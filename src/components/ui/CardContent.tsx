import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { BackgroundBeamsFx } from "./fx/backgroundBeamsFx";
import ContentChat from "./ContentChat";

interface CardContentProps {
  isOpen: boolean;
  title: string;
  description: string;
  tag: string;
  summary?: string;
  onClose: () => void;
}

export const CardContent: React.FC<CardContentProps> = ({
  isOpen,
  title,
  description,
  summary,
  tag,
  onClose,
}) => {
  const [showChat, setShowChat] = useState(false);
  const words = tag.split(/\s+/).slice(1, 9); // Ignore the first "*"

  return (
    <div
      className={`fixed top-0 right-0 h-full w-full sm:w-1/2 bg-gray-900 shadow-xl transform transition-all duration-300 ease-in-out z-50 ${
        isOpen
          ? "translate-x-0 opacity-100 visibility-visible"
          : "translate-x-full opacity-0 visibility-hidden"
      }`}
    >
      <div className="flex flex-col h-full z-[9999]">
        <div className="flex flex-col justify-between flex-grow p-6 text-white overflow-y-auto">
          <div>
            <button
              onClick={onClose}
              className="self-end text-gray-400 hover:text-gray-200 text-lg mb-4"
            >
              ✕
            </button>

            <h1 className="font-bold text-2xl mb-4">{title}</h1>

            <ReactMarkdown className="prose prose-invert text-gray-300">
              {description}
            </ReactMarkdown>

            <div className="flex flex-wrap gap-2 mt-4">
              {words.map((word, idx) => (
                <ReactMarkdown
                  key={idx}
                  className="prose prose-invert bg-gray-700 text-gray-300 px-3 py-0.5 text-sm rounded-xl"
                >
                  {word}
                </ReactMarkdown>
              ))}
            </div>
          </div>

          {!showChat && (
            <button
              onClick={() => setShowChat(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition"
            >
              Chat with AI
            </button>
          )}
        </div>

        {showChat && (
          <div className="max-h-[40%] bg-gray-800 border-t border-gray-700 overflow-hidden">
            <ContentChat
              title={title}
              description={description}
              summary={summary}
              tag={tag}
            />
          </div>
        )}
      </div>

      <BackgroundBeamsFx />
    </div>
  );
};
