import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setPosts,
  createNewPost,
  updatePostById,
  deletePost
} from "../redux/post/postSlice";
import axios from "axios";
const Posts = () => {
  const [body, setBody] = useState("");
  const [photo, setPhoto] = useState("");
  const [video, setVideo] = useState("");
  const [update, setUpdate] = useState(false);
  const dispatch = useDispatch();
  const { posts } = useSelector((state) => {
    return {
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
                  authorization: `Bearer ${token}`
                }
              }
            )
            .then((result) => {
              console.log(result);
              dispatch(createNewPost(result));
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
              <option>
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
                        axios("", {});
                        setUpdate(!update);
                        dispatch(updatePostById());
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
              </option>
              <button
                onClick={() => {
                  axios.delete(`/${elem.id}`,{});
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
