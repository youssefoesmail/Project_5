import React from "react";
import { useDispatch, useSelector } from "react-redux";

const Reel = () => {
  const dispatch = useDispatch();
  const { reel } = useSelector((state) => {
    return {
      reel: state.reel
    };
  });
  return <div>Reel</div>;
};

export default Reel;
