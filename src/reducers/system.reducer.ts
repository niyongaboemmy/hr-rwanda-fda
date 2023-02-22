import { Action, ActionTypes, System } from "../actions";
// default state
const defaultState: System = {
  side_nav: false,
  basic_info: null,
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
        basic_info: action.payload,
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
    default:
      return state;
  }
};
