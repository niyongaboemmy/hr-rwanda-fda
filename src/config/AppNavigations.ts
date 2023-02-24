import { IconType } from "react-icons";
import { MdOutlineDashboard } from "react-icons/md";
import { HiOutlineBriefcase, HiOutlineUser } from "react-icons/hi";
import { RiLockPasswordLine } from "react-icons/ri";
import { UserAccessList } from "./userAccess";
import { FaUsersCog } from "react-icons/fa";

export enum MENU_TYPE {
  NONE = "NONE",
  PROFILE = "PROFILE",
  ACTIVITIES = "ACTIVITIES",
  REPORTS = "REPORTS",
  SETTINGS = "SETTINGS",
}

export interface NavigationInterface {
  title: string;
  url: string;
}

export interface SideNavigationInterface {
  title: string;
  url: string;
  icon: IconType;
  label: string;
  menu_type: MENU_TYPE;
  access: UserAccessList | "all";
}

/**
 * @description Appear allways
 * @done_by Emmy
 */
export const PUBLIC: NavigationInterface[] = [
  {
    title: "Login",
    url: "/login",
  },
];

/**
 * @description Appear once the user is not logged in
 * @done_by Emmy
 */
export const NON_AUTHENTICATED_MENUS: NavigationInterface[] = [
  {
    title: "About",
    url: "/about",
  },
  {
    title: "Login",
    url: "/login",
  },
];

/**
 * @description Appear once the user is logged in
 * @done_by Emmy
 */
export const AUTHENTICATED_MENUS: SideNavigationInterface[] = [
  {
    icon: MdOutlineDashboard,
    title: "Dashboard",
    label: "Dashboard",
    url: "/dashboard",
    menu_type: MENU_TYPE.NONE,
    access: "all",
  },
  {
    icon: HiOutlineUser,
    title: "Profile",
    label: "Profile",
    url: "/profile",
    menu_type: MENU_TYPE.PROFILE,
    access: "all",
  },
  {
    icon: RiLockPasswordLine,
    title: "Change Password",
    label: "Change Password",
    url: "/change-password",
    menu_type: MENU_TYPE.PROFILE,
    access: "all",
  },
  {
    icon: HiOutlineBriefcase,
    title: "Positions management",
    label: "Positions management",
    url: "/positions-management",
    menu_type: MENU_TYPE.ACTIVITIES,
    access: UserAccessList.POSITIONS,
  },
  {
    icon: FaUsersCog,
    title: "Employees",
    label: "Employees",
    url: "/employees-management",
    menu_type: MENU_TYPE.ACTIVITIES,
    access: UserAccessList.EMPLOYEES_LIST,
  },
];

export const menus_categories = (): { key: MENU_TYPE; title: string }[] => {
  const response: { key: MENU_TYPE; title: string }[] = [];
  for (const menu in MENU_TYPE) {
    response.push({
      key: menu as MENU_TYPE,
      title:
        menu === MENU_TYPE.PROFILE
          ? "Profile"
          : menu === MENU_TYPE.ACTIVITIES
          ? "Activities"
          : menu === MENU_TYPE.REPORTS
          ? "Reports"
          : menu === MENU_TYPE.SETTINGS
          ? "Settings"
          : "",
    });
  }
  return response.filter((element) =>
    response.find((itm) => itm.key === element.key)
  );
};
