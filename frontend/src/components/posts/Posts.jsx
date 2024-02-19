import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setPosts,
  createNewPost,
  updatePostById,
  deletePost,
  setComments
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
import { token } from "../redux/auth/userSlice";
import axios from "axios";
import Story from "../Story/Story";
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
  const [userPostId, setUserPostId] = useState("");

  const imagesListRef = ref(storage, "images/");
  const videoListRef = ref(storage, "videos/");

  const { posts, auth, comment, userId } = useSelector((state) => {
    return {
      auth: state.auth,
      posts: state.posts.posts,
      comment: state.posts.comment.comment,
      userId: state.auth.userId
    };
  });
  console.log(userId, show, userPostId);
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
        // console.log(result);
        dispatch(createNewPost(result.data));
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
        console.log(result.data.result);

        dispatch(
          setComments({ comment: comments, id: id })
        );
      } else throw Error;
    } catch (error) {
      if (!error.response) {
        return setMessage(error);
      }
      setMessage(
        "Error happened while Get Data, please try again"
      );
    }
  };
  // ====================================================

  const mapcomment = () => {
    comment.map((ele, i) => {
      console.log(ele.comment);
      return <p>{ele.comment}</p>
    })
  }

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

  const handleUpdatePost = (postId) => {
    const updatePost = {
      body,
      photo,
      video
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
  };
  const uploadFile = () => {
    if (imageUpload == null) return;
    const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
    uploadBytes(imageRef, imageUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setImageUrls((prev) => [...prev, url]);
      });
    });
    if (videoUpload == null) return;
    const videoRef = ref(storage, `videos/${videoUpload.name + v4()}`);
    uploadBytes(videoRef, videoUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setVideoUrls((prev) => [...prev, url]);
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
    console.log(comment);
    axios
      .get("http://localhost:5000/posts")
      .then((result) => {
        // console.log(result.data.posts);
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

      {userId && <button
        onClick={() => {
          handleCreateNewPost();
          clearInput();
        }}
      >
        createNewPost
      </button>}
      <button onClick={uploadFile}> Upload</button>
      {posts.map((elem) => {
        return (
          <>
            <div key={elem.id}>
              <>
                {" "}
                <h1 onClick={elem.id}>{elem.body}</h1>
                {console.log(elem)}
                {<button
                  onClick={() => {
                    getPostComment(elem.id)
                    console.log(elem);
                    setShow(elem.user_id);
                  }
                  }
                >
                  showComment
                </button>}
                {// get if there is a value
                  elem.comment?.map((comment, i) => {
                    return (
                      <p className="comment" key={i}>
                        {comment?.comment}
                        {show == userId && (<div>
                          <button>update</button>
                          <button>delete</button>
                        </div>)}
                      </p>
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
                { elem.user_id == userId && update ? (
                  <>
                    {" "}
                    <input
                      placeholder="body"
                      onChange={(e) => {
                        setBody(e.target.value);
                      }}
                    />
                    <input
                      placeholder="Body"
                      onChange={(e) => {
                        setImageUrls(e.target.value);
                      }}
                    />
                    <input
                      placeholder="Body"
                      onChange={(e) => {
                        setVideo(e.target.value);
                      }}
                    />
                    <button
                      onClick={() => {
                        handleUpdatePost(elem.id);
                      }}
                    >
                      UpdateInformtion
                    </button>
                  </>
                ) : (
                  <>
                    {elem.user_id == userId && <button
                      onClick={() => {
                        setUpdate(!update);
                      }}
                    >
                      update
                    </button>}
                  </>
                )}
              </>
              { elem.user_id == userId && <button
                onClick={() => {
                  handleDeletePost(elem.id);
                }}
              >
                deletePost
              </button>}
              {userId && <button
                onClick={() => {
                  // console.log(elem.id);
                  {
                    elem.id && <input placeholder="Body" />;
                  }
                }}
              >
                Add Comment
              </button>}
            </div>{" "}
          </>
        );
      })}
    </div>
  );
};

export default Posts;
