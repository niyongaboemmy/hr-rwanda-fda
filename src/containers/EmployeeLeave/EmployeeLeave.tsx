import React, { Component, Fragment } from "react";
import { BsFilterCircle } from "react-icons/bs";
import { IoIosAddCircleOutline, IoMdRefreshCircle } from "react-icons/io";
import { MdDirectionsWalk, MdOutlineKeyboardArrowDown } from "react-icons/md";
import { connect } from "react-redux";
import {
  Auth,
  EmployeeLeaveInterface,
  FC_GetEmployeeLeaves,
  FC_RemoveEmployeeLeave,
  LeaveStore,
  UnitInterface,
} from "../../actions";
import Alert, { AlertType } from "../../components/Alert/Alert";
import SearchInput from "../../components/Fragments/SearchInput";
import ExportToExcel from "../../components/GenerateReport/ExportToExcel";
import MainContainer from "../../components/MainContainer/MainContainer";
import Modal, { ModalSize, Themes } from "../../components/Modal/Modal";
import { PositionItemLoading } from "../../components/PositionItem/PositionItemLoading";
import { RequestLeave } from "../../components/RequestLeave/RequestLeave";
import { SelectUnit } from "../../components/SelectUnit/SelectUnit";
import { StoreState } from "../../reducers";
import { commaFy, search } from "../../utils/functions";
import { EmployeeLeavesList } from "./EmployeeLeavesList";

interface EmployeeLeavesProps {
  auth: Auth;
  leave: LeaveStore;
  FC_GetEmployeeLeaves: (
    user_id: string,
    callback: (loading: boolean, error: string) => void
  ) => void;
  FC_RemoveEmployeeLeave: (
    employee_leave_id: string,
    callback: (
      loading: boolean,
      res: { type: "success" | "error"; msg: string } | null
    ) => void
  ) => void;
}
interface EmployeeLeavesState {
  loading: boolean;
  tabs: "SUMMARY" | "EMPLOYEE_LEAVES";
  selectedUnit: UnitInterface | null;
  searchData: string;
  mainError: string;
  openSelectUnit: boolean;
  selectedYear: number;
  removingLeave: EmployeeLeaveInterface | null;
  requestLeave: boolean;
  error: string;
}

class _EmployeeLeaves extends Component<
  EmployeeLeavesProps,
  EmployeeLeavesState
