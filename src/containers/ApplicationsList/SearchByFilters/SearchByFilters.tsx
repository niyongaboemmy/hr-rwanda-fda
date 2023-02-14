import React, { Component, Fragment } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";
import { RiSearchLine } from "react-icons/ri";
import {
  ApplicationDetailsInterface,
  ApplicationsStore,
} from "../../../actions";
import Alert, { AlertType } from "../../../components/Alert/Alert";
import {
  ApplicationDetails,
  getOutcomeValues,
} from "../../../components/ApplicationDetails/ApplicationDetails";
import ExportToExcel from "../../../components/GenerateReport/ExportToExcel";
import Loading from "../../../components/Loading/Loading";
import MainContainer from "../../../components/MainContainer/MainContainer";
import Modal, { ModalSize, Themes } from "../../../components/Modal/Modal";
import { commaFy, DATE, search } from "../../../utils/functions";
import FilterByStatus from "./FilterByStatus";

interface SearchByFiltersProps {
  applications: ApplicationsStore;
  onGoBack: () => void;
  FC_GetApplicationByReferenceNumber: (
    reference_number: string,
    callback: (
      loading: boolean,
      res: ApplicationDetailsInterface | null,
      msg: string
    ) => void
  ) => void;
  FC_GetApplicationByDates: (
    starting_date: string,
    ending_date: string,
    callback: (loading: boolean, msg: string) => void
  ) => void;
  FC_SetSuccess: (msg: string) => void;
  FC_Error: (msg: string) => void;
  FC_SetApplications: (
    applications: ApplicationDetailsInterface[] | null
  ) => void;
}
interface SearchByFiltersState {
  loading: boolean;
  start_date: string;
  ending_date: string;
  error: {
    target: "start_date" | "ending_date" | "main";
    msg: string;
  } | null;
  selected_application: ApplicationDetailsInterface | null;
  selected_status: string;
  search_application: string;
  view_statuses_filter: boolean;
}

export class SearchByFilters extends Component<
  SearchByFiltersProps,
  SearchByFiltersState
