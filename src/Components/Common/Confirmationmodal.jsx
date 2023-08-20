import React from "react";
import Iconbtn from "./Iconbtn";

function Confirmationmodal(modalData) {
  return (
    <div className="  text-richblack-25 ">
      <div>
        <p>{modalData.text1}</p>
        <p>{modalData.text2}</p>
        <div className=" flex ">
          <Iconbtn
            onClick={modalData?.btn1Handler}
            text={modalData?.btn1Text}
          />

          <button onClick={modalData?.btn2Handler}>
            {modalData?.btn2Text}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Confirmationmodal;
