import React, { Component } from "react";
import { BsArrowRight } from "react-icons/bs";
import { connect } from "react-redux";
import {
  AccessListDetails,
  FC_AssignPositionAccess,
  System,
} from "../../actions";
import { UserAccessInterface, UserAccessList } from "../../config/userAccess";
import { StoreState } from "../../reducers";
import Alert, { AlertType } from "../Alert/Alert";
import BackButton from "../Fragments/BackButton";
import Loading from "../Loading/Loading";
import SelectCustom from "../SelectCustom/SelectCustom";
import Switch from "../Switch/Switch";

interface AssignPositionAccessProps {
  system: System;
  accessList: AccessListDetails[];
  selectedPositionId: string;
  currentPositionAccess: UserAccessInterface[];
  onCancel: () => void;
  onSuccess: (data: {
    position_id: string;
    access: UserAccessInterface;
  }) => void;
  FC_AssignPositionAccess: (
    data: {
      position_id: string;
      access: UserAccessInterface[];
    },
    callback: (loading: boolean, error: string) => void
  ) => void;
  updateAccess: UserAccessInterface | null;
}
interface AssignPositionAccessState {
  loading: boolean;
  selected_access: UserAccessList | null;
  openSelectAccess: boolean;
  view: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
  export: boolean;
  error: string;
  success: string;
}

class _AssignPositionAccess extends Component<
  AssignPositionAccessProps,
  AssignPositionAccessState
