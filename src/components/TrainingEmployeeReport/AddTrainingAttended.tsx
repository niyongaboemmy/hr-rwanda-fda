import React, { Component } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { BsArrowRightCircle } from "react-icons/bs";
import { MdOutlineDataSaverOn } from "react-icons/md";
import { connect } from "react-redux";
import {
  Auth,
  FC_AddTrainingAttendedReport,
  FC_GetTrainingProviders,
  TrainingAttendanceData,
  TrainingPlansByParticipant,
  TrainingStore,
} from "../../actions";
import { StoreState } from "../../reducers";
import Alert, { AlertType } from "../Alert/Alert";
import BackButton from "../Fragments/BackButton";
import FileInput from "../Fragments/FileInput";
import Input from "../Fragments/Input";
import Textarea from "../Fragments/Textarea";
import SelectCustom from "../SelectCustom/SelectCustom";

interface AddTrainingAttendedProps {
  auth: Auth;
  training: TrainingStore;
  trainingPlan: TrainingPlansByParticipant;
  onGoBack?: () => void;
  FC_AddTrainingAttendedReport: (
    data: TrainingAttendanceData,
    callback: (
      loading: boolean,
      res: {
        type: "success" | "error";
        msg: string;
      } | null
    ) => void
  ) => void;
  onCreated: () => void;
  FC_GetTrainingProviders: (
    callback: (loading: boolean, error: string) => void
  ) => void;
}

interface AddTrainingAttendedState {
  loading: boolean;
  success: string;
  error: {
    target:
      | "main"
      | "title"
      | "user_id"
      | "provider_id"
      | "location"
      | "start_date"
      | "end_date"
      | "participant_report"
      | "supporting_doc";
    msg: string;
  } | null;
  //   Data definition
  training_plan_id: string;
  user_id: string;
  title: string;
  provider_id: string;
  location: string;
  start_date: string;
  end_date: string;
  participant_report: string;
  supporting_doc: File | null;
  loadingTrainingProviders: boolean;
  openSelectTrainingProvider: boolean;
}

class _AddTrainingAttended extends Component<
  AddTrainingAttendedProps,
  AddTrainingAttendedState
