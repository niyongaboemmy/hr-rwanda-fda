import axios from "axios";
import { Dispatch } from "redux";
import { UserAccessInterface } from "../config/userAccess";
import { API_URL } from "../utils/api";
import { setAxiosToken } from "../utils/AxiosToken";
import { errorToText } from "../utils/functions";
import { BooleanEnum } from "./auth.action";
import {
  SetSystemErrorMessageAction,
  SetSystemSuccessMessageAction,
} from "./system.action";
import { ActionTypes } from "./types";

export interface PositionCompetencyInterface {
  behavior_id: string;
  behavior_name: string;
  classification_name: string;
  competency_classification_id: string;
  competency_function: string;
  competency_function_id: string;
  competency_id: string;
  competency_type: string;
  competency_type_id: string;
  domain_id: string;
  domain_name: string;
  position_id: string;
  proficiency_level: string;
  proficiency_level_id: string;
}

export interface PositionCompetencyFormatInterface {
  position_id: string;
  domain_id: string;
  domain_name: string;
  behaviors: {
    behavior_id: string;
    behavior_name: string;
    classification_name: string;
    competency_classification_id: string;
    competency_function: string;
    competency_function_id: string;
    competency_id: string;
    competency_type: string;
    competency_type_id: string;
    proficiency_level: string;
    proficiency_level_id: string;
  }[];
}

export interface PositionInterface {
  position_id: string;
  is_line_manager: BooleanEnum;
  employee_number: number;
  position_name: string;
  access: UserAccessInterface[];
  job_family_id: string;
  job_family: string;
  unit_id: string;
  unit_name: string;
  report_unit_id: string;
  competency?: PositionCompetencyInterface[];
}

export interface PositionDetailsInterface {
  access: UserAccessInterface[];
  competencies: PositionCompetencyInterface[];
  employment_id: string;
  end_date: string | null;
  is_acting: BooleanEnum;
  is_active: BooleanEnum;
  is_line_manager: BooleanEnum;
  position_id: 1;
  position_name: string;
  start_date: string;
  unit_id: string;
  unit_name: string;
  user_id: string;
}

export interface PositionStore {
  positions: PositionInterface[] | null;
}

//* ********************** ACTION TYPE INTERFACES ********************** */
export interface GetAllPositionsInfoAction {
  type: ActionTypes.GET_ALL_POSITIONS;
  payload: PositionInterface[];
}

export interface SetPositionCompetenciesAction {
  type: ActionTypes.SET_POSITION_COMPETENCIES;
  payload: {
    position_id: string;
    competency: PositionCompetencyInterface[];
  };
}

export interface UpdatePositionAccessInfoAction {
  type: ActionTypes.UPDATE_POSITION_ACCESS;
  payload: {
    position_id: string;
    access: UserAccessInterface[];
  };
}

export const FC_GetAllPositions = (
  callback: (loading: boolean, error: string) => void
) => {
  return async (dispatch: Dispatch) => {
    callback(true, "");
    setAxiosToken();
    try {
      const res = await axios.get<PositionInterface[]>(`${API_URL}/positions`);
      console.log({ AllPositions: res.data });
      dispatch<GetAllPositionsInfoAction>({
        type: ActionTypes.GET_ALL_POSITIONS,
        payload: res.data.map((item) => ({
          ...item,
          access: JSON.parse(item.access as unknown as string),
        })),
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

export const GetPositionFormattedCompetency = (
  competency: PositionCompetencyInterface[]
): PositionCompetencyFormatInterface[] => {
  var response: PositionCompetencyFormatInterface[] = [];
  var domains: {
    domain_id: string;
    domain_name: string;
    position_id: string;
  }[] = [];
  // Assign domains
  for (const domain of competency) {
    if (
      domains.find(
        (itm) => itm.domain_id.toString() === domain.domain_id.toString()
      ) === undefined
    ) {
      domains.push({
        domain_id: domain.domain_id,
        domain_name: domain.domain_name,
        position_id: domain.position_id,
      });
    }
  }
  //   Add competency behaviors
  for (const item of domains) {
    if (
      response.find(
        (itm) => itm.domain_id.toString() === item.domain_id.toString()
      ) === undefined
    ) {
      response.push({
        domain_id: item.domain_id,
        domain_name: item.domain_name,
        position_id: item.position_id,
        behaviors: competency.filter(
          (itm) => itm.domain_id.toString() === item.domain_id.toString()
        ),
      });
    }
  }
  return response;
};

export const FC_AssignPositionAccess = (
  data: {
    position_id: string;
    access: UserAccessInterface[];
  },
  callback: (loading: boolean, error: string) => void
) => {
  return async (dispatch: Dispatch) => {
    callback(true, "");
    setAxiosToken();
    try {
      const res = await axios.post(`${API_URL}/positions/access`, data);
      console.log({ Update: res.data });
      dispatch<UpdatePositionAccessInfoAction>({
        type: ActionTypes.UPDATE_POSITION_ACCESS,
        payload: data,
      });
      callback(false, "");
      dispatch<SetSystemSuccessMessageAction>({
        type: ActionTypes.SET_SYSTEM_SUCCESS_MESSAGE,
        payload: "Access assigned successfully!",
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

export const FC_GetPositionCompetencies = (
  position_id: string,
  callback: (loading: boolean, error: string) => void
) => {
  return async (dispatch: Dispatch) => {
    callback(true, "");
    setAxiosToken();
    try {
      const res = await axios.get<PositionCompetencyInterface[]>(
        `${API_URL}/positions/competency/${position_id}`
      );
      console.log({ AllPositions: res.data });
      dispatch<SetPositionCompetenciesAction>({
        type: ActionTypes.SET_POSITION_COMPETENCIES,
        payload: {
          position_id: position_id,
          competency: res.data,
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
