import axios from "axios";
import { Dispatch } from "redux";
import { API_URL } from "../utils/api";
import { setAxiosToken } from "../utils/AxiosToken";
import { errorToText } from "../utils/functions";
import { BooleanEnum } from "./auth.action";
import {
  SetSystemErrorMessageAction,
  SetSystemSuccessMessageAction,
} from "./system.action";
import { ActionTypes } from "./types";

export interface TrainingPlanListInterface {
  title: string;
  training_plan_id: string;
  division_id: string;
  division_name: string;
  training_offer_mode_id: string;
  allocated_budget: number;
  used_budget: number;
  budget_source: string;
  year: number;
}

export interface CreateTrainingPlanData {
  title: string;
  division_id: string;
  training_offer_mode_id: string;
  allocated_budget: number;
  budget_source: string;
  year: number;
}

export interface UpdateTrainingPlanData {
  training_plan_id: string;
  title: string;
  division_id: string;
  training_offer_mode_id: string;
  allocated_budget: number;
  budget_source: string;
  year: number;
}

export interface TrainingPlanParticipantData {
  training_plan_id: string;
  user_id: string;
  unit_id: string;
  position_id: string;
  location: string;
  provider_id: string;
}

export interface TrainingPlanParticipantInterface {
  training_participate_id: string;
  user_id: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  residence: string | null;
  status: "ACTIVE" | "INACTIVE";
  training_plan_id: string;
  location: string;
  has_attended: string | null;
  participant_report: string | null;
  supporting_doc: string | null;
  reporting_date: string | null;
  is_approved: string | null;
  approved_by: string | null;
  approval_date: string | null;
  division_id: string;
  training_offer_mode_id: string;
  allocated_budget: number;
  used_budget: number;
  budget_source: string;
  year: number;
  provider_id: string;
  provider_name: string;
}

export interface TrainingProviderInterface {
  provider_id: string;
  provider_name: string;
  phone_number: string;
  email: string;
  location: string;
}

export interface TrainingPlansByParticipant {
  training_participate_id: string;
  training_plan_id: string;
  user_id: string;
  title: string;
  division_name: string;
  is_approved: string | null;
  approved_by: string | null;
  approval_date: string | null;
  is_removed: BooleanEnum;
  division_id: string;
  training_offer_mode_id: string;
  allocated_budget: number;
  used_budget: number;
  budget_source: string;
  year: number;
}

export interface TrainingAttendedInterface {
  training_id: string;
  training_plan_id: string;
  user_id: string;
  title: string;
  provider_id: string;
  location: string;
  start_date: string;
  end_date: string;
  participant_report: string;
  supporting_doc: string;
  created_at: string;
  created_by: string;
  updated_at: string | null;
  updated_by: string | null;
}

export interface TrainingAttendanceData {
  training_plan_id: string;
  user_id: string;
  title: string;
  provider_id: string;
  location: string;
  start_date: string;
  end_date: string;
  participant_report: string;
  supporting_doc: File;
}

export interface TrainingStore {
  training_plans: TrainingPlanListInterface[] | null;
  training_providers: TrainingProviderInterface[] | null;
  employee_trainings: TrainingPlansByParticipant[] | null;
}

//* ********************** ACTION TYPE INTERFACES ********************** */

export interface GetTrainingPlansByYearInfoAction {
  type: ActionTypes.GET_TRAINING_PLANS_BY_YEAR;
  payload: {
    data: TrainingPlanListInterface[];
    year: number;
  };
}

export interface CreateTrainingPlanInfoAction {
  type: ActionTypes.CREATE_TRAINING_PLAN;
  payload: {
    data: CreateTrainingPlanData;
    training_plan_id: string;
  };
}

export interface UpdateTrainingPlanInfoAction {
  type: ActionTypes.UPDATE_TRAINING_PLAN;
  payload: {
    data: UpdateTrainingPlanData;
    training_plan_id: string;
  };
}

