import axios, { formToJSON } from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUserId, setLogin } from "../redux/auth/userSlice";
import { GoogleLogin } from '@react-oauth/google';


const Login = () => {
    //================= useNavigate =========================

    const history = useNavigate();

    //===================================================

    //================= useState =========================

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState(false);

    //===================================================

    //================= Redux ========================

    const dispatch = useDispatch();

    const { isLoggedIn,token } = useSelector((state) => {
        return {
            token:state.auth.token,
            isLoggedIn: state.auth.isLoggedIn
        };
    });

    //================= Functions ========================

    //!=========== login ===============
    const login = async (e) => {
        try {
            const result = await axios.post("http://localhost:5000/users/login", {
                email,
                password
            });
            if (result.data) {
                setMessage("");
                console.log(result.data, isLoggedIn);
                dispatch(setUserId(result.data.userId));
                dispatch(setLogin(result.data.token));
            } else throw Error;
        } catch (error) {
            console.log("--------------", email, "---------", password);
            if (error.response && error.response.data) {
                return setMessage(error.response.data.message);
            }
            setMessage("Error happened while Login, please try again");
        }
    };

    useEffect(() => {
        if (isLoggedIn) {
            console.log(isLoggedIn);
            history("/Home");
        }
    });

    //===================================================

    return (
        <div>
            <div>
                <p>Login: </p>

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
                        login(e);
                    }}
                >
                    Login
                </button>
                
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              console.log(credentialResponse);
                dispatch(setLogin(credentialResponse.credential))
              /* setToken(credentialResponse.credential); */
              localStorage.setItem("token", credentialResponse.credential);
              navigate("/");
            }}
            onError={() => {
              setError("Google login failed");
            }}
          />
        
               <button
                    onClick={(e) => {
                        history("/register");
                    }}
                >
                    I dont have account
                </button>

                {status
                    ? message && <div className="SuccessMessage">{message}</div>
                    : message && <div className="ErrorMessage">{message}</div>}
            </div>
        </div>
    );
};

export default Login;