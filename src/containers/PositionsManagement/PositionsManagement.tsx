import React, { Component, Fragment } from "react";
import { BsFilterCircle } from "react-icons/bs";
import { HiOutlineBriefcase } from "react-icons/hi";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { connect } from "react-redux";
import { Auth, System } from "../../actions";
import MainContainer from "../../components/MainContainer/MainContainer";
import { StoreState } from "../../reducers";
import { RiSearchLine } from "react-icons/ri";
import ExportToExcel from "../../components/GenerateReport/ExportToExcel";
import { PositionItem } from "../../components/PositionItem/PositionItem";
import Modal, {
  ModalMarginTop,
  ModalSize,
  Themes,
} from "../../components/Modal/Modal";
import { PositionDetails } from "../../components/PositionDetails/PositionDetails";
import { NoResultFound } from "../../components/Fragments/NoResultFound";

interface PositionsManagementProps {}
interface PositionsManagementState {
  loading: boolean;
  tabs: "SUMMARY" | "POSITIONS";
  selectedPosition: any;
  searchData: string;
}

class _PositionsManagement extends Component<
  PositionsManagementProps,
  PositionsManagementState
> {
  constructor(props: PositionsManagementProps) {
    super(props);

    this.state = {
      loading: false,
      tabs: "POSITIONS",
      selectedPosition: null,
      searchData: "",
    };
  }
  FilteredData = () => {
    return [];
  };
  render() {
    return (
      <Fragment>
        <div className="pt-3">
          <div className="flex flex-row items-center justify-between gap-2 w-full pl-2">
            <div className="flex flex-row items-center gap-3">
              <div>
                <HiOutlineBriefcase className="text-5xl text-gray-400" />
              </div>
              <div>
                <div className="text-xl font-bold truncate">
                  Positions Managements
                </div>
                <div className="text-sm text-gray-600 truncate">
                  Positions grouped in their divisions management panel
                </div>
              </div>
            </div>
            {/* Right side */}
            <div className="flex flex-row items-center justify-end gap-2 w-1/2">
              <div className="flex flex-row items-center justify-between gap-6 bg-white hover:bg-primary-100 border border-primary-700 rounded cursor-pointer pr-2 group truncate">
                <div className="flex flex-row items-center gap-2 truncate">
                  <div>
                    <div className="bg-primary-700 flex items-center justify-center h-10 w-10">
                      <BsFilterCircle className="text-2xl text-white" />
                    </div>
                  </div>
                  <div className="font-bold text-sm text-gray-500 group-hover:text-primary-800 py-1 truncate">
                    Search by positions Units
                  </div>
                </div>
                <div>
                  <MdOutlineKeyboardArrowDown className="text-2xl text-gray-500 group-hover:text-primary-700" />
                </div>
              </div>
              <div className="flex flex-col">
                <div className="text-sm text-gray-600 truncate">
                  Total positions
                </div>
                <div className="font-bold text-xl -mt-1">{200}</div>
              </div>
            </div>
          </div>
          {/* Body */}
          <MainContainer className="mt-3">
            <div className="border-b mb-3">
              <div className="grid grid-cols-12 w-full">
                <div className="col-span-12 lg:col-span-6">
                  <div className="flex flex-row items-center gap-2">
                    <div
                      onClick={() => this.setState({ tabs: "SUMMARY" })}
                      className={`px-6 py-2 border-b-2 ${
                        this.state.tabs === "SUMMARY"
                          ? "border-primary-700 text-primary-800 animate__animated animate__fadeIn"
                          : "border-white hover:border-primary-700 hover:text-primary-800"
                      } cursor-pointer`}
                    >
                      Summary
                    </div>
                    <div
                      onClick={() => this.setState({ tabs: "POSITIONS" })}
                      className={`px-6 py-2 border-b-2 ${
                        this.state.tabs === "POSITIONS"
                          ? "border-primary-700 text-primary-800 animate__animated animate__fadeIn"
                          : "border-white hover:border-primary-700 hover:text-primary-800"
                      } cursor-pointer`}
                    >
                      Positions
                    </div>
                  </div>
                </div>
                <div className="col-span-12 lg:col-span-6 flex flex-row items-center justify-end gap-2 pb-2 -mt-1">
                  <div className="relative w-full">
                    <input
                      type="search"
                      className="bg-gray-100 rounded-md px-3 py-2 w-full pl-10 text-base"
                      placeholder="Search position"
                      value={this.state.searchData}
                      onChange={(e) =>
                        this.setState({ searchData: e.target.value })
                      }
                    />
                    <RiSearchLine
                      className="absolute top-3 left-3 text-xl"
                      style={{ marginTop: "-1.5px" }}
                    />
                  </div>
                  {/* <div>
                    <div className="bg-primary-700 hover:bg-primary-800 text-white px-3 py-2 rounded font-bold text-sm w-max cursor-pointer">
                      Create position
                    </div>
                  </div> */}
                  <ExportToExcel fileData={[]} fileName={"Positions report"} />
                </div>
              </div>
            </div>
            {this.state.tabs === "POSITIONS" && (
              <div className="mt-6 animate__animated animate__fadeIn">
                {this.FilteredData().length === 0 ? (
                  <NoResultFound />
                ) : (
                  this.FilteredData().map((item, i) => (
                    <PositionItem
                      key={i + 1}
                      position={item}
                      onClick={() => {
                        this.setState({ selectedPosition: "selected" });
                      }}
                    />
                  ))
                )}
              </div>
            )}
          </MainContainer>
        </div>
        {this.state.selectedPosition !== null && (
          <Modal
            backDrop={true}
            theme={Themes.default}
            close={() => this.setState({ selectedPosition: null })}
            backDropClose={true}
            widthSizeClass={ModalSize.maxWidth}
            marginTop={ModalMarginTop.small}
            displayClose={false}
            padding={{
              title: undefined,
              body: undefined,
              footer: undefined,
            }}
          >
            <PositionDetails
              position={this.state.selectedPosition}
              onClose={() => this.setState({ selectedPosition: null })}
            />
          </Modal>
        )}
      </Fragment>
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
