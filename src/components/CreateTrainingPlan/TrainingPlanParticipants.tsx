import React, { Component, Fragment } from "react";
import { IoIosAddCircle } from "react-icons/io";
import { connect } from "react-redux";
import {
  BooleanEnum,
  EmployeeListInterface,
  FC_AddTrainingPlanParticipant,
  FC_GetTrainingPlanParticipants,
  FC_RemoveTrainingPlanParticipant,
  System,
  TrainingPlanParticipantData,
  TrainingPlanParticipantInterface,
} from "../../actions";
import { StoreState } from "../../reducers";
import { NoResultFound } from "../Fragments/NoResultFound";
import LoaderComponent from "../Loading/LoaderComponent";
import { SelectEmployee } from "../SelectEmployee/SelectEmployee";

interface TrainingPlanParticipantsProps {
  system: System;
  FC_GetTrainingPlanParticipants: (
    training_plan_id: string,
    callback: (
      loading: boolean,
      res: {
        type: "success" | "error";
        msg: string;
        data: TrainingPlanParticipantInterface[];
      } | null
    ) => void
  ) => void;
  FC_AddTrainingPlanParticipant: (
    data: TrainingPlanParticipantData,
    callback: (
      loading: boolean,
      res: {
        type: "success" | "error";
        msg: string;
      } | null
    ) => void
  ) => void;
  onGoBack?: () => void;
  onSubmit?: () => void;
  setStepCompleted: () => void;
  selected_training_plan_id: string;
  FC_RemoveTrainingPlanParticipant: (
    training_participate_id: string,
    callback: (loading: boolean, error: string) => void
  ) => void;
}
interface TrainingPlanParticipantsState {
  loading: boolean;
  openSelectParticipant: boolean;
  participants: TrainingPlanParticipantInterface[] | null;
  error: string;
}

class _TrainingPlanParticipants extends Component<
  TrainingPlanParticipantsProps,
  TrainingPlanParticipantsState
