import React from 'react'
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import axios from "axios";
import { setFollowers, setPosts } from '../redux/personalPage/personal';

const FollowPost = () => {
    const dispatch = useDispatch();
    const { auth, personal, post,followers } = useSelector((state) => {
        return {
          auth: state.auth,
          post: state.post,
          personal: state.personal.personal,
          followers: state.personal.followers
        };
      });
    console.log(auth.userId,auth.token);
    useEffect(()=>{
        axios.get(`http://localhost:5000/followers/userFollowers/${auth.userId}`, {
            headers: {
              authorization: `Bearer ${auth.token}`
            }
          })
        .then((result) => {
            console.log(result.data.result);
            dispatch(setFollowers(result.data))
          })
          .catch((err) => {
            console.log(err);
          });

        console.log(followers);
    axios.get(`http://localhost:5000/posts/search_1/${followers.result.following_user_id}`,
            {
            headers: {
              authorization: `Bearer ${auth.token}`
            }
          })
        .then((result) => {
            console.log(result.data.result);
            //dispatch(setPosts(result))
          })
          .catch((err) => {
            console.log(err);
          });
    }
    
    ,[]);
    
    
  return (
    <div>FollowPost</div>
  )
}

export default FollowPost