import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setPosts,
  createNewPost,
  updatePostById,
  deletePost
} from "../redux/post/postSlice";
import { token } from "../redux/auth/userSlice";
import axios from "axios";
const Posts = () => {
  const [body, setBody] = useState("");
  const [photo, setPhoto] = useState("");
  const [video, setVideo] = useState("");
  const [update, setUpdate] = useState(false);
  const dispatch = useDispatch();
  const { posts, auth } = useSelector((state) => {
    return {
      auth: state.auth,
      posts: state.posts.posts
    };
  });
  const handleCreateNewPost = () => {
    const NewPost = {
      body: body,
      photo: photo || null,
      video: video || null
    };

    axios
      .post("http://localhost:5000/posts", NewPost, {
        headers: {
          authorization: `Bearer ${auth.token}`
        }
      })
      .then((result) => {
        console.log(result);
        dispatch(createNewPost(result.data));
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleDeletePost = (postId) => {
    axios
      .delete(`http://localhost:5000/posts/${postId}`, {
        headers: {
          authorization: `Bearer ${auth.token}`
        }
      })
      .then((result) => {
        console.log(result);
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
  };
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
      <input
        placeholder="Body"
        onChange={(e) => {
          setBody(e.target.value);
        }}
      />
      <input
        placeholder="photo"
        onChange={(e) => {
          setPhoto(e.target.value);
        }}
      />
      <input
        placeholder="video"
        onChange={(e) => {
          setVideo(e.target.value);
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
      {posts.map((elem) => {
        return (
          <>
            <div key={elem.id}>
              <>
                {" "}
                <h1>{elem.body}</h1>
                {update ? (
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
                        setPhoto(e.target.value);
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
                    <button
                      onClick={() => {
                        setUpdate(!update);
                      }}
                    >
                      update
                    </button>
                  </>
                )}
              </>
              <button
                onClick={() => {
                  handleDeletePost(elem.id);
                }}
              >
                deletePost
              </button>
            </div>{" "}
          </>
        );
      })}
    </div>
  );
};

export default Posts;
