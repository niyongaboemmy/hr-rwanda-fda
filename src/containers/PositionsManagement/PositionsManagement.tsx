import React, { Component, Fragment } from "react";
import { BsFilterCircle } from "react-icons/bs";
import { HiOutlineBriefcase } from "react-icons/hi";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { connect } from "react-redux";
import {
  Auth,
  FC_GetAllUnits,
  System,
  UnitInterface,
  UnitStore,
} from "../../actions";
import MainContainer from "../../components/MainContainer/MainContainer";
import { StoreState } from "../../reducers";
import ExportToExcel from "../../components/GenerateReport/ExportToExcel";
import { PositionItem } from "../../components/PositionItem/PositionItem";
import Modal, {
  ModalMarginTop,
  ModalSize,
  Themes,
} from "../../components/Modal/Modal";
import { PositionDetails } from "../../components/PositionDetails/PositionDetails";
import { NoResultFound } from "../../components/Fragments/NoResultFound";
import {
  FC_GetAllPositions,
  PositionInterface,
  PositionStore,
} from "../../actions/position.action";
import { PositionItemLoading } from "../../components/PositionItem/PositionItemLoading";
import { commaFy, search } from "../../utils/functions";
import { SelectUnit } from "../../components/SelectUnit/SelectUnit";
import SearchInput from "../../components/Fragments/SearchInput";
import { IoMdRefreshCircle } from "react-icons/io";

interface PositionsManagementProps {
  auth: Auth;
  system: System;
  position: PositionStore;
  units: UnitStore;
  FC_GetAllPositions: (
    callback: (loading: boolean, error: string) => void
  ) => void;
  FC_GetAllUnits: (callback: (loading: boolean, error: string) => void) => void;
}
interface PositionsManagementState {
  loading: boolean;
  tabs: "SUMMARY" | "POSITIONS";
  selectedPosition: PositionInterface | null;
  selectedUnit: UnitInterface | null;
  searchData: string;
  mainError: string;
  openSelectUnit: boolean;
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
      selectedUnit: null,
      searchData: "",
      mainError: "",
      openSelectUnit: false,
    };
  }
  FilteredData = () => {
    if (this.props.position.positions === null) {
      return [];
    }
    var response = this.props.position.positions;
    if (this.state.selectedUnit !== null) {
      response = response.filter(
        (itm) =>
          this.state.selectedUnit !== null &&
          itm.unit_id.toString() === this.state.selectedUnit.unit_id.toString()
      );
    }
    return search(response, this.state.searchData) as PositionInterface[];
  };
  getUnitName = (unit_id: string): string => {
    if (this.props.units.units !== null) {
      const unit = this.props.units.units.find(
        (itm) => itm.unit_id.toString() === unit_id.toString()
      );
      if (unit !== undefined) {
        return unit.unit_name;
      }
    }
    return "";
  };
  componentDidMount = () => {
    if (this.props.position.positions === null) {
      this.setState({ loading: true });
      this.props.FC_GetAllPositions((loading: boolean, error: string) => {
        this.setState({ loading: loading, mainError: error });
      });
    }
  };
  getSelectedPosition = (): PositionInterface | null => {
    if (this.props.position.positions === null) {
      return null;
    }
    const response = this.props.position.positions.find(
      (itm) => itm.position_id === this.state.selectedPosition?.position_id
    );
    return response !== undefined ? response : null;
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
              <div
                onClick={() => this.setState({ openSelectUnit: true })}
                className="flex flex-row items-center justify-between gap-6 bg-white hover:bg-primary-100 border border-primary-700 rounded cursor-pointer pr-2 group truncate"
              >
                <div className="flex flex-row items-center gap-2 truncate">
                  <div>
                    <div className="bg-primary-700 flex items-center justify-center h-10 w-10">
                      <BsFilterCircle className="text-2xl text-white" />
                    </div>
                  </div>
                  {this.state.selectedUnit === null ? (
                    <div className="font-bold text-sm text-gray-500 group-hover:text-primary-800 py-1 truncate">
                      Search by positions Units
                    </div>
                  ) : (
                    <div className="font-bold text-sm text-primary-800 group-hover:text-primary-900 py-1 truncate">
                      {this.state.selectedUnit.unit_name}
                    </div>
                  )}
                </div>
                <div>
                  <MdOutlineKeyboardArrowDown className="text-2xl text-gray-500 group-hover:text-primary-700" />
                </div>
              </div>
              {this.state.selectedUnit !== null && (
                <div
                  onClick={() => this.setState({ selectedUnit: null })}
                  title="Reset to view back all of the positions"
                  className=" rounded-full flex items-center justify-center text-yellow-600 hover:text-yellow-700 cursor-pointer"
                >
                  <IoMdRefreshCircle className="text-4xl bg-white rounded-full" />
                </div>
              )}
              <div className="flex flex-col">
                <div className="text-sm text-gray-600 truncate">
                  Total positions
                </div>
                <div className="font-bold text-xl -mt-1">
                  {commaFy(this.FilteredData().length)}
                </div>
              </div>
            </div>
          </div>
          {/* Body */}
          {this.state.loading === true ||
          this.props.position.positions === null ? (
            <div className="mt-8 bg-white rounded-md p-3">
              <div>
                {[1, 2, 3, 4, 5].map((item, i) => (
                  <PositionItemLoading key={i + 1} className="animate-pulse" />
                ))}
              </div>
            </div>
          ) : (
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
                    <SearchInput
                      searchData={this.state.searchData}
                      onChange={(value: string) =>
                        this.setState({ searchData: value })
                      }
                    />
                    <ExportToExcel
                      fileData={this.props.position.positions}
                      fileName={"Positions report"}
                    />
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
                          this.setState({ selectedPosition: item });
                        }}
                      />
                    ))
                  )}
                </div>
              )}
            </MainContainer>
          )}
        </div>
        {this.getSelectedPosition() !== null && (
          <Modal
            backDrop={true}
            theme={Themes.default}
            close={() => this.setState({ selectedPosition: null })}
            backDropClose={true}
            widthSizeClass={ModalSize.extraLarge}
            marginTop={ModalMarginTop.none}
            displayClose={false}
            padding={{
              title: undefined,
              body: undefined,
              footer: undefined,
            }}
          >
            <PositionDetails
              position={this.getSelectedPosition()!}
              onClose={() => this.setState({ selectedPosition: null })}
            />
          </Modal>
        )}
        {this.state.openSelectUnit &&
          this.props.position.positions !== null && (
            <Modal
              backDrop={true}
              theme={Themes.default}
              close={() => this.setState({ openSelectUnit: false })}
              backDropClose={true}
              widthSizeClass={ModalSize.extraLarge}
              displayClose={false}
              padding={{
                title: undefined,
                body: undefined,
                footer: undefined,
              }}
            >
              <SelectUnit
                positionsCounter={this.props.position.positions.map((item) => ({
                  position_id: item.position_id,
                  employees_number: item.employee_number,
                  unit_id: item.unit_id,
                }))}
                onSelect={(unit: UnitInterface | null) =>
                  this.setState({ selectedUnit: unit, openSelectUnit: false })
                }
                onClose={() => this.setState({ openSelectUnit: false })}
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
  position,
  units,
}: StoreState): {
  auth: Auth;
  system: System;
  position: PositionStore;
  units: UnitStore;
} => {
  return { auth, system, position, units };
};

export const PositionsManagement = connect(mapStateToProps, {
  FC_GetAllPositions,
  FC_GetAllUnits,
})(_PositionsManagement);
