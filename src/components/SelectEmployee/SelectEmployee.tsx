import React, { Component } from "react";
import { MdClose } from "react-icons/md";
import { connect } from "react-redux";
import {
  BooleanEnum,
  EmployeeListInterface,
  EmployeeStore,
  FC_GetAllEmployees,
} from "../../actions";
import { StoreState } from "../../reducers";
import { search } from "../../utils/functions";
import { NoResultFound } from "../Fragments/NoResultFound";
import SearchInput from "../Fragments/SearchInput";
import LoaderComponent from "../Loading/LoaderComponent";

interface SelectEmployeeProps {
  onClose: () => void;
  employee: EmployeeStore;
  FC_GetAllEmployees: (
    callback: (loading: boolean, error: string) => void
  ) => void;
  onSelect: (data: EmployeeListInterface) => void;
}
interface SelectEmployeeState {
  loading: boolean;
  error: string;
  searchData: string;
}

class _SelectEmployee extends Component<
  SelectEmployeeProps,
  SelectEmployeeState
> {
  constructor(props: SelectEmployeeProps) {
    super(props);

    this.state = {
      loading: false,
      error: "",
      searchData: "",
    };
  }
  GetAllEmployees = () => {
    this.setState({ loading: true });
    this.props.FC_GetAllEmployees((loading: boolean, error: string) =>
      this.setState({ loading: loading, error: error })
    );
  };
  FilteredData = () => {
    if (this.props.employee.employees === null) {
      return [];
    }
    const response = this.props.employee.employees;
    return search(response, this.state.searchData) as EmployeeListInterface[];
  };
  componentDidMount(): void {
    if (
      this.props.employee.employees === null ||
      this.props.employee.employees.length === 0
    ) {
      this.GetAllEmployees();
    }
  }
  render() {
    return (
      <div className="absolute bg-white rounded-md shadow-md top-3 right-5 left-5 animate__animated animate__zoomIn">
        <div className="flex flex-row items-center justify-between gap-2 border-b px-4 py-4">
          <div className="flex flex-row items-center gap-3 w-full">
            <div className="w-full">
              <div className="font-bold text-xl">Choose Employee</div>
            </div>
            <div className="w-full">
              <SearchInput
                searchData={this.state.searchData}
                onChange={(value: string) =>
                  this.setState({ searchData: value })
                }
                placeholder="Search by name"
              />
            </div>
          </div>
          <div className="w-1/3 flex flex-row items-center justify-end">
            <div
              onClick={this.props.onClose}
              className="h-10 w-10 rounded-full flex items-center justify-center bg-red-100 hover:bg-red-200 text-red-700 cursor-pointer"
            >
              <MdClose className="text-2xl" />
            </div>
          </div>
        </div>
        {this.state.loading === true ||
        this.props.employee.employees === null ? (
          <div className="p-3">
            <LoaderComponent />
          </div>
        ) : (
          <div>
            {this.FilteredData().length === 0 ? (
              <NoResultFound />
            ) : (
              <div className="w-full overflow-x-auto">
                <table className="min-w-full text-sm text-left">
                  <thead>
                    <tr>
                      <th className="px-3 py-2 border truncate">#</th>
                      <th className="px-3 py-2 border truncate">First name</th>
                      <th className="px-3 py-2 border truncate">Last name</th>
                      <th className="px-3 py-2 border truncate">Gender</th>
                      <th className="px-3 py-2 border truncate">Nationality</th>
                      <th className="px-3 py-2 border truncate">NID</th>
                      <th className="px-3 py-2 border truncate">
                        Martial Status
                      </th>
                      <th className="px-3 py-2 border truncate">
                        Phone number
                      </th>
                      <th className="px-3 py-2 border truncate">Email</th>
                      <th className="px-3 py-2 border truncate">Position</th>
                      <th className="px-3 py-2 border truncate">Unit</th>
                      {/* <th className="px-3 py-2 border truncate"></th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {this.FilteredData().map((item, i) => (
                      <tr
                        onClick={() => this.props.onSelect(item)}
                        key={i + 1}
                        className="group hover:text-primary-800 cursor-pointer hover:bg-primary-50"
                        title="Click to select this employee"
                      >
                        <td className="px-3 py-2 border truncate">{i + 1}</td>
                        <td className="px-3 py-2 border truncate">
                          {item.first_name}
                        </td>
                        <td className="px-3 py-2 border truncate">
                          {item.last_name}
                        </td>
                        <td className="px-3 py-2 border truncate">
                          {item.gender}
                        </td>
                        <td className="px-3 py-2 border truncate">
                          {item.nationality}
                        </td>
                        <td className="px-3 py-2 border truncate">
                          {item.nid_number}
                        </td>
                        <td className="px-3 py-2 border truncate">
                          {item.martial_status}
                        </td>
                        <td className="px-3 py-2 border truncate">
                          {item.phone_number}
                        </td>
                        <td className="px-3 py-2 border truncate">
                          {item.email}
                        </td>
                        <td className="px-3 py-2 border truncate">
                          {
                            item.positions.find(
                              (itm) =>
                                itm.is_active === BooleanEnum.TRUE &&
                                itm.is_acting === BooleanEnum.FALSE
                            )?.position_name
                          }
                        </td>
                        <td className="px-3 py-2 border truncate">
                          {
                            item.positions.find(
                              (itm) =>
                                itm.is_active === BooleanEnum.TRUE &&
                                itm.is_acting === BooleanEnum.FALSE
                            )?.unit_name
                          }
                        </td>
                        {/* <td className="border p-1 w-10">
                          <div className="px-3 py-2 rounded-md text-sm font-bold w-max cursor-pointer bg-primary-100 group-hover:bg-primary-700 text-primary-800 group-hover:text-white">
                            Select
                          </div>
                        </td> */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = ({
  employee,
}: StoreState): {
  employee: EmployeeStore;
} => {
  return { employee };
};

export const SelectEmployee = connect(mapStateToProps, { FC_GetAllEmployees })(
  _SelectEmployee
);
