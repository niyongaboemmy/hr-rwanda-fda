import React from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const LoaderComponent = () => {
  return (
    <div className="flex flex-col items-center gap-2 justify-center w-full border rounded-md py-6 text-center bg-gray-100 px-4 mt-3">
      <div>
        <AiOutlineLoading3Quarters className="text-5xl text-yellow-500 animate-spin" />
      </div>
      <div className="text-lg font-light">Loading, please wait...</div>
    </div>
  );
};

export default LoaderComponent;
