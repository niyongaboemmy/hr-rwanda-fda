import React, { Component } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { BsArrowRightCircle } from "react-icons/bs";
import { MdAssignment } from "react-icons/md";
import { connect } from "react-redux";
import {
  Auth,
  FC_GetTrainingProviders,
  FC_GetTrainingsReportedByEmployee,
  FC_RemoveTrainingReported,
  TrainingAttendedInterface,
  TrainingPlansByParticipant,
  TrainingStore,
} from "../../actions";
import { StoreState } from "../../reducers";
import { API_URL, DocFolder } from "../../utils/api";
import { DATE, search } from "../../utils/functions";
import BackButton from "../Fragments/BackButton";
import { NoResultFound } from "../Fragments/NoResultFound";
import LoaderComponent from "../Loading/LoaderComponent";
import PdfViewer from "../PdfViewer/PdfViewer";

interface TrainingEmployeeReportProps {
  auth: Auth;
  training: TrainingStore;
  trainingPlan: TrainingPlansByParticipant;
  onGoBack?: () => void;
  FC_GetTrainingsReportedByEmployee: (
    user_id: string,
    training_plan_id: string,
    callback: (
      loading: boolean,
      res: {
        type: "error" | "success";
        msg: string;
        data: TrainingAttendedInterface[];
      } | null
    ) => void
  ) => void;
  FC_RemoveTrainingReported: (
    training_id: string,
    callback: (
      loading: boolean,
      res: { type: "success" | "error"; msg: string } | null
    ) => void
  ) => void;
  onAddReport: () => void;
  FC_GetTrainingProviders: (
    callback: (loading: boolean, error: string) => void
  ) => void;
}
interface TrainingEmployeeReportState {
  trainings: TrainingAttendedInterface[] | null;
  loading: boolean;
  error: string;
  searchData: string;
  removedTraining: string;
  success: string;
  previewDocument: TrainingAttendedInterface | null;
}

class _TrainingEmployeeReport extends Component<
  TrainingEmployeeReportProps,
  TrainingEmployeeReportState
