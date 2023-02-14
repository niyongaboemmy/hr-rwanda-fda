import axios from "axios";
import { API_URL } from "../utils/api";
import { errorToText } from "../utils/functions";
import { Dispatch } from "redux";
import { SetSystemErrorMessageAction } from "./system.action";
import { ActionTypes } from "./types";
import FileSaver from "file-saver";
import { setAxiosToken } from "../utils/AxiosToken";
import { RegisterProductDataInterface } from "../components/RegisterProduct/RegisterProduct";
import { CreateApplicationInterface } from "../containers/CreateApplication/CreateApplication";

export enum RegistrationStates {
  REGISTERED = "REGISTERED",
}
export enum RoundValues {
  ROUND_ONE = "ROUND_ONE",
  ROUND_TWO = "ROUND_TWO",
  ROUND_THREE = "ROUND_THREE",
  ROUND_FOUR = "ROUND_FOUR",
}
export const RoundsArray = [
  RoundValues.ROUND_ONE,
  RoundValues.ROUND_TWO,
  RoundValues.ROUND_THREE,
  RoundValues.ROUND_FOUR,
];
export enum LevelsValues {
  LEVEL_ONE = "LEVEL_ONE",
  LEVEL_TWO = "LEVEL_TWO",
}
export enum AssessmentOutcomeValues {
  OG = "OG",
  R = "R",
  NR = "NR",
}
export enum ScreeningStatusValues {
  WITHDRAWN = "WITHDRAWN",
  PROGRESS_IN_SCREENING = "PROGRESS_IN_SCREENING",
  SCREENING_COMPLETED = "SCREENING_COMPLETED",
}
export enum PeerReviewStatusValues {
  approved = "APPROVED",
  rejected = "REJECTED",
  incomplete = "UNCOMPLETED",
}
export interface ScreeningInterface {
  done_by: undefined;
  screening_feedback: string;
  date_of_screening_feedback: string | null;
  screening_response: string;
  date_of_screening_response: string;
  screening_status: ScreeningStatusValues;
}
export interface AssessmentInterface {
  done_by?: string;
  assessment_level: LevelsValues;
  assessment_round: RoundValues;
  assessment_start_date: string;
  assessment_end_date: string;
  assessment_outcome: AssessmentOutcomeValues;
  assessment_comment: string;
  assessment_days: number;
}
export interface AssessmentQuerySaveData {
  assessment_round: RoundValues;
  application_ref_number: string;
  query_issued: string;
  query_issued_date: string;
  query_response: string;
  query_response_date: string | null;
}
export interface PeerReviewSavedData {
  application_ref_number: string;
  comment: string;
  status: PeerReviewStatusValues;
}
export interface PeerReviewInterface {
  comment: string;
  status: PeerReviewStatusValues;
}
export interface AssessmentQueryInterface {
  assessment_round: RoundValues;
  query_issued: string;
  query_issued_date: string;
  query_response: string | null;
  query_response_date: string | null;
  down_time: number;
}
export interface ApplicationDetailsInterface {
  application_id: string;
  application_ref_number: string;
  submission_date: string;
  product_brand_name: string;
  product_common_name: string;
  product_strength: string;
  product_dosage_form: string;
  manufacturer_name_and_country: string;
  manufacturing_site_address: string | null;
  applicant_name: string;
  applicant_address: string | null;
  local_technical_representative: string;
  date_ma_certificate_issued_to_applicant: string;
  no_of_working_days_taken: string;
  additional_data: string | null;
  registration_Status: RegistrationStates;
  application_status: string | null;
  screenings: ScreeningInterface[];
  assessments: AssessmentInterface[];
  peerreviews: PeerReviewInterface[];
  assessmentqueries: AssessmentQueryInterface[];
  done_by?: string;
  current_days: number;
  up_time: number;
}
export interface ApplicationCustomSearchInterface {
  application_id: 2;
  application_ref_number: string;
  submission_date: string;
  product_brand_name: string;
  product_common_name: string;
  manufacturer_name_and_country: string;
  manufacturing_site_address: string;
  registration_Status: RegistrationStates;
  application_status: string;
}
export interface UpdateScreeningDataInterface {
  application_id: string;
  application_ref_number: string;
  screening_feedback: string;
  date_of_screening_feedback: string | null;
  screening_response: string;
  date_of_screening_response: string | null;
  screening_status: string;
  done_by: string;
  done_at: string;
}
export interface UpdateAssessmentDataInterface {
  application_ref_number: string;
  assessment_level: LevelsValues;
  assessment_round: RoundValues;
  assessment_start_date: string;
  assessment_end_date: string;
  assessment_outcome: AssessmentOutcomeValues;
  assessment_comment: string;
  done_by: string;
  done_at: string | null;
}

