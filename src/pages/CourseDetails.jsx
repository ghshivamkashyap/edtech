import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { buyCourse } from "../services/operations/studentFeatures";

function CourseDetails() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const { courseId } = useParams();

  const handleBuyCourse = () => {
    if (token) {
      // console.log("courses------" ,[courseId],"user------", user,"navigate------", navigate, dispatch);
      buyCourse(token, [courseId], user, navigate, dispatch);
      return;
    }
  };
  return (
    <div className=" overflow-x-hidden text-richblack-25 w-[100vw] mx-auto flex flex-col justify-between  h-[100vh] ">
      <button
        className=" bg-yellow-100 text-richblack-900 p-4 w-fit "
        onClick={() => handleBuyCourse()}
      >
        buy now
      </button>
    </div>
  );
}

export default CourseDetails;
