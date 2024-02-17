import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import axios from "axios";
import { setStory } from "../redux/story/Story";
const Story = () => {
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
      {story.map((elem) => {
        return (
          <>
            <img src={elem.photo_video} />
          </>
        );
      })}
    </div>
  );
};

export default Story;
