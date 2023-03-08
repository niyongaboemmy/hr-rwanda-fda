import React, { Component } from "react";
import { BsFillArrowRightCircleFill } from "react-icons/bs";
import { FaChalkboardTeacher } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { connect } from "react-redux";
import {
  Auth,
  EmployeeListInterface,
  EmployeePositionItem,
  FC_GetTrainingOfferModes,
  FC_GetTrainingPlansByCustomParticipant,
  System,
  TrainingPlansByParticipant,
} from "../../actions";
import BackButton from "../../components/Fragments/BackButton";
import { NoResultFound } from "../../components/Fragments/NoResultFound";
import LoaderComponent from "../../components/Loading/LoaderComponent";
import { TrainingEmployeeReport } from "../../components/TrainingEmployeeReport/TrainingEmployeeReport";
import { StoreState } from "../../reducers";

interface EmployeeTrainingProps {
  auth: Auth;
  system: System;
  activeEmployeePosition: EmployeePositionItem | null;
  employee: EmployeeListInterface;
  onClose?: () => void;
  FC_GetTrainingPlansByCustomParticipant: (
    user_id: string,
    callback: (
      loading: boolean,
      res: {
        type: "success" | "error";
        msg: string;
        data: TrainingPlansByParticipant[];
      } | null
    ) => void
  ) => void;
  FC_GetTrainingOfferModes: (callback: (loading: boolean) => void) => void;
}
interface EmployeeTrainingState {
  training_plans: TrainingPlansByParticipant[] | null;
  loading: boolean;
  error: string;
  selectedTrainingPlan: TrainingPlansByParticipant | null;
}

class _EmployeeTrainingComponent extends Component<
  EmployeeTrainingProps,
  EmployeeTrainingState
> {
  constructor(props: EmployeeTrainingProps) {
    super(props);

    this.state = {
      loading: false,
      training_plans: null,
      error: "",
      selectedTrainingPlan: null,
    };
  }
  GetTrainingPlans = () => {
    this.setState({ loading: true });
    this.props.auth.user !== null &&
      this.props.FC_GetTrainingPlansByCustomParticipant(
        this.props.auth.user.user_id,
        (
          loading: boolean,
          res: {
            type: "success" | "error";
            msg: string;
            data: TrainingPlansByParticipant[];
          } | null
        ) => {
          this.setState({ loading: loading });
          if (res?.type === "success") {
            this.setState({
              training_plans: res.data,
              loading: false,
              error: "",
            });
          }
          if (res?.type === "error") {
            this.setState({
              training_plans: [],
              loading: false,
              error: res.msg,
            });
          }
        }
      );
  };
  componentDidMount(): void {
    if (this.state.training_plans === null) {
      this.GetTrainingPlans();
    }
    if (
      this.props.system.basic_info === null ||
      this.props.system.basic_info.training_offer_modes.length === 0
    ) {
      this.props.FC_GetTrainingOfferModes((loading: boolean) =>
        this.setState({ loading: loading })
      );
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
                <div className="font-bold text-xl">Employee training plan</div>
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
          {this.state.training_plans === null || this.state.loading === true ? (
            <LoaderComponent />
          ) : this.state.training_plans.length === 0 ? (
            <NoResultFound
              title="No Training Plans found"
              description="No training plans are assigned to this employee"
            />
          ) : (
            <div className="w-full">
              {this.state.training_plans.map((item, i) => (
                <div
                  key={i + 1}
                  className="cursor-pointer bg-primary-50 hover:bg-primary-100 hover:text-primary-800 flex flex-row items-center justify-between gap-2 rounded-md p-2 px-2 group border border-primary-100"
                  onClick={() => this.setState({ selectedTrainingPlan: item })}
                >
                  <div className="flex flex-row items-center gap-3">
                    <div>
                      <div className="bg-white text-primary-700 flex items-center justify-center h-14 w-14 rounded-md">
                        <FaChalkboardTeacher className="text-3xl" />
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <div className="font-normal text-primary-900 text-base group-hover:text-primary-800">
                        {item.title}
                      </div>
                      <div className="flex flex-row items-center gap-2 text-sm italic">
                        <span className="text-yellow-600 group-hover:text-black">
                          Click to view attended trainings
                        </span>
                      </div>
                      {/* <div className="flex flex-row items-center gap-2 text-sm font-light">
                        <span className="text-gray-600">Division</span>
                        <span className="">{item.division_name}</span>
                      </div> */}
                      {/* <div className="flex flex-row items-center gap-2">
                        {(
                          JSON.parse(
                            item.training_offer_mode_id
                          ) as TrainingOfferModeItem[]
                        ).map((mode, m) => (
                          <div
                            key={m + 1}
                            className="bg-yellow-600 text-white w-max px-2 rounded-full"
                          >
                            {mode.offer_mode}
                          </div>
                        ))}
                      </div> */}
                    </div>
                  </div>
                  <div>
                    <BsFillArrowRightCircleFill className="text-3xl text-primary-700 group-hover:text-primary-800" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({
  auth,
  system,
}: StoreState): {
  auth: Auth;
  system: System;
} => {
  return { auth, system };
};

export const EmployeeTrainingComponent = connect(mapStateToProps, {
  FC_GetTrainingPlansByCustomParticipant,
  FC_GetTrainingOfferModes,
})(_EmployeeTrainingComponent);
