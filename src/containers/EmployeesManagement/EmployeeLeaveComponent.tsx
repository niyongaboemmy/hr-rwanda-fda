import React, { Component } from "react";
import { MdClose } from "react-icons/md";
import { connect } from "react-redux";
import {
  Auth,
  EmployeeLeaveInterface,
  EmployeeListInterface,
  EmployeePositionItem,
  FC_GetCustomEmployeeLeaves,
  LeaveStore,
  TrainingPlansByParticipant,
} from "../../actions";
import BackButton from "../../components/Fragments/BackButton";
import { NoResultFound } from "../../components/Fragments/NoResultFound";
import LoaderComponent from "../../components/Loading/LoaderComponent";
import { TrainingEmployeeReport } from "../../components/TrainingEmployeeReport/TrainingEmployeeReport";
import { StoreState } from "../../reducers";
import { EmployeeLeavesList } from "../EmployeeLeave/EmployeeLeavesList";

interface EmployeeLeaveComponentProps {
  auth: Auth;
  leave: LeaveStore;
  employee: EmployeeListInterface;
  activeEmployeePosition: EmployeePositionItem | null;
  onClose?: () => void;
  FC_GetCustomEmployeeLeaves: (
    user_id: string,
    callback: (
      loading: boolean,
      res: {
        type: "success" | "error";
        msg: string;
        data: EmployeeLeaveInterface[];
      } | null
    ) => void
  ) => void;
}
interface EmployeeLeaveComponentState {
  employee_leaves: EmployeeLeaveInterface[] | null;
  loading: boolean;
  error: string;
  selectedTrainingPlan: TrainingPlansByParticipant | null;
}

class _EmployeeLeaveComponent extends Component<
  EmployeeLeaveComponentProps,
  EmployeeLeaveComponentState
> {
  constructor(props: EmployeeLeaveComponentProps) {
    super(props);

    this.state = {
      loading: false,
      employee_leaves: null,
      error: "",
      selectedTrainingPlan: null,
    };
  }
  GetEmployeeLeaves = () => {
    this.setState({ loading: true });
    this.props.auth.user !== null &&
      this.props.FC_GetCustomEmployeeLeaves(
        this.props.auth.user.user_id,
        (
          loading: boolean,
          res: {
            type: "success" | "error";
            msg: string;
            data: EmployeeLeaveInterface[];
          } | null
        ) => {
          this.setState({ loading: loading });
          if (res?.type === "success") {
            this.setState({
              employee_leaves: res.data,
              loading: false,
              error: "",
            });
          }
          if (res?.type === "error") {
            this.setState({
              employee_leaves: [],
              loading: false,
              error: res.msg,
            });
          }
        }
      );
  };
  componentDidMount(): void {
    if (this.state.employee_leaves === null) {
      this.GetEmployeeLeaves();
    }
  }
  render() {
    if (this.state.selectedTrainingPlan !== null) {
      return (
        <TrainingEmployeeReport
          trainingPlan={this.state.selectedTrainingPlan}
          onAddReport={() => {}}
          onGoBack={() => this.setState({ selectedTrainingPlan: null })}
          allowAddReport={false}
        />
      );
    }
    return (
      <div>
        <div className="flex flex-row items-center justify-between gap-3 px-3 py-3">
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
              <div className="flex flex-row items-center gap-2">
                <div className="font-bold text-xl">Employee leaves</div>
                <div className="w-max px-2 rounded-full text-sm font-bold bg-primary-800 text-white">
                  {this.props.employee.first_name}{" "}
                  {this.props.employee.last_name}
                </div>
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
        <div
          className="px-2 md:px-4 overflow-y-auto p-3 py-10 pt-0"
          style={{
            height: "calc(100vh - 85px)",
          }}
        >
          {this.state.employee_leaves === null ||
          this.state.loading === true ? (
            <LoaderComponent />
          ) : this.state.employee_leaves.length === 0 ? (
            <NoResultFound
              title="No Leaves found!"
              description="No leaves found for selected employee"
            />
          ) : (
            <EmployeeLeavesList
              allowed_to_validate={true}
              leaves={this.state.employee_leaves}
              onValidate={() => this.GetEmployeeLeaves()}
            />
          )}
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

export const EmployeeLeaveComponent = connect(mapStateToProps, {
  FC_GetCustomEmployeeLeaves,
})(_EmployeeLeaveComponent);
