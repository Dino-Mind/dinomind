import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

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

  const fetchGeminiResponse = async (userMessage: string) => {
    setLoading(true);
    try {
      const genAI = new GoogleGenerativeAI(
        import.meta.env.VITE_GEMINI_AI_API_KEY
      );
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(userMessage);
      const response = await result.response;
      const text = await response.text();

      setMessages((prevMessages) => [...prevMessages, { sender: "ai", text }]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "ai", text: "Error: Could not reach the AI service." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = () => {
    if (!input.trim()) return;

    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "user", text: input },
    ]);

    fetchGeminiResponse(input);

    setInput("");
  };

  return (
    <div className="chatbox-container">
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            <span>{message.text}</span>
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
