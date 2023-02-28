import React, { Component } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { HiOutlineSelector } from "react-icons/hi";
import { connect } from "react-redux";
import {
  AccessListDetails,
  EmployeeCustomAccessDataInterface,
  EmployeeListInterface,
  FC_AddEmployeeCustomAccess,
  FC_GetSystemAccessDetails,
  System,
} from "../../actions";
import { UserAccessInterface, UserAccessList } from "../../config/userAccess";
import { StoreState } from "../../reducers";
import Alert, { AlertType } from "../Alert/Alert";
import BackButton from "../Fragments/BackButton";
import { NoResultFound } from "../Fragments/NoResultFound";
import Loading from "../Loading/Loading";
import SelectCustom from "../SelectCustom/SelectCustom";
import Switch from "../Switch/Switch";
import { MdAdminPanelSettings, MdDoNotDisturbAlt } from "react-icons/md";
import { BsCheckCircleFill } from "react-icons/bs";
import AccessListTable from "../AccessListTable/AccessListTable";

interface AddEmployeeCustomAccessProps {
  employee: EmployeeListInterface;
  system: System;
  FC_AddEmployeeCustomAccess: (
    data: EmployeeCustomAccessDataInterface,
    callback: (loading: boolean, error: string) => void
  ) => void;
  FC_GetSystemAccessDetails: (callback: (loading: boolean) => void) => void;
  onCancel?: () => void;
  onCreated: (data: EmployeeCustomAccessDataInterface) => void;
}
interface AddEmployeeCustomAccessState {
  loading: boolean;
  openSelectRoleKey: boolean;
  selectedRole: AccessListDetails | null;
  loadingBasicData: boolean;
  error: string;
  success: string;
  saving_data: boolean;
  access: UserAccessInterface[];
  end_date: string;
  reason: string;
  start_date: string;
  view: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
  export: boolean;
}

class _AddEmployeeCustomAccess extends Component<
  AddEmployeeCustomAccessProps,
  AddEmployeeCustomAccessState
