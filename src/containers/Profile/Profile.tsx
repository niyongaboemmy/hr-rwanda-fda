import React, { Component } from "react";
import { BsPersonCircle } from "react-icons/bs";
import { FaUserEdit } from "react-icons/fa";
import { IoMdLogOut } from "react-icons/io";
import { RiLockPasswordLine } from "react-icons/ri";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Auth, FC_Logout, System } from "../../actions";
import { StoreState } from "../../reducers";

interface ProfileProps {
  auth: Auth;
  system: System;
  FC_Logout: () => void;
}
interface ProfileState {
  loading: boolean;
}

class _Profile extends Component<ProfileProps, ProfileState> {
  constructor(props: ProfileProps) {
    super(props);

    this.state = {
      loading: false,
    };
  }
  render() {
    return (
      <div className="mt-2 h-full">
        <div className=" bg-hero-pattern h-36 lg:h-1/5 rounded-xl"></div>
        <div className="grid grid-cols-12 -mt-20 gap-6">
          <div className="col-span-12 lg:col-span-3 flex flex-col items-center lg:items-end">
            <div className="bg-white h-40 w-40 rounded-xl flex items-center justify-center">
              <BsPersonCircle className="text-8xl text-gray-300" />
            </div>
          </div>
          <div className="col-span-12 lg:col-span-8">
            {this.props.auth.user !== null && (
              <div className="bg-white rounded-xl grid grid-cols-12 p-6 gap-3">
                <div className="col-span-12">
                  <div className="font-extrabold text-xl mb-4">
                    User profile details
                  </div>
                </div>
                <div className="col-span-12 md:col-span-6 lg:col-span-4 flex flex-col">
                  <span className="text-gray-600 text-sm">User Names</span>
                  <span className="font-semibold">
                    {this.props.auth.user.fname} {this.props.auth.user.lname}
                  </span>
                </div>
                <div className="col-span-12 md:col-span-6 lg:col-span-4 flex flex-col">
                  <span className="text-gray-600 text-sm">Phone number</span>
                  <span className="font-semibold">
                    {this.props.auth.user.phone_number}
                  </span>
                </div>
                <div className="col-span-12 md:col-span-6 lg:col-span-4 flex flex-col">
                  <span className="text-gray-600 text-sm">User email</span>
                  <span className="font-semibold">
                    {this.props.auth.user.email}
                  </span>
                </div>
                <div className="col-span-12 md:col-span-6 lg:col-span-4 flex flex-col">
                  <span className="text-gray-600 text-sm">Access level</span>
                  <span className="font-semibold">
                    {this.props.auth.user.access_level}
                  </span>
                </div>
                <div className="col-span-12 md:col-span-6 lg:col-span-4 flex flex-col">
                  <span className="text-gray-600 text-sm">User access</span>
                  <span className="font-semibold">
                    {this.props.auth.user.access}
                  </span>
                </div>
                <div className="col-span-12 border-t border-gray-300 mt-10 mb-5"></div>
                <div className="col-span-12 flex flex-col md:flex-row gap-3">
                  <div className="px-3 py-2 text-sm text-black bg-gray-200 hover:bg-gray-300 rounded-md cursor-pointer flex flex-row items-center gap-2 w-52">
                    <div>
                      <FaUserEdit className="text-2xl" />
                    </div>
                    <span>Update profile</span>
                  </div>
                  <Link
                    to="/change-password"
                    className="px-3 py-2 text-sm text-primary-900 bg-primary-100 rounded-md cursor-pointer flex flex-row items-center gap-2 w-52"
                  >
                    <div>
                      <RiLockPasswordLine className="text-2xl" />
                    </div>
                    <span>Change password</span>
                  </Link>
                  <div
                    onClick={() => this.props.FC_Logout()}
                    className="px-3 py-2 text-sm text-yellow-800 bg-yellow-50 hover:bg-yellow-100 rounded-md cursor-pointer flex flex-row items-center gap-2 w-52"
                  >
                    <div>
                      <IoMdLogOut className="text-2xl" />
                    </div>
                    <span>Sign Out</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({
  auth,
  system,
}: StoreState): {
  auth: Auth;
  system: System;
} => {
  return {
    auth,
    system,
  };
};

export const Profile = connect(mapStateToProps, { FC_Logout })(_Profile);