export interface RegisteredProductInterface {
  registration_number: string | null;
  application_ref_number: string;
  submission_date: string;
  product_brand_name: string;
  product_common_name: string;
  product_strength: string;
  product_dosage_form: string;
  manufacturer_name_and_country: string;
  manufacturing_site_address: string | null;
  applicant_name: string;
  applicant_address: string | null;
  local_technical_representative: string;
  date_ma_certificate_issued_to_applicant: string;
  name_of_the_active_ingredient: string | null;
  therapeutic_indication: string | null;
  pack_size: string | null;
  pack_type: string | null;
  shelf_life_in_month: string | null;
  storage_statement: string | null;
  distribution_category: string | null;
  name_of_marketing_authorization_holder: string | null;
  product_category: string | null;
}
// --------------------------------------------------------------------------
// Actions interfaces

export interface GetApplicationsByDatesAction {
  type: ActionTypes.GET_APPLICATIONS_BY_DATES;
  payload: ApplicationDetailsInterface[] | null;
}

/**
 * @description Check if the user is logged in based on the logged in account
 * @param account
 * @param MsgHandler return the error from the API
 * @returns
 */

export interface ApplicationsStore {
  applicationsList: ApplicationDetailsInterface[] | null;
}

export const FC_GetCustomSearchResults = (
  search_keyword: string,
  callback: (
    loading: boolean,
    res: ApplicationCustomSearchInterface[] | null,
    msg: string
  ) => void
) => {
  callback(true, null, "");
  return async (dispatch: Dispatch) => {
    setAxiosToken();
    try {
      const res = await axios.post<ApplicationCustomSearchInterface[]>(
        `${API_URL}/application/like/reference`,
        {
          ref_number: `${search_keyword}`,
        }
      );
      if (res.status === 200) {
        callback(false, res.data, "");
      }
    } catch (error: any) {
      console.log("Err: ", { ...error });
      callback(false, null, errorToText(error));
    }
  };
};

export const FC_GetApplicationByReferenceNumber = (
  reference_number: string,
  callback: (
    loading: boolean,
    res: ApplicationDetailsInterface | null,
    msg: string
  ) => void
) => {
  callback(true, null, "");
  return async (dispatch: Dispatch) => {
    setAxiosToken();
    try {
      const res = await axios.post<ApplicationDetailsInterface>(
        `${API_URL}/application/reference`,
        {
          ref_number: `${reference_number}`,
        }
      );
      if (res.status === 200) {
        // if ((res.data as unknown as string).replace(/\s/g, "") === "") {
        //   dispatch<SetSystemErrorMessageAction>({
        //     type: ActionTypes.SET_SYSTEM_ERROR_MESSAGE,
        //     payload:
        //       "No result found for the reference number: " + reference_number,
        //   });
        //   callback(
        //     false,
        //     null,
        //     "No result found for the reference number: " + reference_number
        //   );
        // }
        callback(false, res.data, "");
      }
    } catch (error: any) {
      //   dispatch<SetSystemErrorMessageAction>({
      //     type: ActionTypes.SET_SYSTEM_ERROR_MESSAGE,
      //     payload: errorToText(error),
      //   });
      console.log("Err: ", { ...error });
      callback(false, null, errorToText(error));
    }
  };
};

