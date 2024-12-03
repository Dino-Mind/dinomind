import React from "react";
import ReactMarkdown from "react-markdown";

import { useChatWithAi } from "../../hooks/useChatWithAi";
import "./style.scss";
import { TextGenerateEffectFx } from "../ui/fx/textGenerateEffectFx";
import { VanishInputFx } from "../ui/fx/vanishInputFx";

import { Sender } from "@/types/messageType";

interface ContentChatProps {
  description: string;
  tag: string;
  summary?: string;
  id: string;
  onClose: React.MouseEventHandler<HTMLButtonElement>;
}

const ContentChat: React.FC<ContentChatProps> = ({ id, summary, onClose }) => {
  const {
    messages,
    loading,
    latestAIMessageIndex,
    handleInputChange,
    handleSubmit,
    clearChatHistory,
    // abortCurrentPrompt,
    // resetSession,
  } = useChatWithAi("contentChat", id, summary);

  const placeholders = [
    "Type your questions...",
    "Ask me anything!",
    "What do you like about this content?",
    "Let's find what you wonder about!",
  ];

  return (
    <div className="absolute bottom-0 right-0 left-0 h-20 w-full bg-gray-800 text-white shadow-xl transition-transform duration-300 ease-in-out z-[9999]">
      <div className="flex flex-col h-full">
        <div className="flex-grow overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.sender}`}>
              {message.sender === Sender.AI ? (
                index === latestAIMessageIndex ? (
                  <TextGenerateEffectFx
                    words={message.text || ""}
                    duration={1}
                    filter={false}
                  />
                ) : (
                  <ReactMarkdown className="prose prose-invert">
                    {message.text}
                  </ReactMarkdown>
                )
              ) : (
                <ReactMarkdown className="prose prose-invert border border-gray-500 rounded-xl  px-2 max-w-fit ml-auto">
                  {message.text}
                </ReactMarkdown>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center border-t border-gray-700 bg-gray-900 p-4">
          <VanishInputFx
            loading={loading}
            placeholders={placeholders}
            onChange={handleInputChange}
            onSubmit={handleSubmit}
          />
        </div>

        <div className="flex justify-around p-2 text-[10px]">
          <button onClick={clearChatHistory} className="text-white">
            Clear Chat History
          </button>
          {/* <button onClick={abortCurrentPrompt} className="text-white">
            Stop Running Prompt
          </button>
          <button onClick={resetSession} className="text-white">
            Reset AI Session
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default ContentChat;
