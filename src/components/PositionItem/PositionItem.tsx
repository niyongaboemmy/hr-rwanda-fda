import React, { Component } from "react";
import { BsArrowRightCircle } from "react-icons/bs";
import { ImUser } from "react-icons/im";
import { MdArrowRight } from "react-icons/md";
import { BooleanEnum, PositionInterface } from "../../actions";

interface PositionItemProps {
  onClick: () => void;
  position: PositionInterface;
}
interface PositionItemState {}

export class PositionItem extends Component<
  PositionItemProps,
  PositionItemState
> {
  constructor(props: PositionItemProps) {
    super(props);

    this.state = {};
  }
  render() {
    return (
      <div
        onClick={this.props.onClick}
        className="mb-2 border-b border-gray-200 hover:border-primary-700 p-1 pb-4 cursor-pointer group animate__animated animate__fadeIn animate__slow"
        title="Click to view details"
      >
        <div className="flex flex-row items-center justify-between w-full gap-2">
          <div className="flex flex-row items-center gap-4">
            <div>
              <div className="flex items-center justify-center h-16 w-16 rounded-md bg-gray-100 group-hover:bg-primary-100">
                <ImUser className="text-5xl text-gray-300 group-hover:text-primary-700" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="text-base font-semibold group-hover:text-primary-800">
                {this.props.position.position_name}
              </div>
              <div className="flex flex-row items-center text-sm text-gray-600">
                <div>{this.props.position.job_family} job family</div>
                {this.props.position.is_line_manager === BooleanEnum.TRUE && (
                  <div>
                    <MdArrowRight className="text-yellow-600 text-2xl" />
                  </div>
                )}
                <div>
                  {this.props.position.is_line_manager === BooleanEnum.TRUE ? (
                    <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm truncate font-semibold">
                      Line manager
                    </span>
                  ) : (
                    <span></span>
                  )}
                </div>
              </div>
              <div className="flex flex-row items-center gap-3">
                <div>
                  <BsArrowRightCircle className="text-yellow-600 text-lg" />
                </div>
                <div className="text-sm text-gray-600">
                  {this.props.position.unit_name}
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="bg-gray-100 group-hover:bg-primary-700 group-hover:text-white px-3 py-2 rounded-md font-bold text-sm w-max cursor-pointer">
              Details
            </div>
          </div>
        </div>
      </div>
    );
  }
}
