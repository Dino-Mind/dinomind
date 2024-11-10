import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TabName } from "../../types";

export interface UIState {
  activeTab: TabName;
}

const initialState: UIState = {
  activeTab: "ChatBox",
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setActiveTab(state, action: PayloadAction<TabName>) {
      state.activeTab = action.payload;
    },
  },
});

export const { setActiveTab } = uiSlice.actions;
export default uiSlice.reducer;
