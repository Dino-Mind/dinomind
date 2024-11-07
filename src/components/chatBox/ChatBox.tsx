import React, { useState } from "react";

import { fetchGeminiNanoResponse } from "../../utils/fetchGeminiResponse";
import "./style.scss";

interface Message {
  sender: string;
  text: string;
}

const ChatBox: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

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

    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "user", text: input },
    ]);

    const promptTemplate = `You are a helpful and friendly assistant. Here is a message from a user:

    Message: "{userMessage}"
    "Please format your response based on the type of question:
      If the question is conversational (like a chat), respond in a friendly, conversational tone with shorter, direct sentences.
      If the question is asking for a definition, description, or structured information, organize your answer with a title, paragraphs, and use lists where appropriate. Keep the response clear, easy to read, and well-structured."

    Respond in a polite and conversational tone, and keep the answer organized and easy to understand.`;

    fetchGeminiNanoResponse(input, promptTemplate, setLoading, setMessages);
    setInput("");
  };

  const renderMessage = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, index) => {
      // Check if line is a title (e.g., surrounded by **)
      if (/^\*\*(.*)\*\*$/.test(line)) {
        const title = line.replace(/\*\*/g, "");
        return (
          <h2 key={index} className="message-title">
            {title}
          </h2>
        );
      }
      // Check if line is a bullet point
      if (/^[-*]\s/.test(line)) {
        return (
          <li key={index} className="message-list-item">
            {line.replace(/^[-*]\s/, "")}
          </li>
        );
      }
      // Render as paragraph by default
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
      </div>
    </div>
  );
};

export default ChatBox;
