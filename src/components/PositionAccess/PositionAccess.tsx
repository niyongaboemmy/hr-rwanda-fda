import React, { Component } from "react";
import { BsCheckCircle } from "react-icons/bs";
import { IoIosAddCircle, IoIosCloseCircleOutline } from "react-icons/io";
import { MdSettingsSuggest } from "react-icons/md";
import { connect } from "react-redux";
import { FC_GetSystemAccessDetails, System } from "../../actions";
import { UserAccessInterface, UserAccessList } from "../../config/userAccess";
import { StoreState } from "../../reducers";
import { AssignPositionAccess } from "../AssignPositionAccess/AssignPositionAccess";
import { NoResultFound } from "../Fragments/NoResultFound";
import LoadingComponent from "../Loading/LoadingComponent";

interface PositionAccessProps {
  position_id: string;
  position_name: string;
  title: string;
  access: UserAccessInterface[];
  system: System;
  FC_GetSystemAccessDetails: (callback: (loading: boolean) => void) => void;
  onUpdate: (status: boolean) => void;
}
interface PositionAccessState {
  loading: boolean;
  addNewAccess: boolean;
  updateAccess: UserAccessInterface | null;
}

const ReturnBooleanStatusIcon = (status: boolean) => {
  return (
    <div>
      {status === true ? (
        <BsCheckCircle className="text-xl text-green-600" />
      ) : (
        <IoIosCloseCircleOutline className="text-2xl text-red-700" />
      )}
    </div>
  );
};

class _PositionAccess extends Component<
  PositionAccessProps,
  PositionAccessState
> {
  constructor(props: PositionAccessProps) {
    super(props);

    this.state = {
      loading: false,
      addNewAccess: false,
      updateAccess: null,
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
    if (
      this.state.loading === true ||
      this.props.system.access_details === null
    ) {
      return (
        <div>
          <LoadingComponent />
        </div>
      );
    }
    if (this.state.addNewAccess === true || this.state.updateAccess !== null) {
      return (
        <div className="mb-3">
          <AssignPositionAccess
            accessList={this.props.system.access_details}
            selectedPositionId={this.props.position_id}
            onCancel={() => {
              this.setState({ addNewAccess: false, updateAccess: null });
              this.props.onUpdate(false);
            }}
            onSuccess={(data: {
              position_id: string;
              access: UserAccessInterface;
            }) => {
              this.setState({ addNewAccess: false, updateAccess: null });
              this.props.onUpdate(false);
            }}
            currentPositionAccess={this.props.access}
            updateAccess={this.state.updateAccess}
          />
        </div>
      );
    }
    return (
      <div>
        <div className="flex flex-row items-center justify-between gap-3 mb-3">
          <div className="flex flex-row items-center gap-2 pl-2">
            <div>
              <MdSettingsSuggest className="text-3xl text-yellow-600" />
            </div>
            <div className="font-bold text-black">{this.props.title}</div>
          </div>
        </div>
        <div>
          {this.props.access.length === 0 ? (
            <div>
              <NoResultFound />
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="min-w-full text-sm text-left">
                <thead>
                  <tr>
                    <th className="px-3 py-2">#</th>
                    <th className="px-3 py-2">Access</th>
                    <th className="px-3 py-2">View</th>
                    <th className="px-3 py-2">Create</th>
                    <th className="px-3 py-2">Update</th>
                    <th className="px-3 py-2">Delete</th>
                    <th className="px-3 py-2">Export</th>
                    <th className="px-1 py-1"></th>
                  </tr>
                </thead>
                <tbody>
                  {this.props.access.map((item, i) => (
                    <tr>
                      <td className="px-3 py-2">{i + 1}</td>
                      <td className="px-3 py-2">
                        {this.getAccessName(item.key)}
                      </td>
                      <td className="px-3 py-2">
                        {ReturnBooleanStatusIcon(item.permission.view)}
                      </td>
                      <td className="px-3 py-2">
                        {ReturnBooleanStatusIcon(item.permission.create)}
                      </td>
                      <td className="px-3 py-2">
                        {ReturnBooleanStatusIcon(item.permission.update)}
                      </td>
                      <td className="px-3 py-2">
                        {ReturnBooleanStatusIcon(item.permission.delete)}
                      </td>
                      <td className="px-3 py-2">
                        {ReturnBooleanStatusIcon(item.permission.export)}
                      </td>
                      <td className="px-1 py-1 w-10">
                        <div
                          onClick={() => {
                            this.setState({ updateAccess: item });
                            this.props.onUpdate(true);
                          }}
                          className="bg-white border border-yellow-200 hover:text-yellow-600 rounded-md px-2 py-2 w-max cursor-pointer font-semibold"
                        >
                          Update
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div
                onClick={() => {
                  this.setState({ addNewAccess: true });
                  this.props.onUpdate(true);
                }}
                className="flex flex-row items-center gap-2 p-2 pr-3 rounded-md bg-white cursor-pointer hover:bg-primary-100 hover:text-primary-800 mt-3"
              >
                <div>
                  <IoIosAddCircle className="text-3xl text-primary-700" />
                </div>
                <div className="text-lg font-light">
                  Click to add new access
                </div>
              </div>
            </div>
          )}
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

export const PositionAccess = connect(mapStateToProps, {
  FC_GetSystemAccessDetails,
})(_PositionAccess);
