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
      />{" "}
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
          axios
            .post(
              "http://localhost:5000/posts",
              {
                body: body,
                photo: photo || null,
                video: video || null
              },
              {
                headers: {
                  authorization: `Bearer ${auth.token}`
                }
              }
            )
            .then((result) => {
              console.log(result);
              dispatch(createNewPost(result.data));
            })
            .catch((err) => {
              console.log(err);
            });
        }}
      >
        createNewPost
      </button>
      {posts.map((elem) => {
        return (
          <>
            <div>
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
                        axios
                          .put(
                            `http://localhost:5000/posts/${elem.id}`,
                            {
                              photo: photo,
                              body: body,
                              video: video
                            },
                            {
                              headers: {
                                authorization: `Bearer ${auth.token}`
                              }
                            }
                          )
                          .then((result) => {
                            setUpdate(!update);
                            dispatch(updatePostById(elem.id));
                          })
                          .catch((err) => {
                            console.log(err);
                          });
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
                  axios
                    .delete(`http://localhost:5000/posts/${elem.id}`, {
                      headers: {
                        authorization: `Bearer ${auth.token}`
                      }
                    })
                    .then((result) => {
                      console.log(result)
                      dispatch(deletePost(elem.id));
                    })
                    .catch((err) => {
                      console.log(err);
                    });
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
