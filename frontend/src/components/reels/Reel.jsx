import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "react-bootstrap";
import axios from "axios";
import { setReel, createNewReels } from "../redux/reels/reels";
import { ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import { storage } from "../firebase";
import { v4 } from "uuid";
import { Reels } from "@sayings/react-reels";

const reelsPage = () => {
  const [reelVideoUpload, setReelVideoUpload] = useState(null);
  const [reelVideoUrls, setReelVideoUrls] = useState([]);
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const reelVideoListRef = ref(storage, "ReelVideos/");

  const { auth, reels } = useSelector((state) => ({
    auth: state.auth,
    reels: state.reels
  }));
  console.log(reels);
  const dispatch = useDispatch();

  const getAllReels = () => {
    axios
      .get(`http://localhost:5000/reels`, {
        headers: {
          authorization: `Bearer ${auth.token}`
        }
      })
      .then((result) => {
        console.log(result.data.reels);
        dispatch(setReel(result.data.reels));
      })
      .catch((err) => {
        console.log(err);
      });
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
          video: reelVideoUrls[reelVideoUrls.length - 1]
        },
        {
          headers: {
            authorization: `Bearer ${auth.token}`
          }
        }
      )
      .then((result) => {
        dispatch(createNewReels(result.data.reels));
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  useEffect(() => {
    listAll(reelVideoListRef).then((response) => {
      const uniqueUrls = new Set();
      response.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
          console.log(url);
          uniqueUrls.add(url);
        });
      });
      setReelVideoUrls(Array.from(uniqueUrls));
    });
  }, []);

  useEffect(() => {
    getAllReels();
  }, []);

  const handleNextReel = () => {
    setCurrentReelIndex((prevIndex) => (prevIndex + 1) % reelVideoUrls.length);
  };

  return (
    <div>
      <Button variant="info" onClick={handleNextReel}>
        Next reels
      </Button>
      <h1>Reels</h1>
      {reels && reels.length > 0 ? (
        <>
          {reels.reels.map((elem, index) => (
            <Reels
              key={elem.id || index} // Ensure each Reels component has a unique key
              videos={elem} // Verify that this structure matches what @sayings/react-reels expects
              currentIndex={currentReelIndex}
              onFullscreen={() => setIsFullScreen(true)}
            />
          ))}
        </>
      ) : (
        <p>No reels available</p>
      )}
      <input
        type="file"
        onChange={(event) => {
          setReelVideoUpload(event.target.files[0]);
        }}
      />
      <Button variant="primary" onClick={uploadFile}>
        Upload Video
      </Button>
      <Button variant="success" onClick={handleCreateNewReel}>
        Create reels
      </Button>
    </div>
  );
};

export default reelsPage;
