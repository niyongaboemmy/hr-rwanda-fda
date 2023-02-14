import { Action, ActionTypes, ApplicationsStore } from "../actions";
// default state
const defaultState: ApplicationsStore = {
  applicationsList: null,
};

/**
 * this is the action
 * @param state
 * @param action
 * @returns
 */
export const applicationsReducer = (
  state: ApplicationsStore = defaultState,
  action: Action
) => {
  switch (action.type) {
    case ActionTypes.GET_APPLICATIONS_BY_DATES:
      return {
        ...state,
        applicationsList: action.payload,
      };
    case ActionTypes.LOGOUT:
      return {
        ...defaultState,
      };
    default:
      return state;
  }
};
