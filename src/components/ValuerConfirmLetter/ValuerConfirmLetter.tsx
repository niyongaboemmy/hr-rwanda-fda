import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Auth,
  InstructionLetterStore,
  FC_GetInstructionLetterByBranch,
  FC_ValuerApproveInstructionLetter,
  InstructionLetterInterface,
} from "../../actions";
import { StoreState } from "../../reducers";
import Alert, { AlertType } from "../Alert/Alert";
import Loading from "../Loading/Loading";

export const ValuerComments = [
  {
    key: 1,
    comment: "The case has completed",
  },
  {
    key: 2,
    comment: "The case has failed",
  },
  {
    key: 3,
    comment: "I did not found the client",
  },
  {
    key: 4,
    comment: "The case is not well defined",
  },
  {
    key: 5,
    comment: "Other",
  },
];

interface ValuerConfirmLetterProps {
  onCancel: () => void;
  onSave: () => void;
  instructionLetters: InstructionLetterStore;
  selected_letter: InstructionLetterInterface;
  auth: Auth;
  FC_GetInstructionLetterByBranch: (
    branch_id: string,
    setLoading: (loading: boolean) => void
  ) => void;
  FC_ValuerApproveInstructionLetter: (
    user_id: string,
    letter_id: string,
    valuer_comment: string,
    callBack: (
      loading: boolean,
      res: { type: "error" | "success"; msg: string }
    ) => void
  ) => void;
}
interface ValuerConfirmLetterState {
  loading: boolean;
  error: string;
  success: string;
  valuer_comment: string;
  selected_comment: string;
}

class _App extends Component<
  ValuerConfirmLetterProps,
  ValuerConfirmLetterState
> {
  constructor(props: ValuerConfirmLetterProps) {
    super(props);

    this.state = {
      loading: false,
      error: "",
      success: "",
      valuer_comment: "",
      selected_comment: "",
    };
  }
  render() {
    if (this.state.loading === true) {
      return (
        <div className="bg-white rounded-md p-2 pt-10 mt-3 w-full">
          <Loading />
          <div className="-mt-10 ml-4 mb-3 animate-pulse">
            Loading, please wait...
          </div>
        </div>
      );
    }
    return (
      <div className="p-5">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (this.state.valuer_comment === "") {
              this.setState({
                error: "Please fill valuation comment!",
                success: "",
              });
            } else {
              this.props.auth.user &&
                this.props.FC_ValuerApproveInstructionLetter(
                  this.props.auth.user.user_id,
                  this.props.selected_letter.instruction_letter_id,
                  this.state.valuer_comment,
                  (
                    loading: boolean,
                    res: {
                      type: "error" | "success";
                      msg: string;
                    }
                  ) => {
                    this.setState({ loading: loading });
                    if (res.type === "error") {
                      this.setState({ error: res.msg });
                    } else {
                      if (res.msg !== "") {
                        this.setState({ success: res.msg });
                        this.props.FC_GetInstructionLetterByBranch(
                          this.props.selected_letter.bank_branch_id,
                          (loading: boolean) =>
                            this.setState({ loading: loading })
                        );
                        this.props.onSave();
                      }
                    }
                  }
                );
            }
          }}
          className="w-full"
        >
          <div className="font-extrabold text-2xl">Conclusion on the case</div>
          <div className="font-light mb-3">
            After working on the case, you are required to provide information
            about instruction letter where you are completed the task
          </div>
          <div className="w-full flex flex-col items-center justify-center gap-1">
            <div className="w-full text-left text-base font-bold mt-2">
              Valuation conclusion
            </div>
            <select
              onChange={(e) => {
                this.setState({
                  selected_comment: e.target.value,
                  valuer_comment:
                    e.target.value === "Other" ? "" : e.target.value,
                });
              }}
              disabled={this.state.loading}
              value={this.state.selected_comment}
              className="px-3 py-2 rounded border-2 border-gray-400 w-full bg-white mb-2"
            >
              <option value="">Choose instruction letter status</option>
              {ValuerComments.map((item, i) => (
                <option key={i + 1} value={item.comment}>
                  {item.comment}
                </option>
              ))}
            </select>
            {this.state.selected_comment === "Other" && (
              <textarea
                className="px-3 py-2 rounded border-2 border-gray-500 w-full"
                cols={10}
                rows={3}
                value={this.state.valuer_comment}
                onChange={(e) => {
                  this.setState({ valuer_comment: e.target.value });
                }}
              ></textarea>
            )}
            {this.state.error !== "" && (
              <div className="w-full mt-3 rounded-md animate__animated animate__fadeIn bg-white p-1">
                <Alert
                  alertType={AlertType.DANGER}
                  title={"Failed to load data!"}
                  description={this.state.error}
                  close={() => this.setState({ error: "" })}
                />
              </div>
            )}

            {this.state.success !== "" && (
              <div className="w-full mt-3 rounded-md animate__animated animate__fadeIn bg-white p-1">
                <Alert
                  alertType={AlertType.SUCCESS}
                  title={"Action done successfully!"}
                  description={this.state.success}
                  close={() => this.setState({ success: "" })}
                />
              </div>
            )}
            <div className="mt-5 flex flex-row items-center gap-2">
              <div
                onClick={() => {
                  if (
                    window.confirm(
                      "Are you sure do you want to cancel the process"
                    ) === true
                  ) {
                    this.props.onCancel();
                  }
                }}
                className="bg-gray-300 text-black hover:bg-primary-900 px-3 py-2 rounded cursor-pointer w-max hover:text-white"
              >
                Close
              </div>
              <button
                type="submit"
                className="bg-primary-800 hover:bg-primary-900 px-3 py-2 rounded cursor-pointer w-max text-white"
              >
                Yes, the case is completed
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = ({
  instructionLetters,
  auth,
}: StoreState): {
  instructionLetters: InstructionLetterStore;
  auth: Auth;
} => {
  return { instructionLetters, auth };
};

export const ValuerConfirmLetter = connect(mapStateToProps, {
  FC_GetInstructionLetterByBranch,
  FC_ValuerApproveInstructionLetter,
})(_App);