export interface AddTrainingPlanParticipantInfoAction {
  type: ActionTypes.ADD_TRAINING_PLAN_PARTICIPANT;
  payload: TrainingPlanParticipantData;
}

export interface AddTrainingAttendedReportInfoAction {
  type: ActionTypes.ADD_TRAINING_ATTENDED_REPORT;
  payload: TrainingAttendanceData;
}

export interface RemoveTrainingAttendedReportInfoAction {
  type: ActionTypes.REMOVE_TRAINING_ATTENDED_REPORT;
  payload: {
    training_id: string;
  };
}

export interface GetTrainingProvidersInfoAction {
  type: ActionTypes.GET_TRAINING_PROVIDERS;
  payload: TrainingProviderInterface[];
}

export interface GetTrainingPlansByParticipantInfoAction {
  type: ActionTypes.GET_TRAINING_PLANS_PARTICIPANT;
  payload: TrainingPlansByParticipant[];
}

export interface GetTrainingAttendedInfoAction {
  type: ActionTypes.GET_TRAINING_ATTENDANCE;
  payload: TrainingAttendedInterface[];
}

export const FC_GetTrainingPlansByYear = (
  year: number = new Date().getFullYear(),
  callback: (loading: boolean, error: string) => void
) => {
  return async (dispatch: Dispatch) => {
    callback(true, "");
    setAxiosToken();
    try {
      const res = await axios.get<TrainingPlanListInterface[]>(
        `${API_URL}/training/plan/year/${year}`
      );
      console.log({ TrainingPlans: res.data });
      dispatch<GetTrainingPlansByYearInfoAction>({
        type: ActionTypes.GET_TRAINING_PLANS_BY_YEAR,
        payload: {
          data: res.data,
          year: year,
        },
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

export const FC_CreateTrainingPlan = (
  data: CreateTrainingPlanData,
  callback: (
    loading: boolean,
    res: {
      type: "success" | "error";
      msg: string;
      training_plan_id: string;
    } | null
  ) => void
) => {
  return async (dispatch: Dispatch) => {
    callback(true, null);
    setAxiosToken();
    try {
      const res = await axios.post<{
        training_plan_id: string;
      }>(`${API_URL}/training/plan`, data);
      console.log({ TrainingPlans: res.data });
      dispatch<CreateTrainingPlanInfoAction>({
        type: ActionTypes.CREATE_TRAINING_PLAN,
        payload: {
          data: data,
          training_plan_id: res.data.training_plan_id,
        },
      });
      callback(false, {
        msg: "",
        training_plan_id: res.data.training_plan_id,
        type: "success",
      });
      dispatch<SetSystemSuccessMessageAction>({
        type: ActionTypes.SET_SYSTEM_SUCCESS_MESSAGE,
        payload: "Created training plan successfully!",
      });
    } catch (error: any) {
      dispatch<SetSystemErrorMessageAction>({
        type: ActionTypes.SET_SYSTEM_ERROR_MESSAGE,
        payload: errorToText(error),
      });
      callback(false, {
        msg: errorToText(error),
        training_plan_id: "",
        type: "error",
      });
      console.log("err: ", { ...error });
    }
  };
};

export const FC_UpdateTrainingPlan = (
  data: UpdateTrainingPlanData,
  callback: (
    loading: boolean,
    res: {
      type: "success" | "error";
      msg: string;
      training_plan_id: string;
    } | null
  ) => void
) => {
  return async (dispatch: Dispatch) => {
    callback(true, null);
    setAxiosToken();
    try {
      const res = await axios.patch<{
        training_plan_id: string;
      }>(`${API_URL}/training/plan`, data);
      console.log({ TrainingPlans: res.data });
      dispatch<UpdateTrainingPlanInfoAction>({
        type: ActionTypes.UPDATE_TRAINING_PLAN,
        payload: {
          data: data,
          training_plan_id: res.data.training_plan_id,
        },
      });
      callback(false, {
        msg: "",
        training_plan_id: res.data.training_plan_id,
        type: "success",
      });
      dispatch<SetSystemSuccessMessageAction>({
        type: ActionTypes.SET_SYSTEM_SUCCESS_MESSAGE,
        payload: "Training plan has updated successfully!",
      });
    } catch (error: any) {
      dispatch<SetSystemErrorMessageAction>({
        type: ActionTypes.SET_SYSTEM_ERROR_MESSAGE,
        payload: errorToText(error),
      });
      callback(false, {
        msg: errorToText(error),
        training_plan_id: "",
        type: "error",
      });
      console.log("err: ", { ...error });
    }
  };
};

export const FC_AddTrainingPlanParticipant = (
  data: TrainingPlanParticipantData,
  callback: (
    loading: boolean,
    res: {
      type: "success" | "error";
      msg: string;
    } | null
  ) => void
) => {
  return async (dispatch: Dispatch) => {
    callback(true, null);
    setAxiosToken();
    try {
      const res = await axios.post<{
        training_plan_id: string;
      }>(`${API_URL}/training/participate`, data);
      console.log({ TrainingPlans: res.data });
      dispatch<AddTrainingPlanParticipantInfoAction>({
        type: ActionTypes.ADD_TRAINING_PLAN_PARTICIPANT,
        payload: data,
      });
      callback(false, {
        msg: "",
        type: "success",
      });
      dispatch<SetSystemSuccessMessageAction>({
        type: ActionTypes.SET_SYSTEM_SUCCESS_MESSAGE,
        payload: "Created participant added successfully!",
      });
    } catch (error: any) {
      dispatch<SetSystemErrorMessageAction>({
        type: ActionTypes.SET_SYSTEM_ERROR_MESSAGE,
        payload: errorToText(error),
      });
      callback(false, {
        msg: errorToText(error),
        type: "error",
      });
      console.log("err: ", { ...error });
    }
  };
};

export const FC_GetTrainingPlanParticipants = (
  training_plan_id: string,
  callback: (
    loading: boolean,
    res: {
      type: "success" | "error";
      msg: string;
      data: TrainingPlanParticipantInterface[];
    } | null
  ) => void
) => {
  return async (dispatch: Dispatch) => {
    callback(true, null);
    setAxiosToken();
    try {
      const res = await axios.get<TrainingPlanParticipantInterface[]>(
        `${API_URL}/training/participate/plan/${training_plan_id}`
      );
      console.log({ Participants: res.data });
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

export const FC_RemoveTrainingPlanParticipant = (
  training_participate_id: string,
  callback: (loading: boolean, error: string) => void
) => {
  return async (dispatch: Dispatch) => {
    callback(true, "");
    setAxiosToken();
    try {
      const res = await axios.delete<TrainingPlanListInterface[]>(
        `${API_URL}/training/participate/${training_participate_id}`
      );
      console.log({ RemoveParticipant: res.data });
      callback(false, "");
      dispatch<SetSystemSuccessMessageAction>({
        type: ActionTypes.SET_SYSTEM_SUCCESS_MESSAGE,
        payload: "Removed participant successfully",
      });
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

export const FC_GetTrainingProviders = (
  callback: (loading: boolean, error: string) => void
) => {
  return async (dispatch: Dispatch) => {
    callback(true, "");
    setAxiosToken();
    try {
      const res = await axios.get<TrainingProviderInterface[]>(
        `${API_URL}/providers`
      );
      console.log({ TrainingProviders: res.data });
      dispatch<GetTrainingProvidersInfoAction>({
        type: ActionTypes.GET_TRAINING_PROVIDERS,
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

export const FC_GetTrainingPlansByParticipant = (
  user_id: string,
  callback: (loading: boolean, error: string) => void
) => {
  return async (dispatch: Dispatch) => {
    callback(true, "");
    setAxiosToken();
    try {
      const res = await axios.get<TrainingPlansByParticipant[]>(
        `${API_URL}/training/participate/${user_id}`
      );
      console.log({ TrainingProviders: res.data });
      dispatch<GetTrainingPlansByParticipantInfoAction>({
        type: ActionTypes.GET_TRAINING_PLANS_PARTICIPANT,
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

export const FC_GetTrainingsReportedByEmployee = (
  user_id: string,
  training_plan_id: string,
  callback: (
    loading: boolean,
    res: {
      type: "error" | "success";
      msg: string;
      data: TrainingAttendedInterface[];
    } | null
  ) => void
) => {
  return async (dispatch: Dispatch) => {
    callback(true, null);
    setAxiosToken();
    try {
      const res = await axios.get<TrainingAttendedInterface[]>(
        `${API_URL}/training/attendance/user/${user_id}/${training_plan_id}`
      );
      console.log({ Trainings: res.data });
      dispatch<GetTrainingAttendedInfoAction>({
        type: ActionTypes.GET_TRAINING_ATTENDANCE,
        payload: res.data,
      });
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

export const FC_AddTrainingAttendedReport = (
  data: TrainingAttendanceData,
  callback: (
    loading: boolean,
    res: {
      type: "success" | "error";
      msg: string;
    } | null
  ) => void
) => {
  return async (dispatch: Dispatch) => {
    callback(true, null);
    setAxiosToken();
    try {
      // Data conversion into form data format
      const formData = new FormData();
      formData.append("user_id", data.user_id);
      formData.append("training_plan_id", data.training_plan_id);
      formData.append("title", data.title);
      formData.append("supporting_doc", data.supporting_doc);
      formData.append("start_date", data.start_date);
      formData.append("end_date", data.end_date);
      formData.append("provider_id", data.provider_id);
      formData.append("participant_report", data.participant_report);
      formData.append("location", data.location);
      // Send the request
      const res = await axios.post<{
        training_plan_id: string;
      }>(`${API_URL}/training/attendance`, formData);
      console.log({ AddTrainingReportAttended: res.data });
      dispatch<AddTrainingAttendedReportInfoAction>({
        type: ActionTypes.ADD_TRAINING_ATTENDED_REPORT,
        payload: data,
      });
      callback(false, {
        msg: "Training report sent successfully!",
        type: "success",
      });
      dispatch<SetSystemSuccessMessageAction>({
        type: ActionTypes.SET_SYSTEM_SUCCESS_MESSAGE,
        payload: "Training report sent successfully!",
      });
    } catch (error: any) {
      dispatch<SetSystemErrorMessageAction>({
        type: ActionTypes.SET_SYSTEM_ERROR_MESSAGE,
        payload: errorToText(error),
      });
      callback(false, {
        msg: errorToText(error),
        type: "error",
      });
      console.log("err: ", { ...error });
    }
  };
};

export const FC_RemoveTrainingReported = (
  training_id: string,
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
        `${API_URL}/training/attendance/${training_id}`
      );
      console.log({ RemoveTrainingAttended: res.data });
      callback(false, {
        type: "success",
        msg: "Training removed successfully",
      });
      dispatch<RemoveTrainingAttendedReportInfoAction>({
        type: ActionTypes.REMOVE_TRAINING_ATTENDED_REPORT,
        payload: {
          training_id: training_id,
        },
      });
      dispatch<SetSystemSuccessMessageAction>({
        type: ActionTypes.SET_SYSTEM_SUCCESS_MESSAGE,
        payload: "Training removed successfully",
      });
    } catch (error: any) {
      dispatch<SetSystemErrorMessageAction>({
        type: ActionTypes.SET_SYSTEM_ERROR_MESSAGE,
        payload: errorToText(error),
      });
      callback(false, {
        type: "error",
        msg: errorToText(error),
      });
      console.log("err: ", { ...error });
    }
  };
};
