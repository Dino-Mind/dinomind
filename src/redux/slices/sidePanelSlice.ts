/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { saveSummaryData } from "../../utils/dataUtils";

export interface SidePanelState {
  isOpen: boolean;
  chatSummary?: string;
}

const initialState: SidePanelState = {
  isOpen: false,
};

export const saveChatHistory = createAsyncThunk(
  "sidePanel/saveChatHistory",
  async () => {
    return new Promise<void>((resolve) => {
      chrome.storage.local.get("chatHistory", (data) => {
        const chatHistory = data.chatHistory || [];
        chrome.storage.local.set({ savedChatHistory: chatHistory }, () => {
          console.log("Chat history saved on side panel close.");
          resolve();
        });
      });
    });
  }
);

export const summarizeChatHistory = createAsyncThunk(
  "sidePanel/summarizeChatHistory",
  async ({ currentTabId }: { currentTabId: number }, { getState }) => {
    const state: { sidePanel: SidePanelState } = getState() as any;

    if (!state.sidePanel.isOpen) {
      return;
    }

    const { chatHistory } = await new Promise<{
      chatHistory: Array<{ sender: string; text: string }>;
    }>((resolve) =>
      chrome.storage.local.get("chatHistory", (data) => {
        resolve({ chatHistory: data.chatHistory || [] });
      })
    );

    //checking chatHistory with lenght because it may null or empty
    if (chatHistory.length > 0) {
      const fullChatText = chatHistory.map((entry) => entry.text).join(" ");
      console.log("Full chat text for summary:", fullChatText);

      try {
        const summary = await new Promise<string>((resolve, reject) => {
          chrome.tabs.sendMessage(
            currentTabId,
            { action: "summarizeText", text: fullChatText },
            (response) => {
              if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError.message));
              } else if (response.error) {
                reject(new Error(response.error));
              } else {
                resolve(response.summary);
              }
            }
          );
        });

        saveSummaryData(summary);
        console.log("summary:", summary);

        return summary;
      } catch (error) {
        console.error("Error summarizing text:", error);
        return "Unable to summarize at this time.";
      }
    } else {
      console.log("No chat history found. Skipping summarization.");
    }
  }
);

const sidePanelSlice = createSlice({
  name: "sidePanel",
  initialState,
  reducers: {
    openSidePanel(state) {
      state.isOpen = true;
    },
    closeSidePanel(state) {
      state.isOpen = false;
    },
    setSidePanelState(state, action: PayloadAction<boolean>) {
      state.isOpen = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(saveChatHistory.fulfilled, () => {
      console.log("Chat history successfully saved.");
    });
    builder.addCase(summarizeChatHistory.fulfilled, (state, action) => {
      if (action.payload) {
        state.chatSummary = action.payload;
      }
    });
  },
});

export const { openSidePanel, closeSidePanel, setSidePanelState } =
  sidePanelSlice.actions;
export default sidePanelSlice.reducer;
