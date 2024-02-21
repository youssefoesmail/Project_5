import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setPosts,
  createNewPost,
  updatePostById,
  deletePost,
  setComments,
  addComments,
  updateComments

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
  console.log(posts);
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
        console.log(result.data.result);
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
        console.log(result.data.result)
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
          comment: "addComment_4"
          comment: "addComment",

        },
        {
          headers: {
            authorization: `Bearer ${auth.token}`,
          },
        }
      );
      console.log(result.data.result);
      dispatch(updateComments({ comment: result.data.result, id, pID }));
    } catch (err) {
      console.log(err);
    }
  };
  // ====================================================

  //!============ deleteComment =========================

  // const deleteComment = async (id) => {
  //   try {
  //     const result = await axios.delete(`http://localhost:5000/comments/post/${id}`,
  //       {
  //         comment: "addComment",
  //       },
  //       {
  //         headers: {
  //           authorization: `Bearer ${auth.token}`
  //         }
  //       }
  //     );
  //     console.log(result.data.result);
  //     dispatch(updateComments({comment:result.data.result,id}))
  //   }
  //   catch (err) {
  //     console.log(err);
  //   }
  // };
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

  const handleUpdatePost = (postId,img_url,vid_url) => {
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
  const uploadFile = (id,str1,str2) => {
    let urlim=""
    if (imageUpload == null) return;
    const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
    uploadBytes(imageRef, imageUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setImageUrls((prev) => [...prev, url]);
                urlim=url
        
      });
    });
    if (videoUpload == null) return;
    const videoRef = ref(storage, `videos/${videoUpload.name + v4()}`);
    uploadBytes(videoRef, videoUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setVideoUrls((prev) => [...prev, url]);
        if(str2 == "update_vid"){
          handleUpdatePost(id,urlim,url)
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
        console.log(result.data.posts);
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
                    console.log(elem.user_id);
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
                      console.log(elem.id);
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
                      <div className="comment" key={i}>
                        <p>{comment?.comment}</p>
                        {comment.commenter == userId && (
                          <div>

                            <button
                              onClick={() => {
                                console.log(comment);
                                updateComment(comment.id, elem.id)
                              }}
                            >update</button>
                            <button>delete</button>
                          </div>
                        )}
                      </div>
                    );
                  })
                }
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
                  <>
                    {" "}
                    <input
                      placeholder="body"
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
                        // handleUpdatePost(elem.id);
                        uploadFile(elem.id,"update_img","update_vid")
                      }}
                    >
                      UpdateInformtion
                    </button>
                  </>
                ) : (
                  <>
                    {elem.user_id == userId && (
                      <button
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
                  onClick={() => {
                    handleDeletePost(elem.id);
                  }}
                >
                  deletePost
                </button>
              )}
              {elem.id != show && <button
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
                elem.id == show && <input placeholder="Body" onChange={(e) => {
                  setAddCommentValue(e.target.value);
                }} />
              }
              {
                elem.id == show && <button
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
          </>
        );
      })}
    </div>
  );
};

export default Posts;
