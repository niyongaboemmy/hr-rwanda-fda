import React, { Component } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { MdDirectionsWalk } from "react-icons/md";
import { connect } from "react-redux";
import {
  Auth,
  EmployeeLeaveInterface,
  FC_ChangeEmployeeLeaveStatus,
  LeaveStore,
} from "../../actions";
import Alert, { AlertType } from "../../components/Alert/Alert";
import Textarea from "../../components/Fragments/Textarea";
import LoaderComponent from "../../components/Loading/LoaderComponent";
import { StoreState } from "../../reducers";
import { DATE } from "../../utils/functions";

interface EmployeeLeaveItemProps {
  item: EmployeeLeaveInterface;
  RemoveLeave?: (item: EmployeeLeaveInterface) => void;
  setRemovingItem?: (item: EmployeeLeaveInterface) => void;
  removingLeave?: EmployeeLeaveInterface | null;
  allowed_to_validate: boolean;
  onValidate?: (item: EmployeeLeaveInterface) => void;
  FC_ChangeEmployeeLeaveStatus: (
    employee_leave_id: string,
    leave_status: "APPROVED" | "REJECTED",
    leave_status_change_comment: string,
    callback: (
      loading: boolean,
      res: { type: "success" | "error"; msg: string } | null
    ) => void
  ) => void;
}
interface EmployeeLeaveItemState {
  loading: boolean;
  openValidate: boolean;
  leave_status: "APPROVED" | "REJECTED" | "";
  leave_status_change_comment: string;
  formErr: {
    target: "leave_status" | "leave_status_change_comment" | "main";
    msg: string;
  } | null;
}

class _EmployeeLeaveItem extends Component<
  EmployeeLeaveItemProps,
  EmployeeLeaveItemState
