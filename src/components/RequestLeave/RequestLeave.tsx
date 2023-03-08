import React, { Component } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { BsArrowRightCircle } from "react-icons/bs";
import { connect } from "react-redux";
import {
  Auth,
  BooleanEnum,
  CreateLeaveData,
  EmploymentItem,
  FC_CreateLeave,
  FC_GetLeaveCategories,
  LeaveStore,
} from "../../actions";
import { StoreState } from "../../reducers";
import Alert, { AlertType } from "../Alert/Alert";
import BackButton from "../Fragments/BackButton";
import Input from "../Fragments/Input";
import Textarea from "../Fragments/Textarea";
import LoaderComponent from "../Loading/LoaderComponent";
import SelectCustom from "../SelectCustom/SelectCustom";

interface RequestLeaveProps {
  auth: Auth;
  leave: LeaveStore;
  FC_GetLeaveCategories: (
    callback: (loading: boolean, error: string) => void
  ) => void;
  onGoBack: () => void;
  onCreated: () => void;
  FC_CreateLeave: (
    data: CreateLeaveData,
    callback: (
      loading: boolean,
      res: { type: "success" | "error"; msg: string } | null
    ) => void
  ) => void;
}
interface RequestLeaveState {
  loading: boolean;
  loadingLeaveCategories: boolean;
  error: {
    target:
      | "main"
      | "leave_id"
      | "start_date"
      | "leave_duration"
      | "leave_reason";
    msg: string;
  } | null;
  leave_id: string;
  start_date: string;
  leave_duration: string;
  leave_reason: string;
  openSelectLeaveCategory: boolean;
  success: string;
}

