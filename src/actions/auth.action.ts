import axios from "axios";
import { Dispatch } from "redux";
import { ActionTypes } from "./types";
import { API_URL, DISTRICTS_LOCATION } from "../utils/api";
import { APP_TOKEN_NAME, setAxiosToken } from "../utils/AxiosToken";
import { errorToText } from "../utils/functions";
import { UserAccessInterface } from "../config/userAccess";

/**
 * * ****************************** INTERFACES *****************************
 */

export enum BooleanEnum {
  TRUE = "TRUE",
  FALSE = "FALSE",
}

export enum UserActiveStatus {
  ACTIVE = "ACTIVE",
  DISABLED = "DISABLED",
}

export interface PermissionInterface {
  view: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
  export: boolean;
}

export interface DistrictLocationItem {
  district_code: string;
  district_name: string;
  province_id: string;
  province_code: string;
  _id: string;
}
export interface ProvinceLocationItem {
  province_code: string;
  province_name: string;
  _id: string;
}
export interface SectorLocationItem {
  district_id: string;
  sector_code: string;
  sector_name: string;
  district_code: string;
  _id: string;
}
export interface LocationAPI {
  districts: DistrictLocationItem[];
  provinces: ProvinceLocationItem[];
  sectors: SectorLocationItem[];
}

const token = localStorage.getItem(APP_TOKEN_NAME);

export interface EmploymentItem {
  employment_id: string;
  user_id: string;
  position_id: string;
  start_date: string;
  is_acting: BooleanEnum;
  end_date: string | null;
  is_active: BooleanEnum;
  position_name: string;
  access: UserAccessInterface[];
}

export interface UserInterface {
  user_id: string;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  phone_number: string;
  email: string;
  location_address: string;
  status: UserActiveStatus;
  jwt: string;
  employment: EmploymentItem[];
  nid_number: string | null;
  residence: string | null;
  passport_number: string | null;
  gender: string | null;
  nationality: string | null;
  education_field_id: string | null;
  education_level_id: string | null;
  dob: string | null;
  martial_status: string | null;
}

export interface Auth {
  loading: boolean;
  isAuthenticated: boolean;
  token: string;
  user: UserInterface | null;
  selectedEmployment: EmploymentItem | null;
}

//* ********************** ACTION TYPE INTERCACES ********************** */
export interface FetchLoginDetails {
  type: ActionTypes.LOGIN_DETAILS;
  payload: Auth;
}

export interface LoginSuccessDetails {
  type: ActionTypes.USER_LOGIN_SUCCESS_DATA;
  payload: {
    data: UserInterface;
    token: string;
  };
}

export interface CleanUserDetails {
  type: ActionTypes.CLEAN_USER_DETAILS;
}

export interface LogoutUser {
  type: ActionTypes.LOGOUT;
}

export interface FetchLoginDetails {
  type: ActionTypes.LOGIN_DETAILS;
  payload: Auth;
}

export interface SwitchEmploymentAction {
  type: ActionTypes.SWITCH_EMPLOYMENT;
  payload: EmploymentItem | null;
}

/**
 * * ****************************** ACTIONS *****************************
 */

export const FC_CleanUserDetails = () => {
  return (dispatch: Dispatch) => {
    dispatch<CleanUserDetails>({
      type: ActionTypes.CLEAN_USER_DETAILS,
    });
  };
};

/**
 * @description Register the account to the api
 * @param account
 * @param MsgHandler return the error from the API
 * @returns
 */
export const FC_Login = (
  data: {
    username: string;
    password: string;
  },
  CallbackFunc: Function
) => {
  return async (dispatch: Dispatch) => {
    try {
      const res = await axios.post<UserInterface>(
        `${API_URL}/user/login`,
        data
      );

      console.log({ data_after_login: res.data });
      console.log("Parsed: ", {
        data: {
          ...res.data,
          employment:
            res.data.employment.length === 0
              ? []
              : res.data.employment.map((item) => ({
                  ...item,
                  access: JSON.parse(item.access as unknown as string),
                })),
        },
      });

      localStorage.setItem(APP_TOKEN_NAME, res.data.jwt);
      dispatch<LoginSuccessDetails>({
        type: ActionTypes.USER_LOGIN_SUCCESS_DATA,
        payload: {
          data: {
            ...res.data,
            employment:
              res.data.employment.length === 0
                ? []
                : res.data.employment.map((item) => ({
                    ...item,
                    access: JSON.parse(item.access as unknown as string),
                  })),
          },
          token: res.data.jwt,
        },
      });
      CallbackFunc(true, "");
    } catch (error: any) {
      console.log("Login err: ", { ...error });
      console.log("Login err: ", error);
      // CallbackFunc(false, errorToText(error));
      CallbackFunc(false, errorToText(error));
    }
  };
};

