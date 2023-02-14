import React, { Component } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { BsArrowLeft, BsCheckCircleFill } from "react-icons/bs";
import { MdRadioButtonUnchecked, MdSave } from "react-icons/md";
import {
  ApplicationDetailsInterface,
  FC_UpdatePeerReview,
  PeerReviewSavedData,
  PeerReviewStatusValues,
} from "../../../actions";
import Alert, { AlertType } from "../../Alert/Alert";

interface PeerReviewProps {
  onGoBack: () => void;
  onSave: (reference_number: string) => void;
  data: ApplicationDetailsInterface;
  comment: string;
  status: PeerReviewStatusValues;
  modal: boolean;
}
interface PeerReviewState {
  loading: boolean;
  success: string;
  error: {
    target: "comment" | "main";
    msg: string;
  } | null;
  application_id: string;
  application_ref_number: string;
  comment: string;
  peer_review_status: PeerReviewStatusValues;
}

export class EditPeerReview extends Component<
  PeerReviewProps,
  PeerReviewState
> {
  constructor(props: PeerReviewProps) {
    super(props);

    this.state = {
      loading: false,
      error: null,
      success: "",
      application_id: this.props.data.application_id,
      application_ref_number: this.props.data.application_ref_number,
      comment: this.props.comment,
      peer_review_status: this.props.status,
    };
  }
  SubmitPeerReview = (e: React.FormEvent<HTMLFormElement>) => {
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
    if (this.state.comment === "") {
      return this.setState({
        error: {
          target: "comment",
          msg: "Please select date of screening feedback!",
        },
      });
    }

    // Saving
    this.setState({ loading: true });
    const data_saved: PeerReviewSavedData = {
      application_ref_number: this.state.application_ref_number,
      comment: this.state.comment,
      status: this.state.peer_review_status,
    };
    FC_UpdatePeerReview(
      data_saved,
      this.state.comment !== "" ? "Update" : "Add",
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
                comment: "",
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
                Add peer review information
              </span>
              <span className="text-xs">
                Fill the following fields to updated the system about peer
                review
              </span>
            </div>
          </div>
          <form
            onSubmit={this.SubmitPeerReview}
            className="grid grid-cols-12 gap-3 mt-5"
          >
            {/* ------------------------------------------------------ */}
            <div className="col-span-6">
              {/* Description */}
              <div className="flex flex-col w-full mt-3">
                <span className="text-sm">Peer Review Response</span>
                <textarea
                  value={this.state.comment}
                  onChange={(e) => {
                    this.setState({
                      comment: e.target.value,
                      error: null,
                    });
                  }}
                  disabled={this.state.loading}
                  className={`px-3 py-2 rounded-md border ${
                    this.state.error?.target === "comment"
                      ? "border-red-600 animate__animated animate__shakeX"
                      : "border-gray-400"
                  } w-full text-sm`}
                ></textarea>
                {this.state.error !== null &&
                  this.state.error.target === "comment" && (
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
            {/* Other info STATUS */}
            <div className="col-span-12 flex flex-row items-center gap-3 justify-end">
              {/* Status here */}
              <div className="">
                <div className="font-bold text-lg mb-2">
                  Choose Peer review status
                </div>
                <div className="flex flex-row items-center justify-end">
                  {(
                    [
                      PeerReviewStatusValues.incomplete.toUpperCase(),
                      PeerReviewStatusValues.approved.toUpperCase(),
                      PeerReviewStatusValues.rejected.toUpperCase(),
                    ] as PeerReviewStatusValues[]
                  ).map((item, i) => (
                    <div
                      key={i + 1}
                      className={`${
                        this.state.peer_review_status.toUpperCase() ===
                        item.toUpperCase()
                          ? "bg-primary-100 text-primary-900 font-extrabold"
                          : "text-gray-600 hover:bg-primary-50 hover:text-primary-800"
                      } text-sm p-1 pr-3 rounded-full flex flex-row items-center justify-center gap-2 cursor-pointer`}
                      onClick={() =>
                        this.setState({ peer_review_status: item })
                      }
                    >
                      <div>
                        {this.state.peer_review_status.toUpperCase() ===
                        item.toUpperCase() ? (
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
