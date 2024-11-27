/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { saveSessionData } from "../../utils/dataUtils";
import { processChatHistory } from "../../utils/fetchGeminiSummarize";

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

export const summarizeChatHistory = createAsyncThunk(
  "sidePanel/summarizeChatHistory",
  async (_, { getState }) => {
    const state: { sidePanel: SidePanelState } = getState() as any;

    if (!state.sidePanel.isOpen) {
      console.log(
        "[summarizeChatHistory] - Side panel is not open. Skipping chat summary."
      );
      return;
    }

    await processChatHistory();
  }
);

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
