import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

import { useChatWithAi } from "../../hooks/useChatWithAi";
import "./style.scss";
import { TextGenerateEffectFx } from "../ui/fx/textGenerateEffectFx";
import { VanishInputFx } from "../ui/fx/vanishInputFx";

import { BackgroundBeamsFx } from "../ui/fx/backgroundBeamsFx";
import { Sender } from "@/types/messageType";
import DinoResponse from "../dino/DinoResponse";

const ChatBox: React.FC = () => {
  const [activeAiMessageIndex, setActiveAiMessageIndex] = useState<
    number | null
  >(null);

  const {
    messages,
    loading,
    latestAIMessageIndex,
    handleInputChange,
    handleSubmit,
    clearChatHistory,
  } = useChatWithAi("chatbox");

  const placeholders = [
    "Type your interest...",
    "Ask me anything!",
    "What do you like?",
    "Let's create a content!",
  ];

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (loading && messages.length > 0) {
      const lastIndex = messages.length - 1;
      if (messages[lastIndex].sender === Sender.AI) {
        setActiveAiMessageIndex(lastIndex);
      }
    } else {
      setActiveAiMessageIndex(null); // Reset when not loading
    }
  }, [loading, messages]);

  useEffect(() => {
    requestAnimationFrame(() => {
      scrollToBottom();
    });
  }, [messages]);

  return (
    <div className="chatbox-container">
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            {message.sender === Sender.AI && (
              <>
                {/* Render DinoResponse for every AI message */}
                <DinoResponse
                  isLoading={index === activeAiMessageIndex && loading}
                />

                {index === activeAiMessageIndex && loading ? (
                  <TextGenerateEffectFx
                    words={message.text || ""}
                    duration={0.3}
                    filter={false}
                  />
                ) : (
                  <ReactMarkdown className="prose prose-invert">
                    {message.text}
                  </ReactMarkdown>
                )}
              </>
            )}
            {message.sender !== Sender.AI && (
              <ReactMarkdown className="prose prose-invert border border-gray-500 rounded-xl  px-2 max-w-fit ml-auto">
                {message.text}
              </ReactMarkdown>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
        <VanishInputFx
          loading={loading}
          placeholders={placeholders}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
        />
      </div>

      <div className="chat-actions">
        <button onClick={clearChatHistory}>Clear Chat History</button>
      </div>

      <BackgroundBeamsFx />
    </div>
  );
};

export default ChatBox;
