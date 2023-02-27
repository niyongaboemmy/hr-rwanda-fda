import axios from "axios";
import { Dispatch } from "redux";
import { ActionTypes } from "./types";
import { API_URL } from "../utils/api";
import { setAxiosToken } from "../utils/AxiosToken";
import { errorToText } from "../utils/functions";
import { UserAccessInterface, UserAccessList } from "../config/userAccess";

/**
 * * ****************************** INTERFACES *****************************
 */

export interface UserRoleInterface {
  access: UserAccessInterface[];
  role_id: string;
  role_name: string;
}

export interface BehaviorItemInterface {
  behavior_id: string;
  behavior_name: string;
}

export interface BasicInfo {
  behavior: BehaviorItemInterface[];
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

export interface AccessListDetails {
  access_key: UserAccessList;
  access_name: string;
}

export interface System {
  side_nav: boolean;
  basic_info: BasicInfo | null;
  access_details: AccessListDetails[] | null;
  error: string;
  success: string;
}

//* ********************** ACTION TYPE INTERCACES ********************** */
export interface GetSystemInfoAction {
  type: ActionTypes.GET_SYSTEM_BASIC_INFO;
  payload: BasicInfo;
}

export interface GetAccessListDetailsInfoAction {
  type: ActionTypes.GET_ALL_ACCESS_DETAILS;
  payload: AccessListDetails[];
}

export interface GetBehaviorsListDetailsInfoAction {
  type: ActionTypes.GET_ALL_BEHAVIORS_DETAILS;
  payload: BehaviorItemInterface[];
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

export const FC_GetSystemAccessDetails = (
  callback: (loading: boolean) => void
) => {
  return async (dispatch: Dispatch) => {
    callback(true);
    setAxiosToken();
    try {
      const res = await axios.get<AccessListDetails[]>(`${API_URL}/access`);

      console.log({ access_details: res.data });

      dispatch<GetAccessListDetailsInfoAction>({
        type: ActionTypes.GET_ALL_ACCESS_DETAILS,
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

export const FC_GetSystemBehaviorsListDetails = (
  callback: (loading: boolean) => void
) => {
  return async (dispatch: Dispatch) => {
    callback(true);
    setAxiosToken();
    try {
      const res = await axios.get<BehaviorItemInterface[]>(
        `${API_URL}/behavior`
      );

      console.log({ access_details: res.data });

      dispatch<GetBehaviorsListDetailsInfoAction>({
        type: ActionTypes.GET_ALL_BEHAVIORS_DETAILS,
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
