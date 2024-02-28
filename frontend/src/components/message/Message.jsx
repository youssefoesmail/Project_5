import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { setMessage, createMessage } from "../redux/message/message";
import axios from "axios";
import { setFollowers } from "../redux/followers/followers";
import "./index.css";
import { setUserInfo } from "../redux/personalPage/personal";

const Message = () => {
  const [to, setTo] = useState("");
  const [messageText, setMessageText] = useState("");
  const dispatch = useDispatch();
  const { auth, messages, followers, personal } = useSelector((state) => {
    return {
      messages: state.message.message,
      followers: state.followers,
      auth: state.auth,
      personal: state.personal.personal
    };
  });

  const handleFollowersId = (id) => {
    setTo(id);
  };

  const getFollowers = () => {
    axios
      .get(`http://localhost:5000/followers`, {
        headers: {
          authorization: `Bearer ${auth.token}`
        }
      })
      .then((result) => {
        dispatch(setFollowers(result.data.result));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getAllMessage = (id) => {
    axios
      .get(`http://localhost:5000/messages/${id}`, {
        headers: {
          authorization: `Bearer ${auth.token}`
        }
      })
      .then((result) => {
        console.log(result.data.result);
        dispatch(setMessage(result.data.result));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const personalPage = () => {
    axios
      .get(`http://localhost:5000/users/${auth.userId}`)
      .then((result) => {
        dispatch(setUserInfo(result.data.result[0]));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    const socket = io("http://localhost:8080/", {
      extraHeaders: {
        user_id: auth.userId,
        token: auth.token
      }
    });
    personalPage();
    getFollowers();
    getAllMessage();
    socket.on("message", (data) => {
      dispatch(setMessage([...messages, data]));
      console.log(data);
    });

    return () => {
      socket.off("message", receiveMessage);
    };
  }, [auth.userId, auth.token, dispatch]);
  const receiveMessage = (data) => {
    console.log(data);
    dispatch(setMessage((prev) => [...prev, data]));
  };
  const createNewMessage = () => {
    const newMessage = {
      receiver_id: to,
      sender_id: auth.userId,
      messages: messageText
    };

    axios
      .post(`http://localhost:5000/messages/${to}`, newMessage, {
        headers: {
          authorization: `Bearer ${auth.token}`
        }
      })
      .then((result) => {
        dispatch(createMessage(result.data.result));
        dispatch(setMessage([...messages, result.data.result[0]]));
        console.log("Message stored in the database:", result.data.result);
      })
      .catch((err) => {
        console.error("Error storing message:", err);
      });
  };

  const sendMessage = () => {
    const socket = io("http://localhost:8080/", {
      extraHeaders: {
        user_id: auth.userId,
        token: auth.token
      }
    });

    socket.emit("message", {
      receiver_id: to,
      sender_id: auth.userId,
      messages: messageText
    });
  };

  //   {message.length > 0 &&
  //     message.map((message) => {
  //       return (
  //         <>
  //           <br />{" "}
  //           <small>
  //             from: {message.from}
  //             {message.message}
  //           </small>
  //         </>
  //       );
  //     })}
  //   {followers.followers.map((elem) => {
  //     return (
  //       <>
  //         <div>
  //           <br />
  //           <button
  //             onClick={() => {
  //               console.log(elem.followed_user_id);
  //               setTo(elem.followed_user_id);
  //             }}
  //           >
  //             {elem.firstname}
  //           </button>
  //         </div>{" "}
  //       </>
  //     );
  //   })}
  //   <span class="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600">
  //                     Can be verified on any platform using docker
  //                   </span>
  //                 </div>
  //               </div>
  //               <img
  //                 src="https://images.unsplash.com/photo-1549078642-b2ba4bda0cdb?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144"
  //                 alt="My profile"
  //                 class="w-6 h-6 rounded-full order-1"
  //               />
  //             </div>
  //           </div>
  //           <div class="chat-message">
  //             <div class="flex items-end justify-end">
  //               <div class="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-1 items-end">
  //                 <div>
  //                   <span class="px-4 py-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white ">
  //                     Your error message says permission denied, npm global
  //                     installs must be given root privileges.
  //                   </span>
  //                 </div>
  //               </div>
  //               <img
  //                 src="https://images.unsplash.com/photo-1590031905470-a1a1feacbb0b?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144"
  //                 alt="My profile"
  //                 class="w-6 h-6 rounded-full order-2"
  //               />
  //             </div>
  //           </div>
  //           <div class="chat-message">
  //             <div class="flex items-end">
  //               <div class="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">
  //                 <div>
  //                   <span class="px-4 py-2 rounded-lg inline-block bg-gray-300 text-gray-600">
  //                     Command was run with root privileges. I'm sure about that.
  //                   </span>
  //                 </div>
  //                 <div>
  //                   <span class="px-4 py-2 rounded-lg inline-block bg-gray-300 text-gray-600">
  //                     I've update the description so it's more obviously now
  //                   </span>
  //                 </div>
  //                 <div>
  //                   <span class="px-4 py-2 rounded-lg inline-block bg-gray-300 text-gray-600">
  //                     FYI https://askubuntu.com/a/700266/510172
  //                   </span>
  //                 </div>
  //                 <div>
  //                   <span class="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600">
  //                     Check the line above (it ends with a # so, I'm running it as
  //                     root )<pre># npm install -g @vue/devtools</pre>
  //                   </span>
  //                 </div>
  //               </div>
  //               <img
  //                 src="https://images.unsplash.com/photo-1549078642-b2ba4bda0cdb?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144"
  //                 alt="My profile"
  //                 class="w-6 h-6 rounded-full order-1"
  //               />
  //             </div>
  //           </div>
  //           <div class="chat-message">
  //             <div class="flex items-end justify-end">
  //               <div class="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-1 items-end">
  //                 <div>
  //                   <span class="px-4 py-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white ">
  //                     Any updates on this issue? I'm getting the same error when
  //                     trying to install devtools. Thanks
  //                   </span>
  //                 </div>
  //               </div>
  //               <img
  //                 src="https://images.unsplash.com/photo-1590031905470-a1a1feacbb0b?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144"
  //                 alt="My profile"
  //                 class="w-6 h-6 rounded-full order-2"
  //               />
  //             </div>
  //           </div>
  //           <div class="chat-message">
  //             <div class="flex items-end">
  //               <div class="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">
  //                 <div>
  //                   <span class="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600">
  //                     Thanks for your message David. I thought I'm alone with this
  //                     issue. Please, ? the issue to support it :)
  //                   </span>
  //                 </div>
  //               </div>
  //               <img
  //                 src="https://images.unsplash.com/photo-1549078642-b2ba4bda0cdb?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144"
  //                 alt="My profile"
  //                 class="w-6 h-6 rounded-full order-1"
  //               />
  //             </div>
  //           </div>
  //           <div class="chat-message">
  //             <div class="flex items-end justify-end">
  //               <div class="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-1 items-end">
  //                 <div>
  //                   <span class="px-4 py-2 rounded-lg inline-block bg-blue-600 text-white ">
  //                     Are you using sudo?
  //                   </span>
  //                 </div>
  //                 <div>
  //                   <span class="px-4 py-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white ">
  //                     Run this command sudo chown -R `whoami` /Users//.npm-global/
  //                     then install the package globally without using sudo
  //                   </span>
  //                 </div>
  //               </div>
  //               <img
  //                 src="https://images.unsplash.com/photo-1590031905470-a1a1feacbb0b?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144"
  //                 alt="My profile"
  //                 class="w-6 h-6 rounded-full order-2"
  //               />
  //             </div>
  //           </div>
  //           <div class="chat-message">
  //             <div class="flex items-end">
  //               <div class="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">
  //                 <div>
  //                   <span class="px-4 py-2 rounded-lg inline-block bg-gray-300 text-gray-600">
  //                     It seems like you are from Mac OS world. There is no /Users/
  //                     folder on linux ?
  //                   </span>
  //                 </div>
  //                 <div>
  //                   <span class="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600">
  //                     I have no issue with any other packages installed with root
  //                     permission globally.
  //                   </span>
  //                 </div>
  //               </div>
  //               <img
  //                 src="https://images.unsplash.com/photo-1549078642-b2ba4bda0cdb?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144"
  //                 alt="My profile"
  //                 class="w-6 h-6 rounded-full order-1"
  //               />
  //             </div>
  //           </div>
  //           <div class="chat-message">
  //             <div class="flex items-end justify-end">
  //               <div class="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-1 items-end">
  //                 <div>
  //                   <span class="px-4 py-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white ">
  //                     yes, I have a mac. I never had issues with root permission
  //                     as well, but this helped me to solve the problem
  //                   </span>
  //                 </div>
  //               </div>
  //               <img
  //                 src="https://images.unsplash.com/photo-1590031905470-a1a1feacbb0b?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144"
  //                 alt="My profile"
  //                 class="w-6 h-6 rounded-full order-2"
  //               />
  //             </div>
  //           </div>
  //           <div class="chat-message">
  //             <div class="flex items-end">
  //               <div class="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">
  //                 <div>
  //                   <span class="px-4 py-2 rounded-lg inline-block bg-gray-300 text-gray-600">
  //                     I get the same error on Arch Linux (also with sudo)
  //                   </span>
  //                 </div>
  //                 <div>
  //                   <span class="px-4 py-2 rounded-lg inline-block bg-gray-300 text-gray-600">
  //                     I also have this issue, Here is what I was doing until now:
  //                     #1076
  //                   </span>
  //                 </div>
  //                 <div>
  //                   <span class="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600">
  //                     even i am facing
  //                   </span>
  return (
    <>
      <div></div>
      <div class="flex-1 p:2 sm:p-6 justify-between flex flex-col h-screen">
        <div class="flex sm:items-center justify-between py-3 border-b-2 border-gray-200">
          <div class="relative flex items-center space-x-4">
            <div class="relative">
              {personal.photo ? (
                <img
                  src={personal.photo}
                  alt=""
                  class="w-10 sm:w-16 h-10 sm:h-16 rounded-full"
                />
              ) : (
                <img
                  src="https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671122.jpg?w=826&t=st=1708943431~exp=1708944031~hmac=8c7a5395dac4611b0f9b5e202be4b31eb2302075e072940832d61722b1d0fc49"
                  alt=""
                  class="w-10 sm:w-16 h-10 sm:h-16 rounded-full"
                />
              )}
            </div>
            <div class="flex flex-col leading-tight">
              <div class="text-2xl mt-1 flex items-center">
                <span class="text-gray-700 mr-3">
                  {personal.firstname} {personal.lastname}
                </span>
              </div>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            {followers.followers.map((elem) => {
              return (
                <>
                  <button
                    type="button"
                    class="inline-flex items-center justify-center rounded-lg border h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none"
                  >
                    {elem.photo ? (
                      <>
                        <img
                          src={elem.photo}
                          alt={elem.firstname}
                          onClick={() => {
                            handleFollowersId(elem.followed_user_id);
                            getAllMessage(elem.followed_user_id);
                          }}
                        />
                      </>
                    ) : (
                      <img
                        onClick={() => {
                          handleFollowersId(elem.followed_user_id);
                          getAllMessage(elem.followed_user_id);
                        }}
                        src="https://img.freepik.com/free-vector/saudi-arab-man-wearing-thobe-with-confused-thinking-facial-expression-hand-drawn-sketch-vector-illustration_460848-9982.jpg?w=740&t=st=1708875035~exp=1708875635~hmac=2f42ea874951d7f3e2cc6f20577b0a472979bdc15aa20446beacc9e53084b26c"
                      />
                    )}
                  </button>
                  {elem.firstname}
                  {elem.followed_user_id}
                </>
              );
            })}
          </div>
        </div>
        {messages?.map((elem, i) => (
          <div key={i} className="chat-message">
            <div className="flex items-end">
              <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">
                <div></div>
              </div>
              <div>
                <div
                  className={
                    (elem.sender_id === auth.userId &&
                      elem.receiver_id === to) ||
                    (elem.sender_id === to && elem.receiver_id === auth.userId)
                      ? "order-2 sender-message"
                      : "order-1 receiver-message"
                  }
                >
                  <span
                    className={`px-4 py-2 rounded-lg inline-block ${
                      (elem.sender_id === auth.userId &&
                        elem.receiver_id === to) ||
                      (elem.sender_id === to &&
                        elem.receiver_id === auth.userId)
                        ? "bg-green-400 text-white"
                        : "bg-blue-400 text-black"
                    }`}
                  >
                    {messages && elem.messages}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div class="border-t-2 border-gray-200 px-4 pt-4 mb-2 sm:mb-0">
          <div class="relative flex">
            <span class="absolute inset-y-0 flex items-center">
              <button
                type="button"
                class="inline-flex items-center justify-center rounded-full h-12 w-12 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  class="h-6 w-6 text-gray-600"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  ></path>
                </svg>
              </button>
            </span>
            <input
              type="text"
              placeholder="Write your message!"
              class="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-12 bg-gray-200 rounded-md py-3"
              onChange={(e) => {
                setMessageText(e.target.value);
              }}
            />
            <div class="absolute right-0 items-center inset-y-0 hidden sm:flex">
              <button
                type="button"
                class="inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  class="h-6 w-6 text-gray-600"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  ></path>
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                </svg>
              </button>
              <button
                type="button"
                class="inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  class="h-6 w-6 text-gray-600"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </button>
              <button
                id="send"
                type="button"
                class="inline-flex items-center justify-center rounded-lg px-4 py-3 transition duration-500 ease-in-out text-white bg-blue-500 hover:bg-blue-400 focus:outline-none"
                onClick={() => {
                  createNewMessage();
                  sendMessage();
                }}
              >
                <span class="font-bold">Send</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  class="h-6 w-6 ml-2 transform rotate-90"
                >
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Message;
{
  /* <div
id="messages"
className="flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
>
{messages?.map((elem, i) => (
  <div key={i} className="chat-message">
    <div className="flex items-end">
      <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">
        <div></div>
      </div>
      <div>
        <div
          className={elem.receiver_id === to ? "order-2" : "order-1"}
        >
          <span
            className={`px-4 py-2 rounded-lg inline-block ${
              elem.receiver_id === to ? "bg-gray-300" : "bg-blue-600"
            } text-${elem.receiver_id === to ? "gray-600" : "white"}`}
          >
            {elem.messages}
          </span>
        </div>
      </div>
    </div>
  </div>
))} */
}
