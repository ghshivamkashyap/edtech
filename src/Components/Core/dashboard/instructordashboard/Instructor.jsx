import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getInstructorData } from "../../../../services/operations/profileAPI";
import { fetchInstructorCourses } from "../../../../services/operations/courseDetailsAPI";
import { Link } from "react-router-dom";
import { setLoading } from "../../../../slices/profileSlice";
import InstructorChart from "./InstructorChart";

const Instructor = () => {
  const [loading, steLoading] = useState(false);
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const [instructorData, setInstructorData] = useState(null);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const getCourseDataWithStats = async () => {
      steLoading(true);
      const instructorApiData = await getInstructorData(token);
      const result = await fetchInstructorCourses(token);
      // console.log("hello ", result);

      if (result) {
        setCourses(result);
      }
      if (instructorApiData) {
        setInstructorData(instructorApiData);
      }
      steLoading(false);
    };
    // console.log("hello user : ", user?.firstName);
    getCourseDataWithStats();
  }, []);

  const totalAmount = instructorData?.reduce(
    (acc, curr) => acc + curr.totalAmountGenerated,
    0
  );
  const totalStudents = instructorData?.reduce(
    (acc, curr) => acc + curr.totalStudentsEnrolled,
    0
  );

  return (
    <div>
      <div>
        {" "}
        <div>
          <div>hi {user?.firstName}</div>
          <p>Let's start something new</p>
        </div>
        <div>
          {loading ? (
            <div>Loading..</div>
          ) : courses.length > 0 ? (
            <div>
              <InstructorChart courses={instructorData} />
              <div>
                <p>Statistics</p>
                <div>
                  <p>Total Courses</p>
                  <p>{courses.length}</p>
                </div>

                <div>
                  <p>Total Students</p>
                  <p>{totalStudents}</p>
                </div>

                <div>
                  <p>Total Income</p>
                  <p>{totalAmount}</p>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <p>You have not created any courses yet</p>
              <Link to={"/dashboard/add-course"}>Create a Course</Link>
            </div>
          )}
        </div>
      </div>
      <div>
        {" "}
        {/* Render 3 courses */}
        <div>
          {" "}
          <p>Your Courses</p>
          <Link to="/dashboard/my-courses">
            <p>View all</p>
          </Link>
        </div>
        <div>
          {courses.slice(0, 3).map((course, key) => (
            <div>
              <img className=" w-[300px] " src={course.thumbnail} alt="img" />
              <div>
                <p>{course.courseName}</p>
                <div>
                  <p>{course.studentsEnrolled.length} students</p>
                  <p> | </p>
                  <p> Rs {course.price}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Instructor;
