import React, { Component } from "react";
import { BsInfoCircleFill } from "react-icons/bs";
import { ApplicationDetailsInterface } from "../../actions";
import {
  ApplicationCurrentState,
  CurrentStatusEnum,
  GetDaysQueryWaitingForAssessment,
} from "./Assessment";

interface ApplicationStatusProps {
  data: ApplicationDetailsInterface;
}
interface ApplicationStatusState {
  loading: boolean;
}

export class ApplicationStatus extends Component<
  ApplicationStatusProps,
  ApplicationStatusState
> {
  constructor(props: ApplicationStatusProps) {
    super(props);

    this.state = {
      loading: false,
    };
  }
  render() {
    return (
      <div>
        {ApplicationCurrentState(this.props.data) !==
          CurrentStatusEnum.NULL && (
          <div className="flex flex-row items-center gap-3 bg-yellow-50 text-black w-full px-2 py-2 pr-4 border border-yellow-300 rounded-md">
            <div>
              <BsInfoCircleFill className="text-5xl text-yellow-700 animate__animated animate__pulse animate__infinite" />
            </div>
            <div className="flex flex-col">
              <span className="font-light text-xl">
                {"Application current step"}
              </span>
              <span className="font-extrabold text-sm text-yellow-700">
                {ApplicationCurrentState(this.props.data)}{" "}
                {GetDaysQueryWaitingForAssessment(this.props.data) > 0 &&
                  `FOR ${GetDaysQueryWaitingForAssessment(
                    this.props.data
                  )} DAYS`}
              </span>
            </div>
          </div>
        )}
      </div>
    );
  }
}