> {
  constructor(props: EmployeeLeaveItemProps) {
    super(props);

    this.state = {
      loading: false,
      openValidate: false,
      leave_status: "",
      leave_status_change_comment: "",
      formErr: null,
    };
  }
  ValidateEmployeeLeave = () => {
    if (this.state.leave_status === "") {
      return this.setState({
        formErr: { target: "leave_status", msg: "Please select decision" },
      });
    }
    if (this.state.leave_status_change_comment === "") {
      return this.setState({
        formErr: { target: "leave_status", msg: "Please type your comment" },
      });
    }
    this.setState({ loading: true });
    this.props.FC_ChangeEmployeeLeaveStatus(
      this.props.item.employee_leave_id,
      this.state.leave_status,
      this.state.leave_status_change_comment,
      (
        loading: boolean,
        res: { type: "success" | "error"; msg: string } | null
      ) => {
        this.setState({ loading: loading });
        if (loading === false && res?.type === "success") {
          this.setState({
            leave_status_change_comment: "",
            formErr: null,
            leave_status: "",
            openValidate: false,
          });
          this.props.onValidate !== undefined &&
            this.props.onValidate(this.props.item);
        }
        if (res?.type === "error" && loading === false) {
          this.setState({
            formErr: { target: "main", msg: res.msg },
            loading: false,
          });
        }
      }
    );
  };
  render() {
    if (this.state.loading === true) {
      return (
        <div className="bg-white border-b pb-3 mb-4">
          <LoaderComponent />
        </div>
      );
    }
    return (
      <div
        className={`bg-white border-b pb-3 mb-4 border-${
          this.props.item.leave_status === "APPROVED"
            ? "green"
            : this.props.item.leave_status === "REJECTED"
            ? "red"
            : "gray"
        }-300 p-0 w-full flex flex-row items-center justify-between gap-3`}
      >
        <div className="flex flex-row gap-4">
          <div>
            <div
              className={`h-20 w-20 flex items-center justify-center rounded-md bg-${
                this.props.item.leave_status === "APPROVED"
                  ? "green"
                  : this.props.item.leave_status === "REJECTED"
                  ? "red"
                  : "yellow"
              }-100 text-${
                this.props.item.leave_status === "APPROVED"
                  ? "green"
                  : this.props.item.leave_status === "REJECTED"
                  ? "red"
                  : "yellow"
              }-700`}
            >
              <MdDirectionsWalk className="text-5xl" />
            </div>
          </div>
          <div>
            <div className="font-bold">{this.props.item.leave_name}</div>
            <div className="flex flex-row items-center text-sm gap-2">
              <div className="text-gray-600">Leave category: </div>
              <div className="text-xs text-primary-800 font-semibold">
                {this.props.item.leave_type}
              </div>
            </div>
            <div className="text-sm flex flex-row gap-2">
              <div className="font-light">Start date:</div>
              <div className="font-semibold">
                {DATE(this.props.item.start_date)}
              </div>
            </div>
            <div className="text-sm flex flex-row gap-2">
              <div className="font-light">Leave duration in days:</div>
              <div className="font-semibold">
                {this.props.item.leave_duration} days
              </div>
            </div>
            <div className="text-sm flex flex-col">
              <div className="font-light">Reason:</div>
              <div className="font-semibold">
                {this.props.item.leave_reason}
              </div>
            </div>
            {this.state.openValidate === true && (
              <div className="bg-primary-50 rounded-md w-full px-3 pt-1 pr-1 pb-3 mt-2">
                <div className="flex flex-row items-center justify-between gap-2 border-b mb-1 pb-1">
                  <div className="font-bold">Validate leave</div>
                  <div>
                    <div
                      onClick={() => this.setState({ openValidate: false })}
                      className="font-bold text-sm px-3 py-1 rounded-md cursor-pointer bg-red-100 border border-red-200"
                    >
                      Close
                    </div>
                  </div>
                </div>
                <div>
                  <div className="mb-2 pr-3">
                    <div className="font-semibold text-sm mb-1">
                      Validation decision
                    </div>
                    <select
                      value={this.state.leave_status}
                      onChange={(e) =>
                        this.setState({
                          leave_status: e.target.value as
                            | ""
                            | "APPROVED"
                            | "REJECTED",
                          formErr: null,
                        })
                      }
                      className="px-3 py-2 rounded-md bg-white w-full border border-yellow-600"
                    >
                      <option value="">Choose decision</option>
                      <option value="APPROVED">APPROVED</option>
                      <option value="REJECTED">REJECTED</option>
                    </select>
                  </div>
                  {this.state.formErr?.target === "leave_status" && (
                    <Alert
                      alertType={AlertType.DANGER}
                      title={this.state.formErr.msg}
                      close={() => this.setState({ formErr: null })}
                    />
                  )}
                  <div className="pr-3">
                    <Textarea
                      title={"Decision comment"}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        this.setState({
                          leave_status_change_comment: e.target.value,
                          formErr: null,
                        })
                      }
                      disabled={this.state.loading}
                      value={this.state.leave_status_change_comment}
                      error={
                        this.state.formErr?.target ===
                        "leave_status_change_comment"
                          ? this.state.formErr.msg
                          : ""
                      }
                      className="bg-white"
                    />
                  </div>
                  {this.state.formErr?.target === "main" && (
                    <Alert
                      alertType={AlertType.DANGER}
                      title={this.state.formErr.msg}
                      close={() => this.setState({ formErr: null })}
                    />
                  )}
                  <div className="mt-2">
                    <div
                      onClick={() => this.ValidateEmployeeLeave()}
                      className="font-bold text-white bg-green-600 hover:bg-green-700 w-max cursor-pointer px-3 py-2 rounded-md"
                    >
                      Save changes
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        {this.state.openValidate === false && (
          <div className="flex flex-row items-center gap-2 justify-end">
            {this.props.item.leave_status === "APPROVED" ? (
              <div className="w-max px-2 rounded-full bg-green-600 text-white">
                Approved
              </div>
            ) : this.props.item.leave_status === "REJECTED" ? (
              <div className="w-max px-2 rounded-full bg-red-600 text-white">
                Rejected
              </div>
            ) : (
              <div className="w-max px-2 rounded-full bg-yellow-600 text-white">
                Pending
              </div>
            )}
            {this.props.removingLeave !== undefined &&
            this.props.removingLeave !== null &&
            this.props.removingLeave.employee_leave_id.toString() ===
              this.props.item.employee_leave_id.toString() ? (
              <div className="flex flex-row items-center justify-center gap-2 rounded-md bg-gray-100 w-max px-3 py-2">
                <div>
                  <AiOutlineLoading3Quarters className="text-2xl text-yellow-600 animate-spin" />
                </div>
                <div className="animate__animated animate__fadeIn animate__infinite">
                  Removing...
                </div>
              </div>
            ) : (
              this.props.item.leave_status === "PENDING" &&
              this.props.removingLeave !== undefined &&
              this.props.setRemovingItem !== undefined && (
                <div
                  onClick={() => {
                    this.props.setRemovingItem !== undefined &&
                      this.props.setRemovingItem(this.props.item);
                    this.props.RemoveLeave !== undefined &&
                      this.props.RemoveLeave(this.props.item);
                  }}
                >
                  <div className="bg-red-50 text-red-700 text-sm font-semibold w-max cursor-pointer hover:bg-red-200 px-3 py-2 rounded-md border border-red-200">
                    Remove
                  </div>
                </div>
              )
            )}
            {this.props.allowed_to_validate === true &&
              this.props.onValidate !== undefined &&
              this.state.openValidate === false && (
                <div
                  onClick={() => {
                    this.setState({ openValidate: true });
                  }}
                >
                  <div className="bg-primary-100 hover:text-white text-primary-800 text-sm font-semibold w-max cursor-pointer hover:bg-primary-800 px-3 py-2 rounded-md border border-primary-300 hover:border-white">
                    Validate
                  </div>
                </div>
              )}
          </div>
        )}
      </div>
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

export const EmployeeLeaveItem = connect(mapStateToProps, {
  FC_ChangeEmployeeLeaveStatus,
})(_EmployeeLeaveItem);
