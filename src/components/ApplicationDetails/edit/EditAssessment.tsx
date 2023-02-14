import React, { Component } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { BsArrowLeft, BsCheckCircleFill } from "react-icons/bs";
import { MdRadioButtonUnchecked, MdSave } from "react-icons/md";
import {
  ApplicationDetailsInterface,
  AssessmentOutcomeValues,
  FC_UpdateAssessment,
  LevelsValues,
  RoundValues,
} from "../../../actions";
import { DATE } from "../../../utils/functions";
import Alert, { AlertType } from "../../Alert/Alert";
import { GetRoundName } from "../Assessment";

interface EditAssessmentProps {
  onGoBack: () => void;
  onSave: (reference_number: string) => void;
  data: ApplicationDetailsInterface;
  assessment_level: LevelsValues;
  assessment_round: RoundValues;
  assessment_start_date: string;
  assessment_end_date: string;
  assessment_outcome: AssessmentOutcomeValues;
  assessment_comment: string;
  done_by: string;
  action_type: "Update" | "Add";
}
interface EditAssessmentState {
  loading: boolean;
  success: string;
  error: {
    target:
      | "assessment_round"
      | "assessment_round"
      | "assessment_start_date"
      | "assessment_end_date"
      | "assessment_outcome"
      | "assessment_comment"
      | "done_by"
      | "main";
    msg: string;
  } | null;
  application_ref_number: string;
  assessment_level: LevelsValues;
  assessment_round: RoundValues;
  assessment_start_date: string;
  assessment_end_date: string;
  assessment_outcome: AssessmentOutcomeValues;
  assessment_comment: string;
  done_by: string;
  done_at: string | null;
}

export class EditAssessment extends Component<
  EditAssessmentProps,
  EditAssessmentState
