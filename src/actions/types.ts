import {
  CleanUserDetails,
  LoginSuccessDetails,
  LogoutUser,
  SwitchEmploymentAction,
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
  GET_SYSTEM_BASIC_INFO = "GET_SYSTEM_BASIC_INFO",
  SET_SYSTEM_ERROR_MESSAGE = "SET_SYSTEM_ERROR_MESSAGE",
  SET_SYSTEM_SUCCESS_MESSAGE = "SET_SYSTEM_SUCCESS_MESSAGE",
  SWITCH_EMPLOYMENT = "SWITCH_EMPLOYMENT",
}

export type Action =
  | CleanUserDetails
  | LoginSuccessDetails
  | LogoutUser
  | GetSystemInfoAction
  | SetSystemErrorMessageAction
  | SetSystemSuccessMessageAction
  | SwitchEmploymentAction;