> {
  constructor(props: EmployeeLeavesProps) {
    super(props);

    this.state = {
      loading: false,
      tabs: "EMPLOYEE_LEAVES",
      selectedUnit: null,
      searchData: "",
      mainError: "",
      openSelectUnit: false,
      selectedYear: new Date().getFullYear(),
      removingLeave: null,
      requestLeave: false,
      error: "",
    };
  }
  FilteredData = () => {
    if (this.props.leave.employee_leaves === null) {
      return [];
    }
    var response = this.props.leave.employee_leaves;
    if (this.state.selectedUnit !== null) {
      response = response.filter(
        (itm) =>
          this.state.selectedUnit !== null &&
          itm.unit_id.toString() === this.state.selectedUnit.unit_id.toString()
      );
    }
    return search(response, this.state.searchData) as EmployeeLeaveInterface[];
  };
  GetEmployeeLeave = () => {
    this.setState({ loading: true });
    this.props.auth.user !== null &&
      this.props.FC_GetEmployeeLeaves(
        this.props.auth.user.user_id,
        (loading: boolean, error: string) => {
          this.setState({ loading: loading, mainError: error });
        }
      );
  };

  RemoveLeave = (selectedLeave: EmployeeLeaveInterface) => {
    if (
      window.confirm(
        "Are you sure do you want to remove " + selectedLeave.leave_name + "?"
      ) === true
    ) {
      this.props.FC_RemoveEmployeeLeave(
        selectedLeave.employee_leave_id,
        (
          loading: boolean,
          res: { type: "success" | "error"; msg: string } | null
        ) => {
          if (res?.type === "success" && loading === false) {
            this.setState({ removingLeave: null });
          }
          if (res?.type === "error") {
            this.setState({ removingLeave: null, error: res.msg });
          }
        }
      );
    } else {
      this.setState({ removingLeave: null });
    }
  };

  componentDidMount(): void {
    if (this.props.leave.employee_leaves === null) {
      this.GetEmployeeLeave();
    }
  }
  render() {
    return (
      <Fragment>
        <div className="pt-3">
          <div className="flex flex-row items-center justify-between gap-2 w-full pl-2">
            <div className="flex flex-row items-center gap-3">
              <div>
                <MdDirectionsWalk className="text-5xl text-gray-400" />
              </div>
              <div>
                <div className="text-xl font-bold truncate">{"My leaves"}</div>
                <div className="text-sm text-gray-600 truncate">
                  {"List of leaves that I requested"}
                </div>
              </div>
            </div>
            {/* Right side */}
            {
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
                        Search by Units
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
                    title="Reset to view back all of the list"
                    className=" rounded-full flex items-center justify-center text-yellow-600 hover:text-yellow-700 cursor-pointer"
                  >
                    <IoMdRefreshCircle className="text-4xl bg-white rounded-full" />
                  </div>
                )}
                <div className="flex flex-col">
                  <div className="text-sm text-gray-600 truncate">
                    Total leaves
                  </div>
                  <div className="font-bold text-xl -mt-1">
                    {commaFy(this.FilteredData().length)}
                  </div>
                </div>
                <div
                  onClick={() => this.setState({ requestLeave: true })}
                  className="px-3 py-2 pl-2 rounded-md bg-primary-800 text-white hover:bg-primary-900 cursor-pointer w-max font-semibold flex flex-row items-center gap-2 justify-center"
                >
                  <IoIosAddCircleOutline className="text-2xl" />
                  <span>Request leave</span>
                </div>
              </div>
            }
          </div>
          {/* Body */}
          {this.state.loading === true ||
          this.props.leave.employee_leaves === null ? (
            <div className="mt-8 bg-white rounded-md p-3">
              <div>
                {[1, 2, 3, 4, 5].map((item, i) => (
                  <PositionItemLoading key={i + 1} className="animate-pulse" />
                ))}
              </div>
            </div>
          ) : (
            <MainContainer className="mt-3">
              <div className="mb-3">
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
                        onClick={() =>
                          this.setState({ tabs: "EMPLOYEE_LEAVES" })
                        }
                        className={`px-6 py-2 border-b-2 ${
                          this.state.tabs === "EMPLOYEE_LEAVES"
                            ? "border-primary-700 text-primary-800 animate__animated animate__fadeIn"
                            : "border-white hover:border-primary-700 hover:text-primary-800"
                        } cursor-pointer`}
                      >
                        Leaves
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
                      fileData={this.props.leave.employee_leaves}
                      fileName={"Employee leaves report"}
                    />
                  </div>
                </div>
              </div>
              {this.state.mainError !== "" && (
                <div className="py-3">
                  <Alert
                    alertType={AlertType.DANGER}
                    title={this.state.mainError}
                    close={() => this.setState({ mainError: "" })}
                  />
                </div>
              )}
              {this.state.tabs === "EMPLOYEE_LEAVES" && (
                <EmployeeLeavesList
                  allowed_to_validate={false}
                  leaves={this.FilteredData()}
                  RemoveLeave={this.RemoveLeave}
                  removingLeave={this.state.removingLeave}
                  setRemovingItem={(item: EmployeeLeaveInterface) =>
                    this.setState({ removingLeave: item })
                  }
                />
              )}
            </MainContainer>
          )}
        </div>

        {this.state.openSelectUnit && (
          //  this.props.training.EMPLOYEE_LEAVES !== null &&
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
              positionsCounter={[]}
              onSelect={(unit: UnitInterface | null) =>
                this.setState({ selectedUnit: unit, openSelectUnit: false })
              }
              onClose={() => this.setState({ openSelectUnit: false })}
            />
          </Modal>
        )}
        {this.state.requestLeave === true && (
          <Modal
            backDrop={true}
            theme={Themes.default}
            close={() => this.setState({ requestLeave: false })}
            backDropClose={true}
            widthSizeClass={ModalSize.extraLarge}
            displayClose={false}
            padding={{
              title: undefined,
              body: undefined,
              footer: undefined,
            }}
          >
            <RequestLeave
              onGoBack={() => this.setState({ requestLeave: false })}
              onCreated={() => {
                this.setState({ requestLeave: false });
                this.GetEmployeeLeave();
              }}
            />
          </Modal>
        )}
      </Fragment>
    );
  }
}

const mapStateToProps = ({
  auth,
  leave,
}: StoreState): {
  auth: Auth;
  leave: LeaveStore;
} => {
  return { auth, leave };
};

export const EmployeeLeaves = connect(mapStateToProps, {
  FC_GetEmployeeLeaves,
  FC_RemoveEmployeeLeave,
})(_EmployeeLeaves);
