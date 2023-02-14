import React, { Component } from "react";
import { BiMessageSquareEdit } from "react-icons/bi";
import {
  BsArrowLeft,
  BsArrowRight,
  BsInfoCircle,
  BsInfoCircleFill,
} from "react-icons/bs";
import { IoWarningOutline } from "react-icons/io5";
import { MdAccessTime, MdFeedback } from "react-icons/md";
import { ApplicationDetailsInterface } from "../../../actions";
import { DATE } from "../../../utils/functions";
import EditScreening from "../edit/EditScreening";
import {
  FCGetScreeningStatusElement,
  GetLastScreeningValue,
  screeningNumberOfDays,
  validateScreening30Days,
} from "../Screening";

interface ScreeningDetailsProps {
  data: ApplicationDetailsInterface;
  openScreeningDetails: (status: boolean) => void;
  onSave: (reference_number: string) => void;
  modal: boolean;
}

interface ScreeningDetailsState {
  editScreening: "FeedBack" | "Response" | "Status" | null;
}

const ScreeningSection = (props: {
  date: string;
  description: string;
  type: "Feedback" | "Response";
  onClick: () => void;
}) => {
  return (
    <div
      onClick={props.onClick}
      className="w-full rounded-md flex flex-row items-center gap-2 group hover:text-primary-900 border px-2 py-1 hover:bg-primary-50 hover:border-primary-100 cursor-pointer"
    >
      <div>
        <div className="h-16 w-16 rounded-lg flex items-center justify-center bg-primary-100 group-hover:bg-white">
          {props.type === "Response" ? (
            <MdFeedback className="text-5xl text-primary-700 group-hover:text-primary-800" />
          ) : (
            <BsInfoCircleFill className="text-5xl text-primary-700 group-hover:text-primary-800" />
          )}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col text-sm">
          <span className="font-bold">Screening {props.type}</span>
          <div className="flex flex-row items-center gap-2">
            <div>
              <MdAccessTime className="text-xl text-gray-400 group-hover:text-primary-900" />
            </div>
            <span className="font-semibold">Date: {DATE(props.date)}</span>
          </div>
        </div>
        <div className="flex flex-col text-sm">
          {/* <span className="font-light">Screening {props.type}</span> */}
          <div>{props.description}</div>
        </div>
      </div>
    </div>
  );
};

const EmptyScreeningSection = (props: {
  type: "Feedback" | "Response";
  onClick: () => void;
}) => {
  return (
    <div
      onClick={props.onClick}
      className="w-full flex flex-row items-center gap-2 justify-between rounded-md group hover:text-primary-900 border px-1 py-1 hover:bg-primary-50 hover:border-primary-100 cursor-pointer"
    >
      <div className="flex flex-row items-center gap-2">
        <div>
          <div className="h-16 w-16 rounded-lg flex items-center justify-center bg-gray-100 group-hover:bg-white">
            {props.type === "Response" ? (
              <MdFeedback className="text-5xl text-gray-300 group-hover:text-primary-800 animate-pulse" />
            ) : (
              <BsInfoCircleFill className="text-5xl text-gray-300 group-hover:text-primary-800 animate-pulse" />
            )}
          </div>
        </div>
        <div className="flex flex-col justify-between">
          <span className="font-bold">Screening {props.type}</span>
          <span className="text-lg font-light">
            Click here to add {props.type}
          </span>
        </div>
      </div>
      <div className="mr-2">
        <BsArrowRight className="text-3xl text-gray-300 group-hover:text-primary-900" />
      </div>
    </div>
  );
};

export class ScreeningDetails extends Component<
  ScreeningDetailsProps,
  ScreeningDetailsState