> {
  constructor(props: AssignPositionAccessProps) {
    super(props);

    this.state = {
      loading: false,
      selected_access:
        this.props.updateAccess !== null ? this.props.updateAccess.key : null,
      openSelectAccess: this.props.updateAccess !== null ? false : true,
      create:
        this.props.updateAccess !== null
          ? this.props.updateAccess.permission.create
          : true,
      view:
        this.props.updateAccess !== null
          ? this.props.updateAccess.permission.view
          : true,
      delete:
        this.props.updateAccess !== null
          ? this.props.updateAccess.permission.delete
          : true,
      update:
        this.props.updateAccess !== null
          ? this.props.updateAccess.permission.update
          : true,
      export:
        this.props.updateAccess !== null
          ? this.props.updateAccess.permission.export
          : true,
      error: "",
      success: "",
    };
  }
  getAccessName = (access_key: UserAccessList) => {
    if (this.props.accessList !== null) {
      const response = this.props.accessList.find(
        (itm) => itm.access_key === access_key
      );
      if (response !== undefined) {
        return response.access_name;
      }
    }
    return "";
  };
  AssignPositionAccess = (type: "create" | "remove") => {
    if (this.state.selected_access === null) {
      return this.setState({ error: "Please select role" });
    }
    if (
      this.state.create === false &&
      this.state.delete === false &&
      this.state.export === false &&
      this.state.update === false &&
      this.state.view === false &&
      this.props.updateAccess === null
    ) {
      if (
        window.confirm("Are you sure do you want to submit with no access?") ===
        false
      ) {
        return this.setState({ error: "Please set at least one access role" });
      }
    }
    this.props.FC_AssignPositionAccess(
      {
        position_id: this.props.selectedPositionId,
        access:
          type === "remove"
            ? this.props.currentPositionAccess.filter(
                (itm) => itm.key !== this.state.selected_access
              )
            : [
                ...this.props.currentPositionAccess.filter(
                  (itm) => itm.key !== this.state.selected_access
                ),
                {
                  key: this.state.selected_access,
                  permission: {
                    create: this.state.create,
                    delete: this.state.delete,
                    export: this.state.export,
                    update: this.state.update,
                    view: this.state.view,
                  },
                },
              ],
      },
      (loading: boolean, error: string) => {
        this.setState({ loading: loading, error: error });
        if (error === "" && loading === false) {
          this.setState({
            success: "Position access has updated successfully!",
          });
          setTimeout(() => {
            this.state.selected_access !== null &&
              this.props.onSuccess({
                position_id: this.props.selectedPositionId,
                access: {
                  key: this.state.selected_access,
                  permission: {
                    create: this.state.create,
                    delete: this.state.delete,
                    export: this.state.export,
                    update: this.state.update,
                    view: this.state.view,
                  },
                },
              });
          }, 3000);
        }
      }
    );
  };
  render() {
    if (this.state.loading === true) {
      return (
        <div>
          <Loading />
        </div>
      );
    }
    return (
      <div className="bg-white rounded-md p-3">
        <div className="flex flex-row items-center gap-2">
          <div>
            <BackButton
              title="Cancel action"
              className="bg-gray-100 text-black hover:bg-primary-100 hover:text-primary-800"
              onClick={this.props.onCancel}
            />
          </div>
          <div>
            <div className="font-bold text-xl">
              {this.props.updateAccess === null
                ? "Create new access"
                : "Update selected access"}
            </div>
            <div className="text-sm text-gray-500">
              Choose the access and customize its definition
            </div>
          </div>
        </div>
        <div className="mt-3">
          <div>
            <div>Choose role</div>
            {this.state.openSelectAccess === false && (
              <div
                onClick={() => this.setState({ openSelectAccess: true })}
                className={`flex flex-row items-center justify-between gap-2 w-full border ${
                  this.state.selected_access !== null
                    ? "bg-white border-gray-300 text-black"
                    : "bg-gray-100  border-gray-100"
                } hover:border-primary-700 rounded-md px-3 pr-2 py-2 font-bold text-sm cursor-pointer hover:bg-primary-50`}
              >
                <span>
                  {this.state.selected_access !== null ? (
                    this.getAccessName(this.state.selected_access)
                  ) : (
                    <span className="text-gray-500">
                      Click to select the role
                    </span>
                  )}
                </span>
                <div>
                  <BsArrowRight className="text-2xl" />
                </div>
              </div>
            )}
            {this.state.openSelectAccess === true && (
              <div className="mt-2 animate__animated animate__fadeInUp animate__fast">
                <SelectCustom
                  loading={this.state.loading}
                  id={"access_key"}
                  title={"access_name"}
                  close={() => this.setState({ openSelectAccess: false })}
                  data={this.props.accessList}
                  click={(data: {
                    access_key: UserAccessList;
                    access_name: string;
                  }) => {
                    this.setState({
                      selected_access: data.access_key,
                      openSelectAccess: false,
                    });
                  }}
                />
              </div>
            )}
            <div className="flex flex-col md:flex-row md:items-center gap-4 mt-3">
              <div className="flex flex-col rounded-md border p-3 px-6">
                <div className="mb-1">View data</div>
                <Switch
                  value={this.state.view}
                  onChange={() => this.setState({ view: !this.state.view })}
                />
              </div>
              <div className="flex flex-col rounded-md border p-3 px-6">
                <div className="mb-1">Create data</div>
                <Switch
                  value={this.state.create}
                  onChange={() => this.setState({ create: !this.state.create })}
                />
              </div>
              <div className="flex flex-col rounded-md border p-3 px-6">
                <div className="mb-1">Update data</div>
                <Switch
                  value={this.state.update}
                  onChange={() => this.setState({ update: !this.state.update })}
                />
              </div>
              <div className="flex flex-col rounded-md border p-3 px-6">
                <div className="mb-1">Delete data</div>
                <Switch
                  value={this.state.delete}
                  onChange={() => this.setState({ delete: !this.state.delete })}
                />
              </div>
              <div className="flex flex-col rounded-md border p-3 px-6">
                <div className="mb-1">Export data</div>
                <Switch
                  value={this.state.export}
                  onChange={() => this.setState({ export: !this.state.export })}
                />
              </div>
            </div>
            {this.state.error !== "" && (
              <div className="mt-3">
                <Alert
                  alertType={AlertType.DANGER}
                  title={this.state.error}
                  close={() => {
                    this.setState({ error: "" });
                  }}
                  timeOut={9000}
                />
              </div>
            )}
            {this.state.success !== "" && (
              <div className="mt-3">
                <Alert
                  alertType={AlertType.SUCCESS}
                  title={this.state.success}
                  close={() => {
                    this.setState({ success: "" });
                  }}
                  timeOut={3000}
                />
              </div>
            )}
            {this.state.success === "" && (
              <div className="mt-3 flex flex-row items-center gap-2">
                <div
                  onClick={() => this.AssignPositionAccess("create")}
                  className="px-3 py-2 rounded-md bg-primary-800 text-white hover:bg-primary-900 cursor-pointer w-max font-bold text-sm"
                >
                  Save changes
                </div>
                {this.props.updateAccess !== null && (
                  <div
                    onClick={() => this.AssignPositionAccess("remove")}
                    className="px-3 py-2 rounded-md bg-red-100 text-red-700 hover:text-white hover:bg-red-600 cursor-pointer w-max font-bold text-sm"
                  >
                    Remove
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

export const AssignPositionAccess = connect(mapStateToProps, {
  FC_AssignPositionAccess,
})(_AssignPositionAccess);
