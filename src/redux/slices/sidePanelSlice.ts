/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { saveSessionData, saveSummaryData } from "../../utils/dataUtils";
// import { processChatHistory } from "../../utils/fetchGeminiSummarize";

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
        saveSessionData(chatHistory);
        resolve();
      });
    });
  }
);

// !!!!!!!  DEV_NOTE : this version works because it triggered with the background messaging system, Above one responds browser not support kinda message
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

    //checking chatHistory with lenght because it may null or
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

//TODO make it more simpler and cleaner with messaging system like above !

// export const summarizeChatHistory = createAsyncThunk(
//   "sidePanel/summarizeChatHistory",
//   async (_, { getState }) => {
//     const state: { sidePanel: SidePanelState } = getState() as any;

//     if (!state.sidePanel.isOpen) {
//       console.log(
//         "[summarizeChatHistory] - Side panel is not open. Skipping chat summary."
//       );
//       return;
//     }

//     await processChatHistory();
//   }
// );

const sidePanelSlice = createSlice({
  name: "sidePanel",
  initialState,
  reducers: {
    openSidePanel(state) {
      console.log("[sidePanelSlice] Side panel opened.");

      state.isOpen = true;
    },
    closeSidePanel(state) {
      console.log("[sidePanelSlice] Side panel closed.");

      state.isOpen = false;
    },
    setSidePanelState(state, action: PayloadAction<boolean>) {
      console.log("[sidePanelSlice] Side panel state set to:", action.payload);

      state.isOpen = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(saveChatHistory.fulfilled, () => {
      console.log("[sidePanelSlice] Chat history successfully saved.");
    });
  },
});

export const { openSidePanel, closeSidePanel, setSidePanelState } =
  sidePanelSlice.actions;
export default sidePanelSlice.reducer;
