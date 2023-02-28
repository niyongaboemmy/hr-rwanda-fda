import React, { Component } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { HiOutlineSelector } from "react-icons/hi";
import { connect } from "react-redux";
import {
  AddEmployeeBehaviorDataInterface,
  BehaviorItemInterface,
  EmployeeListInterface,
  FC_AddEmployeeBehavior,
  FC_GetSystemBehaviorsListDetails,
  FC_GetSystemInfo,
  System,
} from "../../actions";
import { StoreState } from "../../reducers";
import Alert, { AlertType } from "../Alert/Alert";
import BackButton from "../Fragments/BackButton";
import Loading from "../Loading/Loading";
import SelectCustom from "../SelectCustom/SelectCustom";

interface AddEmployeeBehaviorProps {
  employee: EmployeeListInterface;
  system: System;
  FC_AddEmployeeBehavior: (
    data: AddEmployeeBehaviorDataInterface,
    callback: (loading: boolean, error: string) => void
  ) => void;
  FC_GetSystemBehaviorsListDetails: (
    callback: (loading: boolean) => void
  ) => void;
  FC_GetSystemInfo: (callback: (loading: boolean) => void) => void;
  onCancel?: () => void;
  onCreated: (data: AddEmployeeBehaviorDataInterface) => void;
}
interface AddEmployeeBehaviorState {
  loading: boolean;
  openSelectBehavior: boolean;
  selectedBehavior: BehaviorItemInterface | null;
  loadingBasicData: boolean;
  proficiency_level_id: string;
  assignment_comment: string;
  error: string;
  success: string;
  saving_data: boolean;
}

class _AddEmployeeBehavior extends Component<
  AddEmployeeBehaviorProps,
  AddEmployeeBehaviorState
