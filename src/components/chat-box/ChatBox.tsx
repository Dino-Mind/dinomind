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

const ChatBox: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const {
    loading,
    messages: fetchedMessages,
    fetchResponse,
  } = useGeminiResponse();

  useEffect(() => {
    loadChatData(setMessages);
  }, []);

  useEffect(() => {
    if (fetchedMessages.length) {
      setMessages((prevMessages) => [...prevMessages, ...fetchedMessages]);
    }
  }, [fetchedMessages]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !loading && input.trim()) {
      sendMessage();
    }
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

  return (
    <div className="chatbox-container">
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            <MessageLine text={message.text} />
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
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignContent: "center",
          height: "40px",
        }}
      >
        <button
          style={{
            display: "flex",
          }}
          onClick={() =>
            removeLocalStorageData("chatHistory", () => setMessages([]))
          }
        >
          Clear Chat History
        </button>
        <button onClick={abortCurrentPrompt}>Stop Running Prompt</button>
        <button onClick={resetSession}>Reset AI Session</button>
      </div>
    </div>
  );
};

export default ChatBox;
