import React, { Component } from "react";
import { FiArrowRightCircle } from "react-icons/fi";
import { Auth, BooleanEnum, EmploymentItem } from "../../actions";

interface SwitchEmploymentProps {
  auth: Auth;
  setEmploymentItem: (position: EmploymentItem) => void;
}
interface SwitchEmploymentState {
  loading: boolean;
}

export class SwitchEmployment extends Component<
  SwitchEmploymentProps,
  SwitchEmploymentState
> {
  constructor(props: SwitchEmploymentProps) {
    super(props);

    this.state = {
      loading: false,
    };
  }
  render() {
    return (
      <div>
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-hero-pattern filter blur-lg flex flex-col items-center justify-center overflow-y-auto"></div>
        <div className="h-auto w-full grid grid-cols-12 fixed top-0 bottom-0 left-0 right-0 overflow-y-auto py-2">
          <div className="col-span-12 md:col-span-2 lg:col-span-3"></div>
          <div className="col-span-12 md:col-span-8 lg:col-span-6 flex flex-col items-center justify-center">
            <div
              className="w-full h-auto bg-white rounded-md p-6 py-4 animate__animated animate__bounceInUp"
              style={{ zIndex: 9 }}
            >
              <div className="font-bold text-2xl">Choose position</div>
              <div className="text-sm">
                You have more positions assigned to you, choose how you want to
                act
              </div>
              <div className="mt-5">
                {this.props.auth.user === null ? (
                  <div></div>
                ) : this.props.auth.user.employment.length === 0 ? (
                  <div></div>
                ) : (
                  this.props.auth.user.employment.map((item, i) => (
                    <div
                      onClick={() => this.props.setEmploymentItem(item)}
                      className="bg-gray-100 rounded-md px-3 py-3 mb-2 cursor-pointer hover:bg-primary-50 hover:text-primary-800 flex flex-row items-center justify-between gap-3 group border hover:border-primary-700"
                      key={i + 1}
                    >
                      <div className="flex flex-row items-center gap-3">
                        <div>
                          <div className="h-8 w-8 flex items-center justify-center border group-hover:border-white rounded-full bg-white group-hover:bg-primary-700 group-hover:text-white font-semibold text-base">
                            {i + 1}
                          </div>
                        </div>
                        <div className="font-semibold group-hover:text-black">
                          {item.position_name}
                        </div>
                      </div>
                      <div className="flex flex-row items-center justify-end gap-2">
                        <div>
                          {item.is_acting === BooleanEnum.FALSE ? (
                            <div className="text-sm font-bold bg-primary-700 text-white rounded-md px-1">
                              Continue
                            </div>
                          ) : (
                            <div className="text-sm font-bold bg-yellow-600 text-white rounded-md px-1 truncate">
                              Acting position
                            </div>
                          )}
                        </div>
                        <div>
                          <FiArrowRightCircle className="text-3xl text-gray-300 group-hover:text-primary-700" />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          <div className="col-span-12 md:col-span-2 lg:col-span-3"></div>
        </div>
      </div>
    );
  }
}
