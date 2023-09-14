import React from "react";
import { useSelector } from "react-redux";
import Rendercartcoure from "./Rendercartcoure";
import Rendertotalammount from "./Rendertotalammount";

function Cart() {
  const { total, totalItems } = useSelector((state) => state.auth);
  return (
    <div>
      <div>{totalItems} in your cart</div>
      {total > 0 ? (
        <div className=" flex ">
          <Rendercartcoure />
          <Rendertotalammount />
        </div>
      ) : (
        <div>Your cart is empty</div>
      )}
    </div>
  );
}

export default Cart;
