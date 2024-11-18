/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Message, Sender } from "../types/messageType";
import { saveChatData, saveContentData, saveInterestData } from "./dataUtils";

type ComponentType = "chatbox" | "interest" | "content";

const componentConfig: Record<
  ComponentType,
  { promptTemplate: string; saveData: (data: any) => void }
> = {
  chatbox: {
    promptTemplate: `You are a helpful assistant. User message: "{userMessage}". Format based on type.`,
    saveData: saveChatData,
  },
  interest: {
    promptTemplate: `"{userMessage}" Generate content tags for each title in the specified format. For each title, provide only the following data separated by commas: "title", "visitCount", and "definition" in this exact format:
    "{title},{visitCount},{definition}"
    List each entry as a separate item within curly braces, and separate items with commas. Do not add any additional text or labels. The output should look like this:
    
    {YouTube,504,YouTube, a popular video-sharing platform.},{Example Domain,308,Example Domain, a domain name owned by Google.}
    
    Only return the list of entries in this format.`,
    saveData: saveInterestData,
  },
  content: {
    promptTemplate: `Generate a one-sentence joke about this title: "{userMessage}"`,
    saveData: saveContentData,
  },
};

export const useGeminiNanoResponse = () => {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handleError = (
    message: string,
    sender: Sender,
    resolve: (value: string | PromiseLike<string>) => void
  ) => {
    console.warn(message);
    setMessages((prevMessages) => [...prevMessages, { sender, text: message }]);
    resolve(message);
  };

  const fetchGeminiNanoResponse = (
    userMessage: string,
    component: ComponentType
  ): Promise<string> => {
    return new Promise((resolve) => {
      (async () => {
        if (!userMessage.trim()) {
          handleError(
            "No data available to generate content tags.",
            Sender.SYSTEM,
            resolve
          );
          return;
        }

        setLoading(true);
        const { promptTemplate, saveData } = componentConfig[component];

        try {
          if (!window.ai || !window.ai.languageModel) {
            handleError(
              "Error: Gemini Nano is not available in this browser.",
              Sender.AI,
              resolve
            );
            return;
          }

          const prompt = promptTemplate.replace("{userMessage}", userMessage);
          const session = await window.ai.languageModel.create({
            temperature: 0.7,
            topK: 3,
          });

          const stream = await session.promptStreaming(prompt);

          let responseText = "";

          for await (const chunk of stream) {
            responseText = chunk.trim();
          }

          const aiMessage: Message = { sender: Sender.AI, text: responseText };
          setMessages((prevMessages) => [...prevMessages, aiMessage]);
          saveData(component === "chatbox" ? aiMessage : responseText);
          resolve(responseText);
        } catch (error) {
          console.error("Error fetching AI response:", error);
          const errorMessage = "Error: Could not reach the AI service.";
          setMessages((prevMessages) => [
            ...prevMessages,
            { sender: Sender.AI, text: errorMessage },
          ]);
          resolve(errorMessage);
        } finally {
          setLoading(false);
        }
      })();
    });
  };

  return { loading, messages, fetchGeminiNanoResponse };
};
