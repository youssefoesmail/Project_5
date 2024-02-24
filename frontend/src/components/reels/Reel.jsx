import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, Button } from "react-bootstrap";
import axios from "axios";
import { setReel, createNewReels } from "../redux/reels/reels";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  list,
} from "firebase/storage";
import { storage } from "../firebase";
import { v4 } from "uuid";

const Reel = () => {
  const [reelVideoUpload, setReelVideoUpload] = useState(null);
  const [reelVideoUrls, setReelVideoUrls] = useState([] || null);
  const reelVideoListRef = ref(storage, "ReelVideos/");

  const { reels, auth } = useSelector((state) => {
    return {
      reels: state.reels.reels,
      auth: state.auth,
    };
  });

  const dispatch = useDispatch();

  const getAllReels = () => {
    axios
      .get(`http://localhost:5000/reel`, {
        headers: {
          authorization: `Bearer ${auth.token}`,
        },
      })
      .then((result) => {
        console.log(result.data.result);
        dispatch(setReel(result.data.result));
      })
      .catch((err) => {});
  };

  const uploadFile = () => {
    if (reelVideoUpload == null) return;
    const reelVideoRef = ref(storage, `reels/${reelVideoUpload.name + v4()}`);
    uploadBytes(reelVideoRef, reelVideoUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setReelVideoUrls((prev) => [...prev, url]);
      });
    });
  };

  const handleCreateNewReel = () => {
    axios
      .post(
        `http://localhost:5000/reels`,
        {
          video: reelVideoUrls[reelVideoUrls.length - 1],
        },
        {
          headers: {
            authorization: `Bearer ${auth.token}`,
          },
        }
      )
      .then((result) => {
        console.log(result.data.result);
        dispatch(createNewReels(result.data.result));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    listAll(reelVideoListRef).then((response) => {
      response.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
          setReelVideoUrls((prev) => [...prev, url]);
        });
      });
    });
  }, []);

  useEffect(() => {
    getAllReels();
  }, []);
  const handleReelClick = (videoUrl) => {
    const videoElement = document.createElement("video");
    videoElement.src = videoUrl;
    videoElement.controls = true;
  
    // Listen for the 'loadedmetadata' event to ensure the video is ready
    videoElement.addEventListener("loadedmetadata", () => {
      // Append the video element to the document body
      document.body.appendChild(videoElement);
  
      // Check if the browser supports Fullscreen API
      if (document.fullscreenEnabled) {
        // Request full-screen mode
        if (videoElement.requestFullscreen) {
          videoElement.requestFullscreen();
        }
      } else {
        // For browsers that do not support Fullscreen API, open the video in a new tab
        window.open(videoUrl, "_blank");
      }
    });
  };

  return (
    <div>
    <input
      type="file"
      onChange={(event) => {
        setReelVideoUpload(event.target.files[0]);
      }}
    />
    <button onClick={uploadFile}>Upload</button>
    <button onClick={handleCreateNewReel}>Upload</button>
    <h1>Reels</h1>
    <div
      className="reels-container"
      style={{ overflowX: "hidden",gap:"5%" ,height:"100vh"}}

    >
      {reelVideoUrls.map((videoUrl, index) => (
        <Card
          key={index}
          className="reel"
          style={{ display: "block", height:"100%" }}
          onClick={() => handleReelClick(videoUrl)}
        >
          <Card.Body>
            <video src={videoUrl} controls width="100%" height="100%" />
          </Card.Body>
        </Card>
      ))}
    </div>
  </div>
  );
};

export default Reel;
