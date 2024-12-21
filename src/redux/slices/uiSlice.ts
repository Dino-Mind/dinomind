import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TabName } from "../../types";

export interface UIState {
  activeTab: TabName;
  isContentChanged: boolean;
}

const initialState: UIState = {
  activeTab: "ChatBox",
  isContentChanged: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setActiveTab(state, action: PayloadAction<TabName>) {
      state.activeTab = action.payload;
    },
    setIsContentChanged(state, action: PayloadAction<boolean>) {
      state.isContentChanged = action.payload;
    },
  },
});

export const { setActiveTab, setIsContentChanged } = uiSlice.actions;
export default uiSlice.reducer;
