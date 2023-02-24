import React, { Component } from "react";
import { MdClose } from "react-icons/md";
import { RiAdminFill } from "react-icons/ri";
import { connect } from "react-redux";
import {
  BooleanEnum,
  FC_GetAllUnits,
  PositionInterface,
  UnitStore,
} from "../../actions";
import { StoreState } from "../../reducers";
import { commaFy } from "../../utils/functions";
import BackButton from "../Fragments/BackButton";
import Loading from "../Loading/Loading";
import { PositionAccess } from "../PositionAccess/PositionAccess";
import { PositionCompetencies } from "../PositionCompetencies/PositionCompetencies";

interface PositionDetailsProps {
  position: PositionInterface;
  units: UnitStore;
  onClose?: () => void;
  FC_GetAllUnits: (callback: (loading: boolean, error: string) => void) => void;
}
interface PositionDetailsState {
  loading: boolean;
  updatingPosition: boolean;
}

class _PositionDetails extends Component<
  PositionDetailsProps,
  PositionDetailsState
> {
  constructor(props: PositionDetailsProps) {
    super(props);

    this.state = {
      loading: false,
      updatingPosition: false,
    };
  }
  componentDidMount(): void {
    if (this.props.units.units === null) {
      this.setState({ loading: true });
      this.props.FC_GetAllUnits((loading: boolean, error: string) =>
        this.setState({ loading: loading })
      );
    }
  }
  render() {
    return (
      <div>
        <div className="flex flex-row items-center justify-between gap-3 px-3 py-3 border-b">
          <div className="flex flex-row items-center gap-3">
            {this.props.onClose !== undefined && (
              <div>
                <BackButton
                  title="Back"
                  className="bg-primary-100 text-primary-800 hover:bg-primary-800 hover:text-white font-semibold"
                  onClick={this.props.onClose}
                />
              </div>
            )}
            <div>
              <div className="font-bold text-lg">
                {this.props.position.position_name}
              </div>
              <div className="text-sm text-gray-600">
                {this.props.position.unit_name}
              </div>
            </div>
          </div>
          {this.props.onClose !== undefined && (
            <div onClick={this.props.onClose} className="mr-2">
              <MdClose className="text-2xl hover:text-red-600 cursor-pointer" />
            </div>
          )}
        </div>
        {/* Details */}
        {this.state.loading === true || this.props.units.units === undefined ? (
          <div className="pt-6 px-4">
            <Loading />
          </div>
        ) : (
          <div
            className="pt-6 px-2 md:px-4 overflow-y-auto"
            style={{ height: "calc(100vh - 80px)" }}
          >
            <div className="grid grid-cols-12 gap-6 w-full animate__animated animate__fadeIn">
              {this.state.updatingPosition === false && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-3">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">
                        Position job family
                      </span>
                      <span className="font-semibold text-sm">
                        {this.props.position.job_family}
                      </span>
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-6 lg:col-span-3">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">
                        Position job family
                      </span>
                      <span className="font-semibold text-sm">
                        {this.props.position.job_family}
                      </span>
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-6 lg:col-span-3">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">
                        Number of employees
                      </span>
                      <span className="font-semibold text-base px-2 rounded-full bg-yellow-100 text-yellow-700 w-max">
                        {commaFy(this.props.position.employee_number)}
                      </span>
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-6 lg:col-span-3">
                    <div className="flex flex-row items-center gap-2">
                      <div className="bg-yellow-100 border border-yellow-200 rounded h-10 w-10 flex items-center justify-center">
                        <RiAdminFill className="text-2xl" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">
                          Employee Status
                        </div>
                        <div className="font-bold">
                          {this.props.position.is_line_manager ===
                          BooleanEnum.TRUE
                            ? "Line Manager"
                            : "Normal Employee"}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-12 lg:col-span-6">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">Unit</span>
                      <span className="font-semibold text-sm">
                        {this.props.position.unit_name}
                      </span>
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-12 lg:col-span-6">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">
                        Reporting Unit
                      </span>
                      <span className="font-semibold text-sm">
                        {this.props.units.units !== null &&
                          this.props.units.units.find(
                            (itm) => itm.unit_id === this.props.position.unit_id
                          )?.unit_name}
                      </span>
                    </div>
                  </div>
                </>
              )}
              <div className="col-span-12">
                {this.state.updatingPosition === false && (
                  <div className="flex flex-col pt-4">
                    <div className="uppercase font-bold text-primary-800 mb-2">
                      List of Competencies
                    </div>
                    <PositionCompetencies
                      selectedPosition={this.props.position}
                    />
                  </div>
                )}
                <div className="flex flex-col pb-8">
                  <div
                    className={`${
                      this.state.updatingPosition === false
                        ? "bg-yellow-50 rounded-md p-3 border border-yellow-500 mt-5"
                        : "bg-white"
                    }`}
                  >
                    <PositionAccess
                      title="Access Configuration"
                      access={this.props.position.access}
                      position_id={this.props.position.position_id}
                      position_name={this.props.position.position_name}
                      onUpdate={(status: boolean) =>
                        this.setState({ updatingPosition: status })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = ({
  units,
}: StoreState): {
  units: UnitStore;
} => {
  return { units };
};

export const PositionDetails = connect(mapStateToProps, { FC_GetAllUnits })(
  _PositionDetails
);
