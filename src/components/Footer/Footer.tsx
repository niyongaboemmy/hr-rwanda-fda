import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="bg-primary-800 pt-5 text-white">
      <div className="text-center font-light px-6 pb-2">
        HR Management system
      </div>
      <div className="bg-primary-900 flex flex-row items-center justify-between gap-3 w-full px-6 pb-6 pt-2">
        <span>Rwanda FDA @ copyright {new Date().getFullYear()}</span>
        <Link
          to="/"
          className="hover:underline text-gray-300 font-bold text-sm"
        >
          Binary Hub Developers
        </Link>
      </div>
    </div>
  );
};

export default Footer;
