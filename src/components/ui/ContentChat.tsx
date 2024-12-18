import React, { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";

import { useChatWithAi } from "../../hooks/useChatWithAi";
import "./style.scss";
import { TextGenerateEffectFx } from "../ui/fx/textGenerateEffectFx";
import { VanishInputFx } from "../ui/fx/vanishInputFx";

import { Sender } from "@/types/messageType";
import ActionButtons from "./ActionButtons";
import DinoResponse from "../dino/DinoResponse";

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
  tag,
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

  const [messages, setMessages] = React.useState(() => {
    const initialMessage = {
      sender: Sender.AI,
      text: description,
    };
    return [initialMessage, ...messagesFromChat];
  });

  useEffect(() => {
    if (messagesFromChat.length === 0) return;
    setMessages((prev) => {
      return [prev[0], ...messagesFromChat];
    });
  }, [messagesFromChat]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    requestAnimationFrame(() => {
      scrollToBottom();
    });
  }, [messages]);

  const placeholders = loading
    ? ["Please wait...", "I'm thinking...", "Just a moment..."]
    : combinedLoading
    ? ["Updating memory...", "Please wait..."]
    : [
        "Type your questions...",
        "Ask me anything!",
        "What do you like about this content?",
        "Let's find what you wonder about!",
      ];

  const languageEmojiMap = {
    tr: "🇹🇷",
    ko: "🇰🇷",
    es: "🇪🇸",
  };

  const handleTranslate = (targetLanguage: string, result: string) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        sender: Sender.USER,
        text: `Translate to ${
          languageEmojiMap[targetLanguage as keyof typeof languageEmojiMap]
        }`,
      },
      {
        sender: Sender.AI,
        text: result,
      },
    ]);
  };

  /**
     const handleTranslate = (targetLanguage: string, result: string) => {
    const userMessage: Message = {
      sender: Sender.USER,
      text: `Translate to ${
        languageEmojiMap[targetLanguage as keyof typeof languageEmojiMap]
      }`,
    };
    const aiMessage: Message = {
      sender: Sender.AI,
      text: result,
    };
    setMessages((prevMessages) => [...prevMessages, userMessage, aiMessage]);
    if (id) {
      saveContentChatData(id, userMessage);
      saveContentChatData(id, aiMessage);
    }
  };
   */

  const handleClearChat = () => {
    clearChatHistory(); // Clear the storage
    setMessages([
      {
        sender: Sender.AI,
        text: description, // Reset messages to the initial state
      },
    ]);
  };

  const lastAIMessage =
    messages
      .slice()
      .reverse()
      .find((message) => message.sender === Sender.AI)?.text || "";

  return (
    <div className="flex justify-between bottom-0 w-full flex-col h-[90vh]">
      <div className="flex flex-col w-full h-full overflow-y-auto p-4 space-y-4 ">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            {message.sender === Sender.AI && <DinoResponse isLoading={false} />}

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
              <>
                <ReactMarkdown className="prose prose-invert border border-gray-500 rounded-xl text-right px-2 max-w-[70vw] w-fit ml-auto">
                  {message.text}
                </ReactMarkdown>
                {loading && (
                  <DinoResponse
                    isLoading={index + 1 === messages.length && loading}
                  />
                )}
              </>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex flex-col items-center justify-center bg-primary-xBackground p-2 border-t border-primary-xPrimary">
        <ActionButtons
          content={description}
          tag={tag}
          lastMessage={lastAIMessage}
          onTranslate={handleTranslate}
        />
        <VanishInputFx
          loading={combinedLoading}
          placeholders={placeholders}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
        />
        <button
          onClick={handleClearChat}
          className="text-white border-b border-gray-400"
        >
          Clear Chat History
        </button>
      </div>
    </div>
  );
};

export default ContentChat;
