import { saveChatData, saveContentData, saveInterestData } from "../dataUtils";
import { ComponentType } from "../../types/componentType";
import { Message } from "../../types/messageType";

type SaveDataFunction = {
  chatbox: (data: Message) => void;
  interest: (data: string[]) => void;
  content: (data: string[]) => void;
  summarize: (data: string[]) => void;
};

export const promptConfig: Record<
  ComponentType,
  { promptTemplate: string; saveData: SaveDataFunction[ComponentType] }
> = {
  chatbox: {
    promptTemplate: `You are a helpful assistant. User message: "{userMessage}". limit message for 100 words.`,
    saveData: saveChatData,
  },
  interest: {
    promptTemplate: `"{userMessage}" Generate content data for each title in the specified format. For each title, provide only the following data separated by commas: "title", "visitCount", and "definition" in this exact format:
      "{title},{visitCount},{definition}"
      List each entry as a separate item within curly braces, and separate items with commas.`,
    saveData: saveInterestData,
  },
  content: {
    promptTemplate: `Generate a one-sentence joke about this title: "{userMessage}"`,
    saveData: saveContentData,
  },
  summarize: {
    promptTemplate: `Summarize the following text in plain and concise points: "{userMessage}"`,
    saveData: saveInterestData,
  },
};
