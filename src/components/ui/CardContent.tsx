import React from "react";
import ReactMarkdown from "react-markdown";

interface CardContentProps {
  isOpen: boolean;
  title: string;
  description: string;
  tag: string;
  onClose: () => void;
}

export const CardContent: React.FC<CardContentProps> = ({
  isOpen,
  title,
  description,
  tag,
  onClose,
}) => {
  const words = tag.split(/\s+/).slice(1, 9); // first one is "*" so ignored for now

  return (
    <div
      className={`fixed top-0 right-0 h-full w-full sm:w-1/2 bg-gray-900 shadow-xl transform transition-all duration-300 ease-in-out z-50 ${
        isOpen
          ? "translate-x-0 opacity-100 visibility-visible"
          : "translate-x-full opacity-0 visibility-hidden"
      }`}
    >
      <div className="p-6 text-white flex flex-col h-full">
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

        {/**Content tags mapped for now */}
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
    </div>
  );
};
