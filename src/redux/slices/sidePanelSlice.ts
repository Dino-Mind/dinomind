/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import {
  loadSessionData,
  saveSessionData,
  saveSummaryData,
} from "../../utils/dataUtils";
import { promptConfig } from "../../utils/config/promptConfig";
import { Message } from "../../types/messageType";

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
        saveSessionData(chatHistory); // Use the new utility for saving session data
        resolve();
      });
    });
  }
);

export const summarizeChatHistory = createAsyncThunk(
  "sidePanel/summarizeChatHistory",
  async ({ currentTabId }: { currentTabId: number }, { getState }) => {
    const state: { sidePanel: SidePanelState } = getState() as any;

    if (!state.sidePanel.isOpen) {
      console.log("Side panel is not open. Skipping chat summary.");
      return;
    }

    // Fetch chat history from local storage
    const sessionData = await new Promise<Message[]>((resolve) =>
      loadSessionData((data) => resolve(data || []))
    );

    if (sessionData.length > 0) {
      // Combine session data into a single string
      const formattedSessionData = sessionData
        .map((entry) => `${entry.sender}: ${entry.text}`)
        .join(" ");

      // Get the prompt template from promptConfig
      const { promptTemplate } = promptConfig.summarize;
      const prompt = promptTemplate.replace(
        "{sessionData}",
        formattedSessionData
      );

      try {
        // Send message to content script for AI summarization
        const summary = await new Promise<string>((resolve, reject) => {
          chrome.tabs.sendMessage(
            currentTabId,
            { action: "summarizeText", text: prompt },
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
        console.log("Summary saved:", summary);

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
