import React, { Component } from "react";
import {
  ApplicationDetailsInterface,
  ScreeningInterface,
  ScreeningStatusValues,
} from "../../actions";
import { BiLoaderCircle } from "react-icons/bi";
import { IoMdCheckmarkCircle } from "react-icons/io";
import { IoBanOutline, IoDocumentAttachOutline } from "react-icons/io5";
import { RiErrorWarningLine } from "react-icons/ri";
import {
  DATE,
  GetDaysFromTwoDates,
  timestampToDate,
} from "../../utils/functions";

export const GetLastScreeningValue = (screenings: ScreeningInterface[]) => {
  if (screenings.length <= 0) {
    return null;
  }
  const res = screenings[screenings.length - 1];
  return res;
};

export const screeningNumberOfDays = (
  screenings: ScreeningInterface[]
): number => {
  const feedback_date =
    GetLastScreeningValue(screenings)!.date_of_screening_feedback;
  const response_date =
    GetLastScreeningValue(screenings)!.date_of_screening_response;
  const ToDayDate = new Date();
  console.log("ToDayDate: ", ToDayDate);
  console.log(
    "New date: ",
    DATE(timestampToDate(ToDayDate).fullDATE, "MM/DD/YYYY"),
    DATE(response_date, "MM/DD/YYYY")
  );

  if (
    (response_date === null || response_date === "") &&
    feedback_date !== null
  ) {
    return GetDaysFromTwoDates(
      DATE(feedback_date!, "MM/DD/YYYY"),
      DATE(timestampToDate(ToDayDate).fullDATE, "MM/DD/YYYY")
    );
  }
  return feedback_date === null
    ? 0
    : GetDaysFromTwoDates(
        DATE(feedback_date!.toString(), "MM/DD/YYYY"),
        DATE(response_date, "MM/DD/YYYY")
      );
};

export const validateScreening30Days = (
  screenings: ScreeningInterface[]
): "VALID" | "INVALID" => {
  const date_of_screening_response =
    GetLastScreeningValue(screenings)!.date_of_screening_response;
  if (
    date_of_screening_response === null ||
    date_of_screening_response === ""
  ) {
    if (screeningNumberOfDays(screenings) > 30) {
      return "INVALID";
    }
  }
  return "VALID";
};

interface ScreeningProps {
  data: ApplicationDetailsInterface;
  openScreeningDetails: (status: boolean) => void;
}
interface ScreeningState {
  loading: boolean;
  error: {
    target:
      | "date_of_screening"
      | "date_of_screening_response"
      | "screening_status";
    msg: string;
  } | null;
}

export const FCGetScreeningStatusElement = (props: {
  screening_status: ScreeningStatusValues;
}) => {
  if (props.screening_status === ScreeningStatusValues.PROGRESS_IN_SCREENING) {
    return (
      <div className="flex flex-row items-center gap-2 rounded-full p-1 bg-primary-100 text-primary-900 border border-primary-300 font-bold text-xs pr-3 w-max">
        <div>
          <BiLoaderCircle className="text-2xl animate-spin" />
        </div>
        <div>{props.screening_status}</div>
      </div>
    );
  }
  if (props.screening_status === ScreeningStatusValues.SCREENING_COMPLETED) {
    return (
      <div className="flex flex-row items-center gap-2 rounded-full p-1 bg-green-50 text-green-700 border border-green-400 font-bold text-xs pr-3 w-max">
        <div>
          <IoMdCheckmarkCircle className="text-2xl" />
        </div>
        <div>{props.screening_status}</div>
      </div>
    );
  }
  return (
    <div className="flex flex-row items-center gap-2 rounded-full p-1 bg-red-50 text-red-700 border border-red-400 font-bold text-xs pr-3 w-max">
      <div>
        <IoBanOutline className="text-2xl" />
      </div>
      <div>{props.screening_status}</div>
    </div>
  );
};

export class Screening extends Component<ScreeningProps, ScreeningState> {
  constructor(props: ScreeningProps) {
    super(props);

    this.state = {
      loading: false,
      error: null,
    };
  }
  GetLastScreeningValue = () => {
    if (this.props.data.screenings.length <= 0) {
      return null;
    }
    const res =
      this.props.data.screenings[this.props.data.screenings.length - 1];
    return res;
  };

  screeningNumberOfDays = (): number => {
    return screeningNumberOfDays(this.props.data.screenings);
  };

