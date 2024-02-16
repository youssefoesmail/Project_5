import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import axios from "axios";
const Personal = () => {
  const [user, setUser] = useState(null);
  const dispatch = useDispatch();
  const { auth } = useSelector((state) => {
    return {
      auth: state.auth
    };
  });
  const personalPage = () => {
    axios
      .get(`http://localhost:5000/users/${auth.userId}`)
      .then((result) => {
        setUser(result.data.result[0]);
        console.log(result.data.result[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    personalPage();
  }, []);
  return <div>{user.firstname} {user.lastname}</div>;
};

export default Personal;
