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
  summarizeChat: (data: string) => void;
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
    promptTemplate: `Answer this message text that user wrote to you with helpful attitude. "{userMessage}". Generate short but concise messages Limit response to 100 words.`,
    continuedPromptTemplate: `Based on this data "{summaryData}" respond "{userMessage}". Limit response to 100 words.`,
    saveData: saveChatData,
  },
  interest: {
    promptTemplate: `Generate content title for provided text : "{userMessage}". Generate your response with title and one sentenced simple definiton about that title exactly as in this format: "{title},{definition}". List each entry as a separate item within curly braces, and separate items with commas.`,
    saveData: saveInterestData,
  },
  content: {
    promptTemplate: `Generate a content about the user entered this web page a lot "{userMessage}" look at the title and definition for to create interesting and short content. Limit your response to 50 words.`,
    saveData: saveContentData,
  },
  summarizeChat: {
    promptTemplate: `Summarize the following conversation data in concise points: "{sessionData}" limit your response to 50 words`,
    saveData: saveSummaryData,
  },
};
