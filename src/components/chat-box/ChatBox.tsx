import React from "react";
import { useChatWithAi } from "../../hooks/useChatWithAi";
import "./style.scss";
import { TextGenerateEffectFx } from "../ui/fx/textGenerateEffectFx";
import { VanishInputFx } from "../ui/fx/vanishInputFx";
import { MessageLine } from "../message-line/MessageLine";
import { BackgroundBeamsFx } from "../ui/fx/backgroundBeamsFx";
import { Sender } from "@/types/messageType";

const ChatBox: React.FC = () => {
  const {
    messages,
    loading,
    latestAIMessageIndex,
    handleInputChange,
    handleSubmit,
    clearChatHistory,
    abortCurrentPrompt,
    resetSession,
  } = useChatWithAi("chatbox");

  const placeholders = [
    "Type your interest...",
    "Ask me anything!",
    "What do you like?",
    "Let's create a content!",
  ];

  return (
    <div className="chatbox-container">
      <div className="chat-messages">
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
                <MessageLine text={message.text} />
              )
            ) : (
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

      <div className="chat-actions">
        <button onClick={clearChatHistory}>Clear Chat History</button>
        <button onClick={abortCurrentPrompt}>Stop Running Prompt</button>
        <button onClick={resetSession}>Reset AI Session</button>
      </div>

      <BackgroundBeamsFx />
    </div>
  );
};

export default ChatBox;
