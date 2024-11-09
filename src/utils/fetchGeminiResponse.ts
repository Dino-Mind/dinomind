/* eslint-disable @typescript-eslint/no-explicit-any */
import { Message } from "../types/messageType";
import {
  saveChatData,
  saveContentData,
  saveInterestData,
} from "./chatDataUtils";

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

export const fetchGeminiNanoResponse = (
  userMessage: string,
  component: ComponentType,
  setLoading: (loading: boolean) => void,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
): Promise<string> => {
  return new Promise((resolve) => {
    (async () => {
      if (!userMessage.trim()) {
        console.warn("No data available to send to AI.");
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            sender: "system",
            text: "No data available to generate content tags.",
          },
        ]);
        resolve("No data available to generate content tags.");
        return;
      }

      setLoading(true);
      const { promptTemplate, saveData } = componentConfig[component];

      try {
        if (!window.ai || !window.ai.languageModel) {
          const errorMessage =
            "Error: Gemini Nano is not available in this browser.";
          setMessages((prevMessages) => [
            ...prevMessages,
            { sender: "ai", text: errorMessage },
          ]);
          resolve(errorMessage);
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

        const aiMessage: Message = { sender: "ai", text: responseText };
        setMessages((prevMessages) => [...prevMessages, aiMessage]);
        saveData(component === "chatbox" ? aiMessage : responseText);
        resolve(responseText);
      } catch (error) {
        console.error("Error fetching AI response:", error);
        const errorMessage = "Error: Could not reach the AI service.";
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "ai", text: errorMessage },
        ]);
        resolve(errorMessage);
      } finally {
        setLoading(false);
      }
    })();
  });
};