> {
  constructor(props: EditAssessmentProps) {
    super(props);

    this.state = {
      loading: false,
      error: null,
      success: "",
      application_ref_number: this.props.data.application_ref_number,
      assessment_level: this.props.assessment_level,
      assessment_round: this.props.assessment_round,
      assessment_start_date: this.props.assessment_start_date,
      assessment_end_date: this.props.assessment_end_date,
      assessment_outcome: this.props.assessment_outcome,
      assessment_comment: this.props.assessment_comment,
      done_by: this.props.done_by,
      done_at: "", //Default change it to null
    };
  }
  SubmitAssessment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (this.state.application_ref_number === "") {
      return this.setState({
        error: {
          target: "main",
          msg: "Please select application reference number!",
        },
      });
    }

    if (this.state.assessment_start_date === "") {
      return this.setState({
        error: {
          target: "assessment_start_date",
          msg: "Please select assessment start date!",
        },
      });
    }
    if (this.state.assessment_end_date === "") {
      return this.setState({
        error: {
          target: "assessment_end_date",
          msg: "Please select assessment ending date!",
        },
      });
    }
    if (this.state.done_by === "") {
      return this.setState({
        error: {
          target: "done_by",
          msg: "Please type name of person who did assessment!",
        },
      });
    }
    // Saving
    this.setState({ loading: true });
    const data_saved = {
      application_ref_number: this.state.application_ref_number,
      assessment_level: this.state.assessment_level,
      assessment_round: this.state.assessment_round,
      assessment_start_date: DATE(
        this.state.assessment_start_date,
        "YYYY/MM/DD"
      ),
      assessment_end_date: DATE(this.state.assessment_end_date, "YYYY/MM/DD"),
      assessment_outcome: this.state.assessment_outcome,
      assessment_comment:
        this.state.assessment_comment === ""
          ? "No comment"
          : this.state.assessment_comment,
      done_by: this.state.done_by,
      done_at: this.state.done_at,
    };
    FC_UpdateAssessment(
      data_saved,
      this.props.action_type,
      (
        loading: boolean,
        feedback: {
          type: "success" | "error";
          msg: string;
        } | null
      ) => {
        this.setState({
          loading: loading,
        });
        if (loading === false) {
          if (feedback !== null) {
            if (feedback.type === "success") {
              this.setState({
                error: null,
                success: feedback.msg,
                assessment_start_date: "",
                assessment_end_date: "",
                assessment_comment: "",
              });
              //   OnSave
              this.props.onSave(this.state.application_ref_number);
            }
            if (feedback.type === "error") {
              this.setState({
                error: {
                  target: "main",
                  msg: feedback.msg,
                },
                success: "",
              });
            }
          }
        }
      }
    );
  };
  render() {
    return (
      <div>
        <div className="bg-white rounded-md p-3 animate__animated animate__fadeIn">
          {/* Title here */}
          <div></div>
          {/* Details */}
          <div className="flex flex-row items-center gap-3">
            <div className="">
              <div
                onClick={this.props.onGoBack}
                className={`bg-gray-100 cursor-pointer hover:bg-primary-100 hover:text-primary-800 flex items-center justify-center h-10 w-10 rounded-full`}
              >
                <BsArrowLeft className="text-3xl" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold">
                Add Assessment Outcomes
              </span>
              <span className="text-xs">
                Fill the following fields to updated the system about assessment
                outcomes
              </span>
            </div>
          </div>
          <form
            onSubmit={this.SubmitAssessment}
            className="grid grid-cols-12 gap-3 mt-5"
          >
            <div className="col-span-6">
              <div className="flex flex-col w-full">
                <span className="text-sm">Start date of assessment</span>
                <input
                  type="date"
                  value={
                    this.state.assessment_start_date === ""
                      ? ""
                      : DATE(this.state.assessment_start_date, "YYYY/MM/DD")
                  }
                  onChange={(e) => {
                    this.setState({
                      assessment_start_date: e.target.value,
                      error: null,
                    });
                  }}
                  disabled={this.state.loading}
                  className={`px-3 py-2 rounded-md border ${
                    this.state.error?.target === "assessment_start_date"
                      ? "border-red-600 animate__animated animate__shakeX"
                      : "border-gray-400"
                  } w-full text-sm`}
                />
                {this.state.error !== null &&
                  this.state.error.target === "assessment_start_date" && (
                    <div className="my-2">
                      <Alert
                        alertType={AlertType.DANGER}
                        title={"Invalid input!"}
                        description={this.state.error.msg}
                        close={() => {
                          this.setState({
                            error: null,
                          });
                        }}
                      />
                    </div>
                  )}
              </div>
              {/* Description here */}
              <div className="flex flex-col w-full mt-3">
                <span className="text-sm">Assessment comment (Optional)</span>
                <textarea
                  value={this.state.assessment_comment}
                  onChange={(e) => {
                    this.setState({
                      assessment_comment: e.target.value,
                      error: null,
                    });
                  }}
                  disabled={this.state.loading}
                  className={`px-3 py-2 rounded-md border ${
                    this.state.error?.target === "assessment_comment"
                      ? "border-red-600 animate__animated animate__shakeX"
                      : "border-gray-400"
                  } w-full text-sm`}
                ></textarea>
                {this.state.error !== null &&
                  this.state.error.target === "assessment_comment" && (
                    <div className="my-2">
                      <Alert
                        alertType={AlertType.DANGER}
                        title={"Invalid input!"}
                        description={this.state.error.msg}
                        close={() => {
                          this.setState({
                            error: null,
                          });
                        }}
                      />
                    </div>
                  )}
              </div>
            </div>
            {/* ------------------------------------------------------ */}
            <div className="col-span-6">
              <div className="flex flex-col w-full">
                <span className="text-sm">Ending date of assessment</span>
                <input
                  type="date"
                  value={
                    this.state.assessment_end_date === ""
                      ? ""
                      : DATE(this.state.assessment_end_date, "YYYY/MM/DD")
                  }
                  onChange={(e) => {
                    this.setState({
                      assessment_end_date: e.target.value,
                      error: null,
                    });
                  }}
                  disabled={this.state.loading}
                  className={`px-3 py-2 rounded-md border ${
                    this.state.error?.target === "assessment_end_date"
                      ? "border-red-600 animate__animated animate__shakeX"
                      : "border-gray-400"
                  } w-full text-sm`}
                />
                {this.state.error !== null &&
                  this.state.error.target === "assessment_end_date" && (
                    <div className="my-2">
                      <Alert
                        alertType={AlertType.DANGER}
                        title={"Invalid input!"}
                        description={this.state.error.msg}
                        close={() => {
                          this.setState({
                            error: null,
                          });
                        }}
                      />
                    </div>
                  )}
              </div>
              {/* Description */}
              <div className="flex flex-row w-full items-center justify-between gap-3 my-2 mt-7 text-primary-900">
                <div className="flex flex-col w-full rounded-md bg-primary-50 px-4 py-3 text-sm">
                  <span className="font-light">Selected Level</span>
                  <span className="font-bold">
                    {this.props.assessment_level}
                  </span>
                </div>
                <div className="flex flex-col w-full rounded-md bg-primary-50 px-4 py-3 text-sm">
                  <span className="font-light">Selected round</span>
                  <span className="font-bold">
                    {GetRoundName(this.props.assessment_round)}
                  </span>
                </div>
              </div>
            </div>
            <div className="col-span-6 flex flex-col gap-2">
              <div className="">
                <div className="flex flex-col w-full">
                  <span className="text-sm">Assessor names</span>
                  <input
                    value={this.state.done_by}
                    onChange={(e) => {
                      this.setState({
                        done_by: e.target.value,
                        error: null,
                      });
                    }}
                    disabled={this.state.loading}
                    className={`px-3 py-2 rounded-md border ${
                      this.state.error?.target === "done_by"
                        ? "border-red-600 animate__animated animate__shakeX"
                        : "border-gray-400"
                    } w-full text-sm`}
                  />
                  {this.state.error !== null &&
                    this.state.error.target === "done_by" && (
                      <div className="my-2">
                        <Alert
                          alertType={AlertType.DANGER}
                          title={"Invalid input!"}
                          description={this.state.error.msg}
                          close={() => {
                            this.setState({
                              error: null,
                            });
                          }}
                        />
                      </div>
                    )}
                </div>
              </div>
            </div>
            <div className="col-span-6"></div>
            {/* Other info STATUS */}
            <div className="col-span-12 flex flex-row items-center gap-3 justify-end">
              {/* Status here */}
              <div className="">
                <div className="font-bold text-lg mb-2">
                  Choose Assessment Outcome
                </div>
                <div className="flex flex-row items-center justify-end">
                  {(this.props.assessment_round === RoundValues.ROUND_FOUR &&
                  this.props.assessment_level === LevelsValues.LEVEL_TWO
                    ? [AssessmentOutcomeValues.NR, AssessmentOutcomeValues.R]
                    : [
                        AssessmentOutcomeValues.NR,
                        AssessmentOutcomeValues.OG,
                        AssessmentOutcomeValues.R,
                      ]
                  ).map((item, i) => (
                    <div
                      key={i + 1}
                      className={`${
                        this.state.assessment_outcome === item
                          ? "bg-primary-100 text-primary-900 font-extrabold"
                          : "text-gray-600 hover:bg-primary-50 hover:text-primary-800"
                      } text-sm p-1 pr-3 rounded-full flex flex-row items-center justify-center gap-2 cursor-pointer`}
                      onClick={() =>
                        this.setState({ assessment_outcome: item })
                      }
                    >
                      <div>
                        {this.state.assessment_outcome === item ? (
                          <BsCheckCircleFill className="text-2xl" />
                        ) : (
                          <MdRadioButtonUnchecked className="text-2xl" />
                        )}
                      </div>
                      <div className="truncate">
                        {item === AssessmentOutcomeValues.NR
                          ? "NOT RECOMMENDED"
                          : item === AssessmentOutcomeValues.OG
                          ? "ONGOING ASSESSMENT"
                          : "RECOMMENDED"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-row items-center justify-end mt-3 w-full">
                <div className="w-full">
                  <div className="my-2 w-full">
                    {this.state.error !== null &&
                      this.state.error.target === "main" && (
                        <Alert
                          alertType={AlertType.DANGER}
                          title={"Error Occurred!"}
                          description={this.state.error.msg}
                          close={() => {
                            this.setState({
                              error: null,
                              success: "",
                            });
                          }}
                        />
                      )}
                  </div>
                  {this.state.success !== "" && (
                    <div className="my-2">
                      <Alert
                        alertType={AlertType.SUCCESS}
                        title={"Action succeeded!"}
                        description={this.state.success}
                        close={() => {
                          this.setState({
                            error: null,
                            success: "",
                          });
                        }}
                      />
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={this.state.loading}
                    className="flex flex-row items-center justify-center gap-2 font-normal px-3 py-2 rounded-md cursor-pointer text-white bg-primary-800 hover:bg-primary-900"
                  >
                    <div>
                      {this.state.loading === true ? (
                        <AiOutlineLoading3Quarters className="text-xl animate-spin" />
                      ) : (
                        <MdSave className="text-xl" />
                      )}
                    </div>
                    <span>
                      {this.state.loading === true
                        ? "Loading..."
                        : "Save changes"}
                    </span>
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

export default EditAssessment;
