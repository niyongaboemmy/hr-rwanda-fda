import React, { Component } from "react";
import { BiMessageSquareEdit } from "react-icons/bi";
import { BsArrowLeft } from "react-icons/bs";
import {
  ApplicationDetailsInterface,
  PeerReviewStatusValues,
} from "../../../actions";
import { EditPeerReview } from "../edit/EditPeerReview";
import { FCGetPeerReviewStatusElement } from "../PeerReview";

interface PeerReviewDetailsProps {
  data: ApplicationDetailsInterface;
  openPeerReviewDetails: (status: boolean) => void;
  onSave: (application_reference_number: string) => void;
  modal: boolean;
}

interface PeerReviewDetailsState {
  editReview: {
    comment: string;
    status: PeerReviewStatusValues;
  } | null;
}

export class PeerReviewDetails extends Component<
  PeerReviewDetailsProps,
  PeerReviewDetailsState
> {
  constructor(props: PeerReviewDetailsProps) {
    super(props);

    this.state = {
      editReview: null,
    };
  }
  componentDidMount(): void {
    if (this.props.data.peerreviews.length === 0) {
      this.setState({
        editReview: {
          comment: "",
          status: PeerReviewStatusValues.approved,
        },
      });
    }
  }
  render() {
    if (this.state.editReview !== null) {
      return (
        <EditPeerReview
          onGoBack={() => {
            this.setState({ editReview: null });
            if (this.props.data.peerreviews.length === 0) {
              this.props.openPeerReviewDetails(false);
            }
          }}
          onSave={(application_ref_number: string) => {
            this.props.onSave(application_ref_number);
          }}
          data={this.props.data}
          comment={this.state.editReview.comment}
          status={this.state.editReview.status}
          modal={this.props.modal}
        />
      );
    }
    return (
      <div className="animate__animated animate__slideInRight animate__faster rounded-md bg-white p-3">
        <div className="flex flex-row items-center gap-2">
          <div>
            <div
              onClick={() => this.props.openPeerReviewDetails(false)}
              className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-100 hover:bg-primary-100 hover:text-primary-900 cursor-pointer"
            >
              <BsArrowLeft className="text-2xl" />
            </div>
          </div>
          <div className="font-extrabold text-xl flex flex-col">
            <span>Peer review details</span>
            <span className="text-sm font-light">
              This is the historical information for application peer review
            </span>
          </div>
        </div>
        {/* Details */}
        <div className="my-3">
          {this.props.data.peerreviews.length === 0 ? (
            <div className="w-full rounded-md bg-gray-200 text-lg font-light px-3 py-2">
              No review data found!
            </div>
          ) : (
            [
              this.props.data.peerreviews[
                this.props.data.peerreviews.length - 1
              ],
            ].map((item, i) => (
              <div
                key={i + 1}
                className="rounded-md bg-gray-100 hover:text-primary-900 flex flex-row items-center justify-between gap-2 w-full px-3 py-2 mb-2 hover:bg-primary-100 cursor-pointer group"
                // onClick={() => {
                //   this.setState({
                //     editReview: {
                //       comment: item.comment,
                //       status: item.status,
                //     },
                //   });
                // }}
              >
                <div className="flex flex-row items-center gap-2">
                  <div>
                    <div className="rounded-full bg-gray-200 group-hover:bg-primary-800 group-hover:text-white font-extrabold text-lg flex items-center justify-center h-8 w-8">
                      {i + 1}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold">Review comment</span>
                    <span className="font-base text-sm">{item.comment}</span>
                  </div>
                </div>
                <div>
                  <FCGetPeerReviewStatusElement
                    peerReview_status={item.status}
                  />
                </div>
              </div>
            ))
          )}
        </div>
        {
          <div
            onClick={() => {
              this.setState({
                editReview: {
                  comment: "",
                  status: PeerReviewStatusValues.approved,
                },
              });
            }}
            className="mt-5 flex flex-row items-center gap-2"
          >
            <div className="px-3 py-2 text-sm font-bold rounded-md bg-primary-100 text-primary-900 hover:bg-primary-800 hover:text-white cursor-pointer w-max flex flex-row items-center gap-2">
              <div>
                <BiMessageSquareEdit className="text-2xl" />
              </div>
              <span>Add peer review</span>
            </div>
          </div>
        }
      </div>
    );
  }
}
