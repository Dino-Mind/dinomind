/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { saveSessionData } from "../../utils/dataUtils";

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
    builder.addCase(saveChatHistory.fulfilled, () => {});
  },
});

export const { openSidePanel, closeSidePanel, setSidePanelState } =
  sidePanelSlice.actions;
export default sidePanelSlice.reducer;
