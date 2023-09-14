import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getUserEnrolledCourses } from "../../../services/operations/profileAPI";
import ProgressBar from "@ramonak/react-progress-bar";

function EnrolledCourses() {
  const { token } = useSelector((state) => state.auth);
  const [enrolledCourses, setEnrolledCourses] = useState(null);

  const getEnrolledCourses = async () => {
    try {
      const response = await getUserEnrolledCourses(token);
      setEnrolledCourses(response);
    } catch (error) {
      console.log("unable to fetch enrolled courses" + error);
    }
  };

  useEffect(() => {
    getEnrolledCourses();
  }, []);

  return (
    <div className="gap-y-8 w-[80vw] mx-auto flex items-center flex-col">
      <div className="text-3xl flex w-[650px] font-semibold text-richblack-25">
        Enrolled Courses
      </div>

      <div className="flex p-6 w-[650px] items-start justify-between rounded-md bg-richblack-700">
        {!enrolledCourses ? (
          <div>Loading...</div>
        ) : enrolledCourses.length === 0 ? ( // Changed from enrolledCourses.length() to enrolledCourses.length === 0
          <div>You have not enrolled in any course.</div>
        ) : (
          enrolledCourses.map(
            (
              acourse,
              index // Added parentheses around the map function
            ) => <img key={index} src={acourse?.thumbnail} alt="" />
          )
        )}
      </div>
    </div>
  );
}

export default EnrolledCourses;
