import React, { Component } from "react";
import { BsFilterCircle } from "react-icons/bs";
import { HiOutlineBriefcase } from "react-icons/hi";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { connect } from "react-redux";
import { Auth, System } from "../../actions";
import MainContainer from "../../components/MainContainer/MainContainer";
import { StoreState } from "../../reducers";

interface PositionsManagementProps {}
interface PositionsManagementState {
  loading: boolean;
}

class _PositionsManagement extends Component<
  PositionsManagementProps,
  PositionsManagementState
> {
  constructor(props: PositionsManagementProps) {
    super(props);

    this.state = {
      loading: false,
    };
  }
  render() {
    return (
      <div className="pt-3">
        <div className="flex flex-row items-center justify-between gap-2 w-full pl-2">
          <div className="flex flex-row items-center gap-3">
            <div>
              <HiOutlineBriefcase className="text-5xl text-primary-800" />
            </div>
            <div>
              <div className="text-xl font-bold">Positions Managements</div>
              <div className="text-sm text-gray-600">
                Positions grouped in their divisions management panel
              </div>
            </div>
          </div>
          {/* Right side */}
          <div className="flex flex-row items-center justify-end gap-2">
            <div>
              <div className="flex flex-row items-center justify-between gap-6 bg-white hover:bg-primary-100 border border-primary-700 rounded cursor-pointer pr-2 group">
                <div className="flex flex-row items-center gap-2">
                  <div>
                    <div className="bg-primary-700 flex items-center justify-center h-10 w-10">
                      <BsFilterCircle className="text-2xl text-white" />
                    </div>
                  </div>
                  <div className="font-bold text-sm text-gray-500 group-hover:text-primary-800">
                    Filter by Unit
                  </div>
                </div>
                <div>
                  <MdOutlineKeyboardArrowDown className="text-2xl text-gray-500 group-hover:text-primary-700" />
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="text-sm text-gray-600">Total positions</div>
              <div className="font-bold text-xl -mt-1">{200}</div>
            </div>
          </div>
        </div>
        {/* Body */}
        <MainContainer className="mt-3">Table here</MainContainer>
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

export const PositionsManagement = connect(
  mapStateToProps,
  {}
)(_PositionsManagement);