> {
  constructor(props: AddTrainingAttendedProps) {
    super(props);

    this.state = {
      loading: false,
      success: "",
      error: null,
      training_plan_id: this.props.trainingPlan.training_plan_id,
      user_id:
        this.props.auth.user === null ? "" : this.props.auth.user.user_id,
      title: "",
      provider_id: "",
      start_date: "",
      end_date: "",
      location: "",
      participant_report: "",
      supporting_doc: null,
      loadingTrainingProviders: false,
      openSelectTrainingProvider: false,
    };
  }
  AddTrainingAttended = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Validation
    if (this.state.title === "") {
      return this.setState({
        error: {
          target: "title",
          msg: "Please type training title",
        },
      });
    }
    if (this.state.provider_id === "") {
      return this.setState({
        error: {
          target: "provider_id",
          msg: "Please select training provider",
        },
      });
    }
    if (this.state.start_date === "") {
      return this.setState({
        error: {
          target: "start_date",
          msg: "Please type training start date",
        },
      });
    }
    if (this.state.end_date === "") {
      return this.setState({
        error: {
          target: "end_date",
          msg: "Please type training ending date",
        },
      });
    }
    if (this.state.participant_report === "") {
      return this.setState({
        error: {
          target: "participant_report",
          msg: "Please type short report for the training",
        },
      });
    }
    if (this.state.location === "") {
      return this.setState({
        error: {
          target: "location",
          msg: "Please specify training location",
        },
      });
    }
    if (this.state.supporting_doc === null) {
      return this.setState({
        error: {
          target: "supporting_doc",
          msg: "Please select the supporting document (Ex: Certificate or other)",
        },
      });
    }
    this.setState({ loading: true });
    this.props.FC_AddTrainingAttendedReport(
      {
        end_date: this.state.end_date,
        location: this.state.location,
        participant_report: this.state.participant_report,
        provider_id: this.state.provider_id,
        start_date: this.state.start_date,
        supporting_doc: this.state.supporting_doc,
        title: this.state.title,
        training_plan_id: this.state.training_plan_id,
        user_id: this.state.user_id,
      },
      (
        loading: boolean,
        res: { type: "success" | "error"; msg: string } | null
      ) => {
        this.setState({ loading: loading });
        if (res?.type === "success") {
          this.setState({ success: res.msg, loading: true, error: null });
          setTimeout(() => {
            // onSubmit
            this.props.onCreated();
          }, 1000);
        }
        if (res?.type === "error") {
          this.setState({
            success: "",
            error: {
              target: "main",
              msg: res.msg,
            },
            loading: false,
          });
        }
      }
    );
  };
  componentDidMount = () => {
    if (
      this.props.training.training_providers === null ||
      this.props.training.training_providers.length === 0
    ) {
      this.props.FC_GetTrainingProviders((loading: boolean, error: string) =>
        this.setState({ loadingTrainingProviders: loading })
      );
    }
  };
  render() {
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
              <span className="text-xl font-bold">
                Report attended training on selected training plan
              </span>
              <div className="flex flex-row items-center gap-3">
                <div>
                  <BsArrowRightCircle className="text-yellow-600 text-xl" />
                </div>
                <div className="text-sm">{this.props.trainingPlan.title}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-3 px-4 pb-4">
          <form onSubmit={this.AddTrainingAttended} className="w-full">
            <div className="grid grid-cols-12 gap-3 w-full">
              <div className="col-span-6">
                <Input
                  type="text"
                  title={"Training title"}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    this.setState({ title: e.target.value, error: null })
                  }
                  disabled={this.state.loading}
                  value={this.state.title}
                  error={
                    this.state.error?.target === "title"
                      ? this.state.error.msg
                      : ""
                  }
                  onCloseError={() =>
                    this.setState({ error: null, success: "" })
                  }
                />
              </div>
              <div className="col-span-6">
                {this.state.loadingTrainingProviders === true ? (
                  <div>
                    <div className="text-sm">Training Provider</div>
                    <div className="border bg-gray-100 text-yellow-600 w-full px-3 py-2 text-sm animate__animated animate__fadeIn animate__infinite animate__slow rounded-md">
                      Loading training providers ...
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <div>
                      <div className="text-sm">Training Provider</div>
                      <div
                        onClick={() =>
                          this.state.loading === false &&
                          this.setState({
                            openSelectTrainingProvider:
                              !this.state.openSelectTrainingProvider,
                          })
                        }
                        className={`${
                          this.state.error?.target === "provider_id"
                            ? "border-red-600"
                            : this.state.provider_id !== ""
                            ? "text-primary-800 font-semibold"
                            : "bg-gray-100"
                        } px-3 py-2 rounded-md border w-full text-sm flex flex-row items-center justify-between gap-2 cursor-pointer`}
                      >
                        {this.state.provider_id === "" ? (
                          <span className="italic">
                            Select training provider
                          </span>
                        ) : (
                          <span>
                            {
                              this.props.training.training_providers?.find(
                                (itm) =>
                                  itm.provider_id.toString() ===
                                  this.state.provider_id.toString()
                              )?.provider_name
                            }
                          </span>
                        )}
                      </div>
                    </div>
                    {this.state.openSelectTrainingProvider === true && (
                      <div
                        className="absolute pt-2 w-full"
                        style={{ zIndex: 9 }}
                      >
                        <SelectCustom
                          loading={false}
                          id={"provider_id"}
                          title={"provider_name"}
                          close={() =>
                            this.setState({ openSelectTrainingProvider: false })
                          }
                          data={
                            this.props.training.training_providers === null
                              ? []
                              : this.props.training.training_providers
                          }
                          click={(data: {
                            provider_id: string;
                            provider_name: string;
                          }) => {
                            this.setState({
                              provider_id: data.provider_id,
                              openSelectTrainingProvider: false,
                              error: null,
                              success: "",
                            });
                          }}
                        />
                      </div>
                    )}
                  </div>
                )}
                {this.state.error?.target === "provider_id" && (
                  <div>
                    <Alert
                      alertType={AlertType.DANGER}
                      title={this.state.error.msg}
                      close={() => this.setState({ error: null, success: "" })}
                    />
                  </div>
                )}
              </div>
              <div className="col-span-6">
                <Input
                  type="date"
                  title={"Starting date"}
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
                  onCloseError={() =>
                    this.setState({ error: null, success: "" })
                  }
                />
              </div>
              <div className="col-span-6">
                <Input
                  type="date"
                  title={"Ending date"}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    this.setState({ end_date: e.target.value, error: null })
                  }
                  disabled={this.state.loading}
                  value={this.state.end_date}
                  error={
                    this.state.error?.target === "end_date"
                      ? this.state.error.msg
                      : ""
                  }
                  onCloseError={() =>
                    this.setState({ error: null, success: "" })
                  }
                />
              </div>
              <div className="col-span-12">
                <Textarea
                  title={"Training short report"}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    this.setState({
                      participant_report: e.target.value,
                      error: null,
                    })
                  }
                  disabled={this.state.loading}
                  value={this.state.participant_report}
                  error={
                    this.state.error?.target === "participant_report"
                      ? this.state.error.msg
                      : ""
                  }
                  onCloseError={() =>
                    this.setState({ error: null, success: "" })
                  }
                />
              </div>
              <div className="col-span-6">
                <Input
                  type="text"
                  title={"Training location"}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    this.setState({ location: e.target.value, error: null })
                  }
                  disabled={this.state.loading}
                  value={this.state.location}
                  error={
                    this.state.error?.target === "location"
                      ? this.state.error.msg
                      : ""
                  }
                  onCloseError={() =>
                    this.setState({ error: null, success: "" })
                  }
                />
              </div>
              <div className="col-span-6">
                <FileInput
                  title={
                    "Supporting document (EX: Certificate or other) ==> PDF only"
                  }
                  onChange={(file: File) =>
                    this.setState({
                      supporting_doc: file,
                      error: null,
                    })
                  }
                  disabled={this.state.loading}
                  error={
                    this.state.error?.target === "supporting_doc"
                      ? this.state.error.msg
                      : ""
                  }
                  onCloseError={() =>
                    this.setState({ error: null, success: "" })
                  }
                  accept={".pdf"}
                />
              </div>

              <div className="col-span-12">
                {this.state.error?.target === "main" && (
                  <div className="my-2">
                    <Alert
                      alertType={AlertType.DANGER}
                      title={this.state.error.msg}
                      close={() => this.setState({ error: null, success: "" })}
                    />
                  </div>
                )}
                {this.state.success !== "" && (
                  <div className="my-2">
                    <Alert
                      alertType={AlertType.SUCCESS}
                      title={this.state.success}
                      close={() => this.setState({ error: null, success: "" })}
                    />
                  </div>
                )}
                <div className="flex flex-row items-center justify-end">
                  <button
                    type="submit"
                    disabled={this.state.loading}
                    className="bg-green-600 text-white hover:bg-green-700 px-3 py-2 pl-2 rounded-md font-semibold flex flex-row items-center justify-center gap-2"
                  >
                    <div>
                      {this.state.loading === true ? (
                        <AiOutlineLoading3Quarters className="text-xl animate-spin" />
                      ) : (
                        <MdOutlineDataSaverOn className="text-xl" />
                      )}
                    </div>
                    {this.state.loading === true ? (
                      <span className="animate__animated animate__fadeIn animate__infinite">
                        Saving changes...
                      </span>
                    ) : (
                      <span>Add training report</span>
                    )}
                  </button>
                </div>
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
  training,
}: StoreState): {
  auth: Auth;
  training: TrainingStore;
} => {
  return { auth, training };
};

export const AddTrainingAttended = connect(mapStateToProps, {
  FC_AddTrainingAttendedReport,
  FC_GetTrainingProviders,
})(_AddTrainingAttended);
