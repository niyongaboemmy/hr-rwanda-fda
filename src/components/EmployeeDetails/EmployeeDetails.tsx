import React, { Component } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { BsCheckCircle } from "react-icons/bs";
import { FaTrashAlt } from "react-icons/fa";
import { IoIosAddCircleOutline } from "react-icons/io";
import { MdClose } from "react-icons/md";
import { RiAdminFill, RiSettings2Line } from "react-icons/ri";
import { connect } from "react-redux";
import {
  AddEmployeeBehaviorDataInterface,
  BooleanEnum,
  EmployeeDetailsInterface,
  EmployeeListInterface,
  EmployeePositionItem,
  FC_GetAllUnits,
  FC_GetEmployeeDetails,
  FC_GetSystemAccessDetails,
  FC_RemoveEmployeeBehavior,
  GetPositionFormattedCompetency,
  PermissionInterface,
  PositionDetailsInterface,
  System,
  UnitStore,
} from "../../actions";
import { UserAccessInterface, UserAccessList } from "../../config/userAccess";
import { StoreState } from "../../reducers";
import AccessListTable from "../AccessListTable/AccessListTable";
import { AddEmployeeBehavior } from "../AddEmployeeBehavior/AddEmployeeBehavior";
import Alert, { AlertType } from "../Alert/Alert";
import CompetencyItemEvaluation, {
  ProficiencyLevelComponent,
} from "../CompetencyItem/CompetencyItemEvaluation";
import BackButton from "../Fragments/BackButton";
import { NoResultFound } from "../Fragments/NoResultFound";
import Loading from "../Loading/Loading";

interface EmployeeDetailsProps {
  employee: EmployeeListInterface;
  units: UnitStore;
  system: System;
  onClose?: () => void;
  FC_GetAllUnits: (callback: (loading: boolean, error: string) => void) => void;
  activeEmployeePosition: EmployeePositionItem | null;
  FC_GetEmployeeDetails: (
    user_id: string,
    callback: (
      loading: boolean,
      res: {
        res: EmployeeDetailsInterface | null;
        type: "success" | "error";
        msg: string;
      } | null
    ) => void
  ) => void;
  FC_GetSystemAccessDetails: (callback: (loading: boolean) => void) => void;
  FC_RemoveEmployeeBehavior: (
    user_behavior_id: string,
    callback: (loading: boolean, error: string) => void
  ) => void;
  employeeBehaviorPermission: PermissionInterface;
  employeeCustomAccess: PermissionInterface;
}
interface EmployeeDetailsState {
  loading: boolean;
  updatingPosition: boolean;
  loadingData: boolean;
  positionData: EmployeeDetailsInterface | null;
  error: string;
  success: string;
  loadingAccessNames: boolean;
  removing_behavior: string;
  actionReturn: "AddEmployeeBehavior" | "AddEmployeeCustomAccess" | null;
}

class _EmployeeDetails extends Component<
  EmployeeDetailsProps,
  EmployeeDetailsState
