import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import axios from "axios";
import { setStory, createNewStory } from "../redux/story/Story";

const Story = () => {
  const [video, setVideo] = useState(null);
  const [photo, setPhoto] = useState(null);
  const { story, auth } = useSelector((state) => {
    return {
      story: state.story.story,
      auth: state.auth
    };
  });
  const dispatch = useDispatch();
  //   console.log(story);
  const getAllStory = () => {
    axios
      .get(`http://localhost:5000/story`, {
        headers: {
          authorization: `Bearer ${auth.token}`
        }
      })
      .then((result) => {
        console.log(result.data.result);
        dispatch(setStory(result.data.result));
      })
      .catch((err) => {});
  };
  useEffect(() => {
    getAllStory();
  }, []);
  return (
    <div>
      <input
        type="file"
        placeholder="photo"
        onChange={(e) => {
          setPhoto(e.target.value);
        }}
      />
      <input
        type="file"
        onChange={(e) => {
          setVideo(e.target.value);
        }}
      />
      <button
        onClick={() => {
          axios
            .post(
              `http://localhost:5000/story`,
              {
                photo: photo,
                video: video
              },
              {
                headers: {
                  authorization: `Bearer ${auth.token}`
                }
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
      {story.map((elem) => {
        return (
          <>
            <img src={elem.photo} height="200px" width="200px" />
          </>
        );
      })}
    </div>
  );
};

export default Story;
