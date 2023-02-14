import React, { Component } from "react";
import { BsArrowLeft } from "react-icons/bs";
import { RiSearchLine } from "react-icons/ri";
import { TbListSearch } from "react-icons/tb";
import { ApplicationCustomSearchInterface } from "../../../actions";
import { getOutcomeValues } from "../../../components/ApplicationDetails/ApplicationDetails";
import Loading from "../../../components/Loading/Loading";
import MainContainer from "../../../components/MainContainer/MainContainer";
import { commaFy, DATE, search } from "../../../utils/functions";

interface CustomResultTableProps {
  custom_search_result: ApplicationCustomSearchInterface[];
  search_keyword: string;
  loading: boolean;
  onSelect: (reference_number: string) => void;
  GoBack: () => void;
}
interface CustomResultTableState {
  search_data: string;
}

export class CustomResultTable extends Component<
  CustomResultTableProps,
  CustomResultTableState
> {
  constructor(props: CustomResultTableProps) {
    super(props);

    this.state = {
      search_data: "",
    };
  }
  render() {
    return (
      <div>
        {this.props.loading === true ? (
          <MainContainer className="mt-2">
            <Loading />
            <div className="ml-4 -mt-10 text-xl font-light animate-pulse">
              Loading data, please wait...
            </div>
          </MainContainer>
        ) : (
          <div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
              <div className="flex flex-col lg:flex-row lg:items-center gap-2">
                <div
                  onClick={this.props.GoBack}
                  className="flex flex-row items-center justify-center gap-2 bg-accent-400 text-accent-900 hover:bg-yellow-700 hover:text-white rounded w-max cursor-pointer px-3 py-2"
                >
                  <div>
                    <BsArrowLeft className="text-2xl" />
                  </div>
                  <span>Go Back</span>
                </div>
                <div>
                  <div className="h-10 w-10 rounded bg-primary-50 text-primary-900 hidden lg:flex items-center justify-center">
                    <TbListSearch className="text-3xl" />
                  </div>
                </div>
                <div>
                  <div className="text-lg font-bold">
                    Search results for {this.props.search_keyword}
                  </div>
                  <div className="text-xs font-light -mt-1">
                    Select application from the list to view more details to be
                    allowed performing more actions
                  </div>
                </div>
              </div>
              <div>
                <div className="flex flex-col">
                  <div className="text-sm font-light">Total applications</div>
                  <div className="font-extrabold text-xl -mt-1">
                    {commaFy(this.props.custom_search_result.length)}
                  </div>
                </div>
              </div>
            </div>
            {/* Details */}
            <div>
              {this.props.custom_search_result.length === 0 ? (
                <div className="bg-gray-100 rounded-md px-4 py-6 flex flex-col items-center justify-center text-center m-3">
                  <div>
                    <RiSearchLine className="text-8xl text-gray-300 animate__animated animate__shakeX" />
                  </div>
                  <div className="text-lg text-gray-500">
                    No result found for{" "}
                    <span className="font-bold">{this.state.search_data}</span>
                    {/* !, please try different keyword */}
                  </div>
                </div>
              ) : (
                <div>
                  <div>
                    <div className="relative w-full mb-4">
                      <div className="absolute px-3 py-2">
                        <RiSearchLine className="text-2xl text-gray-600" />
                      </div>
                      <input
                        type="search"
                        className="font-normal bg-white border border-primary-900 w-full px-3 pl-12 py-2 rounded"
                        placeholder="Search..."
                        value={this.state.search_data}
                        onChange={(e) =>
                          this.setState({ search_data: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div
                    className="w-full"
                    style={{ height: "calc(100vh - 270px)", overflowY: "auto" }}
                  >
                    <table className="text-left text-xs w-full">
                      <thead className="bg-primary-50">
                        <tr>
                          <th className="px-3 py-2">#</th>
                          <th className="px-3 py-2">Reference number</th>
                          <th className="px-3 py-2">Product common name</th>
                          <th className="px-3 py-2">Product brand name</th>
                          <th className="px-3 py-2">
                            Manufacturer name and country
                          </th>
                          <th className="px-3 py-2">Submission date</th>
                          <th className="px-3 py-2">Registration Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(
                          search(
                            this.props.custom_search_result,
                            this.state.search_data
                          ) as ApplicationCustomSearchInterface[]
                        ).length === 0 ? (
                          <tr>
                            <td
                              colSpan={7}
                              className="text-xl font-light py-3 text-center"
                            >
                              <div className="bg-gray-100 rounded-md px-4 py-6 flex flex-col items-center justify-center text-center m-3">
                                <div>
                                  <RiSearchLine className="text-8xl text-gray-300 animate__animated animate__shakeX" />
                                </div>
                                <div className="text-lg text-gray-500">
                                  No result found for{" "}
                                  <span className="font-bold">
                                    {this.state.search_data}
                                  </span>
                                  {/* !, please try different keyword */}
                                </div>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          (
                            search(
                              this.props.custom_search_result,
                              this.state.search_data
                            ) as ApplicationCustomSearchInterface[]
                          ).map((item, i) => (
                            <tr
                              key={i + 1}
                              className={`${
                                i % 2 !== 0 ? "bg-gray-100" : ""
                              } cursor-pointer hover:bg-primary-100 hover:text-primary-800 text-xs`}
                              title="Click to select the application"
                              onClick={() =>
                                this.props.onSelect(item.application_ref_number)
                              }
                            >
                              <td className="px-3 py-2">{i + 1}</td>
                              <td className="px-3 py-2">
                                {item.application_ref_number}
                              </td>
                              <td className="px-3 py-2">
                                {item.product_common_name}
                              </td>
                              <td className="px-3 py-2">
                                {item.product_brand_name}
                              </td>
                              <td className="px-3 py-2">
                                {item.manufacturer_name_and_country}
                              </td>
                              <td className="px-3 py-2">
                                {DATE(item.submission_date)}
                              </td>
                              <td className="px-3 py-2">
                                {getOutcomeValues(item.registration_Status)}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
}
