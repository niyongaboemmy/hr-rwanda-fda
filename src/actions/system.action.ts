import axios from "axios";
import { Dispatch } from "redux";
import { ActionTypes } from "./types";
import { API_URL } from "../utils/api";
import { setAxiosToken } from "../utils/AxiosToken";
import { Access_Interface } from "./auth.action";
import { errorToText } from "../utils/functions";

/**
 * * ****************************** INTERFACES *****************************
 */

export interface UserRoleInterface {
  access: Access_Interface[];
  role_id: string;
  role_name: string;
}

export interface BasicInfo {
  behavior: {
    behavior_id: string;
    behavior_name: string;
  }[];
  competency_classification: {
    competency_classification_id: string;
    classification_name: string;
  }[];
  competency_function: {
    competency_function_id: string;
    competency_function: string;
  }[];
  competency_type: {
    competency_type_id: string;
    competency_type: string;
  }[];
  domain: {
    competency_type_id: string;
    competency_type: string;
  }[];
  job_family: {
    job_family_id: string;
    job_family: string;
  }[];
  proficiency_level: {
    proficiency_level_id: string;
    proficiency_level: string;
  }[];
}

export interface System {
  side_nav: boolean;
  basic_info: BasicInfo | null;
  error: string;
  success: string;
}

//* ********************** ACTION TYPE INTERCACES ********************** */
export interface GetSystemInfoAction {
  type: ActionTypes.GET_SYSTEM_BASIC_INFO;
  payload: BasicInfo;
}

export interface SetSystemErrorMessageAction {
  type: ActionTypes.SET_SYSTEM_ERROR_MESSAGE;
  payload: string;
}
export interface SetSystemSuccessMessageAction {
  type: ActionTypes.SET_SYSTEM_SUCCESS_MESSAGE;
  payload: string;
}

/**
 * * ****************************** ACTIONS *****************************
 */
/**
 * @description Register the account to the api
 * @param account
 * @param MsgHandler return the error from the API
 * @returns
 */
export const FC_GetSystemInfo = (callback: (loading: boolean) => void) => {
  return async (dispatch: Dispatch) => {
    callback(true);
    setAxiosToken();
    try {
      const res = await axios.get<BasicInfo>(`${API_URL}/data/basic`);

      console.log({ system_basic_info: res.data });

      dispatch<GetSystemInfoAction>({
        type: ActionTypes.GET_SYSTEM_BASIC_INFO,
        payload: res.data,
      });
      callback(false);
    } catch (error: any) {
      dispatch<SetSystemErrorMessageAction>({
        type: ActionTypes.SET_SYSTEM_ERROR_MESSAGE,
        payload: errorToText(error),
      });
      callback(false);
      console.log("err: ", { ...error });
    }
  };
};

export const FC_SetError = (msg: string) => {
  return async (dispatch: Dispatch) => {
    dispatch<SetSystemErrorMessageAction>({
      type: ActionTypes.SET_SYSTEM_ERROR_MESSAGE,
      payload: msg,
    });
  };
};
export const FC_SetSuccess = (msg: string) => {
  return async (dispatch: Dispatch) => {
    dispatch<SetSystemSuccessMessageAction>({
      type: ActionTypes.SET_SYSTEM_SUCCESS_MESSAGE,
      payload: msg,
    });
  };
};
