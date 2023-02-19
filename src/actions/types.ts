import { GetApplicationsByDatesAction } from "./applications";
import {
  CleanUserDetails,
  LoginSuccessDetails,
  LogoutUser,
} from "./auth.action";
import {
  GetSystemInfoAction,
  SetSystemErrorMessageAction,
  SetSystemSuccessMessageAction,
} from "./system.action";

export enum ActionTypes {
  LOGIN_DETAILS = "LOGIN_DETAILS",
  USER_LOGIN_SUCCESS_DATA = "USER_LOGIN_SUCCESS_DATA",
  CLEAN_USER_DETAILS = "CLEAN_USER_DETAILS",
  LOGOUT = "LOGOUT",
  GET_SYSTEM_INFO = "GET_SYSTEM_INFO",
  GET_INSTRUCTION_LETTERS = "GET_INSTRUCTION_LETTERS",
  ASSIGN_INSTRUCTION_LETTER = "ASSIGN_INSTRUCTION_LETTER",
  SET_SYSTEM_ERROR_MESSAGE = "SET_SYSTEM_ERROR_MESSAGE",
  GET_BANK_SUMMARY = "GET_BANK_SUMMARY",
  // New Enums
  GET_APPLICATIONS_BY_DATES = "GET_APPLICATIONS_BY_DATES",
  SET_SYSTEM_SUCCESS_MESSAGE = "SET_SYSTEM_SUCCESS_MESSAGE",
}

export type Action =
  | CleanUserDetails
  | LoginSuccessDetails
  | LogoutUser
  | GetSystemInfoAction
  | SetSystemErrorMessageAction
  | GetApplicationsByDatesAction
  | SetSystemSuccessMessageAction;
