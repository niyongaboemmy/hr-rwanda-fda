import React from "react";
import { BsArrowLeft } from "react-icons/bs";
import { IoReloadOutline } from "react-icons/io5";
import { commaFy } from "../../../utils/functions";

const FilterByStatus = (props: {
  title: string;
  data_list: string[];
  selected_data: string;
  onSelect: (data: string) => void;
  getTotal: (status: string) => number;
}) => {
  return (
    <div
      className="absolute bg-white border border-gray-300 rounded-md shadow-xl p-3 z-50 mt-2 animate__animated animate__slideInLeft animate__faster"
      style={{ width: "auto", minWidth: "500px" }}
    >
      <div className="font-bold text-lg mb-3 flex flex-row items-center justify-between gap-2 w-full">
        <div className="flex flex-row items-center gap-2">
          <div onClick={() => props.onSelect(props.selected_data)}>
            <BsArrowLeft className="text-2xl cursor-pointer" />
          </div>
          <span>{props.title}</span>
        </div>
        {props.selected_data !== "" && (
          <div
            onClick={() => props.onSelect("")}
            className="flex flex-row items-center gap-2 justify-end rounded-md px-1 py-1 pr-3 text-xs font-bold bg-yellow-100 text-yellow-700 cursor-pointer hover:bg-yellow-200 animate__animated animate__zoomIn"
          >
            <div>
              <IoReloadOutline className="text-xl" />
            </div>
            <span>Reset</span>
          </div>
        )}
      </div>
      {props.data_list.length === 0 ? (
        <div className="rounded-md px-3 py-2 bg-gray-200 font-light">
          No data found!
        </div>
      ) : (
        props.data_list.map((item, i) => (
          <div
            className={`cursor-pointer ${
              props.selected_data === item
                ? "bg-primary-100 text-primary-900 font-bold"
                : "bg-gray-200 hover:bg-primary-800 hover:text-white"
            }  text-sm px-3 py-2 rounded-md mb-2 flex flex-row items-center justify-between group`}
            key={i + 1}
            onClick={() => props.onSelect(item)}
          >
            <span>{item}</span>
            <div className="group-hover:bg-primary-100 group-hover:text-primary-900 text-white bg-primary-800 border border-primary-800 rounded-full px-2 text-xs">
              {commaFy(props.getTotal(item))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default FilterByStatus;
