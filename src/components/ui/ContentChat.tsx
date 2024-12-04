import React, { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";

import { useChatWithAi } from "../../hooks/useChatWithAi";
import "./style.scss";
import { TextGenerateEffectFx } from "../ui/fx/textGenerateEffectFx";
import { VanishInputFx } from "../ui/fx/vanishInputFx";

import { Sender } from "@/types/messageType";
import ActionButtons from "./ActionButtons";

interface ContentChatProps {
  description: string;
  tag: string;
  summary?: string;
  id: string;
  loadingSummary: boolean;
}

const ContentChat: React.FC<ContentChatProps> = ({
  id,
  summary,
  description,
  loadingSummary,
}) => {
  const {
    messages: messagesFromChat,
    loading,
    latestAIMessageIndex,
    handleInputChange,
    handleSubmit,
    clearChatHistory,
    // abortCurrentPrompt,
    // resetSession,
  } = useChatWithAi("contentChat", id, summary);

  const combinedLoading = loading || loadingSummary;

  const messages = React.useMemo(() => {
    const initialMessage = {
      sender: Sender.AI,
      text: description,
    };
    return [initialMessage, ...messagesFromChat];
  }, [description, messagesFromChat]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    requestAnimationFrame(() => {
      scrollToBottom();
    });
  }, [messages]);

  const placeholders = combinedLoading
    ? ["Please wait...", "Creating summary...", "Summarizing your content..."]
    : [
        "Type your questions...",
        "Ask me anything!",
        "What do you like about this content?",
        "Let's find what you wonder about!",
      ];

  return (
    <div className="flex justify-between bottom-0 w-full flex-col h-[90vh]">
      <div className="flex flex-col w-full h-full overflow-y-auto p-4 space-y-4 ">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            {message.sender === Sender.AI && (
              <div className="flex flex-row items-center text-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center">
                  <img src="src/assets/rex_magnified.png" alt="AI Avatar" />
                </div>
                <span className="text-base text-white mt-1">Dinomind</span>
              </div>
            )}

            {message.sender === Sender.AI ? (
              index === latestAIMessageIndex ? (
                <TextGenerateEffectFx
                  words={message.text || ""}
                  duration={1}
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
        <div ref={messagesEndRef} />
      </div>

      <div className="flex flex-col items-center justify-center bg-primary-xBackground p-2 border-t border-primary-xPrimary">
        <ActionButtons content={description} />
        <VanishInputFx
          loading={combinedLoading}
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
