import { useState } from "react";
import { fetchGeminiResponse } from "../utils/fetchGeminiResponse";
import { promptConfig } from "../utils/config/promptConfig";
import { Message, Sender } from "../types/messageType";
import { ComponentType, ComponentTypeEnum } from "../types/componentType";

export const useGeminiResponse = () => {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const fetchResponse = async (
    userMessage: string,
    component: ComponentType,
    id?: string,
    summary?: string
  ) => {
    setLoading(true);

    try {
      const responseText = await fetchGeminiResponse(
        userMessage,
        component,
        summary,
        id
      );

      const { saveData } = promptConfig[component];

      if (component === ComponentTypeEnum.Chatbox) {
        const aiMessage: Message = { sender: Sender.AI, text: responseText };
        setMessages((prevMessages) => [
          ...prevMessages.filter((msg) => msg.sender !== Sender.AI),
          aiMessage,
        ]);
        (saveData as (data: Message) => void)(aiMessage);
      } else if (component === ComponentTypeEnum.ContentChat) {
        const aiMessage: Message = { sender: Sender.AI, text: responseText };
        setMessages((prevMessages) => [
          ...prevMessages.filter((msg) => msg.sender !== Sender.AI),
          aiMessage,
        ]);
        (saveData as (data: Message) => void)(aiMessage);
      } else {
        (saveData as (data: string[]) => void)([responseText]);
      }

      return responseText;
    } catch (error) {
      console.error("Error in fetchResponse:", error);
      return "An error occurred while fetching the response.";
    } finally {
      setLoading(false);
    }
  };

  return { loading, messages, fetchResponse };
};
