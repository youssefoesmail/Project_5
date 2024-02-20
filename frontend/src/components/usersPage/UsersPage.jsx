import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setPost, setUsers } from "../redux/users/usersSlice";

const UsersPage = () => {
  const { users, postUser } = useSelector((state) => {
    return {
      users: state.users.users,
      postUser: state.postUser
    };
  });
  const dispatch = useDispatch();
  const { id } = useParams();
  useEffect(() => {
    axios
      .get(`http://localhost:5000/posts/authorPosts/${id}`)
      .then((result) => {
        console.log(result.data.result);
        dispatch(setPost(result.data.result));
      })
      .catch((err) => {});
    axios
      .get(`http://localhost:5000/users/${id}`)
      .then((result) => {
        console.log(result.data.result[0]);
        dispatch(setUsers(result.data.result[0]));
      })
      .catch((err) => {});
  }, []);
  return <div>UsersPage</div>;
};

export default UsersPage;
