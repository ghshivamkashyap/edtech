import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Iconbtn from "../../Common/Iconbtn";

function Myprofile() {
  const { user } = useSelector((state) => state.profile);
  const navigate = useNavigate();
  return (
    <div>
      <div>My Profile</div>

      {/* box 1 */}
      <div className=" flex ">
        <img
          src={user?.img}
          alt={`profile-${user.firstName}`}
          className=" aspect-square rounded-full w-[78px] object-cover "
        />
        <div className=" flex flex-col ">
          <div>{user?.firstName + " " + user?.lastName}</div>
          <div>{user?.email}</div>
        </div>
        <Iconbtn
          text={"Edit"}
          onClick={() => navigate("/dashboard/settings")}
        />
      </div>
    </div>
  );
}

export default Myprofile;
