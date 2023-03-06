import { Action, ActionTypes, System } from "../actions";
// default state
const defaultState: System = {
  side_nav: false,
  basic_info: null,
  access_details: null,
  error: "",
  success: "",
};

/**
 * this is the action
 * @param state
 * @param action
 * @returns
 */
export const systemReducer = (state: System = defaultState, action: Action) => {
  switch (action.type) {
    case ActionTypes.GET_SYSTEM_BASIC_INFO:
      return {
        ...state,
        basic_info: {
          behavior:
            state.basic_info === null || action.payload.behavior === undefined
              ? state.basic_info !== null &&
                state.basic_info.behavior.length > 0
                ? state.basic_info.behavior
                : []
              : action.payload.behavior,
          competency_classification: action.payload.competency_classification,
          competency_function: action.payload.competency_function,
          competency_type: action.payload.competency_type,
          domain: action.payload.domain,
          job_family: action.payload.job_family,
          proficiency_level: action.payload.proficiency_level,
          division: action.payload.division,
          training_offer_modes:
            state.basic_info === null ||
            action.payload.training_offer_modes === undefined
              ? state.basic_info !== null &&
                state.basic_info.training_offer_modes.length > 0
                ? state.basic_info.training_offer_modes
                : []
              : action.payload.training_offer_modes,
        },
      };
    case ActionTypes.SET_SYSTEM_ERROR_MESSAGE:
      return {
        ...state,
        error: action.payload,
        success: "",
      };
    case ActionTypes.SET_SYSTEM_SUCCESS_MESSAGE:
      return {
        ...state,
        success: action.payload,
        error: "",
      };
    case ActionTypes.GET_ALL_ACCESS_DETAILS:
      return {
        ...state,
        access_details: action.payload,
      };
    case ActionTypes.GET_ALL_BEHAVIORS_DETAILS:
      return {
        ...state,
        basic_info: {
          behavior: action.payload,
          competency_classification:
            state.basic_info === null
              ? []
              : state.basic_info.competency_classification,
          competency_function:
            state.basic_info === null
              ? []
              : state.basic_info.competency_function,
          competency_type:
            state.basic_info === null ? [] : state.basic_info.competency_type,
          domain: state.basic_info === null ? [] : state.basic_info.domain,
          job_family:
            state.basic_info === null ? [] : state.basic_info.job_family,
          proficiency_level:
            state.basic_info === null ? [] : state.basic_info.proficiency_level,
          division: state.basic_info === null ? [] : state.basic_info.division,
          training_offer_modes:
            state.basic_info === null
              ? []
              : state.basic_info.training_offer_modes,
        },
      };
    case ActionTypes.GET_TRAINING_OFFER_MODES:
      return {
        ...state,
        basic_info: {
          behavior:
            state.basic_info === null || state.basic_info.behavior === undefined
              ? []
              : state.basic_info.behavior,
          competency_classification:
            state.basic_info === null
              ? []
              : state.basic_info.competency_classification,
          competency_function:
            state.basic_info === null
              ? []
              : state.basic_info.competency_function,
          competency_type:
            state.basic_info === null ? [] : state.basic_info.competency_type,
          domain: state.basic_info === null ? [] : state.basic_info.domain,
          job_family:
            state.basic_info === null ? [] : state.basic_info.job_family,
          proficiency_level:
            state.basic_info === null ? [] : state.basic_info.proficiency_level,
          division: state.basic_info === null ? [] : state.basic_info.division,
          training_offer_modes: action.payload,
        },
      };
    default:
      return state;
  }
};