  validateScreening30Days = (): "VALID" | "INVALID" => {
    return validateScreening30Days(this.props.data.screenings);
  };
  render() {
    return (
      <div>
        <div
          onClick={() => this.props.openScreeningDetails(true)}
          className="rounded-md p-2 flex flex-row gap-2 justify-between bg-white border hover:border-primary-300 hover:bg-primary-50 hover:text-primary-900 group cursor-pointer"
        >
          <div className="flex flex-row items-center gap-3">
            <div className="">
              <div
                className={`h-16 w-16 rounded-md border ${
                  this.GetLastScreeningValue() === null
                    ? "bg-gray-100 border-gray-100"
                    : this.validateScreening30Days() === "INVALID"
                    ? "bg-red-100 border-red-300"
                    : "bg-primary-100 border-primary-100"
                } group-hover:bg-white group-hover:border-primary-100 flex items-center justify-center`}
              >
                <IoDocumentAttachOutline
                  className={`text-5xl ${
                    this.GetLastScreeningValue() === null
                      ? "text-gray-300"
                      : this.validateScreening30Days() === "INVALID"
                      ? "text-red-700 animate__animated animate__bounceIn"
                      : "text-primary-700"
                  } group-hover:text-primary-800`}
                />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base cursor-pointer hover:text-primary-800">
                Screening progress
              </span>
              {this.GetLastScreeningValue() === null ? (
                <div className="font-semibold text-sm text-gray-400 group-hover:text-yellow-700">
                  No details found!
                </div>
              ) : (
                <div>
                  {this.GetLastScreeningValue()!.date_of_screening_feedback !==
                    null && (
                    <div className="flex flex-row items-center text-xs gap-2">
                      <span className="font-light group-hover:text-primary-900">
                        Feedback date:{" "}
                      </span>
                      <span className="font-semibold">
                        {DATE(
                          this.GetLastScreeningValue()!
                            .date_of_screening_feedback!
                        )}
                      </span>
                    </div>
                  )}
                  {this.GetLastScreeningValue()!.date_of_screening_response ===
                  null ? (
                    <div className="font-semibold text-sm text-gray-400 group-hover:text-yellow-700">
                      No response found!
                    </div>
                  ) : (
                    <div className="flex flex-row items-center text-xs gap-2">
                      {/* <span className="font-light group-hover:text-primary-900">
                        Response date:{" "}
                      </span>
                      <span className="font-semibold">
                        {DATE(
                          this.GetLastScreeningValue()!
                            .date_of_screening_response!
                        )}
                      </span> */}
                    </div>
                  )}
                  {this.GetLastScreeningValue() !== null &&
                    this.GetLastScreeningValue()!.date_of_screening_response !==
                      null &&
                    this.GetLastScreeningValue()!.date_of_screening_feedback !==
                      null &&
                    this.GetLastScreeningValue()!.date_of_screening_feedback !==
                      "" && (
                      <div
                        className={`text-xs font-bold px-2 py-1 w-max rounded-full bg-primary-100 text-primary-900 group-hover:bg-primary-800 group-hover:text-white`}
                      >
                        Number of days: {this.screeningNumberOfDays()}
                      </div>
                    )}
                  {this.GetLastScreeningValue() !== null &&
                    (this.GetLastScreeningValue()!
                      .date_of_screening_response === null ||
                      this.GetLastScreeningValue()!
                        .date_of_screening_response === "") && (
                      <div
                        className={`text-xs font-bold px-2 py-1 w-max rounded-full ${
                          this.validateScreening30Days() === "VALID"
                            ? "bg-primary-100 text-primary-900 group-hover:bg-primary-800 group-hover:text-white"
                            : "bg-red-600 text-white animate__animated animate__jello animate__infinite"
                        }`}
                      >
                        Days passed: {this.screeningNumberOfDays()}
                      </div>
                    )}
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end justify-center gap-2">
            {this.GetLastScreeningValue() === null ? (
              <div className="flex flex-row items-center gap-1 rounded-full p-1 bg-yellow-50 text-yellow-700 border border-yellow-200 font-bold text-xs pr-3">
                <div>
                  <RiErrorWarningLine className="text-2xl animate__animated animate__zoomIn animate__infinite" />
                </div>
                <div>{"Not screened"}</div>
              </div>
            ) : (
              <FCGetScreeningStatusElement
                screening_status={
                  this.GetLastScreeningValue()!.screening_status
                }
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Screening;
