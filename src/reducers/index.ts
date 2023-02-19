import { combineReducers } from "redux";
import { ApplicationsStore, Auth, System } from "../actions";
import { applicationsReducer } from "./applications";
import { authReducer } from "./auth.reducer";
import { systemReducer } from "./system.reducer";

// define the entire state into the entire side
export interface StoreState {
  auth: Auth;
  system: System;
  applications: ApplicationsStore;
}

export const reducers = combineReducers<StoreState>({
  auth: authReducer,
  system: systemReducer,
  applications: applicationsReducer,
});
