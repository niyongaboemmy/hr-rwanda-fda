import React, { Component, Fragment } from "react";
import { MdClose } from "react-icons/md";
import { NavLink } from "react-router-dom";
import { Auth } from "../../actions";
import FDA_ICON from "../../assets/logo.jpeg";
import {
  AUTHENTICATED_MENUS,
  menus_categories,
} from "../../config/AppNavigations";

interface SideNavBarProps {
  auth: Auth;
  setOpenVav: (status: boolean) => void;
  sideNavbarStatus: boolean;
}
interface SideNavBarState {}

export class SideNavBar extends Component<SideNavBarProps, SideNavBarState> {
  render() {
    const menus = AUTHENTICATED_MENUS;
    const baseClass =
      "flex flex-row items-center gap-2 px-5 py-2 text-sm mr-3 rounded-r-full";
    return (
      <Fragment>
        <div className="fixed w-full md:w-64 bg-white top-16 bottom-0 left-0 right-5 transition overflow-y-auto z-50">
          <div className="flex items-center justify-center px-5 mt-4">
            <img
              src={FDA_ICON}
              alt="Rwanda FDA"
              className="hidden md:block w-24"
            />
          </div>
          <div className="flex md:hidden flex-row items-center justify-between gap-2 mx-2">
            <span className="text-lg font-bold">Explore Menus</span>
            <div>
              <div
                onClick={() =>
                  this.props.setOpenVav(!this.props.sideNavbarStatus)
                }
                className="h-10 w-10 rounded-full bg-red-50 hover:bg-red-100 flex items-center justify-center cursor-pointer"
              >
                <MdClose className="text-2xl text-red-700" />
              </div>
            </div>
          </div>
          <div className="flex flex-col mb-3">
            {menus_categories().map((item, k) => (
              <div key={k + 1} className="mt-5">
                <div className="text-gray-500 uppercase text-xs px-5 mb-1">
                  {item.title}
                </div>
                {menus
                  .filter((itm) => itm.menu_type === item.key)
                  .map((nav, i) => (
                    <NavLink
                      key={i + 1}
                      to={nav.url}
                      className={(isActive) =>
                        isActive === true
                          ? `${baseClass} bg-primary-100 text-primary-900`
                          : `${baseClass} hover:bg-gray-100`
                      }
                    >
                      <div className="text-xl">{<nav.icon />}</div>
                      <span>{nav.title}</span>
                    </NavLink>
                  ))}
              </div>
            ))}
          </div>
        </div>
      </Fragment>
    );
  }
}

export default SideNavBar;
