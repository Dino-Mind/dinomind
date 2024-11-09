import React, { useEffect, useState } from "react";

import { fetchGeminiNanoResponse } from "../../utils/fetchGeminiResponse";
import {
  clearChatData,
  loadChatData,
  saveChatData,
} from "../../utils/chatDataUtils";
import { Message } from "../../types/messageType";
import "./style.scss";

const ChatBox: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    loadChatData(setMessages);
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !loading && input.trim()) {
      sendMessage();
    }
  };

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    saveChatData(userMessage);

    fetchGeminiNanoResponse(input, "chatbox", setLoading, setMessages);
    setInput("");
  };

  const renderMessage = (text: string | undefined) => {
    if (!text) return null;
    const lines = text.split("\n");
    return lines.map((line, index) => {
      if (/^\*\*(.*)\*\*$/.test(line)) {
        const title = line.replace(/\*\*/g, "");
        return (
          <h2 key={index} className="message-title">
            {title}
          </h2>
        );
      }
      if (/^[-*]\s/.test(line)) {
        return (
          <li key={index} className="message-list-item">
            {line.replace(/^[-*]\s/, "")}
          </li>
        );
      }
      return (
        <p key={index} className="message-paragraph">
          {line}
        </p>
      );
    });
  };

  return (
    <div className="chatbox-container">
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            {renderMessage(message.text)}
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyUp={handleKeyPress}
          placeholder="Type your message..."
          disabled={loading}
        />
        <button onClick={sendMessage} disabled={loading || !input.trim()}>
          {loading ? "Sending..." : "Send"}
        </button>
        <button onClick={() => clearChatData(() => setMessages([]))}>
          Clear Chat History
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
