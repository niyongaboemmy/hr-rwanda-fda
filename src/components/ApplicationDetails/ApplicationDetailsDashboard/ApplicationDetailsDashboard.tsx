import React, { Component } from "react";
import { BsArrowLeft } from "react-icons/bs";
import { ApplicationDetailsInterface } from "../../../actions";
import { commaFy } from "../../../utils/functions";

interface ApplicationDetailsDashboardProps {
  data: ApplicationDetailsInterface;
  modal: boolean;
  onGoBack: () => void;
}
interface ApplicationDetailsDashboardState {
  loading: boolean;
}

export class ApplicationDetailsDashboard extends Component<
  ApplicationDetailsDashboardProps,
  ApplicationDetailsDashboardState
> {
  constructor(props: ApplicationDetailsDashboardProps) {
    super(props);

    this.state = {
      loading: false,
    };
  }
  TotalDownTime = () => {
    let total = 0;
    for (const item of this.props.data.assessmentqueries) {
      total += item.down_time;
    }
    return total;
  };
  render() {
    return (
      <div className="-mx-3 -mt-3">
        <div
          className={`bg-gray-200 grid grid-cols-12 gap-3 pb-2 pt-0 ${
            this.props.modal === true ? "px-2" : ""
          }`}
        >
          {this.props.modal === true && (
            <div className="col-span-12">
              <div className="font-extrabold mt-3 mb-3 text-2xl flex flex-row items-center gap-3 px-2">
                <div>
                  <div
                    onClick={this.props.onGoBack}
                    className="flex items-center justify-center h-10 w-10 bg-white hover:bg-primary-800 hover:text-white rounded-full cursor-pointer"
                  >
                    <BsArrowLeft className="text-3xl" />
                  </div>
                </div>
                <div>Application details</div>
              </div>
            </div>
          )}
          <div className="col-span-12 sm:col-span-6 lg:col-span-3 rounded-md bg-white flex flex-col items-center justify-center p-3 text-center text-primary-800 shadow">
            <span className="font-extrabold text-3xl">
              {commaFy(this.props.data.current_days)}
            </span>
            <span className="font-bold text-sm">Current days</span>
            {/* <span className="text-xs">
              Difference between today’s date and the dates of reception
            </span> */}
          </div>
          <div className="col-span-12 sm:col-span-6 lg:col-span-3 rounded-md bg-white flex flex-col items-center justify-center p-3 text-center text-green-600 shadow">
            <span className="font-extrabold text-3xl">
              {commaFy(this.props.data.up_time)}
            </span>
            <span className="font-bold text-sm">Up Time</span>
            {/* <span className="text-xs">
              Number of days between the issue of the certificate and the date
              of reception
            </span> */}
          </div>
          <div className="col-span-12 sm:col-span-6 lg:col-span-3 rounded-md bg-white flex flex-col items-center justify-center p-3 text-center text-yellow-800 shadow">
            <span className="font-extrabold text-3xl">
              {commaFy(
                this.props.data.assessmentqueries.length === 0
                  ? 0
                  : this.TotalDownTime()
              )}
            </span>
            <span className="font-bold text-sm">Down Time</span>
            {/* <span className="text-xs">
              Number of days taken by the applicant to respond to queries
            </span> */}
          </div>
          <div className="col-span-12 sm:col-span-6 lg:col-span-3 rounded-md bg-white flex flex-col items-center justify-center p-3 text-center text-gray-600 shadow">
            <span className="font-extrabold text-3xl">
              {this.props.data.up_time === 0
                ? commaFy(
                    Math.abs(
                      this.TotalDownTime() - this.props.data.current_days
                    )
                  )
                : commaFy(
                    Math.abs(this.TotalDownTime() - this.props.data.up_time)
                  )}
            </span>
            <span className="font-bold text-sm">Processing days</span>
            {/* <span className="text-xs">
              Number of days between up time and down time
            </span> */}
          </div>
        </div>
      </div>
    );
  }
}
