import { useState, useEffect } from "react";

import { Sender, Message } from "@/types/messageType";
import { useGeminiResponse } from "./useGeminiResponse";
import {
  loadChatData,
  removeLocalStorageData,
  saveChatData,
} from "@/utils/dataUtils";
import { abortCurrentPrompt, resetSession } from "@/utils/fetchGeminiResponse";
import { ComponentType } from "@/types/componentType";

export const useChatWithAi = (
  component: ComponentType,
  id?: string,
  summary?: string
) => {
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

    //ADD here to check if UserComponent is Content Dont SaveChatData, else Save !!!
    const userMessage = { sender: Sender.USER, text: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    saveChatData(userMessage);

    fetchResponse(input, component, id, summary);
    setInput("");
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendMessage();
  };

  const clearChatHistory = () => {
    removeLocalStorageData("chatHistory", () => setMessages([]));
    setLatestAIMessageIndex(null);
  };

  return {
    messages,
    loading,
    latestAIMessageIndex,
    handleInputChange,
    handleSubmit,
    clearChatHistory,
    abortCurrentPrompt,
    resetSession,
  };
};
