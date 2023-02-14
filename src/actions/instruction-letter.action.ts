import axios from "axios";
import { Dispatch } from "redux";
import { ActionTypes } from "./types";
import { API_URL } from "../utils/api";
import { setAxiosToken } from "../utils/AxiosToken";
import { UserData_Interface } from "./auth.action";
import { errorToText } from "../utils/functions";
import { SetSystemErrorMessageAction } from "./system.action";

/**
 * * ****************************** INTERFACES *****************************
 */

export enum InstructionLetterStatus {
  PENDING = "PENDING",
  PROGRESS = "PROGRESS",
  VALUATED = "VALUATED",
  DONE = "DONE",
  FAILED = "FAILED",
  CANCELED = "CANCELED",
}

export const InstructionLetterStatusList: {
  key: InstructionLetterStatus;
  value: string;
}[] = [
  {
    key: InstructionLetterStatus.PENDING,
    value: "Pending",
  },
  {
    key: InstructionLetterStatus.PROGRESS,
    value: "Progress",
  },
  {
    key: InstructionLetterStatus.VALUATED,
    value: "Valuated cases",
  },
  {
    key: InstructionLetterStatus.DONE,
    value: "Done/Accomplished",
  },
  {
    key: InstructionLetterStatus.FAILED,
    value: "Failed",
  },
  {
    key: InstructionLetterStatus.CANCELED,
    value: "Canceled",
  },
];

export interface InstructionLetterInterface {
  instruction_letter_id: string;
  fname: string;
  lname: string;
  phone_number: string;
  upi: string;
  bank_id: string;
  bank_name: string;
  bank_branch_id: string;
  branch_name: string;
  district_code: string;
  district_name: string;
  statement: string;
  created_by: string;
  created_at: string;
  status: InstructionLetterStatus;
  assigned_by: string | null;
  assigned_at: string | null;
  valuer_id: string | null;
  valuer_fname: string | null;
  valuer_lname: string | null;
  valuer_phone_number: string | null;
  valuer_nid: string | null;
  valuer_gender: string | null;
  valuer_location: string | null;
  valuer_comment: string | null;
  valuated_at: string | null;
  confirmed_loan_officer: boolean | null;
  confirmed_by: string | null;
  confirmed_date: string | null;
  instruction_letter_code: string;
}

export interface BankSummaryInterface {
  bank_id: string;
  bank_name: string;
  bank_branch_id: string;
  branch_name: string;
  district_code: string;
  district_name: string;
  total_letter: string;
  pending: string;
  progress: string;
  done: string;
  failed: string;
  canceled: string;
}

export interface InstructionLetterStore {
  instruction_letters: InstructionLetterInterface[] | null;
  bank_details: {
    bank_id: string | null;
    bank_summary: BankSummaryInterface[];
  } | null;
}

//* ********************** ACTION TYPE INTERCACES ********************** */
export interface GetInstructionLettersAction {
  type: ActionTypes.GET_INSTRUCTION_LETTERS;
  payload: InstructionLetterInterface[];
}

export interface AssignInstructionLettersAction {
  type: ActionTypes.ASSIGN_INSTRUCTION_LETTER;
  payload: {
    letter_id: string;
    user: UserData_Interface;
  };
}

