import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import axios from "axios";
import { setStory, createNewStory } from "../redux/story/Story";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  list,
} from "firebase/storage";
import { storage } from "../firebase";
import { v4 } from "uuid";
const Story = () => {
  const [video, setVideo] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [storyImageUpload, setStoryImageUpload] = useState(null);
  const [storyImageUrls, setStoryImageUrls] = useState([] || null);
  const storyImageListRef = ref(storage, "storyImages/");

  const [storyVideoUpload, setStoryVideoUpload] = useState(null);
  const [storyVideoUrls, setStoryVideoUrls] = useState([] || null);
  const storyVideoListRef = ref(storage, "storyVideos/");

  const { story, auth } = useSelector((state) => {
    return {
      story: state.story.story,
      auth: state.auth,
    };
  });
  const dispatch = useDispatch();
  //   console.log(story);
  const getAllStory = () => {
    axios
      .get(`http://localhost:5000/story`, {
        headers: {
          authorization: `Bearer ${auth.token}`,
        },
      })
      .then((result) => {
        console.log(result.data.result);
        dispatch(setStory(result.data.result));
      })
      .catch((err) => {});
  };
  const uploadFile = () => {
    if (storyVideoUpload == null) return;
    const storyVideoRef = ref(
      storage,
      `storys/${storyVideoUpload.name + v4()}`
    );
    uploadBytes(storyVideoRef, storyVideoUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setStoryVideoUrls((prev) => [...prev, url]);
      });
    });
    if (storyImageUpload == null) return;
    const storyImageRef = ref(
      storage,
      `storys/${storyImageUpload.name + v4()}`
    );
    uploadBytes(storyImageRef, storyImageUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setStoryImageUrls((prev) => [...prev, url]);
      });
    });
  };

  useEffect(() => {
    listAll(storyVideoListRef).then((response) => {
      response.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
          setStoryVideoUrls((prev) => [...prev, url]);
        });
      });
    });
    listAll(storyImageListRef).then((response) => {
      response.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
          setStoryImageUrls((prev) => [...prev, url]);
        });
      });
    });
  }, []);
 
  useEffect(() => {
    getAllStory();
  }, []);
  return (
    <div>
      <input
        type="file"
        onChange={(event) => {
          setStoryImageUpload(event.target.files[0]);
        }}
      />
      <input
        type="file"
        onChange={(event) => {
          setStoryVideoUpload(event.target.files[0]);
        }}
      />
      <button
        onClick={() => {
          axios
            .post(
              `http://localhost:5000/story`,
              {
                photo: storyImageUrls[storyImageUrls.length - 1],
                video: storyVideoUrls[storyVideoUrls.length - 1],
              },
              {
                headers: {
                  authorization: `Bearer ${auth.token}`,
                },
              }
            )
            .then((result) => {
              console.log(result.data.result);
              dispatch(createNewStory(result.data.result));
            })
            .catch((err) => {
              console.log(err);
            });
        }}
      >
        createNewStory
      </button>
      <button onClick={uploadFile}> Upload</button>
      {story.map((elem) => {
        return (
          <>
            <img width="200px" height="250px" src={elem.photo} />
            <video controls width="200px" height="250px">
              <source src={elem.video} type="video/mp4" />
            </video>
          </>
        );
      })}
    </div>
  );
};

export default Story;
