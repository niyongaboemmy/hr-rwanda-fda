import React, { Component } from "react";
import { BsArrowRightCircle } from "react-icons/bs";
import { ImUser } from "react-icons/im";
import { MdArrowRight } from "react-icons/md";

interface PositionItemProps {
  onClick: () => void;
  position: any;
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
        className="mb-2 border-b border-gray-200 hover:border-primary-700 p-1 pb-2 cursor-pointer group"
      >
        <div className="flex flex-row items-center justify-between w-full gap-2">
          <div className="flex flex-row items-center gap-4">
            <div>
              <div className="flex items-center justify-center h-16 w-16 rounded-md bg-gray-100 group-hover:bg-primary-100">
                <ImUser className="text-5xl text-gray-300 group-hover:text-primary-700" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="text-sm font-semibold group-hover:text-primary-800">
                Division Manager, Food and Drugs Import & Export Control
              </div>
              <div className="flex flex-row items-center text-xs text-gray-600">
                <div>Category of Management</div>
                <div>
                  <MdArrowRight className="text-yellow-600 text-2xl" />
                </div>
                <div>Subcategory of Technical</div>
              </div>
              <div className="flex flex-row items-center gap-3">
                <div>
                  <BsArrowRightCircle className="text-yellow-600 text-lg" />
                </div>
                <div className="text-xs text-gray-600">
                  Medical Devices & Instrumentation Testing Unit
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
