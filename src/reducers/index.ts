import { combineReducers } from "redux";
import {
  ApplicationsStore,
  Auth,
  InstructionLetterStore,
  System,
} from "../actions";
import { applicationsReducer } from "./applications";
import { authReducer } from "./auth.reducer";
import { instructionLetterReducer } from "./instruction-letter.reducer";
import { systemReducer } from "./system.reducer";

// define the entire state into the entire side
export interface StoreState {
  auth: Auth;
  system: System;
  instructionLetters: InstructionLetterStore;
  applications: ApplicationsStore;
}

export const reducers = combineReducers<StoreState>({
  auth: authReducer,
  system: systemReducer,
  instructionLetters: instructionLetterReducer,
  applications: applicationsReducer,
});
