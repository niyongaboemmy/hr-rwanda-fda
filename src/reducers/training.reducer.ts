import { Action, ActionTypes, TrainingStore } from "../actions";
// default state
const defaultState: TrainingStore = {
  training_plans: null,
  training_providers: null,
  employee_trainings: null,
};

/**
 * this is the action
 * @param state
 * @param action
 * @returns
 */
export const trainingsReducer = (
  state: TrainingStore = defaultState,
  action: Action
) => {
  switch (action.type) {
    case ActionTypes.GET_TRAINING_PLANS_BY_YEAR:
      return {
        ...state,
        training_plans:
          state.training_plans === null
            ? action.payload.data
            : [
                ...state.training_plans.filter(
                  (itm) => itm.year !== action.payload.year
                ),
                ...action.payload.data,
              ],
      };
    case ActionTypes.GET_TRAINING_PROVIDERS:
      return {
        ...state,
        training_providers: action.payload,
      };
    case ActionTypes.GET_TRAINING_PLANS_PARTICIPANT:
      return {
        ...state,
        employee_trainings: action.payload,
      };
    case ActionTypes.CREATE_TRAINING_PLAN:
      return {
        ...state,
        // training_plans:
      };
    case ActionTypes.LOGOUT:
      return {
        ...state,
        employee_trainings: null,
      };
    default:
      return state;
  }
};
