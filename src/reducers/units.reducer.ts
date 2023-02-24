import { Action, ActionTypes } from "../actions";
import { UnitStore } from "../actions/units.action";
// default state
const defaultState: UnitStore = {
  units: null,
};

/**
 * this is the action
 * @param state
 * @param action
 * @returns
 */
export const unitsReducer = (
  state: UnitStore = defaultState,
  action: Action
) => {
  switch (action.type) {
    case ActionTypes.GET_ALL_UNITS:
      return {
        ...state,
        units: action.payload,
      };
    default:
      return state;
  }
};
