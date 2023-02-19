import React, { Component } from "react";
import { RiRefreshFill } from "react-icons/ri";
import { connect } from "react-redux";
import { StoreState } from "../../reducers";
import {
  ApplicationDetailsInterface,
  Auth,
  FC_GetApplicationByReferenceNumber,
  FC_GetApplicationsByStatus,
  FC_SetApplications,
  FC_SetError,
  FC_SetSuccess,
  StatusToSearchApplications,
  System,
} from "../../actions";
import { BsArrowLeft, BsShieldFillCheck, BsUiChecks } from "react-icons/bs";
import Alert, { AlertType } from "../../components/Alert/Alert";
import ApplicationsTableDisplay from "../../components/ApplicationsTableDisplay/ApplicationsTableDisplay";
import axios from "axios";
import { API_URL } from "../../utils/api";
import { commaFy, errorToText } from "../../utils/functions";
import DashboardLoading from "../../components/DashboardLoading/DashboardLoading";
import Chart from "react-apexcharts";
import { setAxiosToken } from "../../utils/AxiosToken";
import { Link } from "react-router-dom";
import { IoNotificationsSharp, IoStopwatch } from "react-icons/io5";
import {
  MdAutoDelete,
  MdBackHand,
  MdOutlineDashboard,
  MdOutlineHourglassTop,
  MdUpdate,
} from "react-icons/md";
import { HiPause } from "react-icons/hi";
import { IoMdListBox } from "react-icons/io";

interface AppProps {
  auth: Auth;
  system: System;
  FC_SetApplications: (data: ApplicationDetailsInterface[]) => void;
  FC_GetApplicationByReferenceNumber: (
    reference_number: string,
    callback: (
      loading: boolean,
      res: ApplicationDetailsInterface | null,
      msg: string
    ) => void
  ) => void;
  FC_SetSuccess: (msg: string) => void;
  FC_SetError: (msg: string) => void;
}

interface DashboardSummaryInterface {
  REGISTERED: number;
  NOT_SCREENED: number;
  WITHDRAWN: number;
  PROGRESS_IN_SCREENING: number;
  SCREENING_COMPLETED: number;
  OG: number;
  R: number;
  NR: number;
  APPROVED: number;
  REJECTED: number;
  UNCOMPLETED: number;
  total: number;
}

interface AppState {
  dashboard: DashboardSummaryInterface | null;
  loading: boolean;
  success: string;
  error: {
    target: "start_date" | "ending_date" | "main";
    msg: string;
  } | null;
  start_date: string;
  ending_date: string;
  open_report: {
    title: string;
    data: ApplicationDetailsInterface[];
  } | null;
  chart_value: ChartValues | null;
}

interface ChartValues {
  options: {
    chart: {
      id: "basic-bar";
    };
    plotOptions: {
      bar: {
        horizontal: boolean;
      };
    };
    xaxis: {
      categories: string[];
    };
  };
  series: [
    {
      name: "Total applications";
      data: number[];
    }
  ];
}

