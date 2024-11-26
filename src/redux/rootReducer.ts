import { combineReducers } from "@reduxjs/toolkit";
import uiReducer from "./slices/uiSlice";
import sidePanelReducer from "./slices/sidePanelSlice";

const rootReducer = combineReducers({
  ui: uiReducer,
  sidePanel: sidePanelReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
