import React from "react";
import { NavbarLinks } from "../../../data/navbar-links";
import { Link, matchPath } from "react-router-dom";
import logo from "../../../assets/Logo/Logo-Full-Light.png";
import { useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();
  const matchroute = (route) => {
    return matchPath({ path: route }, location.pathname);
  };

  return (
    <div className="border-b-[1px] h-10 border-richblack-400 justify-center items-center max-w-full flex">
      <div className=" flex items-center text-center w-[80%]  justify-between  bg-richblack-900 text-white  ">
        {/* logo  */}
        <Link to="/" className=" w-32 ">
          <img src={logo} alt="" />
        </Link>

        {/* nav links  */}
        <nav>
          <ul className=" flex gap-x-6 ">
            {NavbarLinks.map((link, index) => (
              <li key={index}>
                {link.title === "Catalog" ? (
                  <div></div>
                ) : (
                  <p
                    className={`${
                      matchroute(link?.path)
                        ? " text-yellow-25 "
                        : " text-richblack-25 "
                    }`}
                  >
                    <Link to={link?.path}>{link.title}</Link>
                  </p>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className=" flex  gap-x-4  ">
          <div className=" border-[1px] border-richblack-400 px-2 py-1 rounded-md ">
            {" "}
            <Link to="/login">Log in</Link>
          </div>
          <div className=" border-[1px] border-richblack-400 px-2 py-1 rounded-md ">
            {" "}
            <Link to="/signup">Sign up</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
