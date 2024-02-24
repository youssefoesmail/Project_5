import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { setMessage, createNewMessage } from "../redux/message/message";
const Message = () => {
  const [to, setTo] = useState("");
  const dispatch = useDispatch();
  const { auth, message } = useSelector((state) => {
    return {
      message: state.message,

      auth: state.auth
    };
  });

  useEffect(() => {
    const socket = io("http://localhost:8080/", {
      extraHeaders: {
        user_id: auth.userId
      }
    });
    socket.on("message", (data) => {
      dispatch(setMessage([...message, data]));
    });
    return () => {
      socket.off("message", receiveMessage);
    };
  }, [message]);
  const receiveMessage = (data) => {
    console.log(data);
    dispatch(setMessage([...message, data]));
  };
  const sendMessage = () => {
    const socket = io("http://localhost:8080/", {
      extraHeaders: {
        user_id: auth.userId
      }
    });
    console.log(message);
    socket.emit("message", { to, from: auth.userId, message });
  };
  return (
    <div>
      {" "}
      Message
      <input
        placeholder="message"
        onChange={(e) => {
          dispatch(createNewMessage(e.target.value));
        }}
      />
      <input
        onChange={(e) => {
          setTo(e.target.value);
        }}
      />
      <button
        onClick={() => {
          sendMessage();
        }}
      >
        create
      </button>
      {message.length > 0 &&
        message.map((message) => {
          return (
            <>
              <br />{" "}
              <small>
                from: {message.from}
                {message.message}
              </small>
            </>
          );
        })}
    </div>
  );
};

export default Message;
