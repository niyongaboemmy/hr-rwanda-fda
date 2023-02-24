import axios from "axios";
import { Dispatch } from "redux";
import { API_URL } from "../utils/api";
import { setAxiosToken } from "../utils/AxiosToken";
import { errorToText } from "../utils/functions";
import { SetSystemErrorMessageAction } from "./system.action";
import { ActionTypes } from "./types";

export interface UnitInterface {
  unit_id: string;
  unit_name: string;
}

export interface UnitStore {
  units: UnitInterface[] | null;
}

//* ********************** ACTION TYPE INTERFACES ********************** */

export interface GetAllUnitsInfoAction {
  type: ActionTypes.GET_ALL_UNITS;
  payload: UnitInterface[];
}

export const FC_GetAllUnits = (
  callback: (loading: boolean, error: string) => void
) => {
  return async (dispatch: Dispatch) => {
    callback(true, "");
    setAxiosToken();
    try {
      const res = await axios.get<UnitInterface[]>(`${API_URL}/units`);
      console.log({ AllUnits: res.data });
      dispatch<GetAllUnitsInfoAction>({
        type: ActionTypes.GET_ALL_UNITS,
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