export const FC_GetApplicationByDates = (
  starting_date: string,
  ending_date: string,
  callback: (loading: boolean, msg: string) => void
) => {
  callback(true, "");
  return async (dispatch: Dispatch) => {
    setAxiosToken();
    try {
      const res = await axios.get<ApplicationDetailsInterface[]>(
        `${API_URL}/application/submitted/${starting_date}/${ending_date}`
      );
      if (res.status === 200) {
        dispatch<GetApplicationsByDatesAction>({
          type: ActionTypes.GET_APPLICATIONS_BY_DATES,
          payload: res.data,
        });
        callback(false, "");
      }
    } catch (error: any) {
      dispatch<SetSystemErrorMessageAction>({
        type: ActionTypes.SET_SYSTEM_ERROR_MESSAGE,
        payload: errorToText(error),
      });
      console.log("Err: ", { ...error });
      callback(false, errorToText(error));
    }
  };
};

export const FC_SetApplications = (
  applications: ApplicationDetailsInterface[] | null
) => {
  return async (dispatch: Dispatch) => {
    dispatch<GetApplicationsByDatesAction>({
      type: ActionTypes.GET_APPLICATIONS_BY_DATES,
      payload: applications,
    });
  };
};

export const DownloadCertificate = async (
  reference_id: string,
  callback: (
    loading: boolean,
    feedback: {
      type: "success" | "error";
      msg: string;
    } | null
  ) => void
) => {
  callback(true, null);
  setAxiosToken();
  try {
    const res = await axios.get(
      `${API_URL}/application/certificate?ref_number=${reference_id}`
    );
    if (res) {
      FileSaver.saveAs(
        `${API_URL}/application/certificate?ref_number=${reference_id}`,
        "Product certificate.pdf"
      );
      callback(false, {
        type: "success",
        msg: "Certificate has been downloaded!",
      });
    }
  } catch (error: any) {
    callback(false, {
      type: "error",
      msg: errorToText(error),
    });
    console.log("Errr: ", { ...error });
  }
};

export const FC_UpdateScreening = async (
  data: UpdateScreeningDataInterface,
  callback: (
    loading: boolean,
    feedback: {
      type: "success" | "error";
      msg: string;
    } | null
  ) => void
) => {
  callback(true, null);
  setAxiosToken();
  try {
    const res = await axios.post(`${API_URL}/screening`, data);
    if (res) {
      console.log(res);
      callback(false, {
        type: "success",
        msg: "Screening status has been updated successfully!",
      });
    }
  } catch (error: any) {
    console.log("Err: ", { ...error });
    callback(false, {
      type: "error",
      msg: `${errorToText(error)}`,
    });
  }
};

export const FC_UpdateAssessment = async (
  data: UpdateAssessmentDataInterface,
  action_type: "Add" | "Update",
  callback: (
    loading: boolean,
    feedback: {
      type: "success" | "error";
      msg: string;
    } | null
  ) => void
) => {
  callback(true, null);
  setAxiosToken();
  try {
    var res: any = null;
    // if (action_type === "Add") {
    //   res = await axios.post(`${API_URL}/assessment`, data);
    // } else {
    //   res = await axios.patch(`${API_URL}/assessment`, data);
    // }
    res = await axios.post(`${API_URL}/assessment`, data);
    if (res !== null) {
      console.log(res);
      callback(false, {
        type: "success",
        msg: "Assessment status has been updated successfully!",
      });
    }
  } catch (error: any) {
    console.log("Err: ", { ...error });
    callback(false, {
      type: "error",
      msg: `${errorToText(error)}`,
    });
  }
};

export const FC_SendQuery = async (
  data: AssessmentQuerySaveData,
  callback: (
    loading: boolean,
    feedback: {
      type: "success" | "error";
      msg: string;
    } | null
  ) => void
) => {
  callback(true, null);
  setAxiosToken();
  try {
    var res: any = null;
    res = await axios.post(`${API_URL}/query`, data);
    if (res !== null) {
      console.log(res);
      callback(false, {
        type: "success",
        msg: "Assessment query has been updated successfully!",
      });
    }
  } catch (error: any) {
    console.log("Err: ", { ...error });
    callback(false, {
      type: "error",
      msg: `${errorToText(error)}`,
    });
  }
};

