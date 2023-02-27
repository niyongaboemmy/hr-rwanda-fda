import { combineReducers } from "redux";
import { Auth, System } from "../actions";
import { EmployeeStore } from "../actions/employee.action";
import { PositionStore } from "../actions/position.action";
import { UnitStore } from "../actions/units.action";
import { authReducer } from "./auth.reducer";
import { employeeReducer } from "./employee.reducer";
import { positionReducer } from "./position.reducer";
import { systemReducer } from "./system.reducer";
import { unitsReducer } from "./units.reducer";

// define the entire state into the entire side
export interface StoreState {
  auth: Auth;
  system: System;
  position: PositionStore;
  units: UnitStore;
  employee: EmployeeStore;
}

export const reducers = combineReducers<StoreState>({
  auth: authReducer,
  system: systemReducer,
  position: positionReducer,
  units: unitsReducer,
  employee: employeeReducer,
});
