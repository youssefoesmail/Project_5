import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

const UsersPage = () => {
  // const { userId } = useSelector((state) => {
  //   return {
  //     userId: state.post.post.user_id
  //   };
  // });
  const { id } = useParams();
  useEffect(() => {
    axios
      .get(`http://localhost:5000/posts/authorPosts/${id}`)
      .then((result) => {
        console.log(result.data.result);
      })
      .catch((err) => {});
  }, []);
  return <div>UsersPage</div>;
};

export default UsersPage;