> {
  constructor(props: EmployeeDetailsProps) {
    super(props);

    this.state = {
      loading: false,
      updatingPosition: false,
      loadingData: false,
      positionData: null,
      error: "",
      loadingAccessNames: false,
      removing_behavior: "",
      success: "",
      actionReturn: null,
    };
  }
  getAccessName = (access_key: UserAccessList) => {
    if (this.props.system.access_details !== null) {
      const response = this.props.system.access_details.find(
        (itm) => itm.access_key === access_key
      );
      if (response !== undefined) {
        return response.access_name;
      }
    }
    return "Wait...";
  };
  getCustomAccessList = (): UserAccessInterface[] => {
    if (this.state.positionData === null) {
      return [];
    }
    var response: UserAccessInterface[] = [];
    for (const item of this.state.positionData.employee_custom_access) {
      for (const res of item.access) {
        if (response.find((itm) => itm.key === res.key) === undefined) {
          response.push(res);
        }
      }
    }
    return response;
  };
  removeEmployeeBehavior = (
    user_behavior_id: string,
    behavior_name: string
  ) => {
    if (
      window.confirm(
        "Are you sure do you want to remove this behavior " +
          behavior_name +
          "?"
      ) === true
    ) {
      this.setState({ removing_behavior: user_behavior_id });
      this.props.FC_RemoveEmployeeBehavior(
        user_behavior_id,
        (loading: boolean, error: string) => {
          this.setState({
            removing_behavior: loading === true ? user_behavior_id : "",
            error: error,
          });
          if (
            error === "" &&
            loading === false &&
            this.state.positionData !== null
          ) {
            this.setState({
              positionData: {
                employee_behavior:
                  this.state.positionData.employee_behavior.filter(
                    (itm) =>
                      itm.user_behavior_id.toString() !==
                      user_behavior_id.toString()
                  ),
                employee_custom_access:
                  this.state.positionData.employee_custom_access,
                positions: this.state.positionData.positions,
              },
              success: "Employee behavior has removed successfully!",
            });
          }
        }
      );
    }
  };
  LoadEmployeeDetails = () => {
    this.props.FC_GetEmployeeDetails(
      this.props.employee.user_id,
      (
        loading: boolean,
        res: {
          res: EmployeeDetailsInterface | null;
          type: "success" | "error";
          msg: string;
        } | null
      ) => {
        this.setState({ loadingData: loading });
        if (res?.type === "success") {
          this.setState({
            positionData: res.res,
            loadingData: false,
            error: "",
          });
        }
        if (res?.type === "error") {
          this.setState({
            positionData: null,
            loadingData: false,
            error: res.msg,
          });
        }
      }
    );
  };
  componentDidMount(): void {
    if (this.props.units.units === null) {
      this.setState({ loading: true });
      this.props.FC_GetAllUnits((loading: boolean, error: string) =>
        this.setState({ loading: loading })
      );
    }
    if (this.state.positionData === null) {
      this.LoadEmployeeDetails();
    }
    if (this.props.system.access_details === null) {
      this.setState({ loadingAccessNames: true });
      this.props.FC_GetSystemAccessDetails((loading: boolean) =>
        this.setState({ loadingAccessNames: loading })
      );
    }
  }
  render() {
    const selectedActivePositionDetails: PositionDetailsInterface | undefined =
      this.state.positionData === null
        ? undefined
        : this.state.positionData.positions.find(
            (itm) =>
              this.props.activeEmployeePosition !== null &&
              itm.position_id.toString() ===
                this.props.activeEmployeePosition.position_id.toString()
          );
    if (this.state.actionReturn === "AddEmployeeBehavior") {
      return (
        <div>
          <AddEmployeeBehavior
            onCancel={() => this.setState({ actionReturn: null })}
            onCreated={(data: AddEmployeeBehaviorDataInterface) =>
              this.LoadEmployeeDetails()
            }
          />
        </div>
      );
    }
    if (this.state.actionReturn === "AddEmployeeCustomAccess") {
      return <div>{/* Continue here */}</div>;
    }
    return (
      <div>
        <div className="flex flex-row items-center justify-between gap-3 px-3 py-3 border-b">
          <div className="flex flex-row items-center gap-3">
            {this.props.onClose !== undefined && (
              <div>
                <BackButton
                  title="Back"
                  className="bg-primary-100 text-primary-800 hover:bg-primary-800 hover:text-white font-semibold"
                  onClick={this.props.onClose}
                />
              </div>
            )}
            <div>
              <div className="font-bold text-lg">
                {this.props.employee.first_name} {this.props.employee.last_name}
              </div>
              <div className="text-sm text-gray-600">
                {this.props.activeEmployeePosition?.position_name}
              </div>
            </div>
          </div>
          {this.props.onClose !== undefined && (
            <div onClick={this.props.onClose} className="mr-2">
              <MdClose className="text-2xl hover:text-red-600 cursor-pointer" />
            </div>
          )}
        </div>
        {/* Details */}
        {this.state.loading === true || this.props.units.units === undefined ? (
          <div className="pt-6 px-4">
            <Loading />
          </div>
        ) : (
          <div
            className="pt-4 px-2 md:px-4 overflow-y-auto"
            style={{ height: "calc(100vh - 80px)" }}
          >
            {this.state.error !== "" && (
              <div className="mb-3">
                <Alert
                  alertType={AlertType.DANGER}
                  title={this.state.error}
                  close={() => this.setState({ error: "" })}
                />
              </div>
            )}
            {this.state.success !== "" && (
              <div className="mb-3">
                <Alert
                  alertType={AlertType.SUCCESS}
                  title={this.state.success}
                  close={() => this.setState({ error: "" })}
                />
              </div>
            )}
            <div className="grid grid-cols-12 gap-4 mb-6 w-full animate__animated animate__fadeIn">
              <div className="col-span-12 md:col-span-6 h-full">
                <div className="border border-primary-300 rounded-md p-3 px-4 h-full">
                  <div className="">
                    <div className="font-bold text-lg mb-4">
                      Personal Information
                    </div>
                    <div className="grid grid-cols-12 gap-3 w-full">
                      <div className="col-span-12 lg:col-span-6 flex flex-col">
                        <span className="text-sm text-gray-500">
                          First name
                        </span>
                        <span className="font-semibold">
                          {this.props.employee.first_name}
                        </span>
                      </div>
                      <div className="col-span-12 lg:col-span-6 flex flex-col">
                        <span className="text-sm text-gray-500">Last name</span>
                        <span className="font-semibold">
                          {this.props.employee.last_name}
                        </span>
                      </div>
                      <div className="col-span-12 lg:col-span-6 flex flex-col">
                        <span className="text-sm text-gray-500">
                          {this.props.employee.nid_number === null
                            ? "Passport"
                            : "NID"}
                        </span>
                        <span className="font-semibold">
                          {this.props.employee.nid_number === null
                            ? this.props.employee.passport_number
                            : this.props.employee.nid_number}
                        </span>
                      </div>
                      <div className="col-span-12 lg:col-span-6 flex flex-col">
                        <span className="text-sm text-gray-500">Gender</span>
                        <span className="font-semibold">
                          {this.props.employee.gender}
                        </span>
                      </div>
                      <div className="col-span-12 lg:col-span-6 flex flex-col">
                        <span className="text-sm text-gray-500">
                          Date of birth
                        </span>
                        <span className="font-semibold">
                          {this.props.employee.dob}
                        </span>
                      </div>
                      <div className="col-span-12 lg:col-span-6 flex flex-col">
                        <span className="text-sm text-gray-500">
                          Martial status
                        </span>
                        <span className="font-semibold">
                          {this.props.employee.martial_status}
                        </span>
                      </div>
                      <div className="col-span-12 lg:col-span-6 flex flex-col">
                        <span className="text-sm text-gray-500">
                          Phone number
                        </span>
                        <span className="font-semibold">
                          {this.props.employee.phone_number}
                        </span>
                      </div>
                      <div className="col-span-12 lg:col-span-6 flex flex-col">
                        <span className="text-sm text-gray-500">Email</span>
                        <span className="font-semibold">
                          {this.props.employee.email}
                        </span>
                      </div>
                      <div className="col-span-12 lg:col-span-6 flex flex-col">
                        <span className="text-sm text-gray-500">Residence</span>
                        <span className="font-semibold">
                          {this.props.employee.residence}
                        </span>
                      </div>
                      {this.state.positionData !== null &&
                        this.state.positionData.employee_custom_access.length >
                          0 && (
                          <div className="col-span-12 lg:col-span-12 flex flex-col pt-4">
                            <div className="flex flex-row items-center gap-2 mb-2">
                              <div>
                                <RiSettings2Line className="text-2xl text-yellow-600" />
                              </div>
                              <div className="text-gray-600">
                                Employee custom access
                              </div>
                            </div>
                            <div>
                              {this.state.positionData.employee_custom_access
                                .length === 0 ? (
                                <NoResultFound />
                              ) : (
                                <div className="w-full overflow-x-auto">
                                  {this.state.loadingAccessNames === true ? (
                                    <Loading />
                                  ) : (
                                    <AccessListTable
                                      access={this.getCustomAccessList()}
                                      getAccessName={this.getAccessName}
                                      size={"small"}
                                    />
                                  )}
                                </div>
                              )}
                              {this.props.employeeCustomAccess.create ===
                                true && (
                                <div className="bg-primary-50 text-primary-800 px-3 pl-2 py-2 w-full flex flex-row items-center gap-2 rounded text-base cursor-pointer hover:bg-primary-100 hover:text-primary-900 mt-3 group">
                                  <div>
                                    <IoIosAddCircleOutline className="text-2xl text-primary-700" />
                                  </div>
                                  <span>Add custom access</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 h-full">
                <div className="border border-primary-300 rounded-md p-3 px-4 h-full">
                  {this.state.loadingData === true ? (
                    <div className="flex flex-col items-center justify-center w-full text-center">
                      {/* <div className="my-3">
                        <AiOutlineLoading3Quarters className="text-6xl text-yellow-500 animate-spin" />
                      </div>
                      <div className="font-light text-lg">Loading...</div> */}
                      <Loading />
                    </div>
                  ) : (
                    <div>
                      <div className="flex flex-row gap-3 justify-between mb-3">
                        <div className="font-bold text-lg">
                          Position details
                        </div>
                        <div>
                          <div className="flex flex-row items-center gap-2">
                            <div className="bg-yellow-100 border border-yellow-200 rounded h-10 w-10 flex items-center justify-center">
                              <RiAdminFill className="text-2xl" />
                            </div>
                            <div>
                              <div className="text-sm text-gray-500">
                                Employee Status
                              </div>
                              <div className="font-bold text-sm">
                                {this.props.activeEmployeePosition
                                  ?.is_line_manager === BooleanEnum.TRUE
                                  ? "Line Manager"
                                  : "Normal position"}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="grid grid-cols-12 gap-3 w-full">
                          <div className="col-span-12 lg:col-span-6 flex flex-col">
                            <span className="text-sm text-gray-500">
                              Position name
                            </span>
                            <span className="font-semibold">
                              {this.props.activeEmployeePosition?.position_name}
                            </span>
                          </div>
                          <div className="col-span-12 lg:col-span-6 flex flex-col">
                            <span className="text-sm text-gray-500">Unit</span>
                            <span className="font-semibold">
                              {this.props.activeEmployeePosition?.unit_name}
                            </span>
                          </div>
                          <div className="col-span-12 lg:col-span-6 flex flex-col">
                            <span className="text-sm text-gray-500">
                              Reporting Unit
                            </span>
                            <span className="font-semibold">{"Missing"}</span>
                          </div>
                          <div className="col-span-12 lg:col-span-6 flex flex-col">
                            <span className="text-sm text-gray-500">
                              Position ownership
                            </span>
                            <span className="font-semibold">
                              {this.props.activeEmployeePosition?.is_acting ===
                              BooleanEnum.TRUE
                                ? "Acting on this position"
                                : "Position owner"}
                            </span>
                          </div>
                          <div className="col-span-12 lg:col-span-12 flex flex-col pt-4">
                            <div className="flex flex-row items-center gap-2 mb-2">
                              <div>
                                <RiSettings2Line className="text-2xl text-yellow-600" />
                              </div>
                              <div className="text-gray-600">
                                Position access
                              </div>
                            </div>
                            <div>
                              {selectedActivePositionDetails === undefined ? (
                                <div>Not defined</div>
                              ) : selectedActivePositionDetails.access
                                  .length === 0 ? (
                                <NoResultFound />
                              ) : (
                                <div className="w-full overflow-x-auto">
                                  {this.state.loadingAccessNames === true ? (
                                    <Loading />
                                  ) : (
                                    <AccessListTable
                                      access={
                                        selectedActivePositionDetails.access
                                      }
                                      getAccessName={this.getAccessName}
                                      size={"small"}
                                    />
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 h-full">
                <div className="border border-primary-300 rounded-md p-3 px-4 h-full">
                  {this.state.loadingData === true ? (
                    <div className="flex flex-col items-center justify-center w-full text-center">
                      <Loading />
                    </div>
                  ) : (
                    <div>
                      <div className="flex flex-row gap-3 justify-between mb-4">
                        <div className="font-bold text-lg">
                          Employee behaviors
                        </div>
                        <div></div>
                      </div>
                      {/* Content */}
                      <div>
                        {this.state.positionData === null ? (
                          <div></div>
                        ) : this.state.positionData.employee_behavior.length ===
                          0 ? (
                          <NoResultFound title="No behaviors added" />
                        ) : (
                          this.state.positionData.employee_behavior.map(
                            (behavior, b) => (
                              <div
                                key={b + 1}
                                className="flex flex-row items-center justify-between gap-3 w-full text-sm mb-2 group"
                              >
                                <div className="flex flex-row items-center gap-2">
                                  <div>
                                    <BsCheckCircle className="text-2xl text-primary-700" />
                                  </div>
                                  <div className="">
                                    {behavior.behavior_name}
                                  </div>
                                </div>
                                <div className="flex flex-row items-center justify-end gap-2">
                                  <ProficiencyLevelComponent
                                    proficiency_level_id={
                                      behavior.proficiency_level_id
                                    }
                                    proficiency_name={
                                      behavior.proficiency_level
                                    }
                                  />
                                  {this.props.employeeBehaviorPermission
                                    .delete === true && (
                                    <div>
                                      {this.state.removing_behavior ===
                                      behavior.user_behavior_id ? (
                                        <div>
                                          <AiOutlineLoading3Quarters className="animate-spin text-3xl text-yellow-500" />
                                        </div>
                                      ) : (
                                        <div
                                          title="Click to remove this behavior"
                                          className="flex items-center justify-center h-9 w-9 rounded-full bg-red-50 group-hover:bg-red-100 cursor-pointer"
                                          onClick={() =>
                                            this.removeEmployeeBehavior(
                                              behavior.user_behavior_id,
                                              behavior.behavior_name
                                            )
                                          }
                                        >
                                          <FaTrashAlt className="text-xl text-red-600" />
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )
                          )
                        )}
                        {this.props.employeeBehaviorPermission.create ===
                          true && (
                          <div
                            onClick={() =>
                              this.setState({
                                actionReturn: "AddEmployeeBehavior",
                              })
                            }
                            className="bg-primary-50 text-primary-800 px-3 pl-2 py-2 w-full flex flex-row items-center gap-2 rounded text-base cursor-pointer hover:bg-primary-100 hover:text-primary-900 mt-3 group"
                          >
                            <div>
                              <IoIosAddCircleOutline className="text-2xl text-primary-700" />
                            </div>
                            <span>Add behavior</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 h-full">
                <div className="border border-primary-300 rounded-md p-3 px-4 h-full">
                  {this.state.loadingData === true ? (
                    <div className="flex flex-col items-center justify-center w-full text-center">
                      <Loading />
                    </div>
                  ) : (
                    <div>
                      <div className="flex flex-row gap-3 justify-between mb-2">
                        <div className="font-bold text-lg">
                          Position competency benchmarking
                        </div>
                        <div></div>
                      </div>
                      {/* Content */}
                      <div>
                        {this.state.positionData === null ? (
                          <div></div>
                        ) : this.state.positionData.positions.filter(
                            (itm) =>
                              this.props.activeEmployeePosition !== null &&
                              itm.position_id.toString() ===
                                this.props.activeEmployeePosition.position_id.toString()
                          ).length === 0 ? (
                          <NoResultFound title="No behaviors added" />
                        ) : (
                          GetPositionFormattedCompetency(
                            this.state.positionData.positions.filter(
                              (itm) =>
                                this.props.activeEmployeePosition !== null &&
                                itm.position_id.toString() ===
                                  this.props.activeEmployeePosition.position_id.toString()
                            )[0].competencies
                          ).map((competency, c) => (
                            <CompetencyItemEvaluation
                              key={c + 1}
                              competency={competency}
                              employee_behaviors={
                                this.state.positionData === null
                                  ? []
                                  : this.state.positionData.employee_behavior
                              }
                            />
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="col-span-12 md:col-span-12 h-full">
                <div className="border border-primary-300 rounded-md p-3 px-4 h-full">
                  {this.state.loadingData === true ? (
                    <div className="flex flex-col items-center justify-center w-full text-center">
                      <Loading />
                    </div>
                  ) : (
                    <div>
                      <div className="flex flex-row gap-3 justify-between mb-2">
                        <div className="font-bold text-lg">
                          Employee capacity building (trainings)
                        </div>
                        <div></div>
                      </div>
                      {/* Content */}
                      <div>
                        <NoResultFound
                          title="No data available"
                          description="There are no data available for employee trainings"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="col-span-12 md:col-span-12 h-full">
                <div className="border border-primary-300 rounded-md p-3 px-4 h-full">
                  {this.state.loadingData === true ? (
                    <div className="flex flex-col items-center justify-center w-full text-center">
                      <Loading />
                    </div>
                  ) : (
                    <div>
                      <div className="flex flex-row gap-3 justify-between mb-2">
                        <div className="font-bold text-lg">Employee leave</div>
                        <div></div>
                      </div>
                      {/* Content */}
                      <div>
                        <NoResultFound
                          title="No data available"
                          description="There are no data available for employee leave"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="col-span-12 md:col-span-12 h-full">
                <div className="border border-primary-300 rounded-md p-3 px-4 h-full">
                  {this.state.loadingData === true ? (
                    <div className="flex flex-col items-center justify-center w-full text-center">
                      <Loading />
                    </div>
                  ) : (
                    <div>
                      <div className="flex flex-row gap-3 justify-between mb-2">
                        <div className="font-bold text-lg">
                          Employee travels
                        </div>
                        <div></div>
                      </div>
                      {/* Content */}
                      <div>
                        <NoResultFound
                          title="No data available"
                          description="There are no data available for employee travels"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = ({
  units,
  system,
}: StoreState): {
  units: UnitStore;
  system: System;
} => {
  return { units, system };
};

export const EmployeeDetails = connect(mapStateToProps, {
  FC_GetAllUnits,
  FC_GetEmployeeDetails,
  FC_GetSystemAccessDetails,
  FC_RemoveEmployeeBehavior,
})(_EmployeeDetails);
