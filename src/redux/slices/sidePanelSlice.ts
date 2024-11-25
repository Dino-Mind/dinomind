import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SidePanelState {
  isOpen: boolean;
}

const initialState: SidePanelState = {
  isOpen: false,
};

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
});

export const { openSidePanel, closeSidePanel, setSidePanelState } =
  sidePanelSlice.actions;
export default sidePanelSlice.reducer;
