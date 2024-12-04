import { Message } from "../types/messageType";
import { HistoryItem } from "../types/historyItemType";
import { Content } from "@/hooks/useContentResponse";

type StorageKey =
  | "chatHistory"
  | "contentChatHistory"
  | "historyData"
  | "interestData"
  | "contentData"
  | "chatSummary"
  | "chromeHistorySummary"
  | "contentSummary"
  | "tagData"
  | "sessionData";

type StorageMap = {
  chatHistory: Message[];
  contentChatHistory: Message[];
  historyData: HistoryItem[];
  interestData: string;
  tagData: string;
  contentData: Content[];
  chatSummary: string;
  chromeHistorySummary: string;
  contentSummary: string;
  sessionData: Message[];
  tagStat: TagStat[];
};

export type TagStat = {
  tag: string;
  like: number;
  dislike: number;
  ctr: number;
  totalCount: number;
};

export const removeLocalStorageData = (
  name: StorageKey,
  callback: () => void
) => {
  chrome.storage.local.remove(name, callback);
};

// Chat Data Management
export const saveChatData = (newMessage: Message) => {
  chrome.storage.local.get("chatHistory", (result) => {
    const chatHistory = result.chatHistory || [];
    chatHistory.push(newMessage);
    chrome.storage.local.set({ chatHistory });
  });
};

export const loadChatData = (callback: (chatHistory: Message[]) => void) => {
  chrome.storage.local.get("chatHistory", (result) => {
    const chatHistory = result.chatHistory || [];
    callback(chatHistory);
  });
};

// Content Chat Data Management
export const saveContentChatData = (newMessage: Message) => {
  chrome.storage.local.get("contentChatHistory", (result) => {
    const chatHistory = result.chatHistory || [];
    chatHistory.push(newMessage);
    chrome.storage.local.set({ chatHistory });
  });
};

export const loadContentChatData = (
  callback: (chatHistory: Message[]) => void
) => {
  chrome.storage.local.get("contentChatHistory", (result) => {
    const chatHistory = result.chatHistory || [];
    callback(chatHistory);
  });
};

// Session Data Management
export const saveSessionData = (sessionData: Message[]) => {
  chrome.storage.local.set({ sessionData });
};

export const loadSessionData = (callback: (sessionData: Message[]) => void) => {
  chrome.storage.local.get("sessionData", (result) => {
    const sessionData = result.sessionData || [];
    callback(sessionData);
  });
};

// History Data Management
export const saveHistoryData = (historyItems: HistoryItem[]): void => {
  chrome.storage.local.set({ historyData: historyItems });
};

export const loadHistoryData = (
  callback: (historyItems: HistoryItem[]) => void
): void => {
  chrome.storage.local.get("historyData", (result) => {
    const historyItems: HistoryItem[] = result.historyData || [];
    callback(historyItems);
  });
};

// Interest Data Management
export const saveInterestData = (interestInput: string[]) => {
  chrome.storage.local.set({ interestData: interestInput });
};

export const loadInterestData = (
  callback: (interestInput: string[]) => void
) => {
  chrome.storage.local.get("interestData", (result) => {
    callback(result.interestData || null);
  });
};

// Content Data Management
export const saveContentData = (content: Content[]) => {
  if (Array.isArray(content)) {
    chrome.storage.local.set<StorageMap>({ contentData: content });
  } else {
    console.error("Invalid content data provided. Expected an array:", content);
  }
};

export const saveTagStats = (data: TagStat[]) => {
  if (Array.isArray(data)) {
    chrome.storage.local.set<StorageMap>({ tagStat: data });
  } else {
    console.error("Invalid content data provided. Expected an array:", data);
  }
};

export const loadContentData = (callback: (content: Content[]) => void) => {
  chrome.storage.local.get("contentData", (result) => {
    const content = result.contentData;

    // Ensure the returned data is always an array
    if (Array.isArray(content)) {
      callback(content);
    } else {
      console.warn(
        "Invalid content data found in storage. Defaulting to empty array."
      );
      callback([]); // Provide a fallback empty array
    }
  });
};

// Tag data Management
//todo:ORHUN must add count and isClicked saving data utility Must look like content data managers
export const saveTagData = (tagInput: string[]) => {
  chrome.storage.local.set({ tagData: tagInput });
};

export const loadTagData = (callback: (tagInput: string[]) => void) => {
  chrome.storage.local.get("tagData", (result) => {
    callback(result.tagData || null);
  });
};

export const saveTagStatData = (tagInput: TagStat[]) => {
  chrome.storage.local.set({ tagStat: tagInput });
};

export const loadTagStatData = (callback: (tagInput: TagStat[]) => void) => {
  chrome.storage.local.get("tagStat", (result) => {
    callback(result.tagStat || null);
  });
};