> {
  constructor(props: TrainingPlanParticipantsProps) {
    super(props);

    this.state = {
      loading: false,
      openSelectParticipant: false,
      participants: null,
      error: "",
    };
  }
  GetTrainingPlanParticipants = () => {
    this.setState({ loading: true });
    this.props.FC_GetTrainingPlanParticipants(
      this.props.selected_training_plan_id,
      (
        loading: boolean,
        res: {
          type: "success" | "error";
          msg: string;
          data: TrainingPlanParticipantInterface[];
        } | null
      ) => {
        this.setState({ loading: loading });
        if (res?.type === "success") {
          this.setState({ loading: false, participants: res.data, error: "" });
        }
        if (res !== null && res.data.length > 0) {
          this.props.setStepCompleted();
        }
      }
    );
  };
  RemoveTrainingPlanParticipant = (item: TrainingPlanParticipantInterface) => {
    if (
      window.confirm(
        "Are you sure do you want to remove " +
          item.first_name +
          " " +
          item.last_name +
          "?"
      ) === true
    ) {
      this.props.FC_RemoveTrainingPlanParticipant(
        item.training_participate_id,
        (loading: boolean, error: string) => {
          this.setState({ loading: loading });
          if (
            loading === false &&
            error === "" &&
            this.state.participants !== null
          ) {
            this.setState({
              participants: this.state.participants.filter(
                (itm) =>
                  itm.training_participate_id !== item.training_participate_id
              ),
            });
          }
        }
      );
    }
  };
  componentDidMount(): void {
    if (this.state.participants === null) {
      this.GetTrainingPlanParticipants();
    }
  }
  render() {
    return (
      <Fragment>
        <div className="relative">
          <div
            className={
              this.state.openSelectParticipant === true
                ? "filter blur-lg animate__animated animate__fadeIn animate__slow"
                : "animate__animated animate__fadeIn animate__slow"
            }
          >
            <div className="flex flex-row items-center justify-between gap-2 w-full pl-4">
              <div className="">
                <div className="font-bold text-xl">Lis of employees</div>
                <div className="text-sm">
                  List of employees added on the planned training
                </div>
              </div>
              <div className="">
                <div
                  onClick={() => this.setState({ openSelectParticipant: true })}
                  className="bg-white hover:bg-primary-800 border border-primary-700 hover:border-white text-primary-800 hover:text-white w-max cursor-pointer font-semibold text-base px-3 py-2 pl-2 rounded-md flex flex-row items-center justify-center gap-2 group"
                >
                  <div>
                    <IoIosAddCircle className="text-2xl text-primary-700 group-hover:text-white" />
                  </div>
                  <span>Add participant</span>
                </div>
              </div>
            </div>
            <div className="mt-3">
              {this.state.loading === true ||
              this.state.participants === null ? (
                <div>
                  <LoaderComponent />
                </div>
              ) : (
                <div>
                  {this.state.participants.length === 0 ? (
                    <NoResultFound
                      title="No participants added"
                      description="Click the following button to select a participant"
                      button={
                        <div className="bg-primary-800 text-white rounded-md px-3 py-2 cursor-pointer mt-3">
                          Add participant
                        </div>
                      }
                      onClick={() =>
                        this.setState({ openSelectParticipant: true })
                      }
                    />
                  ) : (
                    <div className="w-full overflow-x-auto">
                      <table className="min-w-full text-sm text-left">
                        <thead>
                          <tr>
                            <th className="px-3 py-2 border truncate">#</th>
                            <th className="px-3 py-2 border truncate">
                              First name
                            </th>
                            <th className="px-3 py-2 border truncate">
                              Last name
                            </th>
                            <th className="px-3 py-2 border truncate">
                              Phone number
                            </th>
                            <th className="px-3 py-2 border truncate">Email</th>
                            <th className="px-3 py-2 border truncate">
                              Status
                            </th>
                            <th className="px-3 py-2 border truncate"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {this.state.participants.map((item, i) => (
                            <tr key={i + 1} className="">
                              <td className="px-3 py-2 border truncate">
                                {i + 1}
                              </td>
                              <td className="px-3 py-2 border truncate">
                                {item.first_name}
                              </td>
                              <td className="px-3 py-2 border truncate">
                                {item.last_name}
                              </td>
                              <td className="px-3 py-2 border truncate">
                                {item.phone_number}
                              </td>
                              <td className="px-3 py-2 border truncate">
                                {item.email}
                              </td>
                              <td className="px-3 py-2 border truncate">
                                {item.status}
                              </td>
                              <td className="p-1 border w-10">
                                <div
                                  onClick={() =>
                                    this.RemoveTrainingPlanParticipant(item)
                                  }
                                  className="px-3 py-2 rounded-md font-semibold w-max bg-red-50 text-red-700 hover:bg-red-100 cursor-pointer"
                                >
                                  Remove
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          {this.state.openSelectParticipant === true && (
            <SelectEmployee
              onClose={() => this.setState({ openSelectParticipant: false })}
              onSelect={(data: EmployeeListInterface) => {
                const selectedPosition = data.positions.find(
                  (itm) => itm.is_acting === BooleanEnum.FALSE
                );
                selectedPosition !== undefined &&
                  this.props.FC_AddTrainingPlanParticipant(
                    {
                      location: "1",
                      position_id: selectedPosition.position_id,
                      provider_id: "1",
                      training_plan_id: this.props.selected_training_plan_id,
                      unit_id: selectedPosition.unit_id,
                      user_id: data.user_id,
                    },
                    (
                      loading: boolean,
                      res: {
                        type: "success" | "error";
                        msg: string;
                      } | null
                    ) => {
                      this.setState({
                        loading: loading,
                        openSelectParticipant: false,
                      });
                      if (res?.type === "success") {
                        this.GetTrainingPlanParticipants();
                      }
                    }
                  );
              }}
            />
          )}
        </div>
      </Fragment>
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

export const TrainingPlanParticipants = connect(mapStateToProps, {
  FC_AddTrainingPlanParticipant,
  FC_GetTrainingPlanParticipants,
  FC_RemoveTrainingPlanParticipant,
})(_TrainingPlanParticipants);
