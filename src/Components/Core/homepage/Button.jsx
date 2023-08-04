import React from "react";
import { Link } from "react-router-dom";

function Button({ children, active, linkto }) {
  return (
    <Link to={linkto}>
      <button
        className={`py-3 mr-4 mt-2 px-5 hover:scale-95 transition-all rounded-md border-r-2  border-b-2  bg-richblack-700  font-normal ${
          active
            ? " bg-yellow-50 text-richblack-700 font-semibold border-richblack-5  "
            : " bg-richblack-700  border-richblack-300  "
        }`}
      >
        {children}
      </button>
    </Link>
  );
}

export default Button;
