import React from "react";
import Iconbtn from "./Iconbtn";

function Confirmationmodal({ modalData }) {
  return (
    <div className=" flex  absolute  mt-[13%] border   border-richblack-200 items-center  ml-[40%] bg-richblack-700 rounded-md p-4  h-[100wh] justify-center text-richblack-25 ">
      <div>
        <p className=" text-richblack-25 text-xl font-semibold ">
          {modalData.text1}
        </p>
        <p className=" text-richblack-300 ">{modalData.text2}</p>
        <div className=" flex mt-2 ">
          <Iconbtn
            onClick={modalData?.btn1Handler}
            text={modalData?.btn1Text}
          />

          <button
            className=" py-3 mr-4 mt-2 px-5 hover:scale-95 transition-all rounded-md border-r-2  border-b-2  bg-richblack-500  font-normal   text-richblack-5  border-richblack-300 "
            onClick={modalData?.btn2Handler}
          >
            {modalData?.btn2Text}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Confirmationmodal;
