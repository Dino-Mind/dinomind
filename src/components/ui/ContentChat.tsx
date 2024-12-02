import React from "react";
import { useChatWithAi } from "../../hooks/useChatWithAi";
import "./style.scss";
import { TextGenerateEffectFx } from "../ui/fx/textGenerateEffectFx";
import { VanishInputFx } from "../ui/fx/vanishInputFx";
import { MessageLine } from "../message-line/MessageLine";
import { Sender } from "@/types/messageType";

interface ContentChatProps {
  title: string;
  description: string;
  tag: string;
  summary?: string;
  id: string;
}

//we may use title description,tag later
//Todo : sen summary to chatPrompt
const ContentChat: React.FC<ContentChatProps> = ({ id, summary }) => {
  const {
    messages,
    loading,
    latestAIMessageIndex,
    handleInputChange,
    handleSubmit,
    clearChatHistory,
    abortCurrentPrompt,
    resetSession,
  } = useChatWithAi("content", id, summary);

  const placeholders = [
    "Type your interest...",
    "Ask me anything!",
    "What do you like?",
    "Let's create a content!",
  ];

  return (
    <div className="flex flex-col h-full bg-gray-800 text-white">
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
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

      <div className="flex items-center border-t border-gray-700 bg-gray-900 p-4">
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
          onClick={clearChatHistory}
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
    </div>
  );
};

export default ContentChat;
