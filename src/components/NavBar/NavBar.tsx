import React, { Component } from "react";
import { AiOutlineLogout, AiOutlineMenu } from "react-icons/ai";
import FDA_LOGO from "../../assets/logo.jpeg";
import { FaUserCircle } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { Auth } from "../../actions";
import { RiLockPasswordLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import { TbArrowsDiagonalMinimize2 } from "react-icons/tb";
import { SiWheniwork } from "react-icons/si";
import { HiOutlineBriefcase } from "react-icons/hi";

interface NavBarProps {
  auth: Auth;
  FC_Logout: () => void;
  setOpenVav: (status: boolean) => void;
  sideNavbarStatus: boolean;
  SwitchEmployment: () => void;
}
interface NavBarState {
  view_user: boolean;
  loading: boolean;
}

export class NavBar extends Component<NavBarProps, NavBarState> {
  constructor(props: NavBarProps) {
    super(props);

    this.state = {
      loading: false,
      view_user: false,
    };
  }
  componentDidMount(): void {}
  render() {
    return (
      <div>
        <div
          className={`${
            this.props.auth.isAuthenticated === false
              ? "bg-white"
              : " bg-primary-800 text-white"
          } py-1 pl-3 fixed top-0 right-0 left-0 shadow-md z-50`}
        >
          <div
            className={`${
              this.props.auth.isAuthenticated === false
                ? "container mx-auto lg:px-20"
                : ""
            }`}
          >
            <div className="flex flex-row items-center justify-between gap-3">
              <div className="flex flex-row items-center gap-2">
                {this.props.auth.isAuthenticated === false && (
                  <div>
                    <img
                      className="h-14"
                      src={FDA_LOGO}
                      alt="Valuation Management System"
                    />
                  </div>
                )}

                {this.props.auth.isAuthenticated === false ? (
                  <div className="text-black py-4 font-extrabold text-lg">
                    Rwanda FDA
                  </div>
                ) : (
                  <div className="my-2 flex flex-row items-center gap-3">
                    <div
                      onClick={() =>
                        this.props.setOpenVav(!this.props.sideNavbarStatus)
                      }
                      className="bg-primary-700 rounded-md p-2 cursor-pointer hover:bg-primary-900"
                    >
                      {this.props.sideNavbarStatus === true ? (
                        <TbArrowsDiagonalMinimize2 className="text-2xl text-primary-100 animate__animated animate__zoomIn" />
                      ) : (
                        <AiOutlineMenu className="text-2xl text-primary-100 animate__animated animate__fadeIn" />
                      )}
                    </div>
                    <div className="">
                      <div className="flex flex-row items-center gap-2 text-lg rounded-full w-max pr-3 cursor-pointer group">
                        <div>
                          <SiWheniwork className="text-3xl text-primary-300 group-hover:text-yellow-300" />
                        </div>
                        <span className="text-white font-bold">
                          {this.props.auth.selectedEmployment?.position_name}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {this.props.auth.isAuthenticated === true ? (
                <div className="flex flex-row items-center gap-2 justify-end mr-2">
                  {/* User icon */}
                  <div className="relative">
                    <div
                      onClick={() =>
                        this.setState({ view_user: !this.state.view_user })
                      }
                      className={`rounded-full flex items-center justify-center ${
                        this.state.view_user === true
                          ? "bg-red-600 text-white border-2 border-white"
                          : "bg-primary-700 hover:bg-primary-900 text-white"
                      }  h-10 w-10  cursor-pointer`}
                    >
                      {this.state.view_user === false ? (
                        <FaUserCircle className="text-4xl animate__animated animate__fadeIn" />
                      ) : (
                        <IoMdClose className="text-3xl animate__animated animate__fadeIn" />
                      )}
                    </div>
                    {this.state.view_user === true && (
                      <div className="absolute right-0 pt-4">
                        <div className="border border-gray-300 bg-white p-3 rounded-md w-64 shadow-xl animate__animated animate__zoomInDown animate__faster">
                          <div className="flex flex-col items-center justify-center w-full gap-0">
                            <div className="mt-3">
                              <div className="rounded-full text-gray-400 flex items-center justify-center h-24 w-24 overflow-hidden">
                                <FaUserCircle className="text-8xl" />
                              </div>
                            </div>
                            <div className="font-bold text-center mb-1 text-black mt-2">
                              <span>
                                {
                                  this.props.auth.selectedEmployment
                                    ?.position_name
                                }
                              </span>
                            </div>
                            <div className="font-bold text-center text-sm w-max bg-primary-700 text-white px-3 py-1 rounded-xl truncate">
                              {
                                this.props.auth.selectedEmployment
                                  ?.position_name
                              }
                            </div>
                          </div>

                          <div className="mt-5 text-black">
                            <div className="text-sm text-gray-600 mt-5 mb-2">
                              ACTION MENU
                            </div>
                            <Link
                              onClick={() =>
                                this.setState({ view_user: false })
                              }
                              to={"/profile"}
                              className="flex flex-row items-center gap-2 bg-gray-50 rounded-md px-2 py-1 cursor-pointer hover:bg-primary-700 hover:text-white group"
                            >
                              <div>
                                <FaUserCircle className="text-xl text-primary-700 group-hover:text-white" />
                              </div>
                              <div>User Profile</div>
                            </Link>
                            {this.props.auth.user !== null &&
                              this.props.auth.user.employment.length > 0 && (
                                <div
                                  onClick={() => {
                                    this.setState({ view_user: false });
                                    this.props.SwitchEmployment();
                                  }}
                                  className="flex flex-row items-center gap-2 bg-gray-50 rounded-md px-2 py-1 cursor-pointer hover:bg-primary-700 hover:text-white group"
                                >
                                  <div>
                                    <HiOutlineBriefcase className="text-xl text-yellow-600 group-hover:text-white" />
                                  </div>
                                  <div>Change position</div>
                                </div>
                              )}
                            <Link
                              onClick={() =>
                                this.setState({ view_user: false })
                              }
                              to={"/change-password"}
                              className="flex flex-row items-center gap-2 bg-gray-50 rounded-md px-2 py-1 cursor-pointer hover:bg-primary-700 hover:text-white group"
                            >
                              <div>
                                <RiLockPasswordLine className="text-xl text-red-700 group-hover:text-white" />
                              </div>
                              <div>Change password</div>
                            </Link>

                            <div
                              onClick={() => {
                                this.setState({ view_user: false });
                                this.props.FC_Logout();
                              }}
                              className="flex flex-row items-center gap-2 border border-yellow-700 rounded-md px-2 py-1 cursor-pointer hover:bg-yellow-700 hover:text-white group mt-2"
                            >
                              <div>
                                <AiOutlineLogout className="text-xl text-gray-500 group-hover:text-white" />
                              </div>
                              <div>Sign out</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <a
                  href="https://www.rwandafda.gov.rw/home"
                  title="Rwanda FDA"
                  className="px-6 py-2 rounded-md border border-primary-800 hover:bg-primary-800 text-primary-800 font-bold hover:text-white w-max text-sm"
                  target={"_blank"}
                  rel="noreferrer"
                >
                  Back to website
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
