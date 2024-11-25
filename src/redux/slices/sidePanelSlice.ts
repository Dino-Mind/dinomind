import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SidePanelState {
  isOpen: boolean;
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
  },
});

export const { openSidePanel, closeSidePanel, setSidePanelState } =
  sidePanelSlice.actions;
export default sidePanelSlice.reducer;
