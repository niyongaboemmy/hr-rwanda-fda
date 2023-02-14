import React, { Component } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { BsArrowLeft, BsCheckCircleFill } from "react-icons/bs";
import { MdRadioButtonUnchecked, MdSave } from "react-icons/md";
import {
  ApplicationDetailsInterface,
  FC_UpdateScreening,
  ScreeningStatusValues,
} from "../../../actions";
import {
  DATE,
  GetDaysFromTwoDates,
  timestampToDate,
} from "../../../utils/functions";
import Alert, { AlertType } from "../../Alert/Alert";

interface EditScreeningProps {
  onGoBack: () => void;
  onSave: (reference_number: string) => void;
  data: ApplicationDetailsInterface;
  editScreening: "FeedBack" | "Response" | "Status";
  modal: boolean;
}
interface EditScreeningState {
  loading: boolean;
  success: string;
  error: {
    target:
      | "screening_feedback"
      | "date_of_screening_feedback"
      | "screening_response"
      | "date_of_screening_response"
      | "screening_status"
      | "done_by"
      | "done_at"
      | "main";
    msg: string;
  } | null;
  application_id: string;
  application_ref_number: string;
  screening_feedback: string;
  date_of_screening_feedback: string;
  screening_response: string;
  date_of_screening_response: string | null;
  screening_status: ScreeningStatusValues;
  done_by: string;
  done_at: string;
}

export class EditScreening extends Component<
  EditScreeningProps,
  EditScreeningState
