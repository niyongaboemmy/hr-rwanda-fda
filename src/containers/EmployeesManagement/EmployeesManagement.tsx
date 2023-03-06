import React, { Component, Fragment } from "react";
import { BsFilterCircle } from "react-icons/bs";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { connect } from "react-redux";
import {
  Auth,
  BooleanEnum,
  EmployeeListInterface,
  EmployeePositionItem,
  EmployeeStore,
  FC_GetAllEmployees,
  System,
  UnitInterface,
  UnitStore,
} from "../../actions";
import MainContainer from "../../components/MainContainer/MainContainer";
import { StoreState } from "../../reducers";
import ExportToExcel from "../../components/GenerateReport/ExportToExcel";
import Modal, {
  ModalMarginTop,
  ModalSize,
  Themes,
} from "../../components/Modal/Modal";
import { NoResultFound } from "../../components/Fragments/NoResultFound";
import { PositionItemLoading } from "../../components/PositionItem/PositionItemLoading";
import { commaFy, search } from "../../utils/functions";
import { SelectUnit } from "../../components/SelectUnit/SelectUnit";
import SearchInput from "../../components/Fragments/SearchInput";
import { IoMdRefreshCircle } from "react-icons/io";
import { FaUsersCog } from "react-icons/fa";
import { EmployeeDetails } from "../../components/EmployeeDetails/EmployeeDetails";
import { isAccessAuthorized, UserAccessList } from "../../config/userAccess";
import ActionMenu from "./ActionMenu";
import { EmployeePositions } from "./EmployeePositions";

export enum EmployeeActionTypes {
  DETAILS = "DETAILS",
  POSITIONS = "POSITIONS",
  TRAINING = "TRAINING",
  LEAVE = "LEAVE",
  TRAVEL = "TRAVEL",
  TERMINATE = "TERMINATE",
}

interface EmployeesManagementProps {
  auth: Auth;
  system: System;
  employee: EmployeeStore;
  units: UnitStore;
  FC_GetAllEmployees: (
    callback: (loading: boolean, error: string) => void
  ) => void;
}
interface EmployeesManagementState {
  loading: boolean;
  tabs: "SUMMARY" | "EMPLOYEES";
  selectedEmployee: EmployeeListInterface | null;
  selectedUnit: UnitInterface | null;
  searchData: string;
  mainError: string;
  openSelectUnit: boolean;
  openMenu: EmployeeListInterface | null;
  open: EmployeeActionTypes | null;
}

class _EmployeesManagement extends Component<
  EmployeesManagementProps,
  EmployeesManagementState
