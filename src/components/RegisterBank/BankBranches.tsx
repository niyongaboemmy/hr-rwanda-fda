import React, { useState } from "react";
import { DistrictLocationItem, LocationAPI } from "../../actions";
import Alert, { AlertType } from "../Alert/Alert";
import { RegisterBankBranchInterface } from "./RegisterBank";

interface BankBranchesProps {
  branches: RegisterBankBranchInterface[];
  showRegisterBranchForm: boolean;
  setShowRegisterBranchForm: (status: boolean) => void;
  addBranch: (branch: RegisterBankBranchInterface) => void;
  districts: LocationAPI;
  removeBranch: (branch: RegisterBankBranchInterface) => void;
  loading: boolean;
}

const BankBranches = (props: BankBranchesProps) => {
  const [selectedDistrict, setSelectedDistrict] =
    useState<DistrictLocationItem | null>(null);
  const [branch_name, setBranchName] = useState<string>("");
  const [error, setError] = useState<string>("");

  const AddBranch = () => {
    if (selectedDistrict === null) {
      return setError("Please select district!");
    }
    if (branch_name === "") {
      return setError("Please fill branch name!");
    }
    setError("");
    props.addBranch({
      branch_name: branch_name,
      district_code: selectedDistrict.district_code,
      district_name: selectedDistrict.district_name,
    });
    setBranchName("");
  };

  return (
    <div className="animate__animated animate__fadeInRight animate__faster">
      {props.showRegisterBranchForm === true && (
        <div className="flex flex-row justify-between gap-2 w-full">
          <div className="flex flex-col w-full">
            {/* <span>Branch name</span> */}
            <select
              value={
                selectedDistrict === null ? "" : selectedDistrict.district_code
              }
              onChange={(e) => {
                setError("");
                if (e.target.value === "") {
                  setSelectedDistrict(null);
                } else {
                  const selected = props.districts.districts.find(
                    (itm) => itm.district_code === e.target.value
                  );
                  if (selected !== undefined) {
                    setSelectedDistrict(selected);
                  } else {
                    setSelectedDistrict(null);
                  }
                }
              }}
              disabled={props.loading}
              className="w-full border border-gray-500 rounded px-3 py-2"
            >
              <option value="">Choose district</option>
              {props.districts.districts.map((district, i) => (
                <option key={i + 1} value={district.district_code}>
                  {district.district_name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col w-full">
            {/* <span>Branch name</span> */}
            <input
              type="text"
              disabled={props.loading}
              placeholder="Branch name"
              value={branch_name}
              onChange={(e) => {
                setBranchName(e.target.value);
                setError("");
              }}
              className="w-full border border-gray-500 rounded px-3 py-2 text-sm"
            />
          </div>
          <div>
            {props.loading === false && (
              <div
                onClick={() => AddBranch()}
                className="cursor-pointer truncate bg-primary-50 text-primary-900 px-3 py-2 rounded hover:bg-primary-100 text-sm font-bold"
              >
                Add branch
              </div>
            )}
          </div>
        </div>
      )}
      {error !== "" && (
        <div className="mt-2">
          <Alert
            alertType={AlertType.DANGER}
            title={"Error Occurred!"}
            description={error}
            close={() => setError("")}
          />
        </div>
      )}
      {props.branches.length === 0 ? (
        <div className="rounded-md px-5 py-3 mt-2 text-lg bg-gray-200 w-full font-light">
          No branches added!
        </div>
      ) : (
        <table className="w-full text-left mt-2">
          <thead className="bg-primary-50 text-primary-900 text-sm font-light">
            <tr>
              <th className="px-2 py-1">#</th>
              <th className="px-2 py-1">District name</th>
              <th className="px-2 py-1">Branch name</th>
              <th className="px-2 py-1"></th>
            </tr>
          </thead>
          <tbody>
            {props.branches.map((item, i) => (
              <tr
                className={`${
                  i % 2 !== 0 ? "bg-gray-100" : ""
                } font-light text-sm animate__animated animate__fadeIn`}
              >
                <td className="px-2 py-1">{i + 1}</td>
                <td className="px-2 py-1">{item.district_name}</td>
                <td className="px-2 py-1">{item.branch_name}</td>
                <td className="px-2 py-1 float-right">
                  {props.loading === false && (
                    <div
                      onClick={() => {
                        // if (
                        //   window.confirm(
                        //     `Are you sure do you want to remove ${item.branch_name} branch?`
                        //   ) === true
                        // ) {
                        props.removeBranch(item);
                        // }
                      }}
                      className="cursor-pointer border border-red-600 font-normal rounded text-sm px-2 py-1"
                    >
                      Remove
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BankBranches;