export interface GetBankSummaryAction {
  type: ActionTypes.GET_BANK_SUMMARY;
  payload: {
    bank_id: string;
    bank_summary: BankSummaryInterface[];
  };
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
export const FC_GetInstructionLetterByBranch = (
  branch_id: string,
  setLoading: (loading: boolean) => void
) => {
  return async (dispatch: Dispatch) => {
    setLoading(true);
    setAxiosToken();
    try {
      const res = await axios.get<InstructionLetterInterface[]>(
        `${API_URL}/instructionletter/branch/${branch_id}`
      );

      console.log({ instruction_letters: res.data });

      dispatch<GetInstructionLettersAction>({
        type: ActionTypes.GET_INSTRUCTION_LETTERS,
        payload: res.data,
      });
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      dispatch<SetSystemErrorMessageAction>({
        type: ActionTypes.SET_SYSTEM_ERROR_MESSAGE,
        payload: errorToText(error),
      });
      console.log("err: ", { ...error });
    }
  };
};

export const FC_AssignInstructionLetter = (
  user: UserData_Interface,
  letter_id: string,
  callBack: (
    loading: boolean,
    res: { type: "error" | "success"; msg: string }
  ) => void
) => {
  return async (dispatch: Dispatch) => {
    callBack(true, { type: "success", msg: "" });
    setAxiosToken();
    try {
      const res = await axios.patch(`${API_URL}/instructionletter/assign`, {
        instruction_letter_id: letter_id,
        valuer_id: user.user_id,
      });
      if (res) {
        dispatch<AssignInstructionLettersAction>({
          type: ActionTypes.ASSIGN_INSTRUCTION_LETTER,
          payload: {
            letter_id: letter_id,
            user: user,
          },
        });
        callBack(false, {
          type: "success",
          msg: "Instruction letter assigned successfully!",
        });
      } else {
        callBack(false, { type: "error", msg: "Error occurred, try again!" });
      }
    } catch (error: any) {
      callBack(false, { type: "error", msg: errorToText(error) });
    }
  };
};

export const FC_ValuerApproveInstructionLetter = (
  user_id: string,
  letter_id: string,
  valuer_comment: string,
  callBack: (
    loading: boolean,
    res: { type: "error" | "success"; msg: string }
  ) => void
) => {
  return async (dispatch: Dispatch) => {
    callBack(true, { type: "success", msg: "" });
    setAxiosToken();
    try {
      const res = await axios.patch(`${API_URL}/instructionletter/valuated`, {
        instruction_letter_id: letter_id,
        valuer_comment: valuer_comment,
      });
      if (res) {
        // dispatch<AssignInstructionLettersAction>({
        //   type: ActionTypes.ASSIGN_INSTRUCTION_LETTER,
        //   payload: {
        //     letter_id: letter_id,
        //     user: user,
        //   },
        // });
        console.log("Res: ", res);
        callBack(false, {
          type: "success",
          msg: "Instruction letter has confirmed successfully!",
        });
      } else {
        callBack(false, { type: "error", msg: "Error occurred, try again!" });
      }
    } catch (error: any) {
      callBack(false, { type: "error", msg: errorToText(error) });
    }
  };
};

export const FC_LoanOfficerApproveInstructionLetter = (
  case_done: boolean,
  letter_id: string,
  callBack: (
    loading: boolean,
    res: { type: "error" | "success"; msg: string }
  ) => void
) => {
  return async (dispatch: Dispatch) => {
    callBack(true, { type: "success", msg: "" });
    setAxiosToken();
    try {
      const res = await axios.patch(`${API_URL}/instructionletter/confirmed`, {
        instruction_letter_id: letter_id,
        confirmed_loan_officer: case_done,
      });
      if (res) {
        // dispatch<AssignInstructionLettersAction>({
        //   type: ActionTypes.ASSIGN_INSTRUCTION_LETTER,
        //   payload: {
        //     letter_id: letter_id,
        //     user: user,
        //   },
        // });
        console.log("Res: ", res);
        callBack(false, {
          type: "success",
          msg: "Instruction letter has confirmed successfully!",
        });
      } else {
        callBack(false, { type: "error", msg: "Error occurred, try again!" });
      }
    } catch (error: any) {
      callBack(false, { type: "error", msg: errorToText(error) });
    }
  };
};

export const FC_LoadBankSummaryDetails = (
  bank_id: string,
  callBack: (loading: boolean) => void
) => {
  return async (dispatch: Dispatch) => {
    callBack(true);
    setAxiosToken();
    try {
      const res = await axios.get<BankSummaryInterface[]>(
        `${API_URL}/instructionletter/bank/status/accuracy/${bank_id}`
      );

      console.log({ SUMMARY_DETAILS: res.data });

      dispatch<GetBankSummaryAction>({
        type: ActionTypes.GET_BANK_SUMMARY,
        payload: {
          bank_id: bank_id,
          bank_summary: res.data,
        },
      });
      callBack(false);
    } catch (error: any) {
      callBack(false);
      dispatch<SetSystemErrorMessageAction>({
        type: ActionTypes.SET_SYSTEM_ERROR_MESSAGE,
        payload: errorToText(error),
      });
      console.log("err: ", { ...error });
    }
  };
};
