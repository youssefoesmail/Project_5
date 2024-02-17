import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setPosts,
  createNewPost,
  updatePostById,
  deletePost
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
import { token } from "../redux/auth/userSlice";
import axios from "axios";
const Posts = () => {
  const [body, setBody] = useState("");
  const [photo, setPhoto] = useState("");
  const [video, setVideo] = useState("");
  const [update, setUpdate] = useState(false);
  const dispatch = useDispatch();
  const [imageUpload, setImageUpload] = useState(null);
  const [imageUrls, setImageUrls] = useState([]||null);
  const [videoUpload, setVideoUpload] = useState(null);
  const [videoUrls, setVideoUrls] = useState([]||null);

  const imagesListRef = ref(storage, "images/");
  const videoListRef = ref(storage, "videos/");

  const { posts, auth } = useSelector((state) => {
    return {
      auth: state.auth,
      posts: state.posts.posts
    };
  });
  const handleCreateNewPost = () => {
    const NewPost = {
      body: body,
      photo: imageUrls[imageUrls.length-1] || null,
      video: videoUrls[videoUrls.length-1]  || null
      
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
      </button >
      <button onClick={uploadFile}> Upload</button>
      {posts.map((elem) => {
         return (
          <>
            <div key={elem.id}>
              <>
                {" "}
                <h1>{elem.body}</h1>
                      
        <img width="300px" height="150px" src={elem.photo} /> 
        <video controls width="300px" height="150px">
        <source src={elem.video}type="video/mp4" />
          </video> 

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
