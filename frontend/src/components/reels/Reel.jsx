import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setReel,
  createNewReels,
  setCommentReels,
  createCommentReels
} from "../redux/reels/reels";
import axios from "axios";
const Reel = () => {
  const dispatch = useDispatch();
  const { reels, auth } = useSelector((state) => {
    return {
      reels: state.reels,
      auth: state.auth
    };
  });

  const createNewReels = () => {
    const NewReels = {
      video
    };
    axios.post(`http://localhost:5000/reels`, NewReels, {
      headers: {
        authorization: `Bearer ${auth.token}`
      }
    }).then((result)=>{

    }).catch((err)=>{
        
    })
  };
  return <div>Reel</div>;
};

export default Reel;
