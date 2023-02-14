import React, { Component } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { BsArrowLeft } from "react-icons/bs";
import { MdSave } from "react-icons/md";
import {
  ApplicationDetailsInterface,
  AssessmentQuerySaveData,
  FC_SendQuery,
  RoundValues,
} from "../../../actions";
import { DATE, GetDaysFromTwoDates } from "../../../utils/functions";
import Alert, { AlertType } from "../../Alert/Alert";
import { GetRoundName } from "../Assessment";

interface EditQueryProps {
  onGoBack: () => void;
  onSave: (reference_number: string) => void;
  data: ApplicationDetailsInterface;
  EditQuery: "Issue" | "Response";
  selectedRound: RoundValues;
  application_ref_number: string;
  query_issued: string;
  query_issued_date: string;
  query_response: string;
  query_response_date: string;
}
interface EditQueryState {
  loading: boolean;
  success: string;
  error: {
    target:
      | "query_issued"
      | "query_issued_date"
      | "query_response"
      | "query_response_date"
      | "main";
    msg: string;
  } | null;
  application_ref_number: string;
  query_issued: string;
  query_issued_date: string;
  query_response: string;
  query_response_date: string;
  type: "Issue" | "Response";
}

export class EditQuery extends Component<EditQueryProps, EditQueryState> {
  constructor(props: EditQueryProps) {
    super(props);

    this.state = {
      loading: false,
      error: null,
      success: "",
      application_ref_number: this.props.data.application_ref_number,
      query_issued: this.props.query_issued,
      query_issued_date: this.props.query_issued_date,
      query_response: this.props.query_response,
      query_response_date: this.props.query_response_date,
      type: this.props.EditQuery,
    };
  }
  SubmitScreening = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (this.state.application_ref_number === "") {
      return this.setState({
        error: {
          target: "main",
          msg: "Please select application reference number!",
        },
      });
    }
    if (this.state.query_issued === "" && this.state.type === "Issue") {
      return this.setState({
        error: {
          target: "query_issued",
          msg: "Please type the assessment query issue!",
        },
      });
    }
    if (this.state.query_issued_date === "" && this.state.type === "Issue") {
      return this.setState({
        error: {
          target: "query_issued_date",
          msg: "Please enter query issue date!",
        },
      });
    }
    if (
      this.state.query_response_date === "" &&
      this.state.type === "Response"
    ) {
      return this.setState({
        error: {
          target: "query_response_date",
          msg: "Please enter date of query response from applicant!",
        },
      });
    }
    if (this.state.query_response === "" && this.state.type === "Response") {
      return this.setState({
        error: {
          target: "query_response",
          msg: "Please enter query response from applicant!",
        },
      });
    }
    if (
      this.state.query_issued_date !== "" &&
      this.state.query_issued_date !== null &&
      this.state.query_response_date !== null &&
      this.state.query_response_date !== ""
    ) {
      if (
        GetDaysFromTwoDates(
          DATE(this.state.query_issued_date, "MM/DD/YYYY"),
          DATE(this.state.query_response_date, "MM/DD/YYYY")
        ) < 0
      ) {
        return this.setState({
          error: {
            target: "query_response_date",
            msg: "Invalid date, please the response date should be greater than or equal to issue date!",
          },
        });
      }
    }
    // Saving
    this.setState({ loading: true });
    const data_saved: AssessmentQuerySaveData = {
      application_ref_number: this.props.data.application_ref_number,
      query_issued: this.state.query_issued,
      query_issued_date: DATE(this.state.query_issued_date, "YYYY/MM/DD"),
      query_response: this.state.query_response,
      query_response_date:
        this.state.query_response_date === "" ||
        this.state.query_response_date === null
          ? null
          : DATE(this.state.query_response_date, "YYYY/MM/DD"),
      assessment_round: this.props.selectedRound,
    };
    console.log("Submitted: ", data_saved);
    FC_SendQuery(
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
              <div className="text-xl font-extrabold">
                {GetRoundName(this.props.selectedRound)} Query details
              </div>
              <div className="text-xs">
                Fill the following fields to updated query details
              </div>
              {this.props.EditQuery === "Response" && (
                <div className="flex flex-row items-center gap-2 mt-2">
                  <div
                    onClick={() => this.setState({ type: "Issue" })}
                    className={`px-3 py-2 rounded-md text-sm ${
                      this.state.type === "Issue"
                        ? "font-bold cursor-not-allowed bg-primary-100 text-primary-900"
                        : "cursor-pointer bg-gray-200 hover:bg-primary-50 hover:text-primary-900"
                    }`}
                  >
                    Query Issue
                  </div>
                  <div
                    onClick={() => this.setState({ type: "Response" })}
                    className={`px-3 py-2 rounded-md text-sm ${
                      this.state.type === "Response"
                        ? "font-bold cursor-not-allowed bg-primary-100 text-primary-900"
                        : "cursor-pointer bg-gray-200 hover:bg-primary-50 hover:text-primary-900"
                    }`}
                  >
                    Query Response
                  </div>
                </div>
              )}
            </div>
          </div>
          <form
            onSubmit={this.SubmitScreening}
            className="grid grid-cols-12 gap-3 mt-5"
          >
            {this.state.type === "Issue" && (
              <div className="col-span-6">
                <div className="flex flex-col w-full">
                  <span className="text-sm">Date of query issue</span>
                  <input
                    type="date"
                    value={DATE(this.state.query_issued_date, "YYYY/MM/DD")}
                    onChange={(e) => {
                      this.setState({
                        query_issued_date: e.target.value,
                        error: null,
                      });
                    }}
                    disabled={this.state.loading}
                    className={`px-3 py-2 rounded-md border ${
                      this.state.error?.target === "query_issued_date"
                        ? "border-red-600 animate__animated animate__shakeX"
                        : "border-gray-400"
                    } w-full text-sm`}
                  />
                  {this.state.error !== null &&
                    this.state.error.target === "query_issued_date" && (
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
                  <span className="text-sm">Describe query issue</span>
                  <textarea
                    value={this.state.query_issued}
                    onChange={(e) => {
                      this.setState({
                        query_issued: e.target.value,
                        error: null,
                      });
                    }}
                    disabled={this.state.loading}
                    className={`px-3 py-2 rounded-md border ${
                      this.state.error?.target === "query_issued"
                        ? "border-red-600 animate__animated animate__shakeX"
                        : "border-gray-400"
                    } w-full text-sm`}
                  ></textarea>
                  {this.state.error !== null &&
                    this.state.error.target === "query_issued" && (
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
            {this.state.type === "Response" && (
              <div className="col-span-6">
                <div className="flex flex-col w-full">
                  <span className="text-sm">Date of qery response</span>
                  <input
                    type="date"
                    value={
                      this.state.query_response_date === null
                        ? ""
                        : DATE(this.state.query_response_date, "YYYY/MM/DD")
                    }
                    onChange={(e) => {
                      this.setState({
                        query_response_date: e.target.value,
                        error: null,
                      });
                    }}
                    disabled={this.state.loading}
                    className={`px-3 py-2 rounded-md border ${
                      this.state.error?.target === "query_response_date"
                        ? "border-red-600 animate__animated animate__shakeX"
                        : "border-gray-400"
                    } w-full text-sm`}
                  />
                  {this.state.error !== null &&
                    this.state.error.target === "query_response_date" && (
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
                  <span className="text-sm">Query response details</span>
                  <textarea
                    value={this.state.query_response}
                    onChange={(e) => {
                      this.setState({
                        query_response: e.target.value,
                        error: null,
                      });
                    }}
                    disabled={this.state.loading}
                    className={`px-3 py-2 rounded-md border ${
                      this.state.error?.target === "query_response"
                        ? "border-red-600 animate__animated animate__shakeX"
                        : "border-gray-400"
                    } w-full text-sm`}
                  ></textarea>
                  {this.state.error !== null &&
                    this.state.error.target === "query_response" && (
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

            <div className="col-span-12">
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

export default EditQuery;
