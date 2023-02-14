import axios from "axios";
import { Dispatch } from "redux";
import { ActionTypes } from "./types";
import { API_URL } from "../utils/api";
import { setAxiosToken } from "../utils/AxiosToken";
import { Access_Interface, branchInterface } from "./auth.action";
import { IconType } from "react-icons";
import { FaUserCircle } from "react-icons/fa";
import {
  MdCreditScore,
  MdOutlineAdminPanelSettings,
  MdOutlineAssistant,
} from "react-icons/md";
import { AiFillBank, AiOutlinePropertySafety } from "react-icons/ai";
import { BsFileEarmarkCheck } from "react-icons/bs";
import { RiSettings2Line } from "react-icons/ri";
import { IoDocumentTextOutline } from "react-icons/io5";

/**
 * * ****************************** INTERFACES *****************************
 */

export const getRoleIconDescription = (
  role: string
): { description: string; icon: IconType } => {
  let description: string = "Standard user related tasks";
  let icon: IconType = FaUserCircle;
  if (role === "1") {
    //Super Admin
    description = "User who has critical super administrative tasks";
    icon = RiSettings2Line;
  }
  if (role === "2") {
    //National credit manager
    description = "User that manages bank at national level";
    icon = MdCreditScore;
  }
  if (role === "3") {
    //National credit manager assistant
    description =
      "User that manages bank at national level who has view access only";
    icon = MdOutlineAssistant;
  }
  if (role === "4") {
    //Branch manager/admin
    description = "Branch manager of the selected bank";
    icon = AiFillBank;
  }
  if (role === "5") {
    //Loan officer
    description = "Loan officer on the bank branch";
    icon = MdOutlineAdminPanelSettings;
  }
  if (role === "6") {
    //Valuer
    description = "Person who executes an instruction letter";
    icon = AiOutlinePropertySafety;
  }
  if (role === "7") {
    //Recovery manager/admin
    description = "Recovery manager of the selected bank";
    icon = BsFileEarmarkCheck;
  }
  if (role === "8") {
    //Recovery officer
    description = "Recovery officer on the bank branch";
    icon = IoDocumentTextOutline;
  }
  return {
    description: description,
    icon: icon,
  };
};

export interface UserRoleInterface {
  access: Access_Interface[];
  role_id: string;
  role_name: string;
}

export interface BankItem {
  bank_id: string;
  bank_name: string;
  bank_logo: string;
  branches: branchInterface[];
}

export interface BasicInfo {
  roles: UserRoleInterface[];
  banks: BankItem[];
}

interface BasicInfoGetStrings {
  roles: {
    access: string;
    role_id: string;
    role_name: string;
  }[];
  banks: BankItem[];
}

export interface System {
  side_nav: boolean;
  basic_info: BasicInfo | null;
  error: string;
  success: string;
}

//* ********************** ACTION TYPE INTERCACES ********************** */
export interface GetSystemInfoAction {
  type: ActionTypes.GET_SYSTEM_INFO;
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
      const res = await axios.get<BasicInfoGetStrings>(
        `${API_URL}/register/basicinfo`
      );

      console.log({ system_basic_info: res.data });

      dispatch<GetSystemInfoAction>({
        type: ActionTypes.GET_SYSTEM_INFO,
        payload: {
          roles: res.data.roles.map((role) => ({
            role_id: role.role_id,
            role_name: role.role_name,
            access: (JSON.parse(role.access) as Access_Interface[])?.map(
              (item) => ({
                access_name: item.access_name,
                key: item.key,
                permission: item.permission,
              })
            ),
          })),
          banks: res.data.banks,
        },
      });
      callback(false);
    } catch (error: any) {
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
