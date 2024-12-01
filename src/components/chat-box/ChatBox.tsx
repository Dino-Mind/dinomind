import React, { useEffect, useState } from "react";

import { useGeminiResponse } from "../../hooks/useGeminiResponse";
import {
  removeLocalStorageData,
  loadChatData,
  saveChatData,
} from "../../utils/dataUtils";
import { Message, Sender } from "../../types/messageType";
import "./style.scss";
import { MessageLine } from "../message-line/MessageLine";
import {
  abortCurrentPrompt,
  resetSession,
} from "../../utils/fetchGeminiResponse";
import { TextGenerateEffectFx } from "../ui/fx/textGenerateEffectFx";
import { VanishInputFx } from "../ui/fx/vanishInputFx";
import { BackgroundBeamsFx } from "../ui/fx/backgroundBeamsFx";

const ChatBox: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [latestAIMessageIndex, setLatestAIMessageIndex] = useState<
    number | null
  >(null);

  const {
    loading,
    messages: fetchedMessages,
    fetchResponse,
  } = useGeminiResponse();

  const placeholders = [
    "Type your interest...",
    "Ask me anything!",
    "What do you like?",
    "Let's create a content!",
  ];

  useEffect(() => {
    loadChatData(setMessages);
  }, []);

  useEffect(() => {
    if (fetchedMessages.length) {
      setMessages((prevMessages) => [...prevMessages, ...fetchedMessages]);
      setLatestAIMessageIndex(messages.length);
    }
  }, [fetchedMessages]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const sendMessage = () => {
    if (!input.trim()) {
      return;
    }

    const userMessage = { sender: Sender.USER, text: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    saveChatData(userMessage);
    fetchResponse(input, "chatbox");
    setInput("");
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendMessage();
  };

  return (
    <div className="chatbox-container">
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            {message.sender === Sender.AI ? (
              // Apply TextGenerateEffect only to the latest AI message
              index === latestAIMessageIndex ? (
                <TextGenerateEffectFx
                  words={message.text || ""}
                  duration={2}
                  filter={false}
                />
              ) : (
                // TODO !!! correct style match with ai response with effect
                // Render older AI messages with static MessageLine
                <MessageLine text={message.text} />
              )
            ) : (
              // Render user messages with MessageLine
              <MessageLine text={message.text} />
            )}
          </div>
        ))}
      </div>

      <div className="chat-input">
        <VanishInputFx
          loading={loading}
          placeholders={placeholders}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
        />
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          justifyContent: "space-around",
          alignContent: "space-around",
          fontSize: "8px",
          zIndex: "20",
          height: "40px",
        }}
      >
        <button
          style={{
            color: "white",
          }}
          onClick={() => {
            removeLocalStorageData("chatHistory", () => setMessages([]));
            setLatestAIMessageIndex(null);
          }}
        >
          Clear Chat History
        </button>
        <button
          style={{
            color: "white",
          }}
          onClick={abortCurrentPrompt}
        >
          Stop Running Prompt
        </button>
        <button
          style={{
            color: "white",
          }}
          onClick={resetSession}
        >
          Reset AI Session
        </button>
      </div>

      <BackgroundBeamsFx />
    </div>
  );
};

export default ChatBox;