> {
  constructor(props: SearchByFiltersProps) {
    super(props);

    this.state = {
      loading: false,
      start_date: "",
      ending_date: "",
      error: null,
      selected_application: null,
      selected_status: "",
      search_application: "",
      view_statuses_filter: false,
    };
  }
  getStatuses = (data: ApplicationDetailsInterface[]) => {
    const statuses: string[] = [];
    for (const item of data) {
      if (
        statuses.find(
          (itm) =>
            itm.toLocaleLowerCase() ===
            item.registration_Status.toLocaleLowerCase()
        ) === undefined
      ) {
        statuses.push(item.registration_Status);
      }
    }
    return statuses;
  };
  ReturnFilteredData = (): ApplicationDetailsInterface[] => {
    if (this.props.applications.applicationsList === null) {
      return [];
    }
    var response: ApplicationDetailsInterface[] =
      this.props.applications.applicationsList;
    // Sort by selected status
    if (this.state.selected_status !== "") {
      response = response.filter(
        (itm) =>
          itm.registration_Status.toLocaleLowerCase() ===
          this.state.selected_status.toLocaleLowerCase()
      );
    }
    // Filter by search
    response = search(
      response,
      this.state.search_application
    ) as ApplicationDetailsInterface[];
    return response;
  };
  SearchData = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (this.state.start_date === "") {
      return this.setState({
        error: {
          target: "start_date",
          msg: "Please fill start date",
        },
      });
    }
    if (this.state.ending_date === "") {
      return this.setState({
        error: {
          target: "ending_date",
          msg: "Please fill ending date",
        },
      });
    }
    this.setState({ loading: true });
    this.props.FC_GetApplicationByDates(
      this.state.start_date,
      this.state.ending_date,
      (loading: boolean, msg: string) => {
        this.setState({ loading: loading });
        if (msg !== "") {
          this.setState({
            error: {
              target: "main",
              msg: msg,
            },
          });
        }
      }
    );
  };
  FC_RequestApplicationDetails = (reference_number: string) => {
    this.setState({ loading: true });
    this.props.FC_GetApplicationByReferenceNumber(
      reference_number,
      (
        loading: boolean,
        data: ApplicationDetailsInterface | null,
        msg: string
      ) => {
        console.log("data: ", data);
        this.setState({ loading: loading });
        if (
          loading === false &&
          data !== null &&
          this.props.applications.applicationsList !== null
        ) {
          //  update reducers
          var new_applications =
            this.props.applications.applicationsList.filter(
              (itm) =>
                itm.application_ref_number !== data.application_ref_number
            );
          this.props.FC_SetApplications([data, ...new_applications]); // Change here
          this.setState({ selected_application: data });
        }
        if (msg !== "") {
          this.setState({
            error: {
              target: "main",
              msg: msg,
            },
          });
        }
      }
    );
  };
  render() {
    return (
      <Fragment>
        <div>
          {/* Search box */}
          <MainContainer
            className={`mt-3 animate__animated animate__fadeIn ${
              this.props.applications.applicationsList !== null
                ? "min-h-screen"
                : ""
            }`}
          >
            <div className="grid grid-cols-6 lg:grid-cols-12 gap-2">
              <div className="col-span-6 flex flex-row items-center gap-3">
                <div className="">
                  <div
                    onClick={() => {
                      this.props.FC_SetApplications(null);
                      this.props.onGoBack();
                    }}
                    className={`bg-gray-100 cursor-pointer hover:bg-primary-100 hover:text-primary-800 flex items-center justify-center h-10 w-10 rounded-full`}
                  >
                    <BsArrowLeft className="text-3xl" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-extrabold">
                    Explore Applications
                  </span>
                  <span className="text-xs">
                    The system provides an easy way of generating applications
                    in range of two dates so that they can be exported
                  </span>
                </div>
              </div>
              <form
                onSubmit={this.SearchData}
                className="col-span-6 flex flex-row items-end justify-end gap-3"
              >
                <div className="flex flex-col w-full">
                  <span className="text-sm">Enter start date</span>
                  <input
                    type="date"
                    value={this.state.start_date}
                    onChange={(e) => {
                      this.setState({
                        start_date: e.target.value,
                        error: null,
                      });
                    }}
                    disabled={this.state.loading}
                    className={`px-3 py-2 rounded-md border-2 ${
                      this.state.error?.target === "start_date"
                        ? "border-red-600 animate__animated animate__shakeX"
                        : "border-primary-800"
                    } w-full text-sm`}
                  />
                </div>
                <div className="flex flex-col w-full">
                  <span className="text-sm">Enter ending date</span>
                  <input
                    type="date"
                    value={this.state.ending_date}
                    onChange={(e) => {
                      this.setState({
                        ending_date: e.target.value,
                        error: null,
                      });
                    }}
                    disabled={this.state.loading}
                    className={`px-3 py-2 rounded-md border-2 ${
                      this.state.error?.target === "ending_date"
                        ? "border-red-600 animate__animated animate__shakeX"
                        : "border-primary-800"
                    } w-full text-sm`}
                  />
                </div>
                <button
                  type="submit"
                  disabled={this.state.loading}
                  className="flex flex-row items-center justify-center gap-2 font-normal px-3 py-2 rounded-md cursor-pointer text-white bg-primary-800 hover:bg-primary-900"
                >
                  <div>
                    {this.state.loading === true ? (
                      <AiOutlineLoading3Quarters className="text-xl animate-spin" />
                    ) : (
                      <RiSearchLine className="text-xl" />
                    )}
                  </div>
                  <span>
                    {this.state.loading === true ? "Loading..." : "Search"}
                  </span>
                </button>
              </form>
            </div>
            {this.state.error !== null && (
              <div className="w-full mt-3">
                {this.state.error.msg !== "" && (
                  <Alert
                    alertType={AlertType.DANGER}
                    title={"Invalid input!"}
                    description={this.state.error.msg}
                    close={() => {
                      this.setState({
                        error: null,
                      });
                    }}
                  />
                )}
              </div>
            )}

            {this.state.loading === true ? (
              <div className="mt-5">
                <Loading />
                <div className="-mt-10 ml-4 font-light animate-pulse">
                  Loading, please wait...
                </div>
              </div>
            ) : (
              this.props.applications.applicationsList !== null && (
                <div className="w-full overflow-x-auto mt-4 min-h-screen">
                  {/* Filters */}
                  <div>
                    {this.state.start_date !== "" && (
                      <div className="text-xs">
                        Result from {DATE(this.state.start_date)} to{" "}
                        {DATE(this.state.ending_date)}
                      </div>
                    )}
                    <div className="grid grid-cols-12 gap-2">
                      <div className="col-span-6 flex flex-row items-center gap-2">
                        <div className="relative w-full">
                          <div
                            onClick={() =>
                              this.setState({
                                view_statuses_filter:
                                  !this.state.view_statuses_filter,
                              })
                            }
                            className="w-full border px-3 py-1 rounded-md border-gray-400 flex flex-row items-center justify-between gap-2 text-sm font-bold hover:border-primary-800 cursor-pointer"
                          >
                            <div>
                              {this.state.selected_status === "" ? (
                                <span>Choose status</span>
                              ) : (
                                <span className=" text-primary-900">
                                  {this.state.selected_status}
                                </span>
                              )}
                            </div>
                            <div>
                              {this.state.view_statuses_filter === false ? (
                                <BsArrowRight className="text-2xl" />
                              ) : (
                                <IoMdClose className="text-2xl" />
                              )}
                            </div>
                          </div>
                          {/* Status filter */}
                          {this.state.view_statuses_filter === true && (
                            <FilterByStatus
                              title={"Choose status"}
                              data_list={this.getStatuses(
                                this.props.applications.applicationsList
                              )}
                              selected_data={this.state.selected_status}
                              onSelect={(data: string) => {
                                this.setState({
                                  selected_status: data,
                                  view_statuses_filter: false,
                                });
                              }}
                              getTotal={(status: string) => {
                                var total = 0;
                                if (
                                  this.props.applications.applicationsList !==
                                  null
                                ) {
                                  total =
                                    this.props.applications.applicationsList.filter(
                                      (itm) =>
                                        itm.registration_Status === status
                                    ).length;
                                }
                                return total;
                              }}
                            />
                          )}
                        </div>
                        <input
                          type="text"
                          value={this.state.search_application}
                          onChange={(e) =>
                            this.setState({
                              search_application: e.target.value,
                            })
                          }
                          disabled={this.state.loading}
                          className="px-3 py-2 rounded-md text-sm font-bold border border-gray-400 w-full"
                          placeholder="Search..."
                        />
                      </div>
                      <div className="col-span-6 flex flex-row items-center justify-end gap-2">
                        {this.state.selected_status !== "" && (
                          <div className="flex flex-col items-end justify-center text-right py-1 px-2 rounded-md hover:bg-primary-100 hover:text-primary-900 cursor-pointer">
                            <div className="text-xs font-light">
                              {this.state.selected_status}
                            </div>
                            <div className="text-xl font-extrabold -mt-1">
                              {commaFy(this.ReturnFilteredData().length)}
                            </div>
                          </div>
                        )}
                        <div className="flex flex-col items-end justify-center text-right py-1 px-2 rounded-md hover:bg-primary-100 hover:text-primary-900 cursor-pointer">
                          <div className="text-xs font-light">
                            Total applications
                          </div>
                          <div className="text-xl font-extrabold -mt-1">
                            {commaFy(
                              this.props.applications.applicationsList.length
                            )}
                          </div>
                        </div>
                        <ExportToExcel
                          fileData={this.ReturnFilteredData()}
                          fileName={`Applications report - starting from: ${this.state.start_date} to: ${this.state.ending_date}`}
                          btnName="Download EXCEL"
                        />
                      </div>
                    </div>
                  </div>
                  <table className="w-full text-left">
                    <thead className="text-primary-900 text-xs">
                      <tr>
                        <th className="px-3 py-2 border-b border-primary-700">
                          #
                        </th>
                        <th className="px-3 py-2 border-b border-primary-700">
                          Reference No
                        </th>
                        <th className="px-3 py-2 border-b border-primary-700">
                          Brand name
                        </th>
                        <th className="px-3 py-2 border-b border-primary-700">
                          Applicant
                        </th>
                        <th className="px-3 py-2 border-b border-primary-700">
                          Product common name
                        </th>
                        <th className="px-3 py-2 border-b border-primary-700">
                          Registration status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-xs">
                      {this.ReturnFilteredData().length === 0 ? (
                        <tr>
                          <td
                            colSpan={6}
                            className="text-xl font-light text-center pt-4"
                          >
                            <div className="w-full bg-gray-200 rounded-md p-3 text-center">
                              No result found!
                            </div>
                          </td>
                        </tr>
                      ) : (
                        this.ReturnFilteredData().map((item, i) => (
                          <tr
                            key={i + 1}
                            className={`${
                              i % 2 !== 0 ? "bg-gray-100" : ""
                            } hover:bg-primary-100 hover:text-primary-900 cursor-pointer animate__animated animate__fadeIn`}
                            onClick={() =>
                              this.setState({ selected_application: item })
                            }
                          >
                            <td className="px-3 py-1">{i + 1}</td>
                            <td className="px-3 py-1">
                              {item.application_ref_number}
                            </td>
                            <td className="px-3 py-2">
                              {item.product_brand_name}
                            </td>
                            <td className="px-3 py-1">{item.applicant_name}</td>
                            <td className="px-3 py-2">
                              {item.product_common_name}
                            </td>
                            <td className="px-3 py-1">
                              {getOutcomeValues(item.registration_Status)}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )
            )}
          </MainContainer>
        </div>
        {this.state.selected_application !== null && (
          <Modal
            backDrop={true}
            theme={Themes.default}
            close={() => this.setState({ selected_application: null })}
            backDropClose={true}
            widthSizeClass={ModalSize.maxWidth}
            displayClose={false}
            padding={{
              title: undefined,
              body: true,
              footer: undefined,
            }}
          >
            <ApplicationDetails
              data={this.state.selected_application}
              modal={true}
              onClose={() => this.setState({ selected_application: null })}
              source="list"
              onUpdate={(reference_number: string) => {
                this.setState({ selected_application: null });
                this.FC_RequestApplicationDetails(reference_number);
              }}
              FC_SetSuccess={this.props.FC_SetSuccess}
              FC_Error={this.props.FC_Error}
            />
          </Modal>
        )}
      </Fragment>
    );
  }
}
