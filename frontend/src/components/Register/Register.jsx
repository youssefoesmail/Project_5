import axios from 'axios';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setLogin, setUserId } from '../redux/auth/userSlice';

const Register = () => {

  //================= useNavigate =========================

  const history = useNavigate();

  //===================================================

  //================= useState =========================

  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState(0);
  const [country, setCountry] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(false);

  //===================================================

  //================= Redux ========================

  const dispatch = useDispatch();

  const { isLoggedIn } = useSelector((state) => {
    return {
      isLoggedIn: state.auth.isLoggedIn
    };
  });

  //================= Functions ========================

  //!================ addNewUser ========================
  const addNewUser = async (e) => {
    if (firstname &&
      lastname &&
      age &&
      country &&
      email &&
      password) {
      try {
        const result = await axios.post("http://localhost:5000/users/register", {
          firstname,
          lastname,
          age,
          country,
          email,
          password,
        });
        if (result.data.success) {
          setStatus(true);
          setMessage(result.data.message);
          dispatch(setUserId(result.data.userId));
          dispatch(setLogin(result.data.token));
          history("/Home");
        } else throw Error;
      } catch (error) {
        setStatus(false);
        if (error.response && error.response.data) {
          return setMessage(error.response.data.message);
        }
        setMessage("Error happened while register, please try again");
      }
    }
    else {
      setMessage("Please fill the fields.")
    }
  };


  return (
    <div>
      {!isLoggedIn ? (
        <>
          <p className="Title">Register:</p>
          <br />
          <input
            type="text"
            placeholder="First Name"
            onChange={(e) => setFirstName(e.target.value)}
          />
          <br />
          <input
            type="text"
            placeholder="Last Name"
            onChange={(e) => setLastName(e.target.value)}
          />
          <br />
          <input
            type="number"
            placeholder="Age"
            onChange={(e) => setAge(e.target.value)}
          />
          <br />
          <input
            type="text"
            placeholder="Country"
            onChange={(e) => setCountry(e.target.value)}
          />
          <br />
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <br />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <button
            onClick={(e) => {
              addNewUser()
            }}
          >Register</button>
          <button
            onClick={(e) => {
              history("/");
            }}
          >I have account</button>
          <br />
          {status
            ? message && <div className="SuccessMessage">{message}</div>
            : message && <div className="ErrorMessage">{message}</div>}
        </>
      ) : (
        <p>Logout First</p>
      )}
    </div>
  )
}

export default Register