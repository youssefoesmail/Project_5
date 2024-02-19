import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import axios from "axios";
import { setPosts, setUserInfo } from "../redux/personalPage/personal";
import Posts from "../posts/Posts";
const Personal = () => {
  const [user, setUser] = useState(null);
  const dispatch = useDispatch();
  const { auth, personal, post } = useSelector((state) => {
    return {
      auth: state.auth,
      post: state.personal.post,
      personal: state.personal.personal
    };
  });
  const personalPage = () => {
    axios
      .get(`http://localhost:5000/users/${auth.userId}`)
      .then((result) => {
        dispatch(setUserInfo(result.data.result[0]));
        console.log(result.data.result[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getPostByAuthor = () => {
    axios
      .get(`http://localhost:5000/posts/authorPosts/${auth.userId}`)
      .then((result) => {
        dispatch(setPosts(result.data.result));
        console.log(result.data.result);
      })
      .catch((err) => {
        log;
      });
  };
  useEffect(() => {
    getPostByAuthor();
    personalPage();
    console.log(post);
  }, []);
  return (
    <div>
      <h1>{personal?.firstname}</h1>{" "}
      <h1>
        {personal?.lastname}
        <p>{personal.country}</p>
      </h1>
      {post.map((elem) => {
        return (
          <>
            <p>{elem.body}</p>
          </>
        );
      })}
    </div>
  );
};

export default Personal;
