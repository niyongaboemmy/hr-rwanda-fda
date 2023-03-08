import axios from "axios";
import { Dispatch } from "redux";
import { API_URL } from "../utils/api";
import { setAxiosToken } from "../utils/AxiosToken";
import { errorToText } from "../utils/functions";
import {
  SetSystemErrorMessageAction,
  SetSystemSuccessMessageAction,
} from "./system.action";
import { ActionTypes } from "./types";

export interface LeaveCategoryInterface {
  leave_id: string;
  leave_type: "INCIDENTAL" | "LEAVE";
  leave_name: string;
}

export interface EmployeeLeaveInterface {
  employee_leave_id: string;
  user_id: string;
  leave_id: string;
  leave_type: "INCIDENTAL" | "LEAVE";
  leave_name: string;
  unit_id: string;
  unit_name: string;
  position_id: string;
  position_name: string;
  start_date: string;
  leave_duration: number;
  leave_reason: string;
  leave_status: "PENDING" | "APPROVED" | "REJECTED";
  leave_status_change_comment: string | null;
  leave_status_changed_at: string | null;
  reporting_date: string | null;
  reporting_by: string | null;
}

export interface CreateLeaveData {
  leave_id: string;
  user_id: string;
  unit_id: string;
  position_id: string;
  start_date: string;
  leave_duration: string;
  leave_reason: string;
}

export interface LeaveStore {
  employee_leaves: EmployeeLeaveInterface[] | null;
  leave_categories: LeaveCategoryInterface[] | null;
}

//* ********************** ACTION TYPE INTERFACES ********************** */
export interface GetLeaveCategoriesInfoAction {
  type: ActionTypes.GET_LEAVE_CATEGORIES;
  payload: LeaveCategoryInterface[];
}

