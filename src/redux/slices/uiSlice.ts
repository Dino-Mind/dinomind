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
      console.log(
        `[Redux] Tab changing from ${state.activeTab} to ${action.payload}`
      );
      state.activeTab = action.payload;
    },
    setIsContentChanged(state, action: PayloadAction<boolean>) {
      console.log("[Redux] Content change flag set to:", action.payload);
      state.isContentChanged = action.payload;
    },
  },
});

export const { setActiveTab, setIsContentChanged } = uiSlice.actions;
export default uiSlice.reducer;
