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
  list,
} from "firebase/storage";
import { storage } from "../firebase";
import { v4 } from "uuid";
import { setUserId, token } from "../redux/auth/userSlice";
import axios from "axios";
import Story from "../Story/Story";
import { Link } from "react-router-dom";
import Reel from "../reels/Reel";

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

  const imagesListRef = ref(storage, "images/");
  const videoListRef = ref(storage, "videos/");

  const { posts, auth, comment, userId, users } = useSelector((state) => {
    return {
      auth: state.auth,
      posts: state.posts.posts,
      comment: state.posts.comment,
      userId: state.auth.userId,
      users: state.posts.users,
    };
  });
  const handleCreateNewPost = () => {
    const NewPost = {
      body: body,
      photo: imageUrls[imageUrls.length - 1] || null,
      video: videoUrls[videoUrls.length - 1] || null,
    };

    axios
      .post("http://localhost:5000/posts", NewPost, {
        headers: {
          authorization: `Bearer ${auth.token}`,
        },
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
            authorization: `Bearer ${auth.token}`,
          },
        }
      );
      dispatch(updateComments({ comment: result.data.result, id, pID }));
      setUpCommValue("")
    } catch (err) {
      console.log(err);
    }
  };
  // ====================================================

  //!============ deleteComment =========================

  const deleteComment = async (id, pID) => {
    try {
      const result = await axios.delete(`http://localhost:5000/comments/post/${id}`,
        {
          headers: {
            authorization: `Bearer ${auth.token}`
          }
        }
      );
      console.log("===================>", result.data.message,);
      dispatch(deleteComments({ id, pID }));
    }
    catch (err) {
      console.log(err);
    }
  };
  // ====================================================
  const handleDeletePost = (postId) => {
    axios
      .delete(`http://localhost:5000/posts/${postId}`, {
        headers: {
          authorization: `Bearer ${auth.token}`,
        },
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
      video: vid_url,
    };
    axios
      .put(`http://localhost:5000/posts/${postId}`, updatePost, {
        headers: {
          authorization: `Bearer ${auth.token}`,
        },
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
    let urlim = ""
    if (imageUpload == null) return;
    const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
    uploadBytes(imageRef, imageUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setImageUrls((prev) => [...prev, url]);
        urlim = url

      });
    });
    if (videoUpload == null) return;
    const videoRef = ref(storage, `videos/${videoUpload.name + v4()}`);
    uploadBytes(videoRef, videoUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setVideoUrls((prev) => [...prev, url]);
        if (str2 == "update_vid") {
          handleUpdatePost(id, urlim, url)
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
    <div>
      <Story />
      <input
        placeholder="Body"
        onChange={(e) => {
          setBody(e.target.value);
        }}
      />
      <input
        type="file"
        onChange={(event) => {
          setImageUpload(event.target.files[0]);
        }}
      />
      <input
        type="file"
        onChange={(event) => {
          setVideoUpload(event.target.files[0]);
        }}
      />

      <button
        onClick={() => {
          handleCreateNewPost();
          clearInput();
        }}
      >
        createNewPost
      </button>
      <button onClick={uploadFile}> Upload</button>
      {posts?.map((elem) => {
        return (
          <>
            <div key={elem.id}>
              <>
                {" "}
                <Link
                  to={`/users/${elem.user_id}`}
                  onClick={() => {
                    dispatch(setUserId(elem.user_id));
                  }}
                >
                  <p>{elem.firstname}</p>
                </Link>
                <h1 onClick={elem.id}>{elem.body}</h1>
                {
                  <button
                    onClick={() => {
                      getPostComment(elem.id);
                      setShow(elem.user_id);
                      setPostId(elem.id);
                    }}
                  >
                    showComment
                  </button>
                }
                {elem.id == postId &&
                  // get if there is a value
                  elem.comment?.map((comment, i) => {
                    return (
                      <div className="comment" key={i}>
                        <p>{comment?.comment}</p>
                        {comment.commenter == userId && (
                          <div>
                            <button
                              onClick={() => {
                                updateComment(comment.id, elem.id);

                                updateComment(comment.id, elem.id);

                                //updateComment(comment.id, elem.id)
                                setCommId(comment.id);
                              }}
                            >
                              update
                            </button>
                            <button
                              onClick={() => {
                                console.log(comment.id);
                                deleteComment(comment.id, elem.id);
                              }}
                            >
                              delete
                            </button>
                          </div>
                        )}
                        {comment.id == commId && (
                          <>
                            <input
                              placeholder="update comment"
                              onChange={(e) => {
                                setUpCommValue(e.target.value);
                              }}
                            />
                            <button
                              onClick={() => {
                                updateComment(commId, elem.id);
                                setCommId("");
                              }}
                            >
                              update
                            </button>
                            <button>delete</button>
                          </>
                        )}
                      </div>
                    );
                  })}
                <img width="300px" height="150px" src={elem.photo} />
                <video controls width="300px" height="150px">
                  <source src={elem.video} type="video/mp4" />
                </video>
                {comment && comment.id === elem.id && comment.comments && (
                  <div>
                    <h2>Comments:</h2>
                    {comment.comments.map((comment) => (
                      <p key={comment.id}>{comment.text}</p>
                    ))}
                  </div>
                )}
                {elem.user_id == userId && update ? (

    <section class="bg-white dark:bg-gray-900">
      <div class="container px-6 py-10 mx-auto">
        <div class="lg:flex-col  lg:items-center">
          <Story />
          <Link
                      to={`/reels`}
                    
                    >
                      <p>reels</p>
                    </Link>

          <input
            type="text" placeholder="Body" class="block  mt-2 w-full placeholder-gray-400/70 dark:placeholder-gray-500 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"

            onChange={(e) => {
              setBody(e.target.value);
            }}
          />
          <input
            type="file" class="block  mt-2 w-full placeholder-gray-400/70 dark:placeholder-gray-500 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
            onChange={(event) => {
              setImageUpload(event.target.files[0]);
            }}
          />
          <input
            type="file" class="block  mt-2 w-full placeholder-gray-400/70 dark:placeholder-gray-500 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"

            onChange={(event) => {
              setVideoUpload(event.target.files[0]);
            }}
          />

          <button
            class="px-6 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-lg hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80"
            onClick={() => {
              handleCreateNewPost();
              clearInput();
            }}
          >
            createNewPost
          </button>
          <button
            class="px-6 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-green-600 rounded-lg hover:bg-green-500 focus:outline-none focus:ring focus:ring-green-300 focus:ring-opacity-80"

            onClick={uploadFile}> Upload</button>
          {posts?.map((elem) => {
            return (
              <div class="mt-8  lg:px-6 lg:mt-0 ">
                <div className=" w-auto" key={elem.id}>

                  <>
                    {" "}
                    <Link
                      to={`/users/${elem.user_id}`}
                      onClick={() => {
                        dispatch(setUserId(elem.user_id));
                      }}
                    >
                      <p>{elem.firstname}</p>
                    </Link>
                    {elem.photo ? <img class="object-cover object-center lg:w-1/2 lg:mx-6 w-full h-96 rounded-lg lg:h-[36rem]" alt="" width="300px" height="150px" src={elem.photo} /> :
                      <video controls width="300px" height="150px" class="object-cover object-center lg:w-1/2 lg:mx-6 w-full h-96 rounded-lg lg:h-[36rem]">
                        <source src={elem.video} type="video/mp4" />
                      </video>}
                    {
                      <button class="px-6 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-lg hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80"
                        onClick={() => {
                          getPostComment(elem.id);
                          setShow(elem.user_id);
                          setPostId(elem.id)
                        }}
                      >
                        showComment
                      </button>
                    }
                    {elem.id == postId &&
                      // get if there is a value
                      elem.comment?.map((comment, i) => {
                        return (
                          <section class="max-w-md p-4 mx-auto bg-white border border-gray-200 dark:bg-gray-800 left-12 bottom-16 dark:border-gray-700 rounded-2xl">
                            <div className="comment" key={i}>
                              <h2 class="font-semibold text-gray-800 dark:text-white">{comment?.commenter}</h2>
                              <p class="mt-4 text-sm text-gray-600 dark:text-gray-300">{comment?.comment}</p>
                              {comment.commenter == userId && (
                                <div>
                                  <button
                                    class=" text-xs bg-green-900 font-medium rounded-lg hover:bg-green-700 text-white px-4 py-2.5 duration-300 transition-colors focus:outline-none"
                                    onClick={() => {

                                      updateComment(comment.id, elem.id)

                                      console.log(comment);
                                      //updateComment(comment.id, elem.id)
                                      setCommId(comment.id);

                                    }}
                                  >update</button>
                                  <button
                                    class=" text-xs bg-red-900 font-medium rounded-lg hover:bg-red-700 text-white px-4 py-2.5 duration-300 transition-colors focus:outline-none"
                                    onClick={() => {
                                      console.log(comment.id);
                                      deleteComment(comment.id, elem.id)
                                    }}
                                  >delete</button>
                                </div>
                              )}
                              {
                                comment.id == commId &&
                                <>
                                  <input
                                    type="text" placeholder="update comment" class="block  mt-2 w-full placeholder-gray-400/70 dark:placeholder-gray-500 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"

                                    onChange={(e) => {
                                      setUpCommValue(e.target.value)
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
                              }
                            </div>
                          </section>
                        );
                      })
                    }
                    {comment && comment.id === elem.id && comment.comments && (
                      <div>
                        <h2>Comments:</h2>
                        {comment.comments.map((comment) => (
                          <p key={comment.id}>{comment.text}</p>
                        ))}
                      </div>
                    )}
                    {elem.user_id == userId && update ? (
                      <>
                        {" "}
                        <input
                          type="text" placeholder="body" class="block  mt-2 w-full placeholder-gray-400/70 dark:placeholder-gray-500 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"

                          onChange={(e) => {
                            setBody(e.target.value);
                          }}
                        />
                        <input
                          type="text" placeholder="file" class="block  mt-2 w-full placeholder-gray-400/70 dark:placeholder-gray-500 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
                          onChange={(event) => {
                            setImageUpload(event.target.files[0]);
                          }}
                        />
                        <input
                          type="text" placeholder="file" class="block  mt-2 w-full placeholder-gray-400/70 dark:placeholder-gray-500 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
                          onChange={(event) => {
                            setVideoUpload(event.target.files[0]);
                          }}
                        />
                        <button
                          class="px-6 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-green-600 rounded-lg hover:bg-green-500 focus:outline-none focus:ring focus:ring-green-300 focus:ring-opacity-80"
                          onClick={() => {
                             handleUpdatePost(elem.id);
                            uploadFile(elem.id, "update_img", "update_vid")
                          }}
                        >
                          UpdateInformtion
                        </button>
                      </>
                    ) : (
                      <>
                        {elem.user_id == userId && (
                          <button
                            class="px-6 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-green-600 rounded-lg hover:bg-green-500 focus:outline-none focus:ring focus:ring-green-300 focus:ring-opacity-80"
                            onClick={() => {
                              setUpdate(!update);
                            }}
                          >
                            update
                          </button>
                        )}
                      </>
                    )}
                  </>
                  {elem.user_id == userId && (
                    <button
                      class="px-6 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-red-600 rounded-lg hover:bg-red-500 focus:outline-none focus:ring focus:ring-red-300 focus:ring-opacity-80"
                      onClick={() => {
                        handleDeletePost(elem.id);
                      }}
                    >
                      deletePost
                    </button>
                  )}
                  {elem.id != show && <button
                    class="px-6 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-lg hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80"
                    onClick={() => {
                      {
                        setShow(elem.id)
                      }
                    }}
                  >
                    Add Comment
                  </button>
                  }
                  {
                    elem.id == show && <input
                      type="text" placeholder="Body" class="block  mt-2 w-full placeholder-gray-400/70 dark:placeholder-gray-500 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300" onChange={(e) => {
                        setAddCommentValue(e.target.value);
                      }} />
                  }
                  {
                    elem.id == show && <button
                      class="px-6 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-green-600 rounded-lg hover:bg-green-500 focus:outline-none focus:ring focus:ring-green-300 focus:ring-opacity-80"
                      onClick={() => {
                        {
                          createComment(elem.id)
                          setShow("")
                        }
                      }}
                    >
                      Add
                    </button>
                  }
                </div>{" "}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Posts;