> {
  constructor(props: ScreeningDetailsProps) {
    super(props);

    this.state = {
      editScreening: null,
    };
  }
  GetLastScreeningFeedBack = () => {
    if (this.props.data.screenings.length === 0) {
      return null;
    }
    const item =
      this.props.data.screenings[this.props.data.screenings.length - 1];
    if (
      item.date_of_screening_feedback !== "" &&
      item.date_of_screening_feedback !== null
    ) {
      return item;
    }
    return null;
  };
  GetLastScreeningResponse = () => {
    if (this.props.data.screenings.length === 0) {
      return null;
    }
    const item =
      this.props.data.screenings[this.props.data.screenings.length - 1];
    if (
      item.date_of_screening_response !== "" &&
      item.date_of_screening_response !== null
    ) {
      return item;
    }
    return null;
  };
  componentDidMount(): void {
    if (this.props.data.screenings.length === 0) {
      this.setState({ editScreening: "FeedBack" });
    }
  }
  screeningNumberOfDays = (): number => {
    return screeningNumberOfDays(this.props.data.screenings);
  };

  validateScreening30Days = (): "VALID" | "INVALID" => {
    return validateScreening30Days(this.props.data.screenings);
  };
  render() {
    if (this.state.editScreening !== null) {
      return (
        <EditScreening
          onGoBack={() => {
            this.setState({ editScreening: null });
            if (this.props.data.screenings.length === 0) {
              this.props.openScreeningDetails(false);
            }
          }}
          data={this.props.data}
          onSave={(application_ref_number: string) => {
            // this.setState({ editScreening: null });
            this.props.onSave(application_ref_number);
          }}
          editScreening={this.state.editScreening}
          modal={this.props.modal}
        />
      );
    }
    return (
      <div className="animate__animated animate__fadeIn rounded-md bg-white p-3">
        <div className="flex flex-row items-center gap-2 justify-between">
          <div className="flex flex-row items-center gap-2">
            <div>
              <div
                onClick={() => this.props.openScreeningDetails(false)}
                className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-100 hover:bg-primary-100 hover:text-primary-900 cursor-pointer"
              >
                <BsArrowLeft className="text-2xl" />
              </div>
            </div>
            <div className="font-extrabold text-xl flex flex-col">
              <span>Screening details</span>
              <span className="text-sm font-light">
                This is the historical information for application screening
              </span>
            </div>
          </div>
          {this.props.data.screenings.length > 0 && (
            <FCGetScreeningStatusElement
              screening_status={
                this.props.data.screenings[
                  this.props.data.screenings.length - 1
                ].screening_status
              }
            />
          )}
        </div>
        {/* Details */}
        {GetLastScreeningValue(this.props.data.screenings) !== null &&
          (GetLastScreeningValue(this.props.data.screenings)!
            .date_of_screening_feedback === null ||
            GetLastScreeningValue(this.props.data.screenings)!
              .date_of_screening_feedback === "") &&
          this.validateScreening30Days() === "INVALID" && (
            <div className="my-3 rounded-md bg-red-100 border-red-300 text-red-700 px-2 py-2 pr-4 flex flex-row items-center gap-3">
              <div>
                <IoWarningOutline className="text-6xl animate__animated animate__tada animate__infinite" />
              </div>
              <div className="flex flex-col">
                <div className="flex flex-row gap-2 items-center text-xl font-extrabold">
                  <div className="text-base bg-red-700 text-white rounded-full px-2">
                    {this.screeningNumberOfDays()}
                  </div>
                  <span>days passed without feedback</span>
                </div>
                <div className="text-sm">
                  This application took over 30 days of getting customer
                  feedback, please check out for this
                </div>
              </div>
            </div>
          )}
        {GetLastScreeningValue(this.props.data.screenings) !== null &&
          GetLastScreeningValue(this.props.data.screenings)!
            .date_of_screening_response !== null &&
          GetLastScreeningValue(this.props.data.screenings)!
            .date_of_screening_response !== "" && (
            <div className="my-3 rounded-md bg-primary-50 border-primary-300 text-primary-900 px-2 py-2 pr-4 flex flex-row items-center gap-3">
              <div>
                <BsInfoCircle className="text-5xl animate__animated animate__tada" />
              </div>
              <div className="flex flex-col">
                <div className="flex flex-row gap-2 items-center text-xl font-extrabold">
                  <div className="text-base bg-primary-700 text-white rounded-full px-2">
                    {this.screeningNumberOfDays()}
                  </div>
                  <span>days taken to complete screening</span>
                </div>
                <div className="text-sm">
                  These days are taken from the start of screening up to the end
                </div>
              </div>
            </div>
          )}
        <div className="flex flex-row gap-4 mt-5">
          {this.GetLastScreeningResponse() !== null && (
            <>
              {this.GetLastScreeningFeedBack() !== null &&
              this.GetLastScreeningFeedBack()!.date_of_screening_feedback !==
                null ? (
                <ScreeningSection
                  date={
                    this.GetLastScreeningFeedBack()!.date_of_screening_feedback!
                  }
                  description={
                    this.GetLastScreeningFeedBack()!.screening_feedback
                  }
                  type={"Feedback"}
                  onClick={() => this.setState({ editScreening: "FeedBack" })}
                />
              ) : (
                <EmptyScreeningSection
                  type="Feedback"
                  onClick={() => this.setState({ editScreening: "FeedBack" })}
                />
              )}
            </>
          )}
          {this.GetLastScreeningResponse() !== null ? (
            <ScreeningSection
              date={
                this.GetLastScreeningResponse()!.date_of_screening_response ===
                null
                  ? ""
                  : this.GetLastScreeningResponse()!.date_of_screening_response!
              }
              description={this.GetLastScreeningResponse()!.screening_response}
              type={"Response"}
              onClick={() => this.setState({ editScreening: "Response" })}
            />
          ) : (
            <EmptyScreeningSection
              type="Response"
              onClick={() => this.setState({ editScreening: "Response" })}
            />
          )}
        </div>
        {this.GetLastScreeningResponse() !== null && (
          <div className="my-3 font-bold bg-gray-100 rounded-md px-3 py-2 w-max">
            Done by {this.GetLastScreeningResponse()?.done_by}
          </div>
        )}
        {this.props.data.screenings.length > 0 && (
          <div className="mt-5 flex flex-row items-center gap-2">
            <div
              onClick={() => this.setState({ editScreening: "Status" })}
              className="px-3 py-2 text-sm font-bold rounded-md bg-primary-100 text-primary-900 hover:bg-primary-800 hover:text-white cursor-pointer w-max flex flex-row items-center gap-2"
            >
              <div>
                <BiMessageSquareEdit className="text-2xl" />
              </div>
              <span>Update screening status</span>
            </div>
          </div>
        )}
      </div>
    );
  }
}
