import axios from "axios";
import { Dispatch } from "redux";
import { UserAccessInterface, UserAccessList } from "../config/userAccess";
import { API_URL } from "../utils/api";
import { setAxiosToken } from "../utils/AxiosToken";
import { errorToText } from "../utils/functions";
import {
  BooleanEnum,
  PermissionInterface,
  UserActiveStatus,
} from "./auth.action";
import { PositionDetailsInterface } from "./position.action";
import {
  SetSystemErrorMessageAction,
  SetSystemSuccessMessageAction,
} from "./system.action";
import { ActionTypes } from "./types";

export interface EmployeePositionItem {
  employment_id: string;
  end_date: string | null;
  is_acting: BooleanEnum;
  is_active: BooleanEnum;
  is_line_manager: BooleanEnum;
  position_id: string;
  position_name: string;
  start_date: string;
  unit_id: string;
  unit_name: string;
  user_id: string;
}

export interface EmployeeListInterface {
  user_id: string;
  first_name: string;
  middle_name: string;
  nid_number: string | null;
  last_name: string;
  phone_number: string;
  email: string;
  residence: string | null;
  passport_number: string | null;
  gender: string | null;
  nationality: string | null;
  education_field_id: string | null;
  education_level_id: string | null;
  dob: string | null;
  martial_status: string | null;
  status: UserActiveStatus;
  positions: EmployeePositionItem[];
}

export interface EmployeeCustomAccess {
  custom_access_id: string;
  user_id: string;
  access: UserAccessInterface[];
  start_date: string;
  end_date: string;
  reason: string;
}

export interface EmployeeBehavior {
  user_behavior_id: string;
  user_id: string;
  behavior_id: string;
  behavior_name: string;
  proficiency_level_id: string;
  proficiency_level: string;
  assignment_comment: string;
}

export interface AddEmployeeBehaviorDataInterface {
  user_id: string;
  behavior_id: string;
  proficiency_level_id: string;
  assignment_comment: string;
}

export interface EmployeeDetailsInterface {
  positions: PositionDetailsInterface[];
  employee_custom_access: EmployeeCustomAccess[];
  employee_behavior: EmployeeBehavior[];
}

export interface EmployeeCustomAccessDataInterface {
  user_id: string;
  access: {
    key: UserAccessList;
    permission: PermissionInterface;
  }[];
  start_date: string;
  end_date: string;
  reason: string;
}

export interface EmployeeStore {
  employees: EmployeeListInterface[] | null;
}

//* ********************** ACTION TYPE INTERFACES ********************** */

export interface GetAllEmployeesInfoAction {
  type: ActionTypes.GET_ALL_EMPLOYEES;
  payload: EmployeeListInterface[];
}

export interface RemoveEmployeeBehaviorInfoAction {
  type: ActionTypes.REMOVE_EMPLOYEE_BEHAVIOR;
  payload: {
    behavior_id: string;
  };
}

export interface AddEmployeeBehaviorInfoAction {
  type: ActionTypes.ADD_EMPLOYEE_BEHAVIOR;
  payload: AddEmployeeBehaviorDataInterface;
}

export interface AddEmployeeCustomAccessInfoAction {
  type: ActionTypes.ADD_EMPLOYEE_CUSTOM_ACCESS;
  payload: EmployeeCustomAccessDataInterface;
}

export interface GetEmployeeDetailsInfoAction {
  type: ActionTypes.GET_EMPLOYEE_DETAILS;
  payload: EmployeeDetailsInterface;
}

export const FC_GetAllEmployees = (
  callback: (loading: boolean, error: string) => void
) => {
  return async (dispatch: Dispatch) => {
    callback(true, "");
    setAxiosToken();
    try {
      const res = await axios.get<EmployeeListInterface[]>(`${API_URL}/users`);
      console.log({ AllEmployees: res.data });
      dispatch<GetAllEmployeesInfoAction>({
        type: ActionTypes.GET_ALL_EMPLOYEES,
        payload: res.data,
      });
      callback(false, "");
    } catch (error: any) {
      dispatch<SetSystemErrorMessageAction>({
        type: ActionTypes.SET_SYSTEM_ERROR_MESSAGE,
        payload: errorToText(error),
      });
      callback(false, errorToText(error));
      console.log("err: ", { ...error });
    }
  };
};

