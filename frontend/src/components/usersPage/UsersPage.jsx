import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const UsersPage = () => {
  const {} = useParams();
  useEffect(()=>{
    axios.get(``)
  },[])
  return <div>UsersPage</div>;
};

export default UsersPage;
