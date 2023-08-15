import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import OTPInput from "react-otp-input";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { GiBackwardTime } from "react-icons/gi";
import { sendOtp, signUp } from "../services/operations/authAPI";

function Varifyemail() {
  const { loading, signupData } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const containerStyle = "flex justify-between w-48 mx-auto";

  useEffect(() => {
    if (!signupData) {
      navigate("/signup");
    }
  }, []);

  const handleOnSubmit = (e) => {
    e.preventDefault();
    const {
      accountType,
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
    } = signupData;

    dispatch(
      signUp(
        accountType,
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        otp,
        navigate
      )
    );
  };

  return (
    <div>
      <div className="justify-center max-w-[430px] mx-auto flex gap-y-4 items-center h-[93.9vh] flex-col text-richblack-5">
        {loading ? (
          <div>Loading ...</div>
        ) : (
          <div>
            <div className="my-2 text-2xl">Verify email</div>
            <div className="my-2 text-md text-richblack-400">
              A verification code has been sent to you. Enter the code below
            </div>

            <form action="" className=" text-richblack-5 " onSubmit={handleOnSubmit}>
              <OTPInput
                value={otp}
                onChange={setOtp}
                numInputs={6}
                renderSeparator={<span>-</span>}
                placeholder={"-"}
                // inputStyle="border border-gray-300 rounded-md px-3 py-2 mr-2 text-center"
                containerStyle="flex items-center justify-center" // Tailwind CSS classes directly applied
                renderInput={(props) => (
                  <input
                    {...props}
                    className=" bg-richblack-800 text-richblack-5 gap-x-4 p-5 "
                  />
                )}
              />

              <button type="submit" className="text-sm">
                Varify Email
              </button>
            </form>

            <div className=" flex ">
              <Link className="flex just items-center gap-x-2" to="/login">
                <AiOutlineArrowLeft />
                <div className="text-sm">Back to login</div>
              </Link>

              <button
                onClick={() => dispatch(sendOtp(signupData.email, navigate))}
                className=" flex items-center justify-center "
              >
                <GiBackwardTime className="   text-xl " />
                Resend it
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Varifyemail;
