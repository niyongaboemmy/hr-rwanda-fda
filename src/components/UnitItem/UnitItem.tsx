import React, { Component } from "react";
import { RiBuildingFill } from "react-icons/ri";
import { UnitInterface } from "../../actions";

interface UnitItemProps {
  onClick: () => void;
  unit: UnitInterface;
  total_positions?: number;
  total_employees?: number;
}
interface UnitItemState {}

export class UnitItem extends Component<UnitItemProps, UnitItemState> {
  constructor(props: UnitItemProps) {
    super(props);

    this.state = {};
  }
  render() {
    return (
      <div
        onClick={this.props.onClick}
        className="mb-2 border-b border-gray-200 hover:border-primary-700 p-1 pb-2 cursor-pointer group animate__animated animate__fadeIn animate__slow"
      >
        <div className="flex flex-row items-center justify-between w-full gap-2">
          <div className="flex flex-row items-center gap-4">
            <div>
              <div className="flex items-center justify-center h-10 w-10 rounded border group-hover:border-primary-700 bg-gray-100 group-hover:bg-primary-100">
                <RiBuildingFill className="text-3xl text-gray-300 group-hover:text-primary-700" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="text-base font-semibold group-hover:text-primary-800">
                {this.props.unit.unit_name}
              </div>
              {/* <div className="flex flex-row items-center text-sm text-gray-600">
                {this.props.total_employees}
              </div> */}
              {/* <div className="flex flex-row items-center gap-3">
                <div>
                  <BsArrowRightCircle className="text-yellow-600 text-lg" />
                </div>
                <div className="text-sm text-gray-600"></div>
              </div> */}
            </div>
          </div>
          <div className="flex flex-row items-center justify-end gap-2">
            {this.props.total_positions !== undefined && (
              <div className="rounded p-3 py-1 border">
                <div className="text-xs">Positions</div>
                <div className="text-lg font-bold -mt-1">
                  {this.props.total_positions}
                </div>
              </div>
            )}
            {this.props.total_employees !== undefined && (
              <div className="rounded p-3 py-1 border">
                <div className="text-xs">Employees</div>
                <div className="text-lg font-bold -mt-1">
                  {this.props.total_employees}
                </div>
              </div>
            )}
            <div>
              <div className="bg-yellow-100 text-yellow-800 group-hover:bg-primary-700 group-hover:text-white px-3 py-2 rounded-md font-bold text-sm w-max cursor-pointer">
                Select
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
