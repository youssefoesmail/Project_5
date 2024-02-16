import React from "react";
import { UseDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
const Personal = () => {
  const { auth } = useSelector((state) => {
    return {
      auth: state.auth
    };
  });
  return <div>Personal</div>;
};

export default Personal;
