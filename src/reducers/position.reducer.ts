import { Action, ActionTypes } from "../actions";
import { PositionStore } from "../actions/position.action";
// default state
const defaultState: PositionStore = {
  positions: null,
};

/**
 * this is the action
 * @param state
 * @param action
 * @returns
 */
export const positionReducer = (
  state: PositionStore = defaultState,
  action: Action
) => {
  switch (action.type) {
    case ActionTypes.GET_ALL_POSITIONS:
      return {
        ...state,
        positions: action.payload,
      };
    case ActionTypes.SET_POSITION_COMPETENCIES:
      return {
        ...state,
        positions:
          state.positions === null
            ? null
            : state.positions.map((item) => ({
                ...item,
                competency:
                  action.payload.position_id.toString() ===
                  item.position_id.toString()
                    ? action.payload.competency
                    : item.competency,
              })),
      };
    case ActionTypes.UPDATE_POSITION_ACCESS:
      return {
        ...state,
        positions:
          state.positions === null
            ? null
            : state.positions.map((item) => ({
                ...item,
                access:
                  item.position_id.toString() !==
                  action.payload.position_id.toString()
                    ? item.access
                    : action.payload.access,
                // [
                //     ...item.access.filter(
                //       (itm) =>
                //         itm.key !==
                //         action.payload.access.find(
                //           (test) => test.key === itm.key
                //         )?.key
                //     ),
                //     ...action.payload.access,
                //   ],
              })),
      };
    default:
      return state;
  }
};
