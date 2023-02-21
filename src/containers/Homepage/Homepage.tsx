import React, { Component } from "react";
import {
  AiFillEye,
  AiOutlineEyeInvisible,
  AiOutlineLoading3Quarters,
  AiOutlineLogin,
} from "react-icons/ai";
import { StoreState } from "../../reducers";
import { Auth, FC_GetSystemInfo, FC_Login, System } from "../../actions";
import { connect } from "react-redux";
import Alert, { AlertType } from "../../components/Alert/Alert";
import { Redirect } from "react-router";

interface AppProps {
  auth: Auth;
  system: System;
  FC_Login: (
    data: {
      username: string;
      password: string;
    },
    CallbackFunc: Function
  ) => void;
  FC_GetSystemInfo: (callback: (loading: boolean) => void) => void;
}

interface AppState {
  redirect: boolean;
  username: string;
  password: string;
  loading: boolean;
  error: {
    target: string | null;
    msg: string;
  };
  passwordDisplay: boolean;
}

class _App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);

    this.state = {
      redirect: false,
      username: "",
      password: "",
      loading: false,
      error: {
        target: null,
        msg: "",
      },
      passwordDisplay: false,
    };
  }
  LoginFn = async (e: any) => {
    e.preventDefault();
    if (this.state.username === "") {
      return this.setState({
        error: {
          target: "username",
          msg: "Please fill phone number or email",
        },
      });
    }
    if (this.state.password === "") {
      return this.setState({
        error: {
          target: "password",
          msg: "Please fill password",
        },
      });
    }
    if (this.state.username !== "" && this.state.password !== "") {
      this.setState({ loading: true });
      this.props.FC_Login(
        { username: this.state.username, password: this.state.password },
        (status: boolean, msg: string) => {
          status === false &&
            this.setState({
              error: {
                target: "main",
                msg: msg,
              },
            });
          if (status === true) {
            this.setState({ redirect: true });
          } else {
            this.setState({ loading: false });
          }
        }
      );
    }
  };
  componentDidMount = () => {};
  render() {
    if (
      this.props.auth.isAuthenticated === true ||
      this.state.redirect === true
    ) {
      return <Redirect to="/dashboard" />;
    }
    return (
      <div className="">
        <div className="fixed bg-hero-pattern top-0 right-0 left-0 bottom-0 filter blur-lg">
          {/* <img
            src={FDA_HOMEPAGE}
            alt=""
            className="min-h-full min-w-full object-cover"
          /> */}
        </div>
        <div className="fixed h-auto bg-transparent top-0 left-0 right-0 bottom-0 flex flex-col items-center justify-center">
          <div className="grid grid-cols-12 w-full container mx-auto lg:px-0">
            <div className="col-span-12 md:col-span-2 lg:col-span-4"></div>
            <div className="col-span-12 md:col-span-8 lg:col-span-4 p-4 md:p-0">
              <div className="rounded-md bg-white shadow-md p-3 md:p-5 animate__animated animate__backInUp">
                <div className="font-extrabold text-2xl">Sign In</div>
                <div className="mt-6">
                  <form
                    onSubmit={this.LoginFn}
                    className="w-full flex flex-col gap-4"
                  >
                    <div className="flex flex-col w-full">
                      <span>Phone number or Email</span>
                      <input
                        type="text"
                        value={this.state.username}
                        onChange={(e) => {
                          this.setState({ username: e.target.value });
                          this.state.error.target !== null &&
                            this.setState({
                              error: { target: null, msg: "" },
                            });
                        }}
                        disabled={this.state.loading}
                        autoFocus={true}
                        className={`border ${
                          this.state.error.target === "username"
                            ? "border-red-300"
                            : "border-gray-400"
                        } ${
                          this.state.loading === true
                            ? "cursor-not-allowed"
                            : ""
                        }  bg-white text-black rounded-md px-3 py-2`}
                      />
                      <div>
                        {this.state.error.target === "username" && (
                          <Alert
                            alertType={AlertType.DANGER}
                            title={"Error"}
                            description={this.state.error.msg}
                            close={() => {
                              this.setState({
                                error: { target: null, msg: "" },
                              });
                            }}
                          />
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col w-full">
                      <span>Password</span>
                      <div className="relative w-full">
                        <input
                          type={
                            this.state.passwordDisplay === true
                              ? "text"
                              : "password"
                          }
                          value={this.state.password}
                          disabled={this.state.loading}
                          onChange={(e) => {
                            this.setState({ password: e.target.value });
                            this.state.error.target !== null &&
                              this.setState({
                                error: { target: null, msg: "" },
                              });
                          }}
                          className={`border ${
                            this.state.error.target === "password"
                              ? "border-red-300"
                              : "border-gray-400"
                          } ${
                            this.state.loading === true
                              ? "cursor-not-allowed"
                              : ""
                          } bg-white text-black rounded-md px-3 py-2 w-full`}
                        />
                        <div
                          onClick={() =>
                            this.setState({
                              passwordDisplay: !this.state.passwordDisplay,
                            })
                          }
                          className="absolute inset-y-0 right-0 pr-3 flex items-center leading-5 text-3xl cursor-pointer text-primary-700"
                        >
                          {this.state.passwordDisplay === true ? (
                            <AiFillEye />
                          ) : (
                            <AiOutlineEyeInvisible />
                          )}
                        </div>
                      </div>
                      <div>
                        {this.state.error.target === "password" && (
                          <Alert
                            alertType={AlertType.DANGER}
                            title={"Error"}
                            description={this.state.error.msg}
                            close={() => {
                              this.setState({
                                error: { target: null, msg: "" },
                              });
                            }}
                          />
                        )}
                      </div>
                    </div>
                    <div className="-mb-4">
                      {this.state.error.target === "main" && (
                        <Alert
                          alertType={AlertType.DANGER}
                          title={"Failed to login!"}
                          description={this.state.error.msg}
                          close={() => {
                            this.setState({
                              error: { target: null, msg: "" },
                            });
                          }}
                        />
                      )}
                    </div>
                    <div className="flex flex-row justify-between w-full mt-5">
                      <button
                        type="submit"
                        disabled={this.state.loading}
                        className={`${
                          this.state.loading === true
                            ? "bg-gray-500 cursor-not-allowed"
                            : "bg-primary-700 hover:bg-primary-800"
                        }  text-white font-bold px-6 py-2 w-max rounded-md flex flex-row justify-center items-center gap-2`}
                      >
                        <div>
                          {this.state.loading === true ? (
                            <AiOutlineLoading3Quarters className="text-xl animate-spin" />
                          ) : (
                            <AiOutlineLogin className="text-xl" />
                          )}
                        </div>
                        <span>
                          {this.state.loading === true
                            ? "Loading..."
                            : "Sign In"}
                        </span>
                      </button>
                      {/* <div className="mt-3">
                      <Link
                        className="font-light hover:text-primary-800 underline"
                        to="/"
                      >
                        Forget password?
                      </Link>
                    </div> */}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({
  auth,
  system,
}: StoreState): { auth: Auth; system: System } => {
  return { auth, system };
};

export const Homepage = connect(mapStateToProps, {
  FC_Login,
  FC_GetSystemInfo,
})(_App);