> {
  constructor(props: EmployeesManagementProps) {
    super(props);

    this.state = {
      loading: false,
      tabs: "EMPLOYEES",
      selectedEmployee: null,
      selectedUnit: null,
      searchData: "",
      mainError: "",
      openSelectUnit: false,
      open: null,
      openMenu: null,
    };
  }
  FilteredData = () => {
    if (this.props.employee.employees === null) {
      return [];
    }
    var response = this.props.employee.employees;
    if (this.state.selectedUnit !== null) {
      response = response.filter(
        (itm) =>
          this.state.selectedUnit !== null &&
          itm.positions.find(
            (test) =>
              this.state.selectedUnit !== null &&
              test.unit_id.toString() ===
                this.state.selectedUnit.unit_id.toString()
          ) !== undefined
      );
    }
    return search(response, this.state.searchData) as EmployeeListInterface[];
  };
  getUnitName = (unit_id: string): string => {
    if (this.props.units.units !== null) {
      const unit = this.props.units.units.find(
        (itm) => itm.unit_id.toString() === unit_id.toString()
      );
      if (unit !== undefined) {
        return unit.unit_name;
      }
    }
    return "";
  };
  componentDidMount = () => {
    if (this.props.employee.employees === null) {
      this.setState({ loading: true });
      this.props.FC_GetAllEmployees((loading: boolean, error: string) => {
        this.setState({ loading: loading, mainError: error });
      });
    }
  };
  getSelectedEmployee = (): EmployeeListInterface | null => {
    if (this.props.employee.employees === null) {
      return null;
    }
    const response = this.props.employee.employees.find(
      (itm) => itm.user_id === this.state.selectedEmployee?.user_id
    );
    return response !== undefined ? response : null;
  };
  employeeActivePosition = (
    positions: EmployeePositionItem[]
  ): EmployeePositionItem | null => {
    if (positions.length > 0) {
      const res_not_acting = positions.find(
        (itm) =>
          itm.is_active === BooleanEnum.TRUE &&
          itm.is_acting === BooleanEnum.FALSE
      );
      const res_acting = positions.find(
        (itm) =>
          itm.is_active === BooleanEnum.TRUE &&
          itm.is_acting === BooleanEnum.TRUE
      );
      if (res_not_acting !== undefined) {
        return res_not_acting;
      }
      if (res_acting !== undefined) {
        return res_acting;
      }
    }
    return null;
  };

  getEmployeesPositions = () => {
    if (
      this.props.employee.employees !== null &&
      this.props.employee.employees.length > 0
    ) {
      const response: {
        position_id: string;
        employees_number: number;
        unit_id: string;
      }[] = [];
      for (const item of this.props.employee.employees) {
        const position = item.positions.map((position) => ({
          position_id: position.position_id,
          employees_number:
            this.props.employee.employees === null
              ? 0
              : this.props.employee.employees.filter((itm) =>
                  itm.positions.find(
                    (pos) => pos.position_id === position.position_id
                  )
                ).length,
          unit_id: position.unit_id,
        }));
        if (
          position.length > 0 &&
          response.find(
            (itm) => itm.position_id === position[0].position_id
          ) === undefined
        ) {
          response.push(position[0]);
        }
      }
      return response;
    }
    return [];
  };

  render() {
    return (
      <Fragment>
        <div className="pt-3">
          <div className="flex flex-row items-center justify-between gap-2 w-full pl-2">
            <div className="flex flex-row items-center gap-3">
              <div>
                <FaUsersCog className="text-5xl text-gray-400" />
              </div>
              <div>
                <div className="text-xl font-bold truncate">
                  Employees Managements
                </div>
                <div className="text-sm text-gray-600 truncate">
                  Employees grouped in their positions and divisions management
                  panel
                </div>
              </div>
            </div>
            {/* Right side */}
            <div className="flex flex-row items-center justify-end gap-2 w-1/2">
              <div
                onClick={() => this.setState({ openSelectUnit: true })}
                className="flex flex-row items-center justify-between gap-6 bg-white hover:bg-primary-100 border border-primary-700 rounded cursor-pointer pr-2 group truncate"
              >
                <div className="flex flex-row items-center gap-2 truncate">
                  <div>
                    <div className="bg-primary-700 flex items-center justify-center h-10 w-10">
                      <BsFilterCircle className="text-2xl text-white" />
                    </div>
                  </div>
                  {this.state.selectedUnit === null ? (
                    <div className="font-bold text-sm text-gray-500 group-hover:text-primary-800 py-1 truncate">
                      Search by positions Units
                    </div>
                  ) : (
                    <div className="font-bold text-sm text-primary-800 group-hover:text-primary-900 py-1 truncate">
                      {this.state.selectedUnit.unit_name}
                    </div>
                  )}
                </div>
                <div>
                  <MdOutlineKeyboardArrowDown className="text-2xl text-gray-500 group-hover:text-primary-700" />
                </div>
              </div>
              {this.state.selectedUnit !== null && (
                <div
                  onClick={() => this.setState({ selectedUnit: null })}
                  title="Reset to view back all of the positions"
                  className=" rounded-full flex items-center justify-center text-yellow-600 hover:text-yellow-700 cursor-pointer"
                >
                  <IoMdRefreshCircle className="text-4xl bg-white rounded-full" />
                </div>
              )}
              <div className="flex flex-col">
                <div className="text-sm text-gray-600 truncate">
                  Total positions
                </div>
                <div className="font-bold text-xl -mt-1">
                  {commaFy(this.FilteredData().length)}
                </div>
              </div>
            </div>
          </div>
          {/* Body */}
          {this.state.loading === true ||
          this.props.employee.employees === null ? (
            <div className="mt-8 bg-white rounded-md p-3">
              <div>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map(
                  (item, i) => (
                    <PositionItemLoading
                      key={i + 1}
                      className="animate-pulse"
                    />
                  )
                )}
              </div>
            </div>
          ) : (
            <MainContainer className="mt-3">
              <div className="border-b mb-3">
                <div className="grid grid-cols-12 w-full">
                  <div className="col-span-12 lg:col-span-6">
                    <div className="flex flex-row items-center gap-2">
                      <div
                        onClick={() => this.setState({ tabs: "SUMMARY" })}
                        className={`px-6 py-2 border-b-2 ${
                          this.state.tabs === "SUMMARY"
                            ? "border-primary-700 text-primary-800 animate__animated animate__fadeIn"
                            : "border-white hover:border-primary-700 hover:text-primary-800"
                        } cursor-pointer`}
                      >
                        Summary
                      </div>
                      <div
                        onClick={() => this.setState({ tabs: "EMPLOYEES" })}
                        className={`px-6 py-2 border-b-2 ${
                          this.state.tabs === "EMPLOYEES"
                            ? "border-primary-700 text-primary-800 animate__animated animate__fadeIn"
                            : "border-white hover:border-primary-700 hover:text-primary-800"
                        } cursor-pointer`}
                      >
                        Employees
                      </div>
                    </div>
                  </div>
                  <div className="col-span-12 lg:col-span-6 flex flex-row items-center justify-end gap-2 pb-2 -mt-1">
                    <SearchInput
                      searchData={this.state.searchData}
                      onChange={(value: string) =>
                        this.setState({ searchData: value })
                      }
                    />
                    <ExportToExcel
                      fileData={this.props.employee.employees}
                      fileName={"Employees report"}
                    />
                  </div>
                </div>
              </div>
              {this.state.tabs === "EMPLOYEES" && (
                <div className="mt-6 animate__animated animate__fadeIn">
                  {this.FilteredData().length === 0 ? (
                    <NoResultFound />
                  ) : (
                    <div className="w-full overflow-y-auto">
                      <table className="text-sm text-left min-w-full">
                        <thead>
                          <tr>
                            <th className="px-2 py-2 border truncate">#</th>
                            <th className="px-2 py-2 border truncate">
                              First name
                            </th>
                            <th className="px-2 py-2 border truncate">
                              Last name
                            </th>
                            <th className="px-2 py-2 border truncate">
                              Martial status
                            </th>
                            <th className="px-2 py-2 border truncate">
                              Nationality
                            </th>
                            <th className="px-2 py-2 border truncate">
                              NID / Passport
                            </th>
                            <th className="px-2 py-2 border truncate">
                              Gender
                            </th>
                            <th className="px-2 py-2 border truncate">
                              Phone number
                            </th>
                            <th className="px-2 py-2 border truncate">Email</th>
                            <th className="px-2 py-2 border truncate">
                              Position
                            </th>
                            <th className="px-2 py-2 border truncate">Unit</th>
                            <th className="px-2 py-2 border truncate"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {this.FilteredData().map((item, i) => (
                            <tr
                              key={i + 1}
                              className="hover:bg-primary-50 hover:text-primary-800 cursor-pointer group"
                              title="Click to view details for selected employee"
                              onClick={() => this.setState({ openMenu: item })}
                            >
                              <td className="px-2 py-2 border">{i + 1}</td>
                              <td className="px-2 py-2 border truncate">
                                {item.first_name}
                              </td>
                              <td className="px-2 py-2 border truncate">
                                {item.last_name}
                              </td>
                              <td className="px-2 py-2 border">
                                {item.martial_status}
                              </td>
                              <td className="px-2 py-2 border">
                                {item.nationality}
                              </td>
                              <td className="px-2 py-2 border">
                                {item.nid_number}
                              </td>
                              <td className="px-2 py-2 border">
                                {item.gender}
                              </td>
                              <td className="px-2 py-2 border">
                                {item.phone_number}
                              </td>
                              <td className="px-2 py-2 border">{item.email}</td>
                              <td className="px-2 py-2 border truncate">
                                {
                                  this.employeeActivePosition(item.positions)
                                    ?.position_name
                                }
                              </td>
                              <td className="px-2 py-2 border truncate">
                                {
                                  this.employeeActivePosition(item.positions)
                                    ?.unit_name
                                }
                              </td>
                              <td className="px-1 py-1 border w-10">
                                <div className="px-3 py-2 rounded-md text-sm bg-primary-50 text-primary-900 w-max group-hover:bg-primary-800 group-hover:text-white">
                                  More
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </MainContainer>
          )}
        </div>
        {this.getSelectedEmployee() !== null &&
          this.state.openMenu === null &&
          this.state.open === null && (
            <Modal
              backDrop={true}
              theme={Themes.default}
              close={() => this.setState({ selectedEmployee: null })}
              backDropClose={true}
              widthSizeClass={ModalSize.extraExtraLarge}
              marginTop={ModalMarginTop.none}
              displayClose={false}
              padding={{
                title: undefined,
                body: undefined,
                footer: undefined,
              }}
            >
              <EmployeeDetails
                employee={this.getSelectedEmployee()!}
                onClose={() => this.setState({ selectedEmployee: null })}
                activeEmployeePosition={this.employeeActivePosition(
                  this.getSelectedEmployee()!.positions
                )}
                employeeBehaviorPermission={isAccessAuthorized(
                  this.props.auth.selectedEmployment,
                  UserAccessList.EMPLOYEE_BEHAVIORS
                )}
                employeeCustomAccess={isAccessAuthorized(
                  this.props.auth.selectedEmployment,
                  UserAccessList.EMPLOYEES_LIST
                )}
              />
            </Modal>
          )}
        {this.state.openSelectUnit &&
          this.props.employee.employees !== null && (
            <Modal
              backDrop={true}
              theme={Themes.default}
              close={() => this.setState({ openSelectUnit: false })}
              backDropClose={true}
              widthSizeClass={ModalSize.extraLarge}
              displayClose={false}
              padding={{
                title: undefined,
                body: undefined,
                footer: undefined,
              }}
            >
              <SelectUnit
                positionsCounter={this.getEmployeesPositions()}
                onSelect={(unit: UnitInterface | null) =>
                  this.setState({ selectedUnit: unit, openSelectUnit: false })
                }
                onClose={() => this.setState({ openSelectUnit: false })}
              />
            </Modal>
          )}
        {this.state.openMenu !== null && this.state.open === null && (
          <Modal
            backDrop={true}
            theme={Themes.default}
            close={() => this.setState({ openMenu: null })}
            backDropClose={true}
            widthSizeClass={ModalSize.large}
            displayClose={false}
            padding={{
              title: undefined,
              body: undefined,
              footer: undefined,
            }}
          >
            <ActionMenu
              employee={this.state.openMenu}
              onGoBack={() =>
                this.setState({ openMenu: null, selectedEmployee: null })
              }
              onSelect={(action: EmployeeActionTypes) => {
                switch (action) {
                  case EmployeeActionTypes.DETAILS:
                    this.setState({
                      selectedEmployee: this.state.openMenu,
                      openMenu: null,
                    });
                    break;
                  default:
                    this.setState({
                      selectedEmployee: this.state.openMenu,
                      open: action,
                    });
                }
              }}
            />
          </Modal>
        )}
        {this.state.openMenu !== null &&
          this.state.open === EmployeeActionTypes.POSITIONS &&
          this.getSelectedEmployee() !== null && (
            <Modal
              backDrop={true}
              theme={Themes.default}
              close={() =>
                this.setState({
                  openMenu: null,
                  selectedEmployee: null,
                  open: null,
                })
              }
              backDropClose={true}
              widthSizeClass={ModalSize.extraLarge}
              displayClose={false}
              padding={{
                title: undefined,
                body: undefined,
                footer: undefined,
              }}
            >
              <EmployeePositions
                employee={this.state.openMenu}
                activeEmployeePosition={this.employeeActivePosition(
                  this.getSelectedEmployee()!.positions
                )}
                onClose={() =>
                  this.setState({
                    openMenu: null,
                    open: null,
                    selectedEmployee: null,
                  })
                }
              />
            </Modal>
          )}
      </Fragment>
    );
  }
}

const mapStateToProps = ({
  auth,
  system,
  employee,
  units,
}: StoreState): {
  auth: Auth;
  system: System;
  employee: EmployeeStore;
  units: UnitStore;
} => {
  return { auth, system, employee, units };
};

export const EmployeesManagement = connect(mapStateToProps, {
  FC_GetAllEmployees,
})(_EmployeesManagement);
