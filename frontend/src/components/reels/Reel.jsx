import React, { useRef, useState,useEffect } from 'react'
import "./VideoCard.css";
import VideoHeader from './VideoHeader';
import VideoFooter from './VideoFooter';
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setReel, createNewReels } from "../redux/reels/reels";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  list,
} from "firebase/storage";

import { Button } from "react-bootstrap";
import axios from "axios";
import { setReel, createNewReels } from "../redux/reels/reels";
import { ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";

import { storage } from "../firebase";
import { v4 } from "uuid";
import {  Button,Modal } from "flowbite-react";

const Reel = () => {
  const [reelVideoUpload, setReelVideoUpload] = useState(null);
  const [reelVideoUrls, setReelVideoUrls] = useState([]);
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const reelVideoListRef = ref(storage, "ReelVideos/");
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef(null);
  const [onModal, setOnModal] = useState(false);
  const [reel, setReels] = useState([]);
  const [show, setShow] = useState(false);


  const { auth, reels } = useSelector((state) => ({
    auth: state.auth,
    reels: state.reels.reels
  }));


  const dispatch = useDispatch();
  const onVideoPress = () =>{
    if (isVideoPlaying){
        //stop
        videoRef.current.pause()
        setIsVideoPlaying(false)
    }else{
        //play
        videoRef.current.play()
        setIsVideoPlaying(true)
    }
}
  const getAllReels = () => {
    axios
      .get(`http://localhost:5000/reel`, {
        headers: {
          authorization: `Bearer ${auth.token}`,
        },
      })
      .then((result) => {
        dispatch(setReel(result.data.result));
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
        setShow(true);
      });
    });
  };

  const handleCreateNewReel = () => {
    axios
      .post(
        `http://localhost:5000/reel`,
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
        dispatch(createNewReels(result.data.result));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    listAll(reelVideoListRef).then((response) => {
      const uniqueUrls = new Set();
      response.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
          uniqueUrls.add(url);
        });
      });
      setReelVideoUrls(Array.from(uniqueUrls));
    });
  }, []);

  useEffect(() => {
    getAllReels();
  }, []);
 
  
 console.log(reels);
    return (
      <div>
            <Button onClick={() => setOnModal(true)}>Toggle modal</Button>
            <Modal show={onModal} onClose={() => setOnModal(false)}>
          <Modal.Header>Terms of Service</Modal.Header>
          <Modal.Body>
            <div className="space-y-6">
              <div className="flex space-y-6">
                <label
                  for="image"
                  className=" block text-sm text-gray-500 dark:text-gray-300"
                >
                  Video
                </label>

                <input
                  onChange={(e) => {
                    setReelVideoUpload(e.target.files[0]);
                  }}
                  type="file" 
                  class="block w-full px-3 py-2 mt-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg file:bg-gray-200 file:text-gray-700 file:text-sm file:px-4 file:py-1 file:border-none file:rounded-full dark:file:bg-gray-800 dark:file:text-gray-200 dark:text-gray-300 placeholder-gray-400/70 dark:placeholder-gray-500 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:focus:border-blue-300"
                />
                 
                <button
                  onClick={() => {
                    uploadFile();
                  }}
                  className="px-4 py-2 font-medium text-gray-600 transition-colors duration-200 sm:px-6 dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-100"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="w-5 h-5 sm:w-6 sm:h-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            {show && (
              <Button
                onClick={() => {
                  axios
                    .post(
                      `http://localhost:5000/reel`,
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
                      console.log("restult", result.data);
                      dispatch(createNewReels(result.data.result));
                    })
                    .catch((err) => {
                      console.log(err);
                    });


                    setOnModal(false);
                }}
              >
                I accept
              </Button>
            )}
            <Button color="gray" onClick={() => setOnModal(false)}>
              Decline
            </Button>
          </Modal.Footer>
        
      </Modal>
        <div className='videoCard'>
           
             <div className="app">
       <h1>Reels</h1>
      </div>
      {/* image at the top logo     */}
      {/* Reels Text */}

      <div className="app__videos">
      {/* Container of app__videos(scrollable content) */}
      {reelVideoUrls.map((slide, index) => (
       <div className='videoCard'>
       <VideoHeader/>
       <video
        ref = {videoRef}
        onClick={onVideoPress}
        className ="videoCard__player"
        src={slide}
        alt="IG reel video" 
        loop
        controls
        />
        <VideoHeader
        />
        <VideoFooter
       
        />

    </div>
      ))}
      </div>    

  const handleNextReel = () => {
    setCurrentReelIndex((prevIndex) => (prevIndex + 1) % reelVideoUrls.length);
  };

  return (
    <div>
      <Button variant="info" onClick={handleNextReel}>
        Next Reel
      </Button>
      <h1>Reels</h1>
      {reels.length > 0 ? (
        <Reels
          videos={reels}
          currentIndex={currentReelIndex}
          onFullscreen={() => setIsFullScreen(true)}
        />
      ) : (
        <p>Loading...</p>
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
        Create Reel
      </Button>
    </div>
        </div>
    )
}

export default Reel;