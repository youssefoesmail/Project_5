import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setPosts,
  createNewPost,
  updatePostById,
  deletePost,
  setComments,
  addComments,
  updateComments,
  deleteComments,
  setLikes
} from "../redux/post/postSlice";
import { ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import { storage } from "../firebase";
import { v4 } from "uuid";
import userSlice, { setUserId, token } from "../redux/auth/userSlice";
import axios from "axios";
import Story from "../Story/Story";
import { Link } from "react-router-dom";
import "./index.css";
import { Dropdown } from "flowbite-react";
import { Button, Modal } from "flowbite-react";
import moment from "moment";
import {
  FacebookShareButton,
  WhatsappShareButton,
  TelegramShareButton,
  TwitterShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  TelegramIcon
} from "react-share";
import FooterDown from "../FooterDown/FooterDown";
import NavbarLogin from "../Navbars/NavbarLogin";
import personal, { setUserInfo } from "../redux/personalPage/personal";

import Navbar from "../Navbars/NavbarLogin";

const Posts = () => {
  //setUserPostId
  const [body, setBody] = useState("");
  const [pic, setPhoto] = useState("");
  const [video, setVideo] = useState("");
  const [update, setUpdate] = useState(false);
  const dispatch = useDispatch();
  const [imageUpload, setImageUpload] = useState(null);
  const [imageUrls, setImageUrls] = useState([] || null);
  const [videoUpload, setVideoUpload] = useState(null);
  const [videoUrls, setVideoUrls] = useState([] || null);
  const [message, setMessage] = useState("");
  const [show, setShow] = useState("");
  const [postId, setPostId] = useState("");
  const [addCommentValue, setAddCommentValue] = useState("");
  const [commId, setCommId] = useState("");
  const [upCommValue, setUpCommValue] = useState("");
  const [openUploadModal, setOpenUploadModal] = useState(false);
  const [acceptUpload, setAcceptUpload] = useState(false);

  const imagesListRef = ref(storage, "images/");
  const videoListRef = ref(storage, "videos/");

  const {
    posts,
    auth,
    comment,
    userId,
    users,
    like,
    photo,
    nameUsers,
    personal
  } = useSelector((state) => {
    return {
      auth: state.auth,
      photo: state.personal.personal.photo,
      nameUsers: state.personal.personal,
      posts: state.posts.posts,
      comment: state.posts.comment,
      userId: state.auth.userId,
      personal: state.personal.personal
    };
  });

  const ShareButtons = (shareUrl) => {
    return (
      <div>
        <FacebookShareButton url={shareUrl}>
          <FacebookIcon size={32} round />
        </FacebookShareButton>

        <TwitterShareButton url={shareUrl}>
          <TwitterIcon size={32} round />
        </TwitterShareButton>

        <WhatsappShareButton url={shareUrl}>
          <WhatsappIcon size={32} round />
        </WhatsappShareButton>
      </div>
    );
  };
  const handleCreateNewPost = () => {
    const NewPost = {
      body: body,
      pic: imageUrls[imageUrls.length - 1]
    };

    axios
      .post("http://localhost:5000/posts", NewPost, {
        headers: {
          authorization: `Bearer ${auth.token}`
        }
      })
      .then((result) => {
        dispatch(createNewPost(result.data.post));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //!============ getPostComment ====================

  const getPostComment = async (id) => {
    try {
      const result = await axios.get(
        `http://localhost:5000/comments/post/${id}`
      );
      if (result.data.success) {
        const comments = result.data.result;
        dispatch(setComments({ comment: comments, id }));
      } else throw Error;
    } catch (error) {
      if (!error.response) {
        return setMessage(error);
      }
      setMessage("Error happened while Get Data, please try again");
    }
  };
  // ====================================================

  //!============ createComment ====================

  const createComment = async (id) => {
    try {
      const result = await axios.post(
        `http://localhost:5000/comments/post/${id}`,
        {
          comment: addCommentValue
        },
        {
          headers: {
            authorization: `Bearer ${auth.token}`
          }
        }
      );
      if (result.data.success) {
        const comments = result.data.result;
        dispatch(addComments({ comment: comments, id }));
        setAddCommentValue("");
      } else throw Error;
    } catch (error) {
      if (!error.response) {
        return setMessage(error);
      }
      setMessage("Error happened while Get Data, please try again");
    }
  };
  // ====================================================
  //!============ updateComment =========================

  const updateComment = async (id, pID) => {
    try {
      const result = await axios.put(
        `http://localhost:5000/comments/post/${id}`,
        {
          comment: upCommValue
        },
        {
          headers: {
            authorization: `Bearer ${auth.token}`
          }
        }
      );
      dispatch(updateComments({ comment: result.data.result, id, pID }));
      setUpCommValue("");
    } catch (err) {
      console.log(err);
    }
  };
  // ====================================================

  //!============ deleteComment =========================

  const deleteComment = async (id, pID) => {
    try {
      const result = await axios.delete(
        `http://localhost:5000/comments/post/${id}`,
        {
          headers: {
            authorization: `Bearer ${auth.token}`
          }
        }
      );
      dispatch(deleteComments({ id, pID }));
    } catch (err) {
      console.log(err);
    }
  };
  // ====================================================

  const handleDeletePost = (postId) => {
    axios
      .delete(`http://localhost:5000/posts/${postId}`, {
        headers: {
          authorization: `Bearer ${auth.token}`
        }
      })
      .then((result) => {
        dispatch(deletePost(postId));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleUpdatePost = (postId, img_url, vid_url) => {
    const updatePost = {
      body,
      pic: img_url
    };
    axios
      .put(`http://localhost:5000/posts/${postId}`, updatePost, {
        headers: {
          authorization: `Bearer ${auth.token}`
        }
      })
      .then((result) => {
        setUpdate(!update);
        dispatch(updatePostById({ id: postId, ...updatePost }));
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const clearInput = () => {
    setBody("");
    setPhoto("");
    setVideo("");
    setImageUrls("");
    setVideoUrls("");
    setImageUpload("");
    setVideoUpload("");
  };
  const uploadFile = (id, str1, str2) => {
    let urlim = "";
    if (imageUpload == null) return;
    const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
    uploadBytes(imageRef, imageUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setImageUrls((prev) => [...prev, url]);
        console.log(url);
      });
    });
    if (videoUpload == null) return;
    const videoRef = ref(storage, `videos/${videoUpload.name + v4()}`);
    uploadBytes(videoRef, videoUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setVideoUrls((prev) => [...prev, url]);
        if (str2 == "update_vid") {
          handleUpdatePost(id, urlim, url);
        }
      });
    });
  };

  const personalPage = () => {
    axios
      .get(`http://localhost:5000/users/${auth.userId}`)
      .then((result) => {
        dispatch(setUserInfo(result.data.result[0]));
        console.log(result.data.result[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    listAll(imagesListRef).then((response) => {
      response.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
          setImageUrls((prev) => [...prev, url]);
        });
      });
    });
    listAll(videoListRef).then((response) => {
      response.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
          setVideoUrls((prev) => [...prev, url]);
        });
      });
    });
    personalPage();
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:5000/posts")
      .then((result) => {
        dispatch(setPosts(result.data.posts));
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:5000/likes")
      .then((result) => {
        dispatch(setLikes(result.data.posts));
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <>
      <div id="navbar-login">
        <NavbarLogin />
      </div>
      <div class="bg-white dark:bg-gray-900" className="postUI">
        <div class="ml-60"></div>
        <div class="container px-6 py-10 mx-auto">
          <div class="lg:flex-col  lg:items-center">
            <div id="story">
              {" "}
              <Story />
            </div>

            <div class=" bg-white shadow-lg rounded-lg mx-4 md:mx-auto my-56 max-w-md md:max-w-2xl marginElement">
              <div class="mb-6">
                <input
                  id="input"
                  class="px-16 py-16 font-medium tracking-wide w-full text-white capitalize transition-colors duration-300 transform bg-white-500 rounded-lg hover:bg-white-500 focus:outline-none focus:ring focus:ring-white-300 focus:ring-opacity-80"
                  onClick={() => setOpenUploadModal(true)}
                  placeholder="write posts here"
                />
              </div>
              <Modal
                show={openUploadModal}
                onClose={() => setOpenUploadModal(false)}
              >
                <Modal.Body>
                  <div className="space-y-6">
                    <div>
                      <label
                        for="large-input"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Post Here
                      </label>
                      <input
                        type="text"
                        id="large-input"
                        onClick={(e) => {
                          setBody(e.target.value);
                        }}
                        class="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      />
                      <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                        pic
                      </p>
                      <input
                        type="file"
                        class="block  mt-2 w-full placeholder-gray-400/70 dark:placeholder-gray-500 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
                        onChange={(event) => {
                          setImageUpload(event.target.files[0]);
                        }}
                      />
                    </div>
                    {imageUpload && (
                      <button
                        class="px-6 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-green-600 rounded-lg hover:bg-green-500 focus:outline-none focus:ring focus:ring-green-300 focus:ring-opacity-80"
                        onClick={() => {
                          uploadFile();
                          setAcceptUpload(true);
                        }}
                      >
                        {" "}
                        Upload
                      </button>
                    )}
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  {acceptUpload ? (
                    <Button
                      class="bg-green-500 text-white rounded"
                      onClick={() => {
                        setOpenUploadModal(false);
                        handleCreateNewPost();
                        clearInput();
                        setAcceptUpload(false);
                      }}
                    >
                      Accept
                    </Button>
                  ) : (
                    <Button class="bg-green-500 text-white rounded opacity-50 cursor-not-allowed">
                      Accept
                    </Button>
                  )}
                  <Button
                    color="gray"
                    onClick={() => {
                      setOpenUploadModal(false);
                      setVideoUpload("");
                      setImageUpload("");
                    }}
                  >
                    Decline
                  </Button>
                </Modal.Footer>
              </Modal>
            </div>
            {posts?.map((elem) => {
              return (
                <div class="flex ">
                  <div class="container px-6 py-10 mx-auto w-1/4">
                    <aside
                      id="logo-sidebar"
                      class="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
                      aria-label="Sidebar"
                    >
                      <div class="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
                        <ul class="space-y-2 font-medium">
                          <li>
                            <Link
                              to={`/users/${elem.user_id}`}
                              onClick={() => {
                                dispatch(setUserId(elem.user_id));
                              }}
                            >
                              <a
                                href="/users"
                                class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                              >
                                <img
                                  class="object-cover w-16 h-16 rounded-full"
                                  src={personal.photo}
                                  alt=""
                                />
                                <span class="ms-3">
                                  {personal.firstname} {personal.lastname}
                                </span>
                              </a>
                            </Link>
                          </li>
                          <li>
                            <a
                              href="/"
                              class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                            >
                              <svg
                                class="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 20 18"
                              >
                                <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
                              </svg>
                              <span class="flex-1 ms-3 whitespace-nowrap">
                                friends
                              </span>
                            </a>
                          </li>
                          <li>
                            <a
                              href="/message"
                              class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                            >
                              <svg
                                class="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 20 18"
                              >
                                <path
                                  fill-rule="evenodd"
                                  d="M4 3a1 1 0 0 0-1 1v8c0 .6.4 1 1 1h1v2a1 1 0 0 0 1.7.7L9.4 13H15c.6 0 1-.4 1-1V4c0-.6-.4-1-1-1H4Z"
                                  clip-rule="evenodd"
                                />
                                <path
                                  fill-rule="evenodd"
                                  d="M8 17.2h.1l2.1-2.2H15a3 3 0 0 0 3-3V8h2c.6 0 1 .4 1 1v8c0 .6-.4 1-1 1h-1v2a1 1 0 0 1-1.7.7L14.6 18H9a1 1 0 0 1-1-.8Z"
                                  clip-rule="evenodd"
                                />
                              </svg>
                              <span class="flex-1 ms-3 whitespace-nowrap">
                                Messages
                              </span>
                            </a>
                          </li>
                          <li></li>
                          <li>
                            <a class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                              <svg
                                class="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white mr-4"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 22 22"
                              >
                                <path
                                  stroke="currentColor"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="2"
                                  d="M15 9h0M9 9h0m12 3a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM7 13c0 1 .5 2.4 1.5 3.2a5.5 5.5 0 0 0 7 0c1-.8 1.5-2.2 1.5-3.2 0 0-2 1-5 1s-5-1-5-1Z"
                                />
                              </svg>
                              <Dropdown label="Games" inline>
                                <Dropdown.Item
                                  href="https://main--peaceful-granita-c2011d.netlify.app/"
                                  target="_blank"
                                >
                                  Hangman
                                </Dropdown.Item>
                                <Dropdown.Item
                                  href="https://tic-tac-toe-forgame.netlify.app/"
                                  target="_blank"
                                >
                                  Tic Tac Toe (X-O)
                                </Dropdown.Item>
                                <Dropdown.Item
                                  href="https://projectonequizgmae.netlify.app/"
                                  target="_blank"
                                >
                                  Quiz Game
                                </Dropdown.Item>
                                <Dropdown.Item
                                  href="https://main--resplendent-moxie-139999.netlify.app/"
                                  target="_blank"
                                >
                                  Card Game
                                </Dropdown.Item>
                              </Dropdown>
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                            >
                              <svg
                                class="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 20 18"
                              >
                                <path
                                  stroke="currentColor"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="2"
                                  d="M4 8h11m0 0-4-4m4 4-4 4m-5 3H3a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h3"
                                />
                              </svg>
                              <span class="flex-1 ms-3 whitespace-nowrap">
                                Logout
                              </span>
                            </a>
                          </li>
                        </ul>
                      </div>
                    </aside>
                  </div>
                  <div class="flex bg-white drop-shadow-5x2 rounded-lg my-8 w-1/1">
                    <div class="flex flex-col px-8 py-8 my-6">
                      <div className="" key={elem.id}>
                        <>
                          <div class="flex items-center justify-between">
                            {" "}
                            <Link
                              to={`/users/${elem.user_id}`}
                              onClick={() => {
                                dispatch(setUserId(elem.user_id));
                              }}
                            >
                              {elem.photo ? (
                                <div class="flex items-center gap-x-4">
                                  <img
                                    class="object-cover w-20 h-20 rounded-full"
                                    src={elem.photo}
                                    alt=""
                                  />

                                  <div>
                                    <h1 class="text-xl font-semibold text-gray-700 capitalize dark:text-white">
                                      {elem.firstname} {elem.lastname}{" "}
                                    </h1>

                                    <p class="text-base text-gray-500 dark:text-gray-400">
                                      {elem.email}
                                    </p>
                                  </div>
                                </div>
                              ) : (
                                <div class="flex items-center gap-x-2">
                                  <img
                                    class="object-cover w-16 h-16 rounded-full"
                                    src="https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o="
                                    alt=""
                                  />

                                  <div>
                                    <h1 class="text-xl font-semibold text-gray-700 capitalize dark:text-white">
                                      {elem.firstname} {elem.lastname}{" "}
                                    </h1>

                                    <p class="text-base text-gray-500 dark:text-gray-400">
                                      {elem.email}
                                    </p>
                                  </div>
                                </div>
                              )}
                              <br />
                            </Link>
                            <small class="text-sm text-gray-700">
                              {moment(elem.created_at).endOf("day").fromNow()}
                            </small>
                          </div>

                          {elem.pic && (
                            <img
                              class="object-cover mx-auto my-4 w-full h-96 rounded-lg lg:h-[36rem]"
                              alt=""
                              width="230px"
                              height="2220px"
                              src={elem.pic}
                            />
                          )}

                          <div class="mt-4 flex items-center px-4 py-6 my-6 mx-6">
                            <div class="flex mr-2 text-gray-700 text-sm mr-6 hover:bg-blue-300">
                              <svg
                                fill="none"
                                viewBox="0 0 24 24"
                                class="w-10 h-10 mr-1"
                                stroke="currentColor"
                                onClick={() => {
                                  getPostComment(elem.id);
                                  {
                                    elem.id != postId
                                      ? setPostId(elem.id)
                                      : setPostId("");
                                  }
                                }}
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="2"
                                  d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                                />
                              </svg>
                              <span>{elem.comment?.length}</span>
                            </div>
                            <div class="flex mr-2 text-sm mr-6">
                              <FacebookShareButton url="http://localhost:5173/post">
                                <FacebookIcon class="w-8 h-8 rounded-full" />
                              </FacebookShareButton>
                              <TwitterShareButton
                                url="http://localhost:5173/post"
                                class="ml-4"
                              >
                                <TwitterIcon class="w-8 h-8 rounded-full" />
                              </TwitterShareButton>
                              <WhatsappShareButton
                                url="http://localhost:5173/post"
                                class="ml-4"
                              >
                                <WhatsappIcon class="w-8 h-8 rounded-full" />
                              </WhatsappShareButton>
                              <TelegramShareButton
                                url="http://localhost:5173/post"
                                class="ml-4"
                              >
                                <TelegramIcon class="w-8 h-8 rounded-full" />
                              </TelegramShareButton>
                            </div>

                            {elem.user_id == userId && (
                              <div class="mr-6 hover:bg-red-300">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={1.5}
                                  stroke="currentColor"
                                  className="w-6 h-6"
                                  onClick={() => {
                                    handleDeletePost(elem.id);
                                  }}
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
                                  />
                                </svg>
                              </div>
                            )}
                            <></>
                          </div>
                        </>
                        <div>
                          {elem.id == postId &&
                            // get if there is a value
                            elem.comment?.map((comment, i) => {
                              return (
                                <section class="w-96 p-4 mx-20px bg-white border-gray-200 dark:bg-gray-800 left-12 bottom-16 dark:border-gray-700 border-2 border-solid border-dark-600 rounded-lg">
                                  <div className="comment" key={i}>
                                    <small
                                      class="text-sm text-gray-700"
                                      id="date"
                                    >
                                      {moment(comment.created_at)
                                        .endOf("day")
                                        .fromNow()}
                                    </small>
                                    <h2 class="font-semibold text-gray-800 dark:text-white">
                                      <Link
                                        to={`/users/${elem.user_id}`}
                                        onClick={() => {
                                          dispatch(setUserId(elem.user_id));
                                        }}
                                      >
                                        {comment.pic ? (
                                          <div class="flex items-center gap-x-2">
                                            <img
                                              class="object-cover w-8 h-8 rounded-full"
                                              src={comment.pic}
                                              alt=""
                                            />

                                            <div>
                                              <h4 class="text-xl font-semibold text-gray-700 capitalize dark:text-white">
                                                {elem.firstname} {elem.lastname}{" "}
                                              </h4>

                                              <p class="text-base text-gray-500 dark:text-gray-400">
                                                {elem.email}
                                              </p>
                                            </div>
                                          </div>
                                        ) : (
                                          <div class="flex items-center gap-x-2">
                                            <img
                                              class="object-cover w-8 h-8 rounded-full"
                                              src="https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o="
                                              alt=""
                                            />

                                            <div>
                                              <h4 class="text-xl font-semibold text-gray-700 capitalize dark:text-white">
                                                {elem.firstname} {elem.lastname}{" "}
                                              </h4>

                                              <p class="text-base text-gray-500 dark:text-gray-400">
                                                {elem.email}
                                              </p>
                                            </div>
                                          </div>
                                        )}
                                      </Link>
                                    </h2>
                                    <p class="mt-4 text-sm text-gray-600 dark:text-gray-300">
                                      {comment?.comment}
                                    </p>
                                    {comment.commenter == userId && (
                                      <div class="flex items-center justify-between">
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          strokeWidth={1.5}
                                          stroke="currentColor"
                                          className="w-6 h-6"
                                          onClick={() => {
                                            setCommId(comment.id);
                                          }}
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                                          />
                                        </svg>
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          strokeWidth={1.5}
                                          stroke="currentColor"
                                          className="w-6 h-6"
                                          onClick={() => {
                                            deleteComment(comment.id, elem.id);
                                          }}
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
                                          />
                                        </svg>
                                      </div>
                                    )}
                                    {comment.id == commId && (
                                      <>
                                        <input
                                          type="text"
                                          placeholder="update comment"
                                          class="block  mt-2 w-full placeholder-gray-400/70 dark:placeholder-gray-500 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
                                          onChange={(e) => {
                                            setUpCommValue(e.target.value);
                                          }}
                                        />
                                        <button
                                          class="px-6 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-green-600 rounded-lg hover:bg-green-500 focus:outline-none focus:ring focus:ring-green-300 focus:ring-opacity-80"
                                          onClick={() => {
                                            updateComment(commId, elem.id);
                                            setCommId("");
                                          }}
                                        >
                                          update
                                        </button>
                                      </>
                                    )}
                                  </div>
                                </section>
                              );
                            })}
                        </div>
                        {comment &&
                          comment.id === elem.id &&
                          comment.comments && (
                            <div>
                              <h2>Comments:</h2>
                              {comment.comments.map((comment) => (
                                <p key={comment.id}>{comment.text}</p>
                              ))}
                            </div>
                          )}
                        {elem.id != show && (
                          <button
                            class="px-6 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-lg hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80"
                            onClick={() => {
                              {
                                setShow(elem.id);
                              }
                            }}
                          >
                            Add Comment
                          </button>
                        )}
                        {elem.id == show && (
                          <div class="relative flex">
                            <input
                              type="text"
                              placeholder="Write your message!"
                              class="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-12 bg-gray-200 rounded-md py-3"
                              onChange={(e) => {
                                setAddCommentValue(e.target.value);
                              }}
                            />
                            {addCommentValue ? (
                              <button
                                id="send"
                                type="button"
                                class="inline-flex items-center justify-center rounded-lg px-4 py-3 transition duration-500 ease-in-out text-white bg-blue-500 hover:bg-blue-400 focus:outline-none"
                                onClick={() => {}}
                              >
                                <span
                                  class="font-bold"
                                  onClick={() => {
                                    {
                                      createComment(elem.id);
                                      setShow("");
                                    }
                                  }}
                                >
                                  Add
                                </span>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                  class="h-6 w-6 ml-2 transform rotate-90"
                                >
                                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                                </svg>
                              </button>
                            ) : (
                              <button
                                class="inline-flex items-center justify-center rounded-lg px-4 py-3 transition duration-500 ease-in-out text-white bg-red-500 hover:bg-red-400 focus:outline-none"
                                onClick={() => setShow("")}
                              >
                                close
                              </button>
                            )}
                          </div>
                        )}
                      </div>{" "}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <FooterDown />
    </>
  );
};

export default Posts;
