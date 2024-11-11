import { Message } from "../types/messageType";

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

export const clearChatData = (callback: () => void) => {
  chrome.storage.local.remove("chatHistory", callback);
};

export const saveInterestData = (tags: string) => {
  chrome.storage.local.set({ interestTags: tags });
};

export const loadInterestData = (callback: (tags: string) => void) => {
  chrome.storage.local.get("interestTags", (result) => {
    callback(result.interestTags || "");
  });
};

export const clearInterestData = (callback: () => void) => {
  chrome.storage.local.remove("interestTags", callback);
};

export const saveContentData = (content: string) => {
  chrome.storage.local.set({ contentDatas: content });
};

export const loadContentData = (callback: (content: string) => void) => {
  chrome.storage.local.get("contentDatas", (result) => {
    callback(result.contentDatas || "");
  });
};

export const clearContentData = (callback: () => void) => {
  chrome.storage.local.remove("contentDatas", callback);
};
