import { Action, ActionTypes, LeaveStore } from "../actions";
// default state
const defaultState: LeaveStore = {
  employee_leaves: null,
  leave_categories: null,
};

/**
 * this is the action
 * @param state
 * @param action
 * @returns
 */
export const leaveReducer = (
  state: LeaveStore = defaultState,
  action: Action
) => {
  switch (action.type) {
    case ActionTypes.GET_LEAVE_CATEGORIES:
      return {
        ...state,
        leave_categories: action.payload,
      };
    case ActionTypes.GET_EMPLOYEE_LEAVES:
      return {
        ...state,
        employee_leaves: action.payload,
      };
    case ActionTypes.REMOVE_EMPLOYEE_LEAVE:
      return {
        ...state,
        employee_leaves:
          state.employee_leaves === null
            ? null
            : state.employee_leaves.filter(
                (itm) =>
                  itm.employee_leave_id.toString() !==
                  action.payload.employee_leave_id.toString()
              ),
      };
    case ActionTypes.LOGOUT:
      return {
        ...state,
        employee_leaves: null,
      };

    default:
      return state;
  }
};
