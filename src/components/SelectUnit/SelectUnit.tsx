import React, { Component } from "react";
import { MdClose } from "react-icons/md";
import { connect } from "react-redux";
import { FC_GetAllUnits, UnitInterface, UnitStore } from "../../actions";
import { StoreState } from "../../reducers";
import { commaFy, search } from "../../utils/functions";
import BackButton from "../Fragments/BackButton";
import { NoResultFound } from "../Fragments/NoResultFound";
import SearchInput from "../Fragments/SearchInput";
import ExportToExcel from "../GenerateReport/ExportToExcel";
import Loading from "../Loading/Loading";
import { UnitItem } from "../UnitItem/UnitItem";

interface SelectUnitProps {
  units: UnitStore;
  positionsCounter: {
    position_id: string;
    unit_id: string;
    employees_number: number;
  }[];
  onSelect: (unit: UnitInterface | null) => void;
  FC_GetAllUnits: (callback: (loading: boolean, error: string) => void) => void;
  onClose?: () => void;
}
interface SelectUnitState {
  loading: boolean;
  error: string;
  searchData: string;
}

export class _SelectUnit extends Component<SelectUnitProps, SelectUnitState> {
  constructor(props: SelectUnitProps) {
    super(props);

    this.state = {
      loading: false,
      error: "",
      searchData: "",
    };
  }
  FilteredData = () => {
    if (this.props.units.units === null) {
      return [];
    }
    var response = this.props.units.units;
    return search(response, this.state.searchData) as UnitInterface[];
  };
  GetTotalEmployees = (): number => {
    var total: number = 0;
    for (const item of this.props.positionsCounter) {
      total += item.employees_number;
    }
    return total;
  };
  GetTotalEmployeesByUnit = (unit_id: string): number => {
    var total: number = 0;
    for (const item of this.props.positionsCounter.filter(
      (itm) => itm.unit_id.toString() === unit_id.toString()
    )) {
      total += item.employees_number;
    }
    return total;
  };
  componentDidMount(): void {
    if (this.props.units.units === null) {
      this.setState({ loading: true });
      this.props.FC_GetAllUnits((loading: boolean, error: string) => {
        this.setState({ loading: loading, error: error });
      });
    }
  }
  render() {
    return (
      <div className="p-3">
        <div className="flex flex-row items-center justify-between gap-3 w-full border-b mb-3 pb-2">
          <div className="flex flex-row items-center gap-2">
            <BackButton
              title="Back"
              className="font-bold bg-gray-100 hover:bg-primary-100 hover:text-primary-800"
              onClick={this.props.onClose}
            />
            <div>
              <div className="text-lg font-bold">
                List of employees units or departments
              </div>
              <div className="text-sm">
                Summary for employees position units
              </div>
            </div>
          </div>
          <div className="">
            <div
              onClick={this.props.onClose}
              className="h-9 w-9 rounded-full bg-gray-100 hover:bg-red-100 hover:text-red-700 flex items-center justify-center cursor-pointer"
            >
              <MdClose className="text-2xl" />
            </div>
          </div>
        </div>
        {/* Body */}
        {this.state.loading === false && (
          <div className="grid grid-cols-12 gap-3">
            <div className="col-span-12 md:col-span-6">
              <SearchInput
                searchData={this.state.searchData}
                onChange={(value: string) =>
                  this.setState({ searchData: value })
                }
              />
            </div>
            {/* Summary and export */}
            <div className="col-span-12 md:col-span-6 flex flex-row items-center justify-end gap-3">
              <div>
                <div className="text-sm text-gray-600">Total units</div>
                <div className="font-bold text-xl -mt-1">
                  {commaFy(this.FilteredData().length)}
                </div>
              </div>
              {this.props.positionsCounter.length > 0 && (
                <div>
                  <div className="text-sm text-gray-600">Total employees</div>
                  <div className="font-bold text-xl -mt-1">
                    {commaFy(this.GetTotalEmployees())}
                  </div>
                </div>
              )}
              <ExportToExcel
                fileData={this.FilteredData()}
                fileName={"List of units"}
              />
            </div>
          </div>
        )}
        {/* List of units */}
        <div className="mt-4">
          {this.state.loading === true ? (
            <div>
              <Loading />
            </div>
          ) : this.FilteredData().length === 0 ? (
            <NoResultFound />
          ) : (
            this.FilteredData().map((item, i) => (
              <UnitItem
                key={i + 1}
                onClick={() => this.props.onSelect(item)}
                unit={item}
                total_positions={
                  this.props.positionsCounter.length > 0
                    ? this.props.positionsCounter.filter(
                        (itm) => itm.unit_id === item.unit_id
                      ).length
                    : undefined
                }
                total_employees={
                  this.props.positionsCounter.length > 0
                    ? this.GetTotalEmployeesByUnit(item.unit_id)
                    : undefined
                }
              />
            ))
          )}
        </div>
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

export const SelectUnit = connect(mapStateToProps, { FC_GetAllUnits })(
  _SelectUnit
);
