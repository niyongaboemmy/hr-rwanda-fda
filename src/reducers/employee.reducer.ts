import { Action, ActionTypes } from "../actions";
import { EmployeeStore } from "../actions/employee.action";
// default state
const defaultState: EmployeeStore = {
  employees: null,
};

/**
 * this is the action
 * @param state
 * @param action
 * @returns
 */
export const employeeReducer = (
  state: EmployeeStore = defaultState,
  action: Action
) => {
  switch (action.type) {
    case ActionTypes.GET_ALL_EMPLOYEES:
      return {
        ...state,
        employees: action.payload,
      };
    default:
      return state;
  }
};
