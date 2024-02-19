import React, { useEffect } from "react";
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
      reels: state.reels.reels,
      auth: state.auth
    };
  });
  const getAllReels = () => {
    axios
      .get(`http://localhost:5000/reels`)
      .then((result) => {
        console.log(result.data.reels);
        dispatch(setReel(result.data.reels));
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const createNewReels = () => {
    const NewReels = {
      video
    };
    axios
      .post(`http://localhost:5000/reels`, NewReels, {
        headers: {
          authorization: `Bearer ${auth.token}`
        }
      })
      .then((result) => {
        console.log(result.data);
        dispatch(createNewReels());
      })
      .catch((err) => {});
  };
  useEffect(() => {
    getAllReels();
  }, []);
  return (
    <div>
      {reels?.map((elem) => {
        return (
          <>
            <img src={elem.video} />
          </>
        );
      })}
    </div>
  );
};

export default Reel;
