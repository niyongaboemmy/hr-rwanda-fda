import React from "react";
import { BsPersonCircle } from "react-icons/bs";
import { FaChalkboardTeacher } from "react-icons/fa";
import { FiDelete } from "react-icons/fi";
import { HiOutlineBriefcase } from "react-icons/hi";
import { IoMdWalk } from "react-icons/io";
import { MdTravelExplore } from "react-icons/md";
import { EmployeeListInterface } from "../../actions";
import BackButton from "../../components/Fragments/BackButton";
import { EmployeeActionTypes } from "./EmployeesManagement";

const ActionMenuComponent = (props: {
  icon: JSX.Element;
  title: string;
  description: string;
  onClick: () => void;
}): JSX.Element => {
  const SelectedIcon = props.icon;
  return (
    <div
      onClick={props.onClick}
      className="flex flex-row items-center gap-3 p-3 px-4 rounded-md bg-gray-100 cursor-pointer hover:bg-primary-100 hover:text-primary-800 group"
    >
      <div>{SelectedIcon}</div>
      <div>
        <div className="font-bold">{props.title}</div>
        <div className="text-xs text-gray-500 group-hover:text-primary-800">
          {props.description}
        </div>
      </div>
    </div>
  );
};

const ActionMenu = (props: {
  employee: EmployeeListInterface;
  onGoBack: () => void;
  onSelect: (action: EmployeeActionTypes) => void;
}) => {
  return (
    <div className="p-3">
      <div className="flex flex-row items-center gap-2">
        <div>
          <BackButton
            title="Go back"
            className="bg-primary-100 text-primary-800 hover:bg-primary-800 hover:text-white"
            onClick={props.onGoBack}
          />
        </div>
        <div>
          <div className="flex flex-row items-center gap-2">
            <div className="font-bold text-xl">Action menu</div>
            <div className="w-max px-2 rounded-full text-sm font-bold bg-primary-800 text-white">
              {props.employee.first_name} {props.employee.last_name}
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Choose action you want to be performed for the selected employee
          </div>
        </div>
      </div>
      <div className="mt-3">
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-4">
            <ActionMenuComponent
              icon={
                <BsPersonCircle className="text-5xl text-gray-300 group-hover:text-primary-800" />
              }
              title={"Profile details"}
              description={"More details for employee"}
              onClick={() => props.onSelect(EmployeeActionTypes.DETAILS)}
            />
          </div>
          <div className="col-span-4">
            <ActionMenuComponent
              icon={
                <HiOutlineBriefcase className="text-5xl text-gray-300 group-hover:text-primary-800" />
              }
              title={"Position details"}
              description={"Employment details"}
              onClick={() => props.onSelect(EmployeeActionTypes.POSITIONS)}
            />
          </div>
          <div className="col-span-4">
            <ActionMenuComponent
              icon={
                <FaChalkboardTeacher className="text-5xl text-gray-300 group-hover:text-primary-800" />
              }
              title={"Capacity building"}
              description={"Training related details"}
              onClick={() => props.onSelect(EmployeeActionTypes.TRAINING)}
            />
          </div>
          <div className="col-span-4">
            <ActionMenuComponent
              icon={
                <IoMdWalk className="text-5xl text-gray-300 group-hover:text-primary-800" />
              }
              title={"Leave"}
              description={"Employee leaves"}
              onClick={() => props.onSelect(EmployeeActionTypes.LEAVE)}
            />
          </div>
          <div className="col-span-4">
            <ActionMenuComponent
              icon={
                <MdTravelExplore className="text-5xl text-gray-300 group-hover:text-primary-800" />
              }
              title={"Travel"}
              description={"Employee travels"}
              onClick={() => props.onSelect(EmployeeActionTypes.TRAVEL)}
            />
          </div>
          <div className="col-span-4">
            <ActionMenuComponent
              icon={
                <FiDelete className="text-5xl text-gray-300 group-hover:text-primary-800" />
              }
              title={"Termination"}
              description={"Terminate the employee"}
              onClick={() => props.onSelect(EmployeeActionTypes.TERMINATE)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionMenu;
