import React, { Component } from "react";
import {
  ApplicationDetailsInterface,
  PeerReviewStatusValues,
} from "../../actions";
import { IoMdCheckmarkCircle } from "react-icons/io";
import { IoBanOutline } from "react-icons/io5";
import { RiErrorWarningLine } from "react-icons/ri";
import { MdLockOpen } from "react-icons/md";

interface PeerReviewProps {
  data: ApplicationDetailsInterface;
  openPeerReview: (status: boolean) => void;
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

export const GetLastPeerReviewValue = (data: ApplicationDetailsInterface) => {
  if (data.peerreviews.length <= 0) {
    return null;
  }
  const res = data.peerreviews[data.peerreviews.length - 1];
  return res;
};

export const FCGetPeerReviewStatusElement = (props: {
  peerReview_status: PeerReviewStatusValues;
}) => {
  if (
    props.peerReview_status.toUpperCase() ===
    PeerReviewStatusValues.incomplete.toUpperCase()
  ) {
    return (
      <div className="flex flex-row items-center gap-2 rounded-full p-1 bg-gray-50 text-gray-700 border border-gray-300 font-bold text-xs pr-3 w-max">
        <div>
          <RiErrorWarningLine className="text-2xl animate-pulse" />
        </div>
        <div>{props.peerReview_status.toUpperCase()}</div>
      </div>
    );
  }
  if (
    props.peerReview_status.toUpperCase() ===
    PeerReviewStatusValues.approved.toUpperCase()
  ) {
    return (
      <div className="flex flex-row items-center gap-2 rounded-full p-1 bg-green-50 text-green-700 border border-green-400 font-bold text-xs pr-3 w-max">
        <div>
          <IoMdCheckmarkCircle className="text-2xl" />
        </div>
        <div>{props.peerReview_status.toUpperCase()}</div>
      </div>
    );
  }
  return (
    <div className="flex flex-row items-center gap-2 rounded-full p-1 bg-red-50 text-red-700 border border-red-400 font-bold text-xs pr-3 w-max">
      <div>
        <IoBanOutline className="text-2xl" />
      </div>
      <div>{props.peerReview_status.toUpperCase()}</div>
    </div>
  );
};

export class PeerReview extends Component<PeerReviewProps, ScreeningState> {
  constructor(props: PeerReviewProps) {
    super(props);

    this.state = {
      loading: false,
      error: null,
    };
  }
  GetLastPeerReviewValue = () => {
    if (this.props.data.peerreviews.length <= 0) {
      return null;
    }
    const res =
      this.props.data.peerreviews[this.props.data.peerreviews.length - 1];
    return res;
  };
  render() {
    return (
      <div>
        <div
          onClick={() => this.props.openPeerReview(true)}
          className="rounded-md p-2 flex flex-row gap-2 justify-between bg-white border hover:border-primary-300 hover:bg-primary-50 hover:text-primary-900 group cursor-pointer"
        >
          <div className="flex flex-row items-center gap-3">
            <div className="">
              <div
                className={`h-16 w-16 rounded-md border ${
                  this.GetLastPeerReviewValue() === null
                    ? "bg-gray-100 border-gray-100"
                    : "bg-primary-100 border-primary-100"
                } group-hover:bg-white group-hover:border-primary-100 flex items-center justify-center`}
              >
                <MdLockOpen
                  className={`text-5xl ${
                    this.GetLastPeerReviewValue() === null
                      ? "text-gray-300"
                      : "text-primary-700"
                  } group-hover:text-primary-800`}
                />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base cursor-pointer hover:text-primary-800">
                Peer review progress
              </span>
              {this.GetLastPeerReviewValue() === null ? (
                <div className="font-semibold text-sm text-gray-400 group-hover:text-yellow-700">
                  No details found!
                </div>
              ) : (
                <div>
                  <div className="flex flex-col text-xs">
                    <span className=" group-hover:text-primary-900">
                      Peer review comment:
                    </span>
                    {this.GetLastPeerReviewValue()!.comment !== "" ? (
                      <span className="font-light">
                        {this.GetLastPeerReviewValue()!.comment}
                      </span>
                    ) : (
                      <span className="font-semibold text-gray-400">
                        No comment found
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end justify-center gap-2">
            {this.GetLastPeerReviewValue() === null ? (
              <div className="flex flex-row items-center gap-1 rounded-full p-1 bg-yellow-50 text-yellow-700 border border-yellow-200 font-bold text-xs pr-3">
                <div>
                  <RiErrorWarningLine className="text-2xl animate__animated animate__zoomIn animate__infinite" />
                </div>
                <div>{"Not reviewed"}</div>
              </div>
            ) : (
              <FCGetPeerReviewStatusElement
                peerReview_status={this.GetLastPeerReviewValue()!.status}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default PeerReview;
