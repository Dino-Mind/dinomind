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
}

const ContentChat: React.FC<ContentChatProps> = ({ id, summary }) => {
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
    <div className="flex justify-between bottom-0 w-full flex-col h-[30vh]">
      <div className="flex flex-col w-full h-full overflow-y-auto p-4 space-y-4 ">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            {message.sender === Sender.AI ? (
              index === latestAIMessageIndex ? (
                <TextGenerateEffectFx
                  words={message.text || ""}
                  duration={2}
                  filter={false}
                />
              ) : (
                <ReactMarkdown className="prose prose-invert text-white">
                  {message.text}
                </ReactMarkdown>
              )
            ) : (
              <ReactMarkdown className="prose prose-invert border border-gray-500 rounded-xl px-2 max-w-fit ml-auto">
                {message.text}
              </ReactMarkdown>
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center justify-center bg-gray-900 p-2 border-t border-blue-500">
        <VanishInputFx
          loading={loading}
          placeholders={placeholders}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
        />
        <button
          onClick={clearChatHistory}
          className="text-white border-b border-gray-400"
        >
          Clear Chat History
        </button>
      </div>
    </div>
  );
};

export default ContentChat;
