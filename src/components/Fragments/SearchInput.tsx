import React from "react";
import { RiSearchLine } from "react-icons/ri";

const SearchInput = (props: {
  searchData: string;
  onChange: (value: string) => void;
}) => {
  return (
    <div className="relative w-full">
      <input
        type="search"
        className="bg-gray-100 rounded-md px-3 py-2 w-full pl-10 text-base"
        placeholder="Search position"
        value={props.searchData}
        onChange={(e) => props.onChange(e.target.value)}
      />
      <RiSearchLine
        className="absolute top-3 left-3 text-xl"
        style={{ marginTop: "-1.5px" }}
      />
    </div>
  );
};

export default SearchInput;
