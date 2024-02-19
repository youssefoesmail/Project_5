import React from 'react'
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import axios from "axios";
import { setFollowers } from '../redux/personalPage/personal';

const FollowPost = () => {
    const dispatch = useDispatch();
    const { auth, personal, post } = useSelector((state) => {
        return {
          auth: state.auth,
          post: state.post,
          personal: state.personal.personal
        };
      });
    console.log(auth.userId);
    useEffect(()=>{
        axios.get(`http://localhost:5000/followers/userFollowers/1`,{headers: {
            authorization: `Bearer ${auth.token}`
          }})
        .then((result) => {
            console.log(result);
            dispatch(setFollowers(result.data))
          })
          .catch((err) => {
            console.log(err);
          });
    },[])
  return (
    <div>FollowPost</div>
  )
}

export default FollowPost