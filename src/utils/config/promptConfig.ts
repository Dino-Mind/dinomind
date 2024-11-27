import {
  saveChatData,
  saveContentData,
  saveInterestData,
  saveSummaryData,
} from "../dataUtils";
import { ComponentType } from "../../types/componentType";
import { Message } from "../../types/messageType";

type SaveDataFunction = {
  chatbox: (data: Message) => void;
  interest: (data: string[]) => void;
  content: (data: string[]) => void;
  summarize: (data: string) => void;
};

export const promptConfig: Record<
  ComponentType,
  {
    promptTemplate: string;
    continuedPromptTemplate?: string;
    defaultPromptTemplate?: string;
    saveData: SaveDataFunction[ComponentType];
  }
> = {
  chatbox: {
    promptTemplate: `You are a helpful assistant. User message: "{userMessage}". Limit response to 100 words.`,
    continuedPromptTemplate: `Based on this data "{summaryData}" respond "{userMessage}". Limit response to 100 words.`,
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
    promptTemplate: `Summarize the following conversation data in concise points: "{sessionData}" limit your response to 50 words`,
    saveData: saveSummaryData,
  },
};