> {
  constructor(props: TrainingEmployeeReportProps) {
    super(props);

    this.state = {
      loading: false,
      trainings: null,
      error: "",
      searchData: "",
      removedTraining: "",
      success: "",
      previewDocument: null,
    };
  }
  GetTrainingsAttended = () => {
    if (
      this.props.auth.isAuthenticated === true &&
      this.props.auth.user !== null
    ) {
      this.props.FC_GetTrainingsReportedByEmployee(
        this.props.auth.user.user_id,
        this.props.trainingPlan.training_plan_id,
        (
          loading: boolean,
          res: {
            type: "error" | "success";
            msg: string;
            data: TrainingAttendedInterface[];
          } | null
        ) => {
          this.setState({ loading: loading });
          if (res?.type === "success") {
            this.setState({ error: "", trainings: res.data, loading: false });
          }
          if (res?.type === "error") {
            this.setState({ error: res.msg, loading: false, trainings: [] });
          }
        }
      );
    }
  };
  RemoveTraining = (training_id: string) => {
    this.setState({ removedTraining: training_id });
    this.props.FC_RemoveTrainingReported(
      training_id,
      (
        loading: boolean,
        res: {
          type: "error" | "success";
          msg: string;
        } | null
      ) => {
        if (
          res?.type === "success" &&
          loading === false &&
          this.state.trainings !== null
        ) {
          this.setState({
            trainings: this.state.trainings.filter(
              (itm) => itm.training_id !== training_id
            ),
          });
          this.setState({ error: "", success: res.msg, removedTraining: "" });
        }
        if (res?.type === "error") {
          this.setState({ error: res.msg, success: "", removedTraining: "" });
        }
      }
    );
  };
  FilteredData = (): TrainingAttendedInterface[] => {
    if (this.state.trainings === null) {
      return [];
    }
    var response = this.state.trainings;
    return search(
      response,
      this.state.searchData
    ) as TrainingAttendedInterface[];
  };
  componentDidMount(): void {
    if (this.state.trainings === null) {
      this.GetTrainingsAttended();
    }
    if (
      this.props.training.training_providers === null ||
      this.props.training.training_providers.length === 0
    ) {
      this.props.FC_GetTrainingProviders((loading: boolean, error: string) =>
        this.setState({ loading: loading })
      );
    }
  }
  render() {
    if (this.state.previewDocument !== null) {
      return (
        <div className="h-screen">
          <div className="flex flex-row items-center justify-between gap-2 w-full px-4 pt-3 pb-3">
            <div className="flex flex-row items-center gap-2 w-full truncate">
              <BackButton
                title={"Back"}
                className="bg-primary-50 text-primary-800 hover:bg-primary-100"
                onClick={() => this.setState({ previewDocument: null })}
              />
              <div className="flex flex-col w-full truncate">
                <span className="text-xl font-bold">
                  Preview supporting document
                </span>
                <div className="flex flex-row items-center gap-3 w-full truncate">
                  <div>
                    <BsArrowRightCircle className="text-yellow-600 text-xl" />
                  </div>
                  <div className="text-sm w-full truncate">
                    {this.state.previewDocument.title}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className="overflow-y-auto bg-gray-500"
            style={{ height: "calc(100vh - 80px)" }}
          >
            {this.state.loading === true ? (
              <LoaderComponent />
            ) : (
              <PdfViewer
                file_url={`${API_URL}/${DocFolder.docs}/${this.state.previewDocument.supporting_doc}`}
                class_name={"w-full overflow-y-auto"}
                style={{ height: "calc(100vh - 80px)" }}
                frame_title={""}
                setLoadingFile={(state: boolean) =>
                  this.setState({ loading: state })
                }
              />
            )}
          </div>
        </div>
      );
    }
    return (
      <div>
        <div className="flex flex-row items-center justify-between gap-2 w-full px-4 pt-3 mb-3">
          <div className="flex flex-row items-center gap-2 w-full truncate">
            <BackButton
              title={"Back"}
              className="bg-primary-50 text-primary-800 hover:bg-primary-100"
              onClick={this.props.onGoBack}
            />
            <div className="flex flex-col w-full truncate">
              <span className="text-xl font-bold">
                List of attended trainings
              </span>
              <div className="flex flex-row items-center gap-3 w-full truncate">
                <div>
                  <BsArrowRightCircle className="text-yellow-600 text-xl" />
                </div>
                <div className="text-sm w-full truncate">
                  {this.props.trainingPlan.title}
                </div>
              </div>
            </div>
          </div>
          <div>
            {this.state.trainings !== null &&
              this.state.trainings.length > 0 &&
              this.state.removedTraining === "" && (
                <div
                  onClick={this.props.onAddReport}
                  className="bg-primary-700 text-white hover:bg-primary-800 hover:text-white px-3 py-2 pl-2 rounded-md cursor-pointer w-max font-semibold flex flex-row items-center justify-center gap-2"
                >
                  <div>
                    <MdAssignment className="text-2xl" />
                  </div>
                  <span>Report attended training</span>
                </div>
              )}
          </div>
        </div>
        {/* Body */}
        {this.state.loading === true || this.state.trainings === null ? (
          <div className="p-3 -mt-2">
            <LoaderComponent />
          </div>
        ) : (
          <div>
            {this.state.trainings.length === 0 ? (
              <div>
                <NoResultFound
                  title="No report found!"
                  description="No trainings reported so far as attended trainings"
                  button={
                    <div
                      onClick={this.props.onAddReport}
                      className="bg-primary-800 hover:bg-primary-800 text-white px-3 py-2 pl-2 rounded-md cursor-pointer w-max font-semibold flex flex-row items-center justify-center gap-2 mt-3"
                    >
                      <div>
                        <MdAssignment className="text-2xl" />
                      </div>
                      <span>Report attended training</span>
                    </div>
                  }
                />
              </div>
            ) : this.FilteredData().length === 0 ? (
              <div>
                <NoResultFound />
              </div>
            ) : (
              <div className="grid grid-cols-12 gap-3 p-4">
                {this.FilteredData().map((item, i) => (
                  <div
                    key={i + 1}
                    className={`${
                      this.FilteredData().length === 1
                        ? "col-span-12"
                        : "col-span-12 lg:col-span-12"
                    }`}
                  >
                    <div className="border-b border-gray-300 w-full py-3">
                      <div className="flex flex-row gap-2">
                        <div>
                          <div className="h-8 w-8 font-light text-xl rounded-full bg-gray-100 text-black flex items-center justify-center">
                            {i + 1}
                          </div>
                        </div>
                        <div>
                          <div className="font-bold text-sm">{item.title}</div>
                          <div className="text-xs text-gray-600 mt-1">
                            {item.participant_report}
                          </div>
                          {this.props.training.training_providers !== null &&
                            this.props.training.training_providers.length >
                              0 && (
                              <div className="mt-3 flex flex-row items-center gap-1 text-xs">
                                <span className="text-gray-600 font-light">
                                  Training provider
                                </span>
                                <span className="font-semibold">
                                  {
                                    this.props.training.training_providers.find(
                                      (itm) =>
                                        itm.provider_id.toString() ===
                                        item.provider_id.toString()
                                    )?.provider_name
                                  }
                                </span>
                              </div>
                            )}
                          <div className="mt-1 flex flex-row items-center gap-1 text-xs">
                            <span className="text-gray-600 font-light">
                              Training location:
                            </span>
                            <span className="font-semibold">
                              {item.location}
                            </span>
                          </div>
                          <div className="flex flex-row items-center justify-between gap-2 mt-1">
                            <div className="flex flex-row items-center gap-4 text-xs">
                              <div className="flex flex-row items-center gap-1">
                                <span className="text-gray-600 font-light">
                                  Start date:
                                </span>
                                <span className="font-semibold text-primary-900">
                                  {DATE(item.start_date)}
                                </span>
                              </div>
                              <div className="flex flex-row items-center gap-1">
                                <span className="text-gray-600 font-light">
                                  Ending date:
                                </span>
                                <span className="font-semibold text-primary-900">
                                  {DATE(item.end_date)}
                                </span>
                              </div>
                            </div>
                            {this.state.removedTraining.toString() ===
                            item.training_id.toString() ? (
                              <div className="flex flex-row items-center gap-2 text-yellow-600">
                                <div>
                                  <AiOutlineLoading3Quarters className="text-3xl animate-spin" />
                                </div>
                                <div className="text-sm animate__animated animate__fadeIn animate__infinite font-semibold">
                                  Removing...
                                </div>
                              </div>
                            ) : (
                              <div className="flex flex-row items-center justify-end gap-2">
                                <div
                                  onClick={() =>
                                    this.setState({ previewDocument: item })
                                  }
                                  className="px-3 py-2 rounded-md w-max bg-gray-100 cursor-pointer text-sm font-semibold hover:bg-gray-200"
                                >
                                  Supporting doc
                                </div>
                                <div
                                  onClick={() => {
                                    if (
                                      window.confirm(
                                        "Are you sure do you want to remove" +
                                          item.title +
                                          "?"
                                      ) === true
                                    ) {
                                      this.setState({
                                        removedTraining: item.training_id,
                                      });
                                      this.RemoveTraining(item.training_id);
                                    }
                                  }}
                                  className="px-3 py-2 rounded-md w-max bg-red-100 text-red-700 cursor-pointer text-sm font-semibold hover:bg-red-100"
                                >
                                  Remove
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
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
  training,
}: StoreState): {
  auth: Auth;
  training: TrainingStore;
} => {
  return { auth, training };
};

export const TrainingEmployeeReport = connect(mapStateToProps, {
  FC_GetTrainingsReportedByEmployee,
  FC_RemoveTrainingReported,
  FC_GetTrainingProviders,
})(_TrainingEmployeeReport);
