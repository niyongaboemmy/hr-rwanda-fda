import { combineReducers } from "redux";
import { Auth, LeaveStore, System, TrainingStore } from "../actions";
import { EmployeeStore } from "../actions/employee.action";
import { PositionStore } from "../actions/position.action";
import { UnitStore } from "../actions/units.action";
import { authReducer } from "./auth.reducer";
import { employeeReducer } from "./employee.reducer";
import { leaveReducer } from "./leave.reducer";
import { positionReducer } from "./position.reducer";
import { systemReducer } from "./system.reducer";
import { trainingsReducer } from "./training.reducer";
import { unitsReducer } from "./units.reducer";

// define the entire state into the entire side
export interface StoreState {
  auth: Auth;
  system: System;
  position: PositionStore;
  units: UnitStore;
  employee: EmployeeStore;
  training: TrainingStore;
  leave: LeaveStore;
}

export const reducers = combineReducers<StoreState>({
  auth: authReducer,
  system: systemReducer,
  position: positionReducer,
  units: unitsReducer,
  employee: employeeReducer,
  training: trainingsReducer,
  leave: leaveReducer,
});