class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);

    this.state = {
      loading: false,
      success: "",
      error: null,
      start_date: "",
      ending_date: "",
      open_report: null,
      dashboard: null,
      chart_value: null,
    };
  }
  SearchData = (e: React.FormEvent<HTMLFormElement>) => {
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
  };

  FC_GetDashboardSummary = async () => {
    this.setState({ loading: true });
    setAxiosToken();
    try {
      const res = await axios.get<DashboardSummaryInterface>(
        `${API_URL}/application/count`
      );
      if (res) {
        this.setState({
          loading: false,
          dashboard: res.data,
          chart_value: {
            options: {
              chart: {
                id: "basic-bar",
              },
              plotOptions: {
                bar: {
                  horizontal: true,
                },
              },
              xaxis: {
                categories: [
                  "NOT_SCREENED",
                  "PROGRESS_IN_SCREENING",
                  "SCREENING_COMPLETED",
                  "WITHDRAWN SCREENING",
                  "ONGOING ASSESSMENT",
                  "WITHDRAWN ASSESSMENT",
                  "RECOMMENDED",
                  // "UNCOMPLETED",
                  "REJECTED",
                  "APPROVED",
                  "REGISTERED",
                ],
              },
            },
            series: [
              {
                name: "Total applications",
                data: [
                  res.data.NOT_SCREENED,
                  res.data.PROGRESS_IN_SCREENING,
                  res.data.SCREENING_COMPLETED,
                  res.data.WITHDRAWN,
                  res.data.OG,
                  res.data.NR,
                  res.data.R,
                  // res.data.UNCOMPLETED,
                  res.data.REJECTED,
                  res.data.APPROVED,
                  res.data.REGISTERED,
                ],
              },
            ],
          },
        });
      }
    } catch (error: any) {
      console.log("Err: ", { ...error });
      this.setState({
        error: {
          target: "main",
          msg: errorToText(error),
        },
        loading: false,
      });
    }
  };

  FC_GetDataTableByStatus = (status: StatusToSearchApplications) => {
    this.setState({ loading: true });
    FC_GetApplicationsByStatus(
      status,
      (
        loading: boolean,
        feedback: {
          type: "success" | "error";
          msg: string;
        } | null,
        data: ApplicationDetailsInterface[] | null
      ) => {
        this.setState({ loading: loading });
        if (feedback?.type === "success" && data !== null) {
          this.setState({
            open_report: {
              title: "Response",
              data: data,
            },
            success: feedback.msg,
          });
        }
        if (feedback?.type === "error") {
          this.setState({
            error: {
              target: "main",
              msg: feedback.msg,
            },
          });
        }
      }
    );
  };

  componentDidMount = () => {
    if (this.state.dashboard === null) {
      this.FC_GetDashboardSummary();
    }
  };
  render() {
    if (this.state.loading === true || this.state.dashboard === null) {
      return <DashboardLoading />;
    }

    if (this.state.open_report !== null) {
      return (
        <div className="bg-white rounded-md mt-2 pt-2">
          <div className="flex flex-row items-center gap-3 px-2 -mb-3">
            <div
              onClick={() => this.setState({ open_report: null })}
              className="bg-primary-100 text-black hover:bg-primary-800 hover:text-white cursor-pointer w-max text-sm font-bold flex flex-row items-center justify-center gap-2 px-3 py-2 rounded-md"
            >
              <div>
                <BsArrowLeft className="text-2xl" />
              </div>
              <span>Go Back</span>
            </div>
            <div className="font-extrabold text-xl">
              {this.state.open_report.title}
            </div>
          </div>
          {/* Report here */}
          <ApplicationsTableDisplay
            applications={this.state.open_report.data}
            FC_SetApplications={this.props.FC_SetApplications}
            FC_GetApplicationByReferenceNumber={
              this.props.FC_GetApplicationByReferenceNumber
            }
            onGoBack={() => this.setState({ open_report: null })}
            FC_SetSuccess={this.props.FC_SetSuccess}
            FC_Error={this.props.FC_SetError}
            onUpdate={(reference_number: string) => {
              if (this.state.open_report !== null) {
                // const temp_data = {
                //   title: this.state.open_report.title,
                //   data: this.state.open_report.data.filter,
                // };
                this.FC_GetDashboardSummary();
                this.setState({ open_report: null });
              }
            }}
          />
        </div>
      );
    }
    return (
      <div className="mt-3">
        <div className="flex flex-row items-center gap-3 mb-6">
          <div>
            <MdOutlineDashboard className="text-3xl" />
          </div>
          <span className="font-extrabold text-xl">Application Dashboard</span>
        </div>
        {this.state.error !== null && (
          <div className="w-full my-3">
            {this.state.error.msg !== "" && (
              <Alert
                alertType={AlertType.WARNING}
                title={"Not found!"}
                description={this.state.error.msg}
                close={() => {
                  this.setState({
                    error: null,
                  });
                }}
                className={"border-2 border-white"}
              />
            )}
          </div>
        )}
        {
          <div className="grid grid-cols-12 gap-3">
            <div
              onClick={() =>
                this.FC_GetDataTableByStatus(
                  StatusToSearchApplications.NOT_SCREENED
                )
              }
              className="col-span-12 sm:col-span-6 lg:col-span-3 rounded-lg bg-white p-3 flex flex-row items-center justify-between gap-3 cursor-pointer hover:bg-yellow-100 group animate__animated animate__zoomIn"
            >
              <div>
                <div className="h-14 w-14 rounded-full flex items-center justify-center bg-yellow-700">
                  <MdUpdate className="text-3xl text-white" />
                </div>
              </div>
              <div className="flex flex-col text-right group-hover:text-yellow-700">
                <span className="text-sm">Not screened</span>
                <span className="font-extrabold text-3xl">
                  {commaFy(this.state.dashboard.NOT_SCREENED)}
                </span>
              </div>
            </div>
            <div
              onClick={() =>
                this.FC_GetDataTableByStatus(
                  StatusToSearchApplications.PROGRESS_IN_SCREENING
                )
              }
              className="col-span-12 sm:col-span-6 lg:col-span-3 rounded-lg bg-white p-3 flex flex-row items-center justify-between gap-3 cursor-pointer hover:bg-primary-100 group animate__animated animate__zoomIn"
            >
              <div>
                <div className="h-14 w-14 rounded-full flex items-center justify-center bg-primary-800">
                  <RiRefreshFill className="text-3xl text-white animate-spin" />
                </div>
              </div>
              <div className="flex flex-col text-right group-hover: text-primary-800">
                <span className="text-sm">Under screening progress</span>
                <span className="font-extrabold text-3xl">
                  {commaFy(this.state.dashboard.PROGRESS_IN_SCREENING)}
                </span>
              </div>
            </div>
            <div
              onClick={() =>
                this.FC_GetDataTableByStatus(
                  StatusToSearchApplications.WITHDRAWN
                )
              }
              className="col-span-12 sm:col-span-6 lg:col-span-3 rounded-lg bg-white p-3 flex flex-row items-center justify-between gap-3 cursor-pointer hover:bg-gray-100 group animate__animated animate__zoomIn"
            >
              <div>
                <div className="h-14 w-14 rounded-full flex items-center justify-center bg-gray-500">
                  <MdOutlineHourglassTop className="text-3xl text-white" />
                </div>
              </div>

              <div className="flex flex-col text-right text-black">
                <span className="text-sm">Withdrawn screening</span>
                <span className="font-extrabold text-3xl">
                  {commaFy(this.state.dashboard.WITHDRAWN)}
                </span>
              </div>
            </div>
            <div
              onClick={() =>
                this.FC_GetDataTableByStatus(
                  StatusToSearchApplications.SCREENING_COMPLETED
                )
              }
              className="col-span-12 sm:col-span-6 lg:col-span-3 rounded-lg bg-white p-3 flex flex-row items-center justify-between gap-3 cursor-pointer hover:bg-yellow-100 group animate__animated animate__zoomIn"
            >
              <div>
                <div className="h-14 w-14 rounded-full flex items-center justify-center bg-yellow-700">
                  <MdBackHand className="text-3xl text-white" />
                </div>
              </div>
              <div className="flex flex-col text-right group-hover:text-yellow-700">
                <span className="text-sm">Waiting for assessors</span>
                <span className="font-extrabold text-3xl">
                  {commaFy(this.state.dashboard.SCREENING_COMPLETED)}
                </span>
              </div>
            </div>
            <div
              onClick={() =>
                this.FC_GetDataTableByStatus(StatusToSearchApplications.OG)
              }
              className="col-span-12 sm:col-span-6 lg:col-span-3 rounded-lg bg-white p-3 flex flex-row items-center justify-between gap-3 cursor-pointer hover:bg-primary-100 group animate__animated animate__zoomIn"
            >
              <div>
                <div className="h-14 w-14 rounded-full flex items-center justify-center bg-primary-800 animate-pulse">
                  <BsUiChecks className="text-3xl text-white" />
                </div>
              </div>
              <div className="flex flex-col text-right group-hover:text-primary-800">
                <span className="text-sm">Under assessment progress</span>
                <span className="font-extrabold text-3xl">
                  {commaFy(this.state.dashboard.OG)}
                </span>
              </div>
            </div>
            <div
              onClick={() =>
                this.FC_GetDataTableByStatus(StatusToSearchApplications.NR)
              }
              className="col-span-12 sm:col-span-6 lg:col-span-3 rounded-lg bg-white p-3 flex flex-row items-center justify-between gap-3 cursor-pointer hover:bg-gray-100 group animate__animated animate__zoomIn"
            >
              <div>
                <div className="h-14 w-14 rounded-full flex items-center justify-center bg-gray-500 animate-pulse">
                  <IoStopwatch className="text-3xl text-white" />
                </div>
              </div>
              <div className="flex flex-col text-right text-black">
                <span className="text-sm">Withdrawn assessments</span>
                <span className="font-extrabold text-3xl">
                  {commaFy(this.state.dashboard.NR)}
                </span>
              </div>
            </div>
            <div
              onClick={() =>
                this.FC_GetDataTableByStatus(StatusToSearchApplications.R)
              }
              className="col-span-12 sm:col-span-6 lg:col-span-3 rounded-lg bg-white p-3 flex flex-row items-center justify-between gap-3 cursor-pointer hover:bg-yellow-100 group animate__animated animate__zoomIn"
            >
              <div>
                <div className="h-14 w-14 rounded-full flex items-center justify-center bg-yellow-700 animate-pulse">
                  <HiPause className="text-3xl text-white" />
                </div>
              </div>
              <div className="flex flex-col text-right group-hover:text-yellow-700">
                <span className="text-sm">Waiting for peer review</span>
                <span className="font-extrabold text-3xl">
                  {commaFy(this.state.dashboard.R)}
                </span>
              </div>
            </div>
            <div
              onClick={() =>
                this.FC_GetDataTableByStatus(
                  StatusToSearchApplications.REJECTED
                )
              }
              className="col-span-12 sm:col-span-6 lg:col-span-3 rounded-lg bg-white p-3 flex flex-row items-center justify-between gap-3 cursor-pointer hover:bg-gray-100 group animate__animated animate__zoomIn"
            >
              <div>
                <div className="h-14 w-14 rounded-full flex items-center justify-center bg-gray-500 animate-pulse">
                  <MdAutoDelete className="text-3xl text-white" />
                </div>
              </div>
              <div className="flex flex-col text-right text-black">
                <span className="text-sm">Rejected</span>
                <span className="font-extrabold text-3xl">
                  {commaFy(this.state.dashboard.REJECTED)}
                </span>
              </div>
            </div>
            {/* <div
              onClick={() =>
                this.FC_GetDataTableByStatus(
                  StatusToSearchApplications.UNCOMPLETED
                )
              }
              className="col-span-12 sm:col-span-6 lg:col-span-3 rounded-lg bg-white p-3 flex flex-row items-center justify-between gap-3 cursor-pointer hover:bg-gray-100 group animate__animated animate__zoomIn"
            >
              <div>
                <div className="h-14 w-14 rounded-full flex items-center justify-center bg-gray-500 animate-pulse">
                  <AiFillPlayCircle className="text-3xl text-white" />
                </div>
              </div>
              <div className="flex flex-col text-right text-black">
                <span className="text-sm">Under Peer review</span>
                <span className="font-extrabold text-3xl">
                  {commaFy(this.state.dashboard.UNCOMPLETED)}
                </span>
              </div>
            </div> */}
            <div
              onClick={() =>
                this.FC_GetDataTableByStatus(
                  StatusToSearchApplications.APPROVED
                )
              }
              className="col-span-12 sm:col-span-6 lg:col-span-3 rounded-lg bg-white p-3 flex flex-row items-center justify-between gap-3 cursor-pointer hover:bg-yellow-100 group animate__animated animate__zoomIn"
            >
              <div>
                <div className="h-14 w-14 rounded-full flex items-center justify-center bg-yellow-700">
                  <IoNotificationsSharp className="text-3xl text-white animate__animated animate__bounceIn animate__infinite" />
                </div>
              </div>
              <div className="flex flex-col text-right group-hover:text-yellow-700">
                <span className="text-sm">Recommended for registration</span>
                <span className="font-extrabold text-3xl">
                  {commaFy(this.state.dashboard.APPROVED)}
                </span>
              </div>
            </div>

            <Link
              to="/product-list"
              className="col-span-12 sm:col-span-6 lg:col-span-3 rounded-lg bg-white p-3 flex flex-row items-center justify-between gap-3 cursor-pointer hover:bg-green-100 group animate__animated animate__zoomIn"
            >
              <div>
                <div className="h-14 w-14 rounded-full flex items-center justify-center bg-green-700 animate-pulse">
                  <BsShieldFillCheck className="text-3xl text-white" />
                </div>
              </div>
              <div className="flex flex-col text-right text-green-700">
                <span className="text-sm">Registered products</span>
                <span className="font-extrabold text-3xl">
                  {this.state.dashboard.REGISTERED}
                </span>
              </div>
            </Link>
            <Link
              to="/applications-list"
              className="col-span-12 sm:col-span-6 lg:col-span-3 rounded-lg bg-white p-3 flex flex-row items-center justify-between gap-3 cursor-pointer group animate__animated animate__zoomIn"
            >
              <div>
                <div className="h-14 w-14 rounded-full flex items-center justify-center bg-gray-500 animate-pulse">
                  <IoMdListBox className="text-3xl text-white" />
                </div>
              </div>
              <div className="flex flex-col text-right text-gray-700">
                <span className="text-sm">Total Applications</span>
                <span className="font-extrabold text-3xl">
                  {commaFy(this.state.dashboard.total)}
                </span>
              </div>
            </Link>
            {/* Chart */}
            <div className="col-span-12 grid grid-cols-12 gap-3">
              <div className="col-span-12 lg:col-span-6 bg-white rounded-lg p-4">
                <div className="mt-3">
                  {this.state.chart_value !== null && (
                    <Chart
                      options={this.state.chart_value.options}
                      series={this.state.chart_value.series}
                      type="bar"
                      width="100%"
                    />
                  )}
                </div>
              </div>
              <div className="col-span-12 lg:col-span-6 bg-white rounded-lg p-4">
                <div className="mt-3">
                  {this.state.chart_value !== null && (
                    <Chart
                      options={{
                        series: this.state.chart_value.series,
                        labels: this.state.chart_value.options.xaxis.categories,
                      }}
                      series={this.state.chart_value.series[0].data}
                      type="donut"
                      width="100%"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    );
  }
}

const mapStateToProps = ({
  auth,
  system,
}: StoreState): {
  auth: Auth;
  system: System;
} => {
  return {
    auth,
    system,
  };
};

export const Dashboard = connect(mapStateToProps, {
  FC_SetApplications,
  FC_GetApplicationByReferenceNumber,
  FC_SetSuccess,
  FC_SetError,
})(App);
