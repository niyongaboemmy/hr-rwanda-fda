import axios from "axios";
import React, { Component } from "react";
import { MdOutlineCreateNewFolder, MdSave } from "react-icons/md";
import { FC_GetDistricts, LocationAPI } from "../../actions";
import { API_URL } from "../../utils/api";
import { errorToText } from "../../utils/functions";
import Alert, { AlertType } from "../Alert/Alert";
import Loading from "../Loading/Loading";
import BankBranches from "./BankBranches";

export interface RegisterBankBranchInterface {
  branch_name: string;
  district_code: string;
  district_name: string;
}

interface RegisterBankProps {
  modal: boolean;
  cancelRegister: (reload: boolean) => void;
}
interface RegisterBankState {
  loading: boolean;
  bank_name: string;
  bank_logo: File | null;
  branches: RegisterBankBranchInterface[];
  formError: {
    target: string;
    msg: string;
  } | null;
  imgSrc: (ArrayBuffer | string)[];
  success: string;
  showRegisterBranchForm: boolean;
  districts: LocationAPI | null;
}

export class RegisterBank extends Component<
  RegisterBankProps,
  RegisterBankState
> {
  constructor(props: RegisterBankProps) {
    super(props);

    this.state = {
      loading: false,
      bank_name: "",
      bank_logo: null,
      branches: [],
      formError: null,
      imgSrc: [],
      success: "",
      showRegisterBranchForm: false,
      districts: null,
    };
  }
  RegisterBankFn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (this.state.bank_name === "") {
      return this.setState({
        formError: {
          target: "bank_name",
          msg: "Bank name is required!",
        },
      });
    }
    if (this.state.bank_logo === null || this.state.bank_logo.size <= 0) {
      return this.setState({
        formError: {
          target: "bank_logo",
          msg: "Please select valid image!",
        },
      });
    }
    if (this.state.branches.length <= 0) {
      return this.setState({
        formError: {
          target: "branches",
          msg: "Please add branches!",
        },
      });
    }
    this.setState({ loading: true, formError: null, success: "" });
    try {
      const formData = new FormData();
      formData.append("bank_name", this.state.bank_name);
      formData.append("bank_logo", this.state.bank_logo);
      formData.append("branches", JSON.stringify(this.state.branches));
      const res = await axios.post(`${API_URL}/bank/register`, formData);
      if (res) {
        this.setState({
          loading: false,
          success: "Bank has registered successfully!",
          formError: null,
          bank_logo: null,
          bank_name: "",
          imgSrc: [],
          branches: [],
        });
        this.props.cancelRegister(true);
      }
    } catch (error: any) {
      console.log("Err: ", { ...error });
      this.setState({
        loading: false,
        formError: {
          target: "main",
          msg: errorToText(error),
        },
        success: "",
      });
    }
  };

  componentDidMount = () => {
    if (this.state.branches.length > 0) {
      this.setState({ showRegisterBranchForm: true });
    }
    if (this.state.districts === null) {
      this.setState({ loading: true });
      FC_GetDistricts(
        (status: boolean, res: LocationAPI | null, msg: string) => {
          if (status === true && res !== null) {
            this.setState({ districts: res, loading: false });
          }
          // Error
          if (status === false && msg !== "") {
            this.setState({
              formError: {
                target: "main",
                msg: msg,
              },
              loading: false,
            });
          }
        }
      );
    }
  };

  render() {
    return (
      <div className="">
        <div className="flex flex-row items-center mb-4 p-2 md:p-3 md:pb-0">
          <div className="font-extrabold text-2xl text-gray-700 flex flex-row items-center gap-2">
            <div>
              <MdOutlineCreateNewFolder className="text-5xl" />
            </div>
            <span>Register bank</span>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-5 p-2 mt-0 md:p-3 md:pt-0">
          <div className="col-span-3">
            <div
              className={`${
                this.state.imgSrc.length > 0 ? "shadow-lg" : ""
              } h-56 w-full bg-gray-300 rounded-lg object-cover overflow-hidden`}
            >
              {this.state.imgSrc.length > 0 && (
                <img
                  src={this.state.imgSrc.toString()}
                  alt=""
                  className="h-full w-full object-cover"
                />
              )}
            </div>
          </div>
          <div className="col-span-9">
            <form onSubmit={this.RegisterBankFn}>
              <div className="flex flex-col">
                <span className="text-sm font-bold">Bank name</span>
                <input
                  type="text"
                  value={this.state.bank_name}
                  onChange={(e) => {
                    this.setState({
                      bank_name: e.target.value,
                      formError: null,
                    });
                  }}
                  disabled={this.state.loading}
                  className={`px-3 py-2 rounded border ${
                    this.state.formError?.target === "bank_name"
                      ? "border-red-600"
                      : "border-gray-400"
                  }`}
                />
                {this.state.formError?.target === "bank_name" && (
                  <Alert
                    alertType={AlertType.DANGER}
                    title={"Missing info"}
                    description={this.state.formError.msg}
                    close={() => this.setState({ formError: null })}
                  />
                )}
              </div>
              <div className="flex flex-col mt-3">
                <span className="text-sm font-bold">Bank logo</span>
                <input
                  type="file"
                  onChange={(e) => {
                    if (e.target.files === null) {
                      this.setState({
                        formError: {
                          target: "bank_logo",
                          msg: "Please select an image!",
                        },
                      });
                    } else if (e.target.files[0].size <= 0) {
                      this.setState({
                        formError: {
                          target: "bank_logo",
                          msg: "Invalid image, please select a photo!",
                        },
                      });
                    } else {
                      this.setState({
                        bank_logo:
                          e.target.files === null ? null : e.target.files[0],
                        imgSrc:
                          e.target.files === null ? [] : this.state.imgSrc,
                        formError: null,
                      });
                      // Image preview
                      var file = e.target.files[0];
                      var reader = new FileReader();
                      reader.readAsDataURL(file);

                      reader.onloadend = (e) => {
                        reader.result !== null &&
                          this.setState({
                            imgSrc: [reader.result],
                          });
                      };
                    }
                  }}
                  disabled={this.state.loading}
                  className={`px-3 py-2 rounded border ${
                    this.state.formError?.target === "bank_logo"
                      ? "border-red-600"
                      : "border-gray-400"
                  }`}
                />
                {this.state.formError?.target === "bank_logo" && (
                  <Alert
                    alertType={AlertType.DANGER}
                    title={"Missing info"}
                    description={this.state.formError.msg}
                    close={() => this.setState({ formError: null })}
                  />
                )}
              </div>
              <div className="flex flex-col mt-3">
                <span className="text-sm font-bold">Bank branches</span>
                {this.state.branches.length <= 0 &&
                this.state.showRegisterBranchForm === false ? (
                  <div
                    className={`bg-gray-200 rounded-md p-3 ${
                      this.state.formError?.target === "branches"
                        ? "border-2 border-red-500"
                        : ""
                    }`}
                  >
                    <div className="text-lg font-light">No branches added</div>
                    <div
                      onClick={() =>
                        this.setState({ showRegisterBranchForm: true })
                      }
                      className="border border-gray-500 hover:border-gray-700 hover:bg-white text-sm font-bold rounded cursor-pointer w-max px-2 py-1"
                    >
                      Create branch
                    </div>
                  </div>
                ) : (
                  this.state.districts !== null && (
                    <div>
                      <BankBranches
                        branches={this.state.branches}
                        showRegisterBranchForm={
                          this.state.showRegisterBranchForm
                        }
                        setShowRegisterBranchForm={(status: boolean) => {
                          this.setState({ showRegisterBranchForm: status });
                        }}
                        addBranch={(branch: RegisterBankBranchInterface) => {
                          this.setState({
                            branches: [
                              ...this.state.branches.filter(
                                (itm) =>
                                  itm.district_code !== branch.district_code ||
                                  itm.branch_name !== branch.branch_name
                              ),
                              branch,
                            ],
                          });
                        }}
                        districts={this.state.districts}
                        removeBranch={(branch: RegisterBankBranchInterface) => {
                          this.setState({
                            branches: this.state.branches.filter(
                              (itm) =>
                                itm.branch_name !== branch.branch_name ||
                                itm.district_code !== branch.district_code
                            ),
                          });
                        }}
                        loading={this.state.loading}
                      />
                    </div>
                  )
                )}
                {/* Branches list */}
                {this.state.formError?.target === "branches" && (
                  <Alert
                    alertType={AlertType.DANGER}
                    title={"Missing info"}
                    description={this.state.formError.msg}
                    close={() => this.setState({ formError: null })}
                  />
                )}
              </div>
              {/* Alerts */}
              {this.state.success !== "" && (
                <div className="my-3">
                  <Alert
                    alertType={AlertType.SUCCESS}
                    title={"Action done"}
                    description={this.state.success}
                    close={() =>
                      this.setState({ success: "", formError: null })
                    }
                  />
                </div>
              )}
              {this.state.formError?.target === "main" && (
                <div className="my-3">
                  <Alert
                    alertType={AlertType.DANGER}
                    title={"Action failed"}
                    description={this.state.formError.msg}
                    close={() =>
                      this.setState({ formError: null, success: "" })
                    }
                  />
                </div>
              )}
              {this.state.loading === false ? (
                <div className="mt-3 flex flex-row items-center justify-end gap-2">
                  <div
                    onClick={() => {
                      if (
                        window.confirm(
                          "Are you sure do you want to close window? You will loose your changes!"
                        ) === true
                      ) {
                        this.props.cancelRegister(false);
                      }
                    }}
                    className="bg-gray-300 px-3 py-2 rounded hover:bg-gray-500 hover:text-white w-max cursor-pointer"
                  >
                    Close window
                  </div>
                  <button
                    type="submit"
                    className="bg-primary-700 hover:bg-primary-900 text-white px-3 py-2 rounded cursor-pointer w-max flex flex-row items-center gap-2"
                  >
                    <div>
                      <MdSave className="text-xl" />
                    </div>
                    <span>Register bank</span>
                  </button>
                </div>
              ) : (
                <div className="bg-white border border-gray-300 rounded-md mt-2 p-4">
                  <Loading />
                  <div className="font-light -mt-10 text-lg ml-4 animate-pulse">
                    Loading, please wait...
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default RegisterBank;
