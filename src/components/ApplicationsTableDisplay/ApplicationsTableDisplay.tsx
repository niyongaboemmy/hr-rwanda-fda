import React, { Component, Fragment } from "react";
import { BsArrowRight } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";
import { ApplicationDetailsInterface } from "../../actions";
import FilterByStatus from "../../containers/ApplicationsList/SearchByFilters/FilterByStatus";
import { commaFy, search } from "../../utils/functions";
import {
  ApplicationDetails,
  getOutcomeValues,
} from "../ApplicationDetails/ApplicationDetails";
import ExportToExcel from "../GenerateReport/ExportToExcel";
import Loading from "../Loading/Loading";
import MainContainer from "../MainContainer/MainContainer";
import Modal, { ModalSize, Themes } from "../Modal/Modal";

interface ApplicationsTableDisplayProps {
  applications: ApplicationDetailsInterface[];
  FC_SetApplications: (data: ApplicationDetailsInterface[]) => void;
  FC_GetApplicationByReferenceNumber: (
    reference_number: string,
    callback: (
      loading: boolean,
      res: ApplicationDetailsInterface | null,
      msg: string
    ) => void
  ) => void;
  onGoBack: () => void;
  FC_SetSuccess: (msg: string) => void;
  FC_Error: (msg: string) => void;
  onUpdate: (reference_number: string) => void;
}
interface ApplicationsTableDisplayState {
  loading: boolean;
  selected_application: ApplicationDetailsInterface | null;
  selected_status: string;
  search_application: string;
  view_statuses_filter: boolean;
}

export class ApplicationsTableDisplay extends Component<
  ApplicationsTableDisplayProps,
  ApplicationsTableDisplayState
> {
  constructor(props: ApplicationsTableDisplayProps) {
    super(props);

    this.state = {
      loading: false,
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
    if (this.props.applications === null) {
      return [];
    }
    var response: ApplicationDetailsInterface[] = this.props.applications;
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

  //   FC_RequestApplicationDetails = (reference_number: string) => {
  //     this.setState({ loading: true });
  //     this.props.FC_GetApplicationByReferenceNumber(
  //       reference_number,
  //       (
  //         loading: boolean,
  //         data: ApplicationDetailsInterface | null,
  //         msg: string
  //       ) => {
  //         console.log("data: ", data);
  //         this.setState({ loading: loading });
  //         if (
  //           loading === false &&
  //           data !== null &&
  //           this.props.applications !== null
  //         ) {
  //           //  update reducers
  //           var new_applications = this.props.applications.filter(
  //             (itm) => itm.application_ref_number !== data.application_ref_number
  //           );
  //           this.props.FC_SetApplications([data, ...new_applications]);
  //           this.setState({ selected_application: data });
  //         }
  //         if (msg !== "") {
  //           alert(msg);
  //         }
  //       }
  //     );
  //   };

  render() {
    return (
      <Fragment>
        <div>
          {/* Search box */}
          <MainContainer
            className={`mt-3 animate__animated animate__fadeIn ${
              this.props.applications !== null ? "min-h-screen" : ""
            }`}
          >
            {this.state.loading === true ? (
              <div className="mt-5">
                <Loading />
                <div className="-mt-10 ml-4 font-light animate-pulse">
                  Loading, please wait...
                </div>
              </div>
            ) : (
              this.props.applications !== null && (
                <div className="w-full overflow-x-auto mt-4 min-h-screen">
                  <div>
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
                                this.props.applications
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
                                if (this.props.applications !== null) {
                                  total = this.props.applications.filter(
                                    (itm) => itm.registration_Status === status
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
                            {commaFy(this.props.applications.length)}
                          </div>
                        </div>
                        <ExportToExcel
                          fileData={this.ReturnFilteredData()}
                          fileName={`Applications report`}
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
                this.props.onUpdate(reference_number);
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

export default ApplicationsTableDisplay;
