import React, { Component } from "react";
import { MdClose } from "react-icons/md";
import BackButton from "../Fragments/BackButton";

interface PositionDetailsProps {
  position: any;
  onClose?: () => void;
}
interface PositionDetailsState {}

export class PositionDetails extends Component<
  PositionDetailsProps,
  PositionDetailsState
> {
  constructor(props: PositionDetailsProps) {
    super(props);

    this.state = {};
  }
  render() {
    return (
      <div>
        <div className="flex flex-row items-center justify-between gap-3 px-3 py-3 border-b">
          <div className="flex flex-row items-center gap-3">
            {this.props.onClose !== undefined && (
              <div>
                <BackButton
                  title="Back"
                  className="bg-primary-100 text-primary-800 hover:bg-primary-800 hover:text-white font-semibold"
                  onClick={this.props.onClose}
                />
              </div>
            )}
            <div>
              <div className="font-bold text-lg">
                Vaccines and Biosimilar Registration Specialist
              </div>
              <div className="text-sm text-gray-600">
                Human Medicine And Devices Assessment & Registration Division
              </div>
            </div>
          </div>
          {this.props.onClose !== undefined && (
            <div onClick={this.props.onClose} className="mr-2">
              <MdClose className="text-2xl hover:text-red-600 cursor-pointer" />
            </div>
          )}
        </div>
      </div>
    );
  }
}