> {
  constructor(props: AddEmployeeBehaviorProps) {
    super(props);

    this.state = {
      loading: false,
      openSelectBehavior: true,
      selectedBehavior: null,
      loadingBasicData: false,
      proficiency_level_id: "",
      assignment_comment: "",
      error: "",
      success: "",
      saving_data: false,
    };
  }
  GetBasicInfo = () => {
    this.setState({ loadingBasicData: true });
    this.props.FC_GetSystemInfo((loading: boolean) =>
      this.setState({ loadingBasicData: loading })
    );
  };
  AddEmployeeBehaviorData = () => {
    if (this.state.selectedBehavior === null) {
      return this.setState({ error: "Please select behavior!" });
    }
    if (this.state.proficiency_level_id === "") {
      return this.setState({ error: "Please select proficiency level!" });
    }
    this.setState({ saving_data: true });
    this.props.FC_AddEmployeeBehavior(
      {
        assignment_comment: this.state.assignment_comment,
        behavior_id: this.state.selectedBehavior.behavior_id,
        proficiency_level_id: this.state.proficiency_level_id,
        user_id: this.props.employee.user_id,
      },
      (loading: boolean, error: string) => {
        this.setState({ saving_data: loading, error: error });
        if (
          loading === false &&
          error === "" &&
          this.state.selectedBehavior !== null
        ) {
          this.props.onCreated({
            assignment_comment: this.state.assignment_comment,
            behavior_id: this.state.selectedBehavior.behavior_id,
            proficiency_level_id: this.state.proficiency_level_id,
            user_id: this.props.employee.user_id,
          });
          this.setState({
            success: "Behavior saved successfully!",
            assignment_comment: "",
            proficiency_level_id: "",
            selectedBehavior: null,
          });
        }
      }
    );
  };
  componentDidMount(): void {
    if (
      this.props.system.basic_info === null ||
      this.props.system.basic_info.behavior.length === 0
    ) {
      this.setState({ loading: true });
      this.props.FC_GetSystemBehaviorsListDetails((loading: boolean) =>
        this.setState({ loading: loading })
      );
    }
  }
  render() {
    return (
      <div>
        <div className="bg-white rounded-md p-3 md:p-6">
          <div className="flex flex-row items-center gap-2">
            <div>
              <BackButton
                title="Go Back"
                className="bg-primary-100 text-primary-800 hover:bg-primary-800 hover:text-white"
                onClick={this.props.onCancel}
              />
            </div>
            <div>
              <div className="flex flex-row items-center gap-2">
                <div className="font-bold text-xl">
                  Assign employee behavior
                </div>
                <div className="w-max px-2 rounded-full text-sm font-bold bg-primary-800 text-white">
                  {this.props.employee.first_name}{" "}
                  {this.props.employee.last_name}
                </div>
              </div>
              <div className="text-sm text-gray-500">
                Fill the following form to update employee behavior to update
                his/her position competency
              </div>
            </div>
          </div>
          <div className="mt-3">
            {this.state.loading === true ||
            this.props.system.basic_info === null ||
            this.props.system.basic_info.behavior.length === 0 ? (
              <div className="border rounded-md p-6">
                <Loading />
              </div>
            ) : (
              <div className="w-full">
                <div className="flex flex-col mb-2">
                  <div>Choose behavior</div>
                  <div
                    className={`px-3 py-2 pr-1 rounded-md border w-full flex flex-row items-center justify-between gap-3 cursor-pointer hover:border-primary-700 ${
                      this.state.selectedBehavior !== null
                        ? "text-primary-900 border-primary-700"
                        : "text-gray-500 border-gray-400"
                    }`}
                    onClick={() =>
                      this.setState({
                        openSelectBehavior: !this.state.openSelectBehavior,
                      })
                    }
                  >
                    <div>
                      {this.state.selectedBehavior == null
                        ? "Click to select behavior"
                        : this.state.selectedBehavior.behavior_name}
                    </div>
                    <div>
                      <HiOutlineSelector className="text-2xl" />
                    </div>
                  </div>
                </div>
                {this.state.openSelectBehavior === true &&
                  this.state.saving_data === false && (
                    <div className="w-full">
                      <SelectCustom
                        loading={false}
                        id={"behavior_id"}
                        title={"behavior_name"}
                        close={() =>
                          this.setState({ openSelectBehavior: false })
                        }
                        data={this.props.system.basic_info.behavior}
                        click={(data: {
                          behavior_id: string;
                          behavior_name: string;
                        }) => {
                          this.setState({
                            selectedBehavior: data,
                            openSelectBehavior: false,
                          });
                          if (
                            this.props.system.basic_info === null ||
                            this.props.system.basic_info.proficiency_level
                              .length === 0
                          ) {
                            this.GetBasicInfo();
                          }
                        }}
                      />
                    </div>
                  )}
                <div className="flex flex-col mb-3 mt-4">
                  <div>Comment for selected behavior (optional)</div>
                  <textarea
                    value={this.state.assignment_comment}
                    onChange={(e) =>
                      this.setState({
                        assignment_comment: e.target.value,
                        error: "",
                      })
                    }
                    disabled={this.state.saving_data}
                    className="border border-gray-300 px-3 py-2 rounded-md w-full bg-gray-100"
                  />
                </div>
                {this.state.loadingBasicData === true ? (
                  <div className="border mb-3 rounded-md pt-3">
                    <Loading />
                    <div className="text-yellow-600 font-light px-3 pb-3 -mt-8 animate__animated animate__fadeIn animate__infinite">
                      Loading proficiency levels...
                    </div>
                  </div>
                ) : (
                  this.props.system.basic_info.proficiency_level.length > 0 && (
                    <div className="flex flex-col mb-3">
                      <div>Choose proficiency level</div>
                      <select
                        value={this.state.proficiency_level_id}
                        onChange={(e) =>
                          this.setState({
                            proficiency_level_id: e.target.value,
                          })
                        }
                        className="px-3 py-2 rounded-md border border-yellow-600 w-full"
                        disabled={this.state.saving_data}
                      >
                        <option value="">Choose proficiency level</option>
                        {this.props.system.basic_info.proficiency_level.map(
                          (proficiency, p) => (
                            <option
                              key={p + 1}
                              value={proficiency.proficiency_level_id}
                            >
                              {proficiency.proficiency_level}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                  )
                )}
                {this.state.success !== "" && (
                  <div className="my-3">
                    <Alert
                      alertType={AlertType.SUCCESS}
                      title={this.state.success}
                      close={() => this.setState({ error: "", success: "" })}
                    />
                  </div>
                )}
                {this.state.error !== "" && (
                  <div className="my-3">
                    <Alert
                      alertType={AlertType.DANGER}
                      title={this.state.error}
                      close={() => this.setState({ error: "", success: "" })}
                    />
                  </div>
                )}
                {this.state.saving_data === false ? (
                  <div className="flex flex-row items-center justify-end gap-3">
                    <div
                      onClick={this.props.onCancel}
                      className="px-4 py-2 rounded-md font-semibold w-max cursor-pointer bg-gray-100 text-black hover:text-white hover:bg-gray-500"
                    >
                      Cancel action
                    </div>
                    <div
                      onClick={() => this.AddEmployeeBehaviorData()}
                      className="px-4 py-2 rounded-md font-semibold w-max cursor-pointer bg-primary-800 text-white hover:bg-primary-800"
                    >
                      Save changes
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-100 rounded-md p-6 flex flex-col items-center justify-center w-full text-center">
                    <div>
                      <AiOutlineLoading3Quarters className="text-5xl animate-spin text-yellow-500" />
                    </div>
                    <div className="animate__animated animate__fadeIn animate__infinite text-lg font-light">
                      Saving changes, please wait...
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({
  system,
}: StoreState): {
  system: System;
} => {
  return { system };
};

export const AddEmployeeBehavior = connect(mapStateToProps, {
  FC_AddEmployeeBehavior,
  FC_GetSystemBehaviorsListDetails,
  FC_GetSystemInfo,
})(_AddEmployeeBehavior);
