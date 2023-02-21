import { Auth, Action, ActionTypes } from "../actions";
import { APP_TOKEN_NAME } from "../utils/AxiosToken";
// default state
const defaultState: Auth = {
  user: null,
  selectedEmployment: null,
  loading: true,
  isAuthenticated: false,
  token: "",
};

/**
 * this is the
 * @param state
 * @param action
 * @returns
 */
export const authReducer = (state: Auth = defaultState, action: Action) => {
  switch (action.type) {
    case ActionTypes.USER_LOGIN_SUCCESS_DATA:
      return {
        ...state,
        user: action.payload.data,
        token: action.payload.token,
        loading: false,
        isAuthenticated: true,
        selectedEmployment:
          action.payload.data.employment.length === 1
            ? action.payload.data.employment[0]
            : null,
      };
    case ActionTypes.SWITCH_EMPLOYMENT:
      return {
        ...state,
        selectedEmployment: action.payload,
      };
    case ActionTypes.CLEAN_USER_DETAILS:
      return {
        ...defaultState,
      };
    case ActionTypes.LOGOUT:
      localStorage.removeItem(APP_TOKEN_NAME);
      return {
        ...defaultState,
        loading: false,
      };
    default:
      return state;
  }
};
