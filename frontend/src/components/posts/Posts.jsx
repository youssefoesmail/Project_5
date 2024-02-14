import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../redux/post/postSlice";
import axios from "axios";
const Posts = () => {
  const dispatch = useDispatch();
  const { posts } = useSelector((state) => {
    return {
      posts: state.posts.posts
    };
  });
  useEffect(() => {
    axios
      .get("http://localhost:5000/posts")
      .then((result) => {
        console.log(result.data.posts);
        dispatch(setPosts(result.data.posts));
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  console.log(posts);
  return (
    <div>
      {posts.map((elem) => {
        return (
          <>
            <h1>{elem.body}</h1>
          </>
        );
      })}
    </div>
  );
};

export default Posts;
