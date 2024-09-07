import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./auth.reducer";
import { claimReducer } from "./claims.reducer";
import { projectReducer } from "./projects.reducer";
import { staffReducer } from "./staff.reducer";
import { dashboardReducer } from "./dashboard.reducer";

const rootReducer = combineReducers({
  auth: authReducer,
  claim: claimReducer,
  project: projectReducer,
  staff: staffReducer,
  dashboard: dashboardReducer,
});

export default rootReducer;
