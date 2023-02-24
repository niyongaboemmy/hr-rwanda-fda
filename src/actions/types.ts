import {
  CleanUserDetails,
  LoginSuccessDetails,
  LogoutUser,
  SwitchEmploymentAction,
} from "./auth.action";
import {
  GetAllPositionsInfoAction,
  SetPositionCompetenciesAction,
  UpdatePositionAccessInfoAction,
} from "./position.action";
import {
  GetAccessListDetailsInfoAction,
  GetSystemInfoAction,
  SetSystemErrorMessageAction,
  SetSystemSuccessMessageAction,
} from "./system.action";
import { GetAllUnitsInfoAction } from "./units.action";

export enum ActionTypes {
  LOGIN_DETAILS = "LOGIN_DETAILS",
  USER_LOGIN_SUCCESS_DATA = "USER_LOGIN_SUCCESS_DATA",
  CLEAN_USER_DETAILS = "CLEAN_USER_DETAILS",
  LOGOUT = "LOGOUT",
  GET_SYSTEM_BASIC_INFO = "GET_SYSTEM_BASIC_INFO",
  SET_SYSTEM_ERROR_MESSAGE = "SET_SYSTEM_ERROR_MESSAGE",
  SET_SYSTEM_SUCCESS_MESSAGE = "SET_SYSTEM_SUCCESS_MESSAGE",
  SWITCH_EMPLOYMENT = "SWITCH_EMPLOYMENT",
  GET_ALL_POSITIONS = "GET_ALL_POSITIONS",
  GET_ALL_UNITS = "GET_ALL_UNITS",
  GET_ALL_ACCESS_DETAILS = "GET_ALL_ACCESS_DETAILS",
  UPDATE_POSITION_ACCESS = "UPDATE_POSITION_ACCESS",
  SET_POSITION_COMPETENCIES = "SET_POSITION_COMPETENCIES",
}

export type Action =
  | CleanUserDetails
  | LoginSuccessDetails
  | LogoutUser
  | GetSystemInfoAction
  | SetSystemErrorMessageAction
  | SetSystemSuccessMessageAction
  | SwitchEmploymentAction
  | GetAllPositionsInfoAction
  | GetAllUnitsInfoAction
  | GetAccessListDetailsInfoAction
  | UpdatePositionAccessInfoAction
  | SetPositionCompetenciesAction;