> {
  constructor(props: AddEmployeeCustomAccessProps) {
    super(props);

    this.state = {
      loading: false,
      openSelectRoleKey: true,
      selectedRole: null,
      loadingBasicData: false,
      error: "",
      success: "",
      saving_data: false,
      access: [],
      end_date: "",
      reason: "",
      start_date: "",
      view: true,
      create: false,
      delete: false,
      update: false,
      export: false,
    };
  }

  AddEmployeeCustomAccessData = () => {
    if (this.state.access.length === 0) {
      return this.setState({ error: "Please add access" });
    }
    if (this.state.reason === "") {
      return this.setState({ error: "Please type the reason!" });
    }

    const dataSubmitted = {
      access: this.state.access,
      end_date: this.state.end_date,
      reason: this.state.reason,
      start_date: this.state.start_date,
      user_id: this.props.employee.user_id,
    };
    this.setState({ saving_data: true });
    this.props.FC_AddEmployeeCustomAccess(
      dataSubmitted,
      (loading: boolean, error: string) => {
        this.setState({ saving_data: loading, error: error });
        if (loading === false && error === "") {
          this.props.onCreated(dataSubmitted);
          this.setState({
            success: "Custom access saved successfully!",
            end_date: "",
            start_date: "",
            selectedRole: null,
            reason: "",
          });
        }
      }
    );
  };
  AddAccess = () => {
    if (this.state.selectedRole === null) {
      return this.setState({
        error: "Please select access type",
      });
    }
    if (
      this.state.create === false &&
      this.state.view === false &&
      this.state.update === false &&
      this.state.delete === false &&
      this.state.export === false
    ) {
      return this.setState({
        error: "Please select at least one access definition",
      });
    }
    this.setState({
      access: [
        ...this.state.access.filter(
          (itm) =>
            this.state.selectedRole !== null &&
            itm.key !== this.state.selectedRole.access_key
        ),
        {
          key: this.state.selectedRole.access_key,
          permission: {
            create: this.state.create,
            delete: this.state.delete,
            export: this.state.export,
            update: this.state.update,
            view: this.state.view,
          },
        },
      ],
    });
    this.setState({
      create: false,
      view: false,
      delete: false,
      update: false,
      export: false,
      selectedRole: null,
    });
  };
  getAccessName = (access_key: UserAccessList) => {
    if (this.props.system.access_details !== null) {
      const response = this.props.system.access_details.find(
        (itm) => itm.access_key === access_key
      );
      if (response !== undefined) {
        return response.access_name;
      }
    }
    return "";
  };
  componentDidMount(): void {
    if (this.props.system.access_details === null) {
      this.setState({ loading: true });
      this.props.FC_GetSystemAccessDetails((loading: boolean) =>
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
                title="Go back"
                className="bg-primary-100 text-primary-800 hover:bg-primary-800 hover:text-white"
                onClick={this.props.onCancel}
              />
            </div>
            <div>
              <div className="flex flex-row items-center gap-2">
                <div className="font-bold text-xl">Assign custom access</div>
                <div className="w-max px-2 rounded-full text-sm font-bold bg-primary-800 text-white">
                  {this.props.employee.first_name}{" "}
                  {this.props.employee.last_name}
                </div>
              </div>
              <div className="text-sm text-gray-500">
                Fill the form to assign this employee additional access to the
                default position access list
              </div>
            </div>
          </div>
          <div className="mt-3">
            {this.state.loading === true ||
            this.props.system.access_details === null ? (
              <div className="border rounded-md p-6">
                <Loading />
              </div>
            ) : (
              <div className="w-full">
                <div className="grid grid-cols-12 gap-5 bg-primary-50 rounded-md p-4 border border-primary-300">
                  <div className="col-span-12 md:col-span-6 relative">
                    <div className="flex flex-col mb-2">
                      <div className="font-bold">Choose role</div>
                      <div
                        className={`px-3 py-2 pr-1 rounded-md border w-full flex flex-row items-center justify-between gap-3 cursor-pointer hover:border-primary-700 bg-white ${
                          this.state.selectedRole !== null
                            ? "text-primary-900 border-primary-700"
                            : "text-gray-500 border-gray-400"
                        }`}
                        onClick={() =>
                          this.setState({
                            openSelectRoleKey: !this.state.openSelectRoleKey,
                          })
                        }
                      >
                        <div>
                          {this.state.selectedRole == null
                            ? "Click to select access"
                            : this.state.selectedRole.access_name}
                        </div>
                        <div>
                          <HiOutlineSelector className="text-2xl" />
                        </div>
                      </div>
                      <div className="bg-white rounded-md p-3 mt-2">
                        <div className="mb-2 font-bold">Access definition</div>
                        <div className="grid grid-cols-12 gap-2 mt-3">
                          <div className="col-span-12 md:col-span-4 lg:col-span-4 flex flex-col rounded-md border p-2 px-4 border-primary-300">
                            <div className="mb-1">View data</div>
                            <Switch
                              value={this.state.view}
                              onChange={() =>
                                this.setState({ view: !this.state.view })
                              }
                            />
                          </div>
                          <div className="col-span-12 md:col-span-4 lg:col-span-4 flex flex-col rounded-md border p-2 px-4 border-primary-300">
                            <div className="mb-1">Create data</div>
                            <Switch
                              value={this.state.create}
                              onChange={() =>
                                this.setState({ create: !this.state.create })
                              }
                            />
                          </div>
                          <div className="col-span-12 md:col-span-4 lg:col-span-4 flex flex-col rounded-md border p-2 px-4 border-primary-300">
                            <div className="mb-1">Update data</div>
                            <Switch
                              value={this.state.update}
                              onChange={() =>
                                this.setState({ update: !this.state.update })
                              }
                            />
                          </div>
                          <div className="col-span-12 md:col-span-4 lg:col-span-4 flex flex-col rounded-md border p-2 px-4 border-primary-300">
                            <div className="mb-1">Delete data</div>
                            <Switch
                              value={this.state.delete}
                              onChange={() =>
                                this.setState({ delete: !this.state.delete })
                              }
                            />
                          </div>
                          <div className="col-span-12 md:col-span-4 lg:col-span-4 flex flex-col rounded-md border p-2 px-4 border-primary-300">
                            <div className="mb-1">Export data</div>
                            <Switch
                              value={this.state.export}
                              onChange={() =>
                                this.setState({ export: !this.state.export })
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    {this.state.openSelectRoleKey === true &&
                      this.state.saving_data === false && (
                        <div className="w-full absolute top-6">
                          <SelectCustom
                            loading={false}
                            id={"access_key"}
                            title={"access_name"}
                            close={() =>
                              this.setState({ openSelectRoleKey: false })
                            }
                            data={this.props.system.access_details}
                            click={(data: {
                              access_key: UserAccessList;
                              access_name: string;
                            }) => {
                              this.setState({
                                selectedRole: data,
                                openSelectRoleKey: false,
                              });
                            }}
                          />
                        </div>
                      )}
                  </div>
                  {this.state.selectedRole !== null ? (
                    <div className="col-span-12 md:col-span-6 h-full animate__animated animate__fadeIn">
                      <div className="col-span-12 text-xl text-primary-800 font-bold pt-1">
                        Customized access preview
                      </div>
                      <div className="col-span-12 mb-3 text-sm">
                        Check for customized access definition before
                        confirmation
                      </div>
                      {this.state.selectedRole !== null && (
                        <div className="col-span-12 font-bold px-3 py-2 rounded-md bg-white truncate">
                          {this.state.selectedRole.access_name}
                        </div>
                      )}
                      <div className="mt-3 flex flex-row gap-2 bg-white rounded-md p-5 mb-2">
                        <div className="pr-3">
                          <MdAdminPanelSettings className="text-gray-300 text-7xl mb-2" />
                        </div>
                        <div className="grid grid-cols-12 gap-4 w-full">
                          <div className="col-span-4 bg-white rounded-md p-1 px-2">
                            <div className="text-sm">View</div>
                            {this.state.view === true ? (
                              <BsCheckCircleFill className="text-3xl text-green-500 animate__animated animate__bounceIn animate__fast" />
                            ) : (
                              <MdDoNotDisturbAlt className="text-3xl text-gray-300" />
                            )}
                          </div>
                          <div className="col-span-4 bg-white rounded-md p-1 px-2">
                            <div className="text-sm">Create</div>
                            {this.state.create === true ? (
                              <BsCheckCircleFill className="text-3xl text-green-500 animate__animated animate__bounceIn animate__fast" />
                            ) : (
                              <MdDoNotDisturbAlt className="text-3xl text-gray-300" />
                            )}
                          </div>
                          <div className="col-span-4 bg-white rounded-md p-1 px-2">
                            <div className="text-sm">Update</div>
                            {this.state.update === true ? (
                              <BsCheckCircleFill className="text-3xl text-green-500 animate__animated animate__bounceIn animate__fast" />
                            ) : (
                              <MdDoNotDisturbAlt className="text-3xl text-gray-300" />
                            )}
                          </div>
                          <div className="col-span-4 bg-white rounded-md p-1 px-2">
                            <div className="text-sm">Delete</div>
                            {this.state.delete === true ? (
                              <BsCheckCircleFill className="text-3xl text-green-500 animate__animated animate__bounceIn animate__fast" />
                            ) : (
                              <MdDoNotDisturbAlt className="text-3xl text-gray-300" />
                            )}
                          </div>
                          <div className="col-span-4 bg-white rounded-md p-1 px-2">
                            <div className="text-sm">Export</div>
                            {this.state.export === true ? (
                              <BsCheckCircleFill className="text-3xl text-green-500 animate__animated animate__bounceIn animate__fast" />
                            ) : (
                              <MdDoNotDisturbAlt className="text-3xl text-gray-300" />
                            )}
                          </div>
                          <div className="col-span-12 md:col-span-4 lg:col-span-4">
                            <div
                              onClick={() => this.AddAccess()}
                              className="px-4 py-2 rounded-md font-semibold w-max cursor-pointer text-white bg-primary-700 hover:bg-primary-800 white"
                            >
                              Add access
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="col-span-12 md:col-span-6 h-full animate__animated animate__fadeIn animate__slower">
                      <div className="col-span-12 text-xl text-primary-800 font-bold pt-3">
                        Customized access preview
                      </div>
                      <div className="col-span-12 mb-4 text-sm">
                        Please select the access type and customize the access
                        definition to view the preview
                      </div>
                      <div className="mt-3 flex flex-row gap-2 bg-white rounded-md p-5 mb-2">
                        <div className="pr-3">
                          <MdAdminPanelSettings className="text-gray-200 text-7xl mb-2 animate-pulse" />
                        </div>
                        <div className="grid grid-cols-12 gap-4 pb-2 pt-1 w-full">
                          <div className="col-span-4 rounded-md p-1 px-2">
                            <div className="h-4 mb-2 rounded-full w-full bg-gray-100 animate-pulse"></div>
                            <div className="h-10 w-10 rounded-full bg-gray-100 animate-pulse"></div>
                          </div>
                          <div className="col-span-4 rounded-md p-1 px-2">
                            <div className="h-4 mb-2 rounded-full w-full bg-gray-100 animate-pulse"></div>
                            <div className="h-10 w-10 rounded-full bg-gray-100 animate-pulse"></div>
                          </div>
                          <div className="col-span-4 rounded-md p-1 px-2">
                            <div className="h-4 mb-2 rounded-full w-full bg-gray-100 animate-pulse"></div>
                            <div className="h-10 w-10 rounded-full bg-gray-100 animate-pulse"></div>
                          </div>
                          <div className="col-span-4 rounded-md p-1 px-2">
                            <div className="h-4 mb-2 rounded-full w-full bg-gray-100 animate-pulse"></div>
                            <div className="h-10 w-10 rounded-full bg-gray-100 animate-pulse"></div>
                          </div>
                          <div className="col-span-4 rounded-md p-1 px-2">
                            <div className="h-4 mb-2 rounded-full w-full bg-gray-100 animate-pulse"></div>
                            <div className="h-10 w-10 rounded-full bg-gray-100 animate-pulse"></div>
                          </div>
                          <div className="col-span-4 rounded-md p-1 px-2">
                            <div className="h-4 mb-2 rounded-full w-full bg-gray-100 animate-pulse"></div>
                            <div className="h-10 w-10 rounded-full bg-gray-100 animate-pulse"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="my-3">
                  {this.state.access.length === 0 ? (
                    <div>
                      <NoResultFound
                        title="No access added"
                        description="Fill the above form to add new access from the list"
                      />
                    </div>
                  ) : (
                    <div className="my-3">
                      <div className="font-bold mb-2">
                        List of employee custom access
                      </div>
                      <AccessListTable
                        access={this.state.access}
                        getAccessName={this.getAccessName}
                        onDelete={(item: UserAccessInterface) => {
                          if (
                            window.confirm(
                              "Are you sure do you want to remove " +
                                item.key +
                                "?"
                            ) === true
                          ) {
                            this.setState({
                              access: this.state.access.filter(
                                (itm) => itm.key !== item.key
                              ),
                            });
                          }
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="flex flex-col mb-3 mt-4">
                  <div>Reason</div>
                  <textarea
                    value={this.state.reason}
                    onChange={(e) =>
                      this.setState({
                        reason: e.target.value,
                        error: "",
                      })
                    }
                    disabled={this.state.saving_data}
                    className="border border-gray-300 px-3 py-2 rounded-md w-full bg-gray-100"
                  />
                </div>

                <div className="flex flex-row items-center justify-center gap-3">
                  <div className="flex flex-col mb-3 w-full">
                    <div>Start date</div>
                    <input
                      type="date"
                      value={this.state.start_date}
                      onChange={(e) =>
                        this.setState({
                          start_date: e.target.value,
                        })
                      }
                      className="px-3 py-2 rounded-md border border-yellow-600 w-full"
                      disabled={this.state.saving_data}
                    />
                  </div>
                  <div className="flex flex-col mb-3 w-full">
                    <div>Ending date</div>
                    <input
                      type="date"
                      value={this.state.end_date}
                      onChange={(e) =>
                        this.setState({
                          end_date: e.target.value,
                        })
                      }
                      className="px-3 py-2 rounded-md border border-yellow-600 w-full"
                      disabled={this.state.saving_data}
                    />
                  </div>
                </div>

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
                      onClick={() => this.AddEmployeeCustomAccessData()}
                      className="px-4 py-2 rounded-md font-semibold w-max cursor-pointer bg-green-600 text-white hover:bg-green-700"
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

export const AddEmployeeCustomAccess = connect(mapStateToProps, {
  FC_AddEmployeeCustomAccess,
  FC_GetSystemAccessDetails,
})(_AddEmployeeCustomAccess);