export const FC_GetEmployeeDetails = (
  user_id: string,
  callback: (
    loading: boolean,
    res: {
      res: EmployeeDetailsInterface | null;
      type: "success" | "error";
      msg: string;
    } | null
  ) => void
) => {
  return async (dispatch: Dispatch) => {
    callback(true, null);
    setAxiosToken();
    try {
      const res = await axios.get<EmployeeDetailsInterface>(
        `${API_URL}/users/detail/${user_id}`
      );
      console.log({ EmployeePositionDetails: res.data });
      const ResponseFormatted = {
        employee_behavior: res.data.employee_behavior,
        employee_custom_access:
          res.data.employee_custom_access.length === 0
            ? []
            : res.data.employee_custom_access.map((item) => ({
                ...item,
                access: JSON.parse(item.access as unknown as string),
              })),
        positions:
          res.data.positions.length === 0
            ? []
            : res.data.positions.map((item) => ({
                ...item,
                access: JSON.parse(item.access as unknown as string),
              })),
      };
      dispatch<GetEmployeeDetailsInfoAction>({
        type: ActionTypes.GET_EMPLOYEE_DETAILS,
        payload: ResponseFormatted,
      });
      callback(false, {
        msg: "",
        res: ResponseFormatted,
        type: "success",
      });
    } catch (error: any) {
      dispatch<SetSystemErrorMessageAction>({
        type: ActionTypes.SET_SYSTEM_ERROR_MESSAGE,
        payload: errorToText(error),
      });
      callback(false, {
        msg: errorToText(error),
        res: null,
        type: "error",
      });
      console.log("err: ", { ...error });
    }
  };
};

export const FC_RemoveEmployeeBehavior = (
  user_competency_id: string,
  callback: (loading: boolean, error: string) => void
) => {
  return async (dispatch: Dispatch) => {
    callback(true, "");
    setAxiosToken();
    try {
      const res = await axios.patch(`${API_URL}/user/behavior`, {
        user_competency_id: user_competency_id,
      });
      console.log({ removeEmployeeBehavior: res.data });
      dispatch<RemoveEmployeeBehaviorInfoAction>({
        type: ActionTypes.REMOVE_EMPLOYEE_BEHAVIOR,
        payload: {
          behavior_id: user_competency_id,
        },
      });
      dispatch<SetSystemSuccessMessageAction>({
        type: ActionTypes.SET_SYSTEM_SUCCESS_MESSAGE,
        payload: "Employee behavior has removed successfully!",
      });
      callback(false, "");
    } catch (error: any) {
      dispatch<SetSystemErrorMessageAction>({
        type: ActionTypes.SET_SYSTEM_ERROR_MESSAGE,
        payload: errorToText(error),
      });
      callback(false, errorToText(error));
      console.log("err: ", { ...error });
    }
  };
};

export const FC_AddEmployeeBehavior = (
  data: AddEmployeeBehaviorDataInterface,
  callback: (loading: boolean, error: string) => void
) => {
  return async (dispatch: Dispatch) => {
    callback(true, "");
    setAxiosToken();
    try {
      const res = await axios.post(`${API_URL}/user/behavior`, data);
      console.log({ removeEmployeeBehavior: res.data });
      dispatch<AddEmployeeBehaviorInfoAction>({
        type: ActionTypes.ADD_EMPLOYEE_BEHAVIOR,
        payload: data,
      });
      dispatch<SetSystemSuccessMessageAction>({
        type: ActionTypes.SET_SYSTEM_SUCCESS_MESSAGE,
        payload: "Employee behavior has added successfully!",
      });
      callback(false, "");
    } catch (error: any) {
      dispatch<SetSystemErrorMessageAction>({
        type: ActionTypes.SET_SYSTEM_ERROR_MESSAGE,
        payload: errorToText(error),
      });
      callback(false, errorToText(error));
      console.log("err: ", { ...error });
    }
  };
};

export const FC_AddEmployeeCustomAccess = (
  data: EmployeeCustomAccessDataInterface,
  callback: (loading: boolean, error: string) => void
) => {
  return async (dispatch: Dispatch) => {
    callback(true, "");
    setAxiosToken();
    try {
      const res = await axios.post(`${API_URL}/custom/access`, data);
      console.log({ removeEmployeeBehavior: res.data });
      dispatch<AddEmployeeCustomAccessInfoAction>({
        type: ActionTypes.ADD_EMPLOYEE_CUSTOM_ACCESS,
        payload: data,
      });
      dispatch<SetSystemSuccessMessageAction>({
        type: ActionTypes.SET_SYSTEM_SUCCESS_MESSAGE,
        payload: "Employee custom access has added successfully!",
      });
      callback(false, "");
    } catch (error: any) {
      dispatch<SetSystemErrorMessageAction>({
        type: ActionTypes.SET_SYSTEM_ERROR_MESSAGE,
        payload: errorToText(error),
      });
      callback(false, errorToText(error));
      console.log("err: ", { ...error });
    }
  };
};