> {
  constructor(props: EditScreeningProps) {
    super(props);

    this.state = {
      loading: false,
      error: null,
      success: "",
      application_id: this.props.data.application_id,
      application_ref_number: this.props.data.application_ref_number,
      screening_feedback:
        this.props.data.screenings.length === 0
          ? ""
          : this.props.data.screenings[this.props.data.screenings.length - 1]
              .screening_feedback,
      date_of_screening_feedback:
        this.props.data.screenings.length === 0 ||
        this.props.data.screenings[this.props.data.screenings.length - 1]
          .date_of_screening_feedback === null
          ? ""
          : this.props.data.screenings[this.props.data.screenings.length - 1]
              .date_of_screening_feedback!,
      screening_response:
        this.props.data.screenings.length === 0
          ? ""
          : this.props.data.screenings[this.props.data.screenings.length - 1]
              .screening_response,
      date_of_screening_response:
        this.props.data.screenings.length === 0
          ? ""
          : this.props.data.screenings[this.props.data.screenings.length - 1]
              .date_of_screening_response,
      screening_status:
        this.props.data.screenings.length === 0
          ? ScreeningStatusValues.PROGRESS_IN_SCREENING
          : this.props.data.screenings[this.props.data.screenings.length - 1]
              .screening_status,
      done_by:
        this.props.data.screenings.length === 0 ||
        this.props.data.screenings[this.props.data.screenings.length - 1]
          .done_by === undefined
          ? ""
          : this.props.data.screenings[this.props.data.screenings.length - 1]
              .done_by!,
      done_at: "",
    };
  }
  SubmitScreening = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (this.state.application_id === "") {
      return this.setState({
        error: { target: "main", msg: "Please select application ID" },
      });
    }
    if (this.state.application_ref_number === "") {
      return this.setState({
        error: {
          target: "main",
          msg: "Please select application reference number!",
        },
      });
    }
    if (
      this.state.date_of_screening_feedback === "" &&
      this.props.editScreening === "FeedBack"
    ) {
      return this.setState({
        error: {
          target: "date_of_screening_feedback",
          msg: "Please select date of screening feedback!",
        },
      });
    }
    if (
      this.state.date_of_screening_response === "" &&
      this.props.editScreening === "Response"
    ) {
      return this.setState({
        error: {
          target: "date_of_screening_response",
          msg: "Please select date of screening response!",
        },
      });
    }
    if (
      this.state.date_of_screening_response !== null &&
      GetDaysFromTwoDates(
        DATE(this.state.date_of_screening_response, "MM/DD/YYYY"),
        DATE(timestampToDate(new Date()).fullDATE, "MM/DD/YYYY")
      ) < 0
    ) {
      return this.setState({
        error: {
          target: "date_of_screening_response",
          msg: "Please this date should be less than or equal to today date!",
        },
      });
    }
    if (this.state.done_by === "") {
      return this.setState({
        error: {
          target: "done_by",
          msg: "Please type names of who did screening!",
        },
      });
    }
    if (
      this.state.date_of_screening_response !== "" &&
      this.state.date_of_screening_response !== null &&
      this.state.date_of_screening_feedback !== null &&
      this.state.date_of_screening_feedback !== ""
    ) {
      if (
        GetDaysFromTwoDates(
          DATE(this.state.date_of_screening_feedback, "MM/DD/YYYY"),
          DATE(this.state.date_of_screening_response, "MM/DD/YYYY")
        ) < 0
      ) {
        return this.setState({
          error: {
            target: "date_of_screening_feedback",
            msg: "Please choose the correct date, the date should be greater than or equal to response date!",
          },
        });
      }
    }
    // Saving
    this.setState({ loading: true });
    const data_saved = {
      application_id: this.state.application_id,
      application_ref_number: this.state.application_ref_number,
      date_of_screening_feedback:
        this.state.date_of_screening_feedback === "" ||
        this.state.date_of_screening_response === null
          ? null
          : DATE(this.state.date_of_screening_feedback, "YYYY/MM/DD"),
      date_of_screening_response:
        this.state.date_of_screening_response === "" ||
        this.state.date_of_screening_response === null
          ? null
          : DATE(this.state.date_of_screening_response, "YYYY/MM/DD"),
      screening_feedback:
        this.state.screening_feedback === ""
          ? "Submitted with no comment"
          : this.state.screening_feedback,
      screening_response:
        this.state.screening_response === ""
          ? "Submitted with no comment"
          : this.state.screening_response,
      screening_status: this.state.screening_status,
      done_by: this.state.done_by,
      done_at: this.state.done_at,
    };
    console.log("Submitted: ", data_saved);
    FC_UpdateScreening(
      data_saved,
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
                date_of_screening_feedback: "",
                date_of_screening_response: "",
                screening_feedback: "",
                screening_response: "",
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
        <div
          className={`${
            this.props.modal === true ? "bg-gray-200" : "bg-white"
          } rounded-md p-3 animate__animated animate__fadeIn`}
        >
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
                Add screening {this.props.editScreening} information
              </span>
              <span className="text-xs">
                Fill the following fields to updated the system about screening
              </span>
            </div>
          </div>
          <form
            onSubmit={this.SubmitScreening}
            className="grid grid-cols-12 gap-3 mt-5"
          >
            {this.props.editScreening === "FeedBack" && (
              <div className="col-span-6">
                <div className="flex flex-col w-full">
                  <span className="text-sm">Date of screening feedback</span>
                  <input
                    type="date"
                    value={DATE(
                      this.state.date_of_screening_feedback,
                      "YYYY/MM/DD"
                    )}
                    onChange={(e) => {
                      this.setState({
                        date_of_screening_feedback: e.target.value,
                        error: null,
                      });
                    }}
                    disabled={this.state.loading}
                    className={`px-3 py-2 rounded-md border ${
                      this.state.error?.target === "date_of_screening_feedback"
                        ? "border-red-600 animate__animated animate__shakeX"
                        : "border-gray-400"
                    } w-full text-sm`}
                  />
                  {this.state.error !== null &&
                    this.state.error.target ===
                      "date_of_screening_feedback" && (
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
                  <span className="text-sm">Screening feedback (Optional)</span>
                  <textarea
                    value={this.state.screening_feedback}
                    onChange={(e) => {
                      this.setState({
                        screening_feedback: e.target.value,
                        error: null,
                      });
                    }}
                    disabled={this.state.loading}
                    className={`px-3 py-2 rounded-md border ${
                      this.state.error?.target === "screening_feedback"
                        ? "border-red-600 animate__animated animate__shakeX"
                        : "border-gray-400"
                    } w-full text-sm`}
                  ></textarea>
                  {this.state.error !== null &&
                    this.state.error.target === "screening_feedback" && (
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
            )}
            {/* ------------------------------------------------------ */}
            {this.props.editScreening === "Response" && (
              <div className="col-span-6">
                <div className="flex flex-col w-full">
                  <span className="text-sm">Date of screening response</span>
                  <input
                    type="date"
                    value={
                      this.state.date_of_screening_response === null
                        ? ""
                        : DATE(
                            this.state.date_of_screening_response,
                            "YYYY/MM/DD"
                          )
                    }
                    onChange={(e) => {
                      this.setState({
                        date_of_screening_response: e.target.value,
                        error: null,
                      });
                    }}
                    disabled={this.state.loading}
                    className={`px-3 py-2 rounded-md border ${
                      this.state.error?.target === "date_of_screening_response"
                        ? "border-red-600 animate__animated animate__shakeX"
                        : "border-gray-400"
                    } w-full text-sm`}
                  />
                  {this.state.error !== null &&
                    this.state.error.target ===
                      "date_of_screening_response" && (
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
                <div className="flex flex-col w-full mt-3">
                  <span className="text-sm">Screening response (Optional)</span>
                  <textarea
                    value={this.state.screening_response}
                    onChange={(e) => {
                      this.setState({
                        screening_response: e.target.value,
                        error: null,
                      });
                    }}
                    disabled={this.state.loading}
                    className={`px-3 py-2 rounded-md border ${
                      this.state.error?.target === "screening_response"
                        ? "border-red-600 animate__animated animate__shakeX"
                        : "border-gray-400"
                    } w-full text-sm`}
                  ></textarea>
                  {this.state.error !== null &&
                    this.state.error.target === "screening_response" && (
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
            )}
            <div className="col-span-6"></div>
            {this.props.editScreening === "Status" && (
              <div className="col-span-6"></div>
            )}
            <div className="col-span-6 flex flex-col gap-2">
              <div className="">
                <div className="flex flex-col w-full my-3">
                  <span className="text-sm">Screened by</span>
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
            <div className="col-span-12">
              <div>
                <div className="font-bold text-lg mb-2">
                  Choose Screening status
                </div>
                <div className="flex flex-row items-center ">
                  {[
                    ScreeningStatusValues.PROGRESS_IN_SCREENING,
                    ScreeningStatusValues.SCREENING_COMPLETED,
                    ScreeningStatusValues.WITHDRAWN,
                  ].map((item, i) => (
                    <div
                      key={i + 1}
                      className={`${
                        this.state.screening_status === item
                          ? "bg-primary-100 text-primary-900 font-extrabold"
                          : "text-gray-600 hover:bg-primary-50 hover:text-primary-800"
                      } text-sm p-1 pr-3 rounded-full flex flex-row items-center justify-center gap-2 cursor-pointer`}
                      onClick={() => this.setState({ screening_status: item })}
                    >
                      <div>
                        {this.state.screening_status === item ? (
                          <BsCheckCircleFill className="text-2xl" />
                        ) : (
                          <MdRadioButtonUnchecked className="text-2xl" />
                        )}
                      </div>
                      <span>{item}</span>
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

export default EditScreening;
