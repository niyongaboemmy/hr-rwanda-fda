import React from "react";
import { BsCheckCircle } from "react-icons/bs";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { UserAccessInterface, UserAccessList } from "../../config/userAccess";

export const ReturnBooleanStatusIcon = (status: boolean) => {
  return (
    <div>
      {status === true ? (
        <BsCheckCircle className="text-xl text-green-600" />
      ) : (
        <IoIosCloseCircleOutline className="text-2xl text-red-700" />
      )}
    </div>
  );
};

const AccessListTable = (props: {
  access: UserAccessInterface[];
  getAccessName: (value: UserAccessList) => string;
  onUpdate?: (item: UserAccessInterface) => void;
  size?: "small" | "medium";
}) => {
  return (
    <table
      className={`min-w-full text-${
        props.size === "small" ? "xs" : "sm"
      } text-left`}
    >
      <thead>
        <tr>
          <th className="px-3 py-2">#</th>
          <th className="px-3 py-2">Access</th>
          <th className="px-3 py-2">View</th>
          <th className="px-3 py-2">Create</th>
          <th className="px-3 py-2">Update</th>
          <th className="px-3 py-2">Delete</th>
          <th className="px-3 py-2">Export</th>
          {props.onUpdate !== undefined && <th className="px-1 py-1"></th>}
        </tr>
      </thead>
      <tbody>
        {props.access.map((item, i) => (
          <tr key={i + 1}>
            <td className="px-3 py-2">{i + 1}</td>
            <td className="px-3 py-2">{props.getAccessName(item.key)}</td>
            <td className="px-3 py-2">
              {ReturnBooleanStatusIcon(item.permission.view)}
            </td>
            <td className="px-3 py-2">
              {ReturnBooleanStatusIcon(item.permission.create)}
            </td>
            <td className="px-3 py-2">
              {ReturnBooleanStatusIcon(item.permission.update)}
            </td>
            <td className="px-3 py-2">
              {ReturnBooleanStatusIcon(item.permission.delete)}
            </td>
            <td className="px-3 py-2">
              {ReturnBooleanStatusIcon(item.permission.export)}
            </td>
            {props.onUpdate !== undefined && (
              <td className="px-1 py-1 w-10">
                <div
                  onClick={() =>
                    props.onUpdate !== undefined && props.onUpdate(item)
                  }
                  className="bg-white border border-yellow-200 hover:text-yellow-600 rounded-md px-2 py-2 w-max cursor-pointer font-semibold"
                >
                  Update
                </div>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AccessListTable;
