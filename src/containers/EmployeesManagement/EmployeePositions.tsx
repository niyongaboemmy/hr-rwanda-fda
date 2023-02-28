import React, { Component } from "react";
import { MdClose } from "react-icons/md";
import { connect } from "react-redux";
import {
  BooleanEnum,
  EmployeeDetailsInterface,
  EmployeeListInterface,
  EmployeePositionItem,
  FC_GetAllUnits,
  FC_GetEmployeeDetails,
  FC_GetSystemAccessDetails,
  System,
  UnitStore,
} from "../../actions";
import AccessListTable from "../../components/AccessListTable/AccessListTable";
import BackButton from "../../components/Fragments/BackButton";
import {
  AccessLoading,
  InfoLoading,
} from "../../components/Loading/LoadingComponentTypes";
import { UserAccessList } from "../../config/userAccess";
import { StoreState } from "../../reducers";

interface EmployeePositionsProps {
  system: System;
  units: UnitStore;
  onClose?: () => void;
  employee: EmployeeListInterface;
  activeEmployeePosition: EmployeePositionItem | null;
  FC_GetEmployeeDetails: (
    user_id: string,
    callback: (
      loading: boolean,
      res: {
        res: EmployeeDetailsInterface | null;
        type: "success" | "error";
        msg: string;
      } | null
    ) => void
  ) => void;
  FC_GetSystemAccessDetails: (callback: (loading: boolean) => void) => void;
  FC_GetAllUnits: (callback: (loading: boolean, error: string) => void) => void;
}
interface EmployeePositionsState {
  positionData: EmployeeDetailsInterface | null;
  loadingData: boolean;
  error: string;
}

class _EmployeePositions extends Component<
  EmployeePositionsProps,
  EmployeePositionsState
> {
  constructor(props: EmployeePositionsProps) {
    super(props);

    this.state = {
      positionData: null,
      loadingData: false,
      error: "",
    };
  }
  getUnitName = (unit_id: string) => {
    if (this.props.units.units !== null) {
      const response = this.props.units.units.find(
        (itm) => itm.unit_id.toString() === unit_id.toString()
      );
      if (response !== undefined) {
        return response.unit_name;
      }
    }
    return "Wait...";
  };
  LoadEmployeeDetails = () => {
    this.props.FC_GetEmployeeDetails(
      this.props.employee.user_id,
      (
        loading: boolean,
        res: {
          res: EmployeeDetailsInterface | null;
          type: "success" | "error";
          msg: string;
        } | null
      ) => {
        this.setState({ loadingData: loading });
        if (res?.type === "success") {
          this.setState({
            positionData: res.res,
            loadingData: false,
            error: "",
          });
        }
        if (res?.type === "error") {
          this.setState({
            positionData: null,
            loadingData: false,
            error: res.msg,
          });
        }
      }
    );
  };
  getAccessName = (access_key: UserAccessList) => {
    if (this.props.system.access_details !== null) {
      const response = this.props.system.access_details.find(
        (itm) => itm.access_key === access_key
      );
      if (response !== undefined) {
        return response.access_name;
      }
    }
    return "Wait...";
  };
  componentDidMount = () => {
    this.LoadEmployeeDetails();
    if (this.props.system.access_details === null) {
      this.setState({ loadingData: true });
      this.props.FC_GetSystemAccessDetails((loading: boolean) =>
        this.setState({ loadingData: loading })
      );
    }
    if (this.props.units.units === null) {
      this.props.FC_GetAllUnits((loading: boolean) => {});
    }
  };
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
              <div className="flex flex-row items-center gap-2">
                <div className="font-bold text-xl">
                  Employee positions details
                </div>
                <div className="w-max px-2 rounded-full text-sm font-bold bg-primary-800 text-white">
                  {this.props.employee.first_name}{" "}
                  {this.props.employee.last_name}
                </div>
              </div>
              <div className="text-sm text-gray-600">
                {this.props.activeEmployeePosition?.position_name}
              </div>
            </div>
          </div>
          {this.props.onClose !== undefined && (
            <div onClick={this.props.onClose} className="mr-2">
              <MdClose className="text-2xl hover:text-red-600 cursor-pointer" />
            </div>
          )}
        </div>
        <div
          className="pt-4 px-2 md:px-4 overflow-y-auto p-3 py-10"
          style={{
            height: "calc(100vh - 85px)",
          }}
        >
          {this.state.loadingData === true ||
          this.state.positionData === null ? (
            <div>
              <InfoLoading />
            </div>
          ) : (
            <div>
              {this.state.positionData.positions.map((item, i) => (
                <div
                  key={i + 1}
                  className="p-3 rounded-md mb-3 border border-primary-300 grid grid-cols-12 gap-3"
                >
                  <div className="col-span-5">
                    <div className="flex flex-row items-center gap-3 mb-3">
                      <div>
                        <div className="bg-primary-700 text-white h-8 w-8 rounded-full font-bold text-lg flex items-center justify-center">
                          {i + 1}
                        </div>
                      </div>
                      <div>
                        <div className="font-bold text-xl">
                          Position details
                        </div>
                        <div className="font-semibold">
                          {item.is_acting === BooleanEnum.TRUE ? (
                            <div className="text-sm font-bold px-2 rounded-full bg-yellow-600 text-white w-max">
                              Acting on this position
                            </div>
                          ) : (
                            <div></div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-12 gap-3 w-full pl-3">
                      <div className="col-span-12 flex flex-col">
                        <span className="text-sm text-gray-500">
                          Position name
                        </span>
                        <span className="font-semibold">
                          {item.position_name}
                        </span>
                      </div>
                      <div className="col-span-12 flex flex-col">
                        <span className="text-sm text-gray-500">Unit</span>
                        <span className="font-semibold">{item.unit_name}</span>
                      </div>
                      <div className="col-span-12 flex flex-col">
                        <span className="text-sm text-gray-500">
                          Reporting Unit
                        </span>
                        <span className="font-semibold">
                          {this.getUnitName(item.report_unit_id)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-7">
                    <div className="font-bold text-xl mt-2 mb-3">
                      Position access details
                    </div>
                    <div>
                      <div className="w-full overflow-x-auto">
                        {this.props.system.access_details === null ? (
                          <AccessLoading />
                        ) : (
                          <AccessListTable
                            access={item.access}
                            getAccessName={this.getAccessName}
                            size={"small"}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({
  system,
  units,
}: StoreState): {
  system: System;
  units: UnitStore;
} => {
  return { system, units };
};

export const EmployeePositions = connect(mapStateToProps, {
  FC_GetEmployeeDetails,
  FC_GetSystemAccessDetails,
  FC_GetAllUnits,
})(_EmployeePositions);
