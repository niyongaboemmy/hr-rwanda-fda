import { Action, ActionTypes, InstructionLetterStore } from "../actions";
// default state
const defaultState: InstructionLetterStore = {
  instruction_letters: null,
  bank_details: null,
};

/**
 * this is the action
 * @param state
 * @param action
 * @returns
 */
export const instructionLetterReducer = (
  state: InstructionLetterStore = defaultState,
  action: Action
) => {
  switch (action.type) {
    case ActionTypes.GET_INSTRUCTION_LETTERS:
      return {
        ...state,
        instruction_letters: action.payload,
      };
    case ActionTypes.GET_BANK_SUMMARY:
      return {
        ...state,
        bank_details: action.payload,
      };
    case ActionTypes.LOGOUT:
      return {
        ...defaultState,
      };
    default:
      return state;
  }
};
