import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setReel, createNewReels } from "../redux/reels/reels";
const Reel = () => {
  const dispatch = useDispatch();
  const { reels } = useSelector((state) => {
    return {
      reels: state.reels
    };
  });
  return <div>Reel</div>;
};

export default Reel;
