import { useState, useEffect } from "react";

import { Sender, Message } from "@/types/messageType";
import { useGeminiResponse } from "./useGeminiResponse";
import {
  loadChatData,
  loadContentChatData,
  removeLocalStorageData,
  saveChatData,
  saveContentChatData,
} from "@/utils/dataUtils";
import { abortCurrentPrompt, resetSession } from "@/utils/fetchGeminiResponse";
import { ComponentType, ComponentTypeEnum } from "@/types/componentType";

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
    if (component === ComponentTypeEnum.Chatbox) {
      loadChatData(setMessages);
    } else if (component === ComponentTypeEnum.ContentChat) {
      loadContentChatData(setMessages);
    }
  }, [component]);

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
    if (component === ComponentTypeEnum.Chatbox) {
      saveChatData(userMessage);
    } else if (component === ComponentTypeEnum.ContentChat) {
      saveContentChatData(userMessage);
    }

    setMessages((prevMessages) => [...prevMessages, userMessage]);

    fetchResponse(input, component, id, summary);
    setInput("");
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendMessage();
  };

  const clearChatHistory = () => {
    if (component === ComponentTypeEnum.Chatbox) {
      removeLocalStorageData("chatHistory", () => setMessages([]));
    } else if (component === ComponentTypeEnum.ContentChat) {
      removeLocalStorageData("contentChatHistory", () => setMessages([]));
    }
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