/**
 * @description Check if the user is logged in based on the logged in account
 * @param account
 * @param MsgHandler return the error from the API
 * @returns
 */

export const FC_CheckLoggedIn = (callBack: (status: boolean) => void) => {
  callBack(false);
  return async (dispatch: Dispatch) => {
    if (token === null) {
      dispatch<LogoutUser>({
        type: ActionTypes.LOGOUT,
      });
      callBack(true);
      return false;
    }
    try {
      setAxiosToken();
      const res = await axios.get<UserInterface>(`${API_URL}/user/logged`);
      console.log({ logged_user_details: res.data });
      dispatch<LoginSuccessDetails>({
        type: ActionTypes.USER_LOGIN_SUCCESS_DATA,
        payload: {
          data: {
            ...res.data,
            employment:
              res.data.employment.length === 0
                ? []
                : res.data.employment.map((item) => ({
                    ...item,
                    access: JSON.parse(item.access as unknown as string),
                  })),
          },
          token: token!,
        },
      });
      callBack(true);
    } catch (error: any) {
      callBack(true);
      console.log("User not: ", { ...error });
      dispatch<LogoutUser>({
        type: ActionTypes.LOGOUT,
      });
    }
  };
};

/**
 * @description Logout the user into the system
 * @returns null
 */
export const FC_Logout = () => {
  return (dispatch: Dispatch) => {
    dispatch<LogoutUser>({
      type: ActionTypes.LOGOUT,
    });
  };
};

/**
 * @description Register the account to the api
 * @param account
 * @param MsgHandler return the error from the API
 * @returns
 */

export interface FC_ChangePassword_Interface {
  user_id: string;
  old_password: string;
  new_password: string;
}

export const FC_ChangePassword = (
  data: FC_ChangePassword_Interface,
  callback: Function
) => {
  return async (dispatch: Dispatch) => {
    try {
      setAxiosToken();

      await axios.patch(`${API_URL}/users/changepassword`, {
        user_id: data.user_id,
        old_password: data.old_password,
        new_password: data.new_password,
      });

      callback(true, "");
    } catch (error) {
      callback(false, "errorToText(error)");
    }
  };
};

/**
 * Edit users documents
 * @param data
 * @param user_id
 * @param callback
 * @returns
 */

export interface FC_ForgetPassword_Interface {
  address: string;
  verify_type: string;
}
/**
 * Send the reset password
 * @param data
 * @param callback
 * @returns
 */
export const FC_ForgetPassword = (
  data: FC_ForgetPassword_Interface,
  callback: Function
) => {
  return async (dispatch: Dispatch) => {
    try {
      setAxiosToken();

      const res = await axios.post<{
        message: string;
        code?: string;
      }>(`${API_URL}/users/password/address`, {
        address: data.address,
        verify_type: data.verify_type,
      });

      console.log({ CODE: res.data.code });

      callback(true, res.data.message);
    } catch (error) {
      callback(false, "errorToText(error)");
    }
  };
};

export interface FC_ForgetPassword_Check_Interface {
  address: string;
  verification_code: string;
  new_password: string;
}
/**
 * Send the new password and update that
 * @param data
 * @param callback
 * @returns
 */
export const FC_ForgetPassword_Check = (
  data: FC_ForgetPassword_Check_Interface,
  callback: Function
) => {
  return async (dispatch: Dispatch) => {
    try {
      setAxiosToken();

      const res = await axios.post<{
        message: string;
      }>(`${API_URL}/users/password/reset`, {
        address: data.address,
        verification_code: data.verification_code,
        new_password: data.new_password,
      });

      callback(true, res.data.message);
    } catch (error) {
      callback(false, "errorToText(error)");
    }
  };
};

export const FC_GetDistricts = async (
  callBack: (status: boolean, res: LocationAPI | null, msg: string) => void
) => {
  callBack(false, null, "");
  try {
    const res = await axios.get<LocationAPI>(`${DISTRICTS_LOCATION}`);
    callBack(true, res.data, "");
  } catch (error: any) {
    callBack(false, null, "Try again!");
  }
};

export const FC_SwitchSelectedEmployment = (
  employment: EmploymentItem | null
) => {
  return async (dispatch: Dispatch) => {
    dispatch<SwitchEmploymentAction>({
      type: ActionTypes.SWITCH_EMPLOYMENT,
      payload: employment,
    });
  };
};
