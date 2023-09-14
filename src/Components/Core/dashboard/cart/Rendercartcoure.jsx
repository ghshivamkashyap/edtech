import React from "react";
import { useSelector } from "react-redux";

function Rendercartcoure() {
  const { cart } = useSelector((state) => state.cart);
 
  return (
    <div>
      {cart.map((course, key) => (
        <div>
          {/* image  */}
          <img src={course.thumbnail} alt="" />
          {/* data  */}
          <div></div>
          {/* price and remove btn  */}
          <div></div>
        </div>
      ))}
    </div>
  );
}

export default Rendercartcoure;