export const FC_UpdatePeerReview = async (
  data: PeerReviewSavedData,
  type: "Add" | "Update",
  callback: (
    loading: boolean,
    feedback: {
      type: "success" | "error";
      msg: string;
    } | null
  ) => void
) => {
  callback(true, null);
  setAxiosToken();
  try {
    var res: any = null;
    if (type === "Add") {
      res = await axios.post(`${API_URL}/review`, data);
    } else {
      res = await axios.post(`${API_URL}/review`, data);
    }
    if (res !== null) {
      console.log(res);
      callback(false, {
        type: "success",
        msg: "Application review has been updated successfully!",
      });
    }
  } catch (error: any) {
    console.log("Err: ", { ...error });
    callback(false, {
      type: "error",
      msg: `${errorToText(error)}`,
    });
  }
};

export const FC_RegisterProduct = async (
  data: RegisterProductDataInterface,
  type: "Add" | "Update",
  callback: (
    loading: boolean,
    feedback: {
      type: "success" | "error";
      msg: string;
    } | null
  ) => void
) => {
  callback(true, null);
  setAxiosToken();
  try {
    var res: any = null;
    res = await axios.post(`${API_URL}/registered`, data);
    // if (type === "Add") {
    // } else {
    //   res = await axios.patch(`${API_URL}/registered`, data);
    // }
    if (res !== null) {
      console.log(res);
      callback(false, {
        type: "success",
        msg: `Product has been ${
          type === "Add" ? "registered" : "updated"
        } successfully!`,
      });
    }
  } catch (error: any) {
    console.log("Err: ", { ...error });
    callback(false, {
      type: "error",
      msg: `${errorToText(error)}`,
    });
  }
};

export const FC_GetRegisteredProducts = async (
  callBack: (
    loading: boolean,
    feedback: {
      type: "success" | "error";
      msg: string;
    } | null,
    data: RegisteredProductInterface[] | null
  ) => void
) => {
  callBack(true, null, null);
  setAxiosToken();
  try {
    const res = await axios.get<RegisteredProductInterface[]>(
      `${API_URL}/registered`
    );
    if (res) {
      callBack(
        false,
        {
          type: "success",
          msg: "Data loaded successfully!",
        },
        res.data
      );
    }
  } catch (error: any) {
    console.log("Err: ", error);
    callBack(
      false,
      {
        type: "error",
        msg: errorToText(error),
      },
      []
    );
  }
};

export enum StatusToSearchApplications {
  OG = "OG",
  R = "R",
  NR = "NR",
  WITHDRAWN = "WITHDRAWN",
  PROGRESS_IN_SCREENING = "PROGRESS_IN_SCREENING",
  SCREENING_COMPLETED = "SCREENING_COMPLETED",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  UNCOMPLETED = "UNCOMPLETED",
  NOT_SCREENED = "NOT_SCREENED",
}

export const FC_GetApplicationsByStatus = async (
  status: StatusToSearchApplications,
  callBack: (
    loading: boolean,
    feedback: {
      type: "success" | "error";
      msg: string;
    } | null,
    data: ApplicationDetailsInterface[] | null
  ) => void
) => {
  callBack(true, null, null);
  setAxiosToken();
  try {
    const res = await axios.get<ApplicationDetailsInterface[]>(
      `${API_URL}/application/status/${status}`
    );
    if (res) {
      callBack(
        false,
        {
          type: "success",
          msg: "Data loaded successfully!",
        },
        res.data
      );
    }
  } catch (error: any) {
    console.log("Err: ", error);
    callBack(
      false,
      {
        type: "error",
        msg: errorToText(error),
      },
      []
    );
  }
};

export const FC_CreateApplication = async (
  data: CreateApplicationInterface,
  type: "Add" | "Update",
  callback: (
    loading: boolean,
    feedback: {
      type: "success" | "error";
      msg: string;
    } | null
  ) => void
) => {
  callback(true, null);
  setAxiosToken();
  try {
    var res: any = null;
    if (type === "Add") {
      res = await axios.post(`${API_URL}/application`, data);
    } else {
      res = await axios.patch(`${API_URL}/application`, data);
    }
    if (res !== null) {
      console.log(res);
      callback(false, {
        type: "success",
        msg: `Application has been ${
          type === "Add" ? "added" : "updated"
        } successfully!`,
      });
    }
  } catch (error: any) {
    console.log("Err: ", { ...error });
    console.log("Err: ", error);
    callback(false, {
      type: "error",
      msg: `${errorToText(error)}`,
    });
  }
};
