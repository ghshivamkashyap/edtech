import React from "react";
import { useSelector } from "react-redux";
import Iconbtn from "../../../Common/Iconbtn";

function Rendertotalammount() {
  const { total, cart } = useSelector((state) => state.cart);
  const handlebuycourse = () => {
    // paymrnt par lekr jane ka logic
    const courses = cart.map((course) => course._id);
    console.log("Bought these couses : ", courses);
  };
  return (
    <div>
      <p>total: </p>
      <div>RS: {total}</div>
      <Iconbtn onClick={handlebuycourse} text={"Buy Now"} />
    </div>
  );
}

export default Rendertotalammount;
