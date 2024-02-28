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
    deleteComments
  } from "../redux/post/postSlice";
  import {
    ref,
    uploadBytes,
    getDownloadURL,
    listAll,
    list
  } from "firebase/storage";
  import { storage } from "../firebase";
  import { v4 } from "uuid";
  import { setUserId, token } from "../redux/auth/userSlice";
  import axios from "axios";
  import Story from "../Story/Story";
  import { Link } from "react-router-dom";
  import "./index.css";
  import { Dropdown } from "flowbite-react";
  import { Button, Modal } from "flowbite-react";
  import moment from "moment";

  const Posts = () => {
    //setUserPostId
    const [body, setBody] = useState("");
    const [photo, setPhoto] = useState("");
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
    const [userPostId, setUserPostId] = useState("");
    const [addCommentValue, setAddCommentValue] = useState("");
    const [commId, setCommId] = useState("");
    const [upCommValue, setUpCommValue] = useState("");
    const [openModal, setOpenModal] = useState("");
    const [info, setInfo] = useState(null);
    const [dropDown, setDropDown] = useState("");

    const imagesListRef = ref(storage, "images/");
    const videoListRef = ref(storage, "videos/");

    const { posts, auth, comment, userId, users } = useSelector((state) => {
      return {
        auth: state.auth,
        posts: state.posts.posts,
        comment: state.posts.comment,
        userId: state.auth.userId,
        users: state.posts.users
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
    // <div className="mt-8 lg:px-6 lg:mt-0 border-2 border-solid border-dark-600 rounded-lg">
    //         <div className="w-auto" key={elem.id}>
    //           <ShareButtons shareUrl={`your-post-url/${elem.id}`} title={elem.body} />
    //         </div>
    //       </div>
    const handleCreateNewPost = () => {
      const NewPost = {
        body: body,
        photo: imageUrls[imageUrls.length - 1] || null,
        video: videoUrls[videoUrls.length - 1] || null
      };

      axios
        .post("http://localhost:5000/posts", NewPost, {
          headers: {
            authorization: `Bearer ${auth.token}`
          }
        })
        .then((result) => {
          dispatch(createNewPost(result.data.result));
        })
        .catch((err) => {
          console.log(err);
        });
    };

    //!============ createPostComment ====================

    // const createPostComment = async (id) => {
    //   try {
    //     const result = await axios.post(
    //       `http://localhost:5000/comments/post/${id}`
    //     );
    //     if (result.data.success) {
    //       const comments = result.data.result;
    //       dispatch(setComments({ comments: comments, post_id: id }));
    //     } else throw Error;
    //   } catch (error) {
    //     if (!error.response.data) {
    //       return setMessage(error.response.data.message);
    //     }
    //     setMessage("Error happened while Get Data, please try again");
    //   }
    // };

    //==================================================

    //!============ getPostComment ====================

    const getPostComment = async (id) => {
      try {
        const result = await axios.get(
          `http://localhost:5000/comments/post/${id}`
        );
        if (result.data.success) {
          const comments = result.data.result;
          dispatch(setComments({ comment: comments, id }));
          setInfo(result.data.result);
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
        console.log("===================>", result.data.message);
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
          // console.log(result);
          dispatch(deletePost(postId));
        })
        .catch((err) => {
          console.log(err);
        });
    };

    const handleUpdatePost = (postId, img_url, vid_url) => {
      const updatePost = {
        body,
        photo: img_url,
        video: vid_url
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

      console.log(updatePost);
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
          urlim = url;
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
    return (
      <div class="bg-white dark:bg-gray-900" className="postUI">
        <div class="container px-6 py-10 mx-auto">
          <div class="lg:flex-col  lg:items-center">
            <Story />
            <div class="flex bg-white shadow-lg rounded-lg mx-4 md:mx-auto my-56 max-w-md md:max-w-2xl marginElement">
              <div class="flex items-start px-4 py-6">
                <div class="flex items-center justify-between">
                  <input
                    type="text"
                    placeholder="Body"
                    class="block  mt-2 w-full placeholder-gray-400/70 dark:placeholder-gray-500 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
                    onChange={(e) => {
                      setBody(e.target.value);
                    }}
                  />
                  <input
                    type="file"
                    class="block  mt-2 w-full placeholder-gray-400/70 dark:placeholder-gray-500 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
                    onChange={(event) => {
                      setImageUpload(event.target.files[0]);
                    }}
                  />
                  <input
                    type="file"
                    class="block  mt-2 w-full placeholder-gray-400/70 dark:placeholder-gray-500 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
                    onChange={(event) => {
                      setVideoUpload(event.target.files[0]);
                    }}
                  />
                </div>
                <div class="flex items-center justify-between">
                  <button
                    class="px-6 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-lg hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80"
                    onClick={() => {
                      handleCreateNewPost();
                      clearInput();
                    }}
                  >
                    createNewPost
                  </button>
                </div>
                <div class="flex items-center justify-between">
                  <button
                    class="px-6 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-green-600 rounded-lg hover:bg-green-500 focus:outline-none focus:ring focus:ring-green-300 focus:ring-opacity-80"
                    onClick={uploadFile}
                  >
                    {" "}
                    Upload
                  </button>
                </div>
              </div>
            </div>
            {posts?.map((elem) => {
              return (
                <>
                  <div class="flex bg-white drop-shadow-2xl rounded-lg my-6">
                    <div class="flex flex-col px-4 py-6 my-6 mx-6">
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
                                <img
                                  class="w-12 h-12 rounded-full object-cover mr-4 shadow"
                                  src={elem.photo}
                                  alt="avatar"
                                />
                              ) : (
                                <img
                                  class="w-12 h-12 rounded-full object-cover mr-4 shadow"
                                  src="https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o="
                                  alt="avatar"
                                />
                              )}
                              <h2 class="text-lg font-semibold text-gray-900 -mt-1">
                                {elem.firstname}
                              </h2>
                            </Link>
                            <small class="text-sm text-gray-700">
                              {moment(elem.created_at).endOf("day").fromNow()}
                            </small>
                          </div>
                          {elem.photo ? (
                            <img
                              class="object-cover justify-items-center object-center lg:mx-6 w-full h-96 rounded-lg lg:h-[36rem]"
                              alt=""
                              width="230px"
                              height="150px"
                              src={elem.photo}
                            />
                          ) : (
                            <video
                              controls
                              width="230px"
                              height="150px"
                              class="object-cover object-center lg:w-1/2 lg:mx-6 w-full h-96 rounded-lg lg:h-[36rem]"
                            >
                              <source src={elem.video} type="video/mp4" />
                            </video>
                          )}
                          <div class="mt-4 flex items-center px-4 py-6 my-6 mx-6">
                            <div class="flex mr-12 text-gray-700 text-sm mr-6 hover:bg-red-300">
                              <svg
                                fill="none"
                                viewBox="0 0 24 24"
                                class="w-10 h-10 mr-1"
                                stroke="currentColor"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="2"
                                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                />
                              </svg>
                              <span>12</span>
                            </div>

                            <div class="flex mr-2 text-gray-700 text-sm mr-6 hover:bg-blue-300">
                              <svg
                                fill="none"
                                viewBox="0 0 24 24"
                                class="w-10 h-10 mr-1"
                                stroke="currentColor"
                                onClick={() => {
                                  setOpenModal(elem.id);
                                  getPostComment(elem.id);
                                  console.log(elem.user_id, show);
                                  setShow(elem.user_id);
                                  {
                                    elem.id != postId
                                      ? setPostId(elem.id)
                                      : setPostId("");
                                  }
                                  setInfo(elem.comment);
                                  console.log(userId);
                                }}
                                // onClick={() => {
                                //   getPostComment(elem.id);

                                //   setShow(elem.user_id);
                                //   setPostId(elem.id);
                                // }}
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

                            <div class="flex mr-2 text-gray-700 text-sm mr-6 hover:bg-blue-300">
                              <svg
                                fill="none"
                                viewBox="0 0 24 24"
                                class="w-10 h-10 mr-1"
                                stroke="currentColor"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="2"
                                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                                />
                              </svg>
                              <span>share</span>
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

                            {
                              // <button class="px-6 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-lg hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80"
                              //   onClick={() => {
                              //     getPostComment(elem.id);
                              //     setShow(elem.user_id);
                              //     setPostId(elem.id)
                              //   }}
                              // >
                              //   showComment
                              // </button>
                            }

                            <br />
                            <></>
                            {/* <Modal show={openModal}  onClose={() => { setOpenModal("") }}>
                                <Modal.Header>Comments</Modal.Header>
                                <Modal.Body>
                                  <div className="space-y-6">
                        {  console.log(info)}
                                    {// get if there is a value
                                      info?.map((comments, i) => {
                                        return (
                                          <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                                          {comments.firstname}
                                          
                                          </p>
                                        );
                                      })} 
                                    <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                                      {elem.id}
                                    </p>
                                  </div>
                                </Modal.Body>
                                <Modal.Footer>
                                </Modal.Footer>
                              </Modal> */}
                            {/* {
                              show&&<div id="default-modal" tabindex="-1" aria-hidden="true" class=" overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-40 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
                              <div class="relative p-4 w-full max-w-2xl max-h-full">
                                
                                  <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                                  
                                      <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                          <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                                              Terms of Service
                                          </h3>
                                          <button type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="default-modal">
                                              <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                              </svg>
                                              <span class="sr-only">Close modal</span>
                                          </button>
                                      </div>
                              
                                      <div class="p-4 md:p-5 space-y-4">
                                          <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                                              With less than a month to go before the European Union enacts new consumer privacy laws for its citizens, companies around the world are updating their terms of service agreements to comply.
                                          </p>
                                          <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                                              The European Union’s General Data Protection Regulation (G.D.P.R.) goes into effect on May 25 and is meant to ensure a common set of data rights in the European Union. It requires organizations to notify users as soon as possible of high-risk data breaches that could personally affect them.
                                          </p>
                                      </div>
                                  
                                      <div class="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                                          <button data-modal-hide="default-modal" type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">I accept</button>
                                          <button data-modal-hide="default-modal" type="button" class="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Decline</button>
                                      </div>
                                  </div>
                              </div>
                          </div>
                            } */}
                            <br />

                            {elem.user_id == userId && update ? (
                              <>
                                {" "}
                                <input
                                  type="text"
                                  placeholder="body"
                                  class="block  mt-2 w-full placeholder-gray-400/70 dark:placeholder-gray-500 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
                                  onChange={(e) => {
                                    setBody(e.target.value);
                                  }}
                                />
                                <input
                                  type="text"
                                  placeholder="file"
                                  class="block  mt-2 w-full placeholder-gray-400/70 dark:placeholder-gray-500 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
                                  onChange={(event) => {
                                    setImageUpload(event.target.files[0]);
                                  }}
                                />
                                <input
                                  type="text"
                                  placeholder="file"
                                  class="block  mt-2 w-full placeholder-gray-400/70 dark:placeholder-gray-500 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
                                  onChange={(event) => {
                                    setVideoUpload(event.target.files[0]);
                                  }}
                                />
                                <button
                                  class="px-6 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-green-600 rounded-lg hover:bg-green-500 focus:outline-none focus:ring focus:ring-green-300 focus:ring-opacity-80"
                                  onClick={() => {
                                    // handleUpdatePost(elem.id);
                                    uploadFile(
                                      elem.id,
                                      "update_img",
                                      "update_vid"
                                    );
                                  }}
                                >
                                  UpdateInformtion
                                </button>
                              </>
                            ) : (
                              <>
                                {elem.user_id == userId && (
                                  <div class="hover:bg-green-300">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      strokeWidth={1.5}
                                      stroke="currentColor"
                                      className="w-6 h-6"
                                      onClick={() => {
                                        setUpdate(!update);
                                      }}
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                                      />
                                    </svg>
                                  </div>
                                  // <button
                                  //   class="px-6 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-green-600 rounded-lg hover:bg-green-500 focus:outline-none focus:ring focus:ring-green-300 focus:ring-opacity-80"
                                  //   onClick={() => {
                                  //     setUpdate(!update);
                                  //   }}
                                  // >
                                  //   update
                                  // </button>
                                )}
                              </>
                            )}
                          </div>
                        </>
                        {/* {elem.user_id == userId && (
                          <button
                            class="px-6 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-red-600 rounded-lg hover:bg-red-500 focus:outline-none focus:ring focus:ring-red-300 focus:ring-opacity-80"
                            onClick={() => {
                              handleDeletePost(elem.id);
                            }}
                          >
                            deletePost
                          </button>
                        )} */}
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
                                      {comment.photo ? (
                                        <img
                                          class="w-12 h-12 rounded-full object-cover mr-4 shadow"
                                          src={comment.photo}
                                          alt="avatar"
                                        />
                                      ) : (
                                        <img
                                          class="w-12 h-12 rounded-full object-cover mr-4 shadow"
                                          src="https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o="
                                          alt="avatar"
                                        />
                                      )}
                                      {comment.firstname}
                                    </h2>
                                    <p class="mt-4 text-sm text-gray-600 dark:text-gray-300">
                                      {comment?.comment}
                                    </p>
                                    {console.log(comment.commenter, userId)}
                                    {comment.commenter == userId && (
                                      <div class="flex items-center justify-between">
                                        {/* <><button id="dropdownMenuIconButton" data-dropdown-toggle="dropdownDots" class="inline-flex items-center p-2 text-sm font-medium text-center text-gray-900 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-600" type="button" onClick={() => { 
                                          dropDown == comment.id ? setDropDown("") : setDropDown(comment.id) }}>
                                          <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 4 15">
                                            <path d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
                                          </svg>
                                        </button>


                                        {dropDown == comment.id && <div id="dropdownDots" class="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600">
                                          <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownMenuIconButton">
                                            <li>
                                              <a onClick={() => {
                                                updateComment(comment.id, elem.id);
                                                setDropDown("")
                                                setCommId(comment.id);
                                              }} class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">update</a>
                                            </li>
                                            <li>
                                              <a onClick={() => {
                                                setDropDown("");
                                                deleteComment(comment.id, elem.id);
                                              }} class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">delete</a>
                                            </li>
                                          </ul>
                                        </div>}</> */}
                                        {/* <button
                                              class=" text-xs bg-green-900 font-medium rounded-lg hover:bg-green-700 text-white px-4 py-2.5 duration-300 transition-colors focus:outline-none"
                                              onClick={() => {
                                                updateComment(comment.id, elem.id);

                                                console.log(comment);
                                                //updateComment(comment.id, elem.id)
                                                setCommId(comment.id);
                                              }}
                                            >
                                              update
                                            </button>
                                            <button
                                              class=" text-xs bg-red-900 font-medium rounded-lg hover:bg-red-700 text-white px-4 py-2.5 duration-300 transition-colors focus:outline-none"
                                              onClick={() => {
                                                console.log(comment.id);
                                                deleteComment(comment.id, elem.id);
                                              }}
                                            >
                                              delete
                                            </button> */}
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
                            <button
                              id="send"
                              type="button"
                              class="inline-flex items-center justify-center rounded-lg px-4 py-3 transition duration-500 ease-in-out text-white bg-blue-500 hover:bg-blue-400 focus:outline-none"
                              onClick={() => {
                                // createNewMessage();
                              }}
                            >
                              <span
                                class="font-bold"
                                onClick={() => {
                                  {
                                    console.log("hg");
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
                          </div>
                        )}
                        {/* {elem.id == show && (
                          <input
                            type="text"
                            placeholder="Body"
                            class="block  mt-2 w-full placeholder-gray-400/70 dark:placeholder-gray-500 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
                            onChange={(e) => {
                              setAddCommentValue(e.target.value);
                            }}
                          />
                        )} */}
                        {/* {elem.id == show && (
                          <button
                            class="px-6 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-green-600 rounded-lg hover:bg-green-500 focus:outline-none focus:ring focus:ring-green-300 focus:ring-opacity-80"
                            onClick={() => {
                              {
                                createComment(elem.id);
                                setShow("");
                              }
                            }}
                          >
                            Add
                          </button>
                        )} */}
                      </div>{" "}
                    </div>
                  </div>
                </>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  export default Posts;
