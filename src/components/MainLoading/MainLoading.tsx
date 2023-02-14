import React from "react";
import FDA_ICON from "../../assets/logo.jpeg";

const MainLoading = () => {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center gap-5 rounded-xl bg-white p-5">
      <div>
        <img
          className="h-36 w-auto mb-3 animate-pulse"
          src={FDA_ICON}
          alt="Valuation Management System"
        />
      </div>
      <div className="text-2xl font-extrabold text-gray-400 animate-pulse">
        Loading, please wait...
      </div>
    </div>
  );
};

export default MainLoading;