export interface GetEmployeeLeavesInfoAction {
  type: ActionTypes.GET_EMPLOYEE_LEAVES;
  payload: EmployeeLeaveInterface[];
}
export interface RemoveEmployeeLeaveInfoAction {
  type: ActionTypes.REMOVE_EMPLOYEE_LEAVE;
  payload: {
    employee_leave_id: string;
  };
}
export const FC_GetLeaveCategories = (
  callback: (loading: boolean, error: string) => void
) => {
  return async (dispatch: Dispatch) => {
    callback(true, "");
    setAxiosToken();
    try {
      const res = await axios.get<LeaveCategoryInterface[]>(`${API_URL}/leave`);
      console.log({ LeaveCategories: res.data });
      dispatch<GetLeaveCategoriesInfoAction>({
        type: ActionTypes.GET_LEAVE_CATEGORIES,
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

export const FC_GetEmployeeLeaves = (
  user_id: string,
  callback: (loading: boolean, error: string) => void
) => {
  return async (dispatch: Dispatch) => {
    callback(true, "");
    setAxiosToken();
    try {
      const res = await axios.get<EmployeeLeaveInterface[]>(
        `${API_URL}/leave/employee/${user_id}`
      );
      console.log({ EmployeeLeaves: res.data });
      dispatch<GetEmployeeLeavesInfoAction>({
        type: ActionTypes.GET_EMPLOYEE_LEAVES,
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

export const FC_GetCustomEmployeeLeaves = (
  user_id: string,
  callback: (
    loading: boolean,
    res: {
      type: "success" | "error";
      msg: string;
      data: EmployeeLeaveInterface[];
    } | null
  ) => void
) => {
  return async (dispatch: Dispatch) => {
    callback(true, null);
    setAxiosToken();
    try {
      const res = await axios.get<EmployeeLeaveInterface[]>(
        `${API_URL}/leave/employee/${user_id}`
      );
      console.log({ EmployeeLeaves: res.data });
      callback(false, {
        type: "success",
        msg: "",
        data: res.data,
      });
    } catch (error: any) {
      dispatch<SetSystemErrorMessageAction>({
        type: ActionTypes.SET_SYSTEM_ERROR_MESSAGE,
        payload: errorToText(error),
      });
      callback(false, {
        type: "error",
        msg: errorToText(error),
        data: [],
      });
      console.log("err: ", { ...error });
    }
  };
};

export const FC_CreateLeave = (
  data: CreateLeaveData,
  callback: (
    loading: boolean,
    res: { type: "success" | "error"; msg: string } | null
  ) => void
) => {
  return async (dispatch: Dispatch) => {
    callback(true, null);
    setAxiosToken();
    try {
      const res = await axios.post<EmployeeLeaveInterface[]>(
        `${API_URL}/leave/employee`,
        data
      );
      console.log({ CreateLeave: res.data });
      callback(false, {
        type: "success",
        msg: "Request sent successfully",
      });
      dispatch<SetSystemSuccessMessageAction>({
        type: ActionTypes.SET_SYSTEM_SUCCESS_MESSAGE,
        payload: "Request sent successfully",
      });
    } catch (error: any) {
      dispatch<SetSystemErrorMessageAction>({
        type: ActionTypes.SET_SYSTEM_ERROR_MESSAGE,
        payload: errorToText(error),
      });
      callback(false, { type: "error", msg: errorToText(error) });
      console.log("err: ", { ...error });
    }
  };
};

export const FC_RemoveEmployeeLeave = (
  employee_leave_id: string,
  callback: (
    loading: boolean,
    res: { type: "success" | "error"; msg: string } | null
  ) => void
) => {
  return async (dispatch: Dispatch) => {
    callback(true, null);
    setAxiosToken();
    try {
      const res = await axios.delete(
        `${API_URL}/leave/employee/${employee_leave_id}`
      );
      console.log({ RemoveLeave: res.data });
      callback(false, {
        type: "success",
        msg: "Leave removed successfully",
      });
      dispatch<RemoveEmployeeLeaveInfoAction>({
        type: ActionTypes.REMOVE_EMPLOYEE_LEAVE,
        payload: {
          employee_leave_id: employee_leave_id,
        },
      });
      dispatch<SetSystemSuccessMessageAction>({
        type: ActionTypes.SET_SYSTEM_SUCCESS_MESSAGE,
        payload: "Leave removed successfully",
      });
    } catch (error: any) {
      dispatch<SetSystemErrorMessageAction>({
        type: ActionTypes.SET_SYSTEM_ERROR_MESSAGE,
        payload: errorToText(error),
      });
      callback(false, { type: "error", msg: errorToText(error) });
      console.log("err: ", { ...error });
    }
  };
};

export const FC_ChangeEmployeeLeaveStatus = (
  employee_leave_id: string,
  leave_status: "APPROVED" | "REJECTED",
  leave_status_change_comment: string,
  callback: (
    loading: boolean,
    res: { type: "success" | "error"; msg: string } | null
  ) => void
) => {
  return async (dispatch: Dispatch) => {
    callback(true, null);
    setAxiosToken();
    try {
      const res = await axios.patch(`${API_URL}/leave/employee/change/status`, {
        leave_status: leave_status,
        leave_status_change_comment: leave_status_change_comment,
        employee_leave_id: employee_leave_id,
      });
      console.log({ UpdateLeaveStatus: res.data });
      callback(false, {
        type: "success",
        msg: "Status updated successfully!",
      });
      dispatch<SetSystemSuccessMessageAction>({
        type: ActionTypes.SET_SYSTEM_SUCCESS_MESSAGE,
        payload: "Status updated successfully!",
      });
    } catch (error: any) {
      dispatch<SetSystemErrorMessageAction>({
        type: ActionTypes.SET_SYSTEM_ERROR_MESSAGE,
        payload: errorToText(error),
      });
      callback(false, { type: "error", msg: errorToText(error) });
      console.log("err: ", { ...error });
    }
  };
};