class _RequestLeave extends Component<RequestLeaveProps, RequestLeaveState> {
  constructor(props: RequestLeaveProps) {
    super(props);

    this.state = {
      loading: false,
      error: null,
      leave_duration: "",
      leave_id: "",
      leave_reason: "",
      start_date: "",
      loadingLeaveCategories: false,
      openSelectLeaveCategory: true,
      success: "",
    };
  }
  LoadLeaveCategories = () => {
    this.setState({ loadingLeaveCategories: true });
    this.props.FC_GetLeaveCategories((loading: boolean, error: string) =>
      this.setState({
        loadingLeaveCategories: loading,
        error: error === "" ? null : { target: "main", msg: error },
      })
    );
  };
  componentDidMount(): void {
    if (this.props.leave.leave_categories === null) {
      this.LoadLeaveCategories();
    }
  }
  employeeActivePosition = (): EmploymentItem | null => {
    if (this.props.auth.user !== null) {
      var positions: EmploymentItem[] = this.props.auth.user.employment;
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
    }
    return null;
  };
  SubmitLeave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (this.props.auth.user === null) {
      return this.setState({
        error: { target: "main", msg: "Not Authenticated" },
      });
    }
    if (this.employeeActivePosition() === null) {
      return this.setState({
        error: { target: "main", msg: "Invalid position" },
      });
    }
    if (this.state.leave_id === "") {
      return this.setState({
        error: { target: "leave_id", msg: "Please select leave category" },
      });
    }
    if (this.state.start_date === "") {
      return this.setState({
        error: { target: "start_date", msg: "Please choose start date" },
      });
    }
    if (this.state.leave_duration === "") {
      return this.setState({
        error: { target: "leave_duration", msg: "Please add duration in days" },
      });
    }
    if (isNaN(parseInt(this.state.leave_duration)) === true) {
      return this.setState({
        error: {
          target: "leave_duration",
          msg: "Please days should be numeric",
        },
      });
    }
    if (this.state.leave_reason === "") {
      return this.setState({
        error: {
          target: "leave_reason",
          msg: "Please add reason for the leave in brief",
        },
      });
    }
    this.setState({ loading: true });
    const data: CreateLeaveData = {
      leave_duration: this.state.leave_duration,
      leave_id: this.state.leave_id,
      leave_reason: this.state.leave_reason,
      position_id: this.employeeActivePosition()!.position_id,
      start_date: this.state.start_date,
      unit_id: this.employeeActivePosition()!.unit_id,
      user_id: this.props.auth.user.user_id,
    };
    this.props.FC_CreateLeave(
      data,
      (
        loading: boolean,
        res: { type: "success" | "error"; msg: string } | null
      ) => {
        this.setState({ loading: loading });
        if (res?.type === "success") {
          this.setState({ loading: true, success: res.msg, error: null });
          setTimeout(() => {
            this.props.onCreated();
          }, 1000);
        }
        if (res?.type === "error") {
          this.setState({
            error: { target: "main", msg: res.msg },
            success: "",
          });
        }
      }
    );
  };
  render() {
    if (this.state.loadingLeaveCategories === true) {
      return (
        <div className="p-3">
          <LoaderComponent />
        </div>
      );
    }
    return (
      <div>
        <div className="flex flex-row items-center justify-between gap-2 w-full pb-3 border-b px-4 pt-4">
          <div className="flex flex-row items-center gap-2">
            <BackButton
              title={"Back"}
              className="bg-primary-50 text-primary-800 hover:bg-primary-100"
              onClick={this.props.onGoBack}
            />
            <div className="flex flex-col">
              <span className="text-xl font-bold">Request for leave</span>
              <div className="flex flex-row items-center gap-3">
                <div>
                  <BsArrowRightCircle className="text-yellow-600 text-xl" />
                </div>
                <div className="text-sm">
                  Please fill the following form to submit your request
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="mt-3 px-4 overflow-y-auto pb-10"
          //   style={{ height: "calc(100vh - 100px)" }}
        >
          <form
            onSubmit={this.SubmitLeave}
            className="w-full grid grid-cols-12 gap-4"
          >
            <div className="col-span-12">
              <div className="relative">
                <div>
                  <div className="text-sm mb-1">Leave category</div>
                  <div
                    onClick={() =>
                      this.state.loading === false &&
                      this.setState({
                        openSelectLeaveCategory:
                          !this.state.openSelectLeaveCategory,
                      })
                    }
                    className={`${
                      this.state.error?.target === "leave_id"
                        ? "border-red-600"
                        : this.state.leave_id !== ""
                        ? "text-primary-800 font-semibold bg-primary-50 border-primary-300"
                        : "bg-gray-100"
                    } px-3 py-2 rounded-md border w-full text-sm flex flex-row items-center justify-between gap-2 cursor-pointer`}
                  >
                    {this.state.leave_id === "" ? (
                      <span className="italic">Select leave category</span>
                    ) : (
                      <span>
                        {
                          this.props.leave.leave_categories?.find(
                            (itm) =>
                              itm.leave_id.toString() ===
                              this.state.leave_id.toString()
                          )?.leave_name
                        }
                      </span>
                    )}
                  </div>
                </div>
                {this.state.openSelectLeaveCategory === true &&
                  this.state.loading === false && (
                    <div className="absolute pt-2 w-full" style={{ zIndex: 9 }}>
                      <SelectCustom
                        loading={false}
                        id={"leave_id"}
                        title={"leave_name"}
                        close={() =>
                          this.setState({ openSelectLeaveCategory: false })
                        }
                        data={
                          this.props.leave.leave_categories === null
                            ? []
                            : this.props.leave.leave_categories
                        }
                        click={(data: {
                          leave_id: string;
                          leave_name: string;
                        }) => {
                          this.setState({
                            leave_id: data.leave_id,
                            openSelectLeaveCategory: false,
                            error: null,
                            success: "",
                          });
                        }}
                      />
                    </div>
                  )}
              </div>

              {this.state.error?.target === "leave_id" && (
                <div>
                  <Alert
                    alertType={AlertType.DANGER}
                    title={this.state.error.msg}
                    close={() => this.setState({ error: null, success: "" })}
                  />
                </div>
              )}
            </div>
            <div className="col-span-12 md:col-span-6">
              <Input
                type="date"
                title={"Start date"}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  this.setState({ start_date: e.target.value, error: null })
                }
                disabled={this.state.loading}
                value={this.state.start_date}
                error={
                  this.state.error?.target === "start_date"
                    ? this.state.error.msg
                    : ""
                }
                onCloseError={() => this.setState({ error: null, success: "" })}
              />
            </div>
            <div className="col-span-12 md:col-span-6">
              <Input
                type="text"
                title={"Leave duration in days"}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  this.setState({
                    leave_duration: e.target.value,
                    error: null,
                  })
                }
                disabled={this.state.loading}
                value={this.state.leave_duration}
                error={
                  this.state.error?.target === "leave_duration"
                    ? this.state.error.msg
                    : ""
                }
                onCloseError={() => this.setState({ error: null, success: "" })}
              />
            </div>
            <div className="col-span-12">
              <Textarea
                title={"Reason for leave in brief"}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  this.setState({
                    leave_reason: e.target.value,
                    error: null,
                  })
                }
                disabled={this.state.loading}
                value={this.state.leave_reason}
                error={
                  this.state.error?.target === "leave_reason"
                    ? this.state.error.msg
                    : ""
                }
                onCloseError={() => this.setState({ error: null, success: "" })}
              />
            </div>
            {this.state.error?.target === "main" && (
              <div className="col-span-12">
                <Alert
                  alertType={AlertType.DANGER}
                  title={this.state.error.msg}
                  close={() => this.setState({ error: null })}
                />
              </div>
            )}
            <div className="col-span-12">
              <div className="flex flex-row items-center justify-end">
                <button
                  type="submit"
                  className="px-3 py-2 text-base font-bold text-white bg-primary-700 hover:bg-primary-800 rounded-md flex flex-row items-center justify-center gap-2"
                  disabled={this.state.loading}
                >
                  {this.state.loading === true && (
                    <div>
                      <AiOutlineLoading3Quarters className="text-3xl animate-spin" />
                    </div>
                  )}
                  {this.state.loading === true ? (
                    <div className="animate__animated animate__fadeIn animate__infinite">
                      Sending request...
                    </div>
                  ) : (
                    <div>Request for leave</div>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
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

export const RequestLeave = connect(mapStateToProps, {
  FC_GetLeaveCategories,
  FC_CreateLeave,
})(_RequestLeave);
