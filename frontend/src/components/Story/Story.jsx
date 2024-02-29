import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import "./index.css";
import axios from "axios";
import { setStory, createNewStory } from "../redux/story/Story";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
} from "firebase/storage";
import { setUserInfo } from "../redux/personalPage/personal";
import { storage } from "../firebase";
import { v4 } from "uuid";
import { Button, Modal, } from 'flowbite-react';
const Story = () => {
  const [storyUpload, setStoryUpload] = useState(null);
  const [storyUrls, setStoryUrls] = useState([] || null);
  const storyListRef = ref(storage, "storyImages/");
  const [show, setShow] = useState(false);
  const [storyVideoUpload, setStoryVideoUpload] = useState(null);
  const [storyVideoUrls, setStoryVideoUrls] = useState([] || null);
  const storyVideoListRef = ref(storage, "storyVideos/");
  const [openModal, setOpenModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [show2, setShow2] = useState("");

  const { story, auth, personal } = useSelector((state) => {
    return {
      personal: state.personal.personal,
      story: state.story.story,
      auth: state.auth,
    };
  });
  const dispatch = useDispatch();
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
    console.log(storyUpload.type);
    if (storyUpload !== null) {
      if (storyUpload.type=="image/jpeg"||"image/png") {
        const storyRef = ref(
          storage,
          `ImageStorys/${storyUpload.name + v4()}`
        );
        uploadBytes(storyRef, storyUpload).then((snapshot) => {
          getDownloadURL(snapshot.ref).then((url) => {
            setStoryUrls((prev) => [...prev, url]);
            console.log(url);
            setShow(true);
          });
        });
      }
      else{
        if (storyUpload !== null){
          if (storyUpload.type=="video/webm"||"video/mp4") {
          const storyRef = ref(
            storage,
            `VideoStorys/${storyUpload.name + v4()}`
          );
          uploadBytes(storyRef, storyUpload).then((snapshot) => {
            getDownloadURL(snapshot.ref).then((url) => {
              setStoryUrls((prev) => [...prev, url]);
              console.log(url);
              setShow(true);
            });
          });
      }
        }
  }
   
  }

  };

  useEffect(() => {
    listAll(storyListRef).then((response) => {
      response.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
          setStoryUrls((prev) => [...prev, url]);
        });
      });
    });
  }, []);
  const personalPage = () => {
    axios
      .get(`http://localhost:5000/users/${auth.userId}`)
      .then((result) => {
        dispatch(setUserInfo(result.data.result[0]));
        console.log(result.data.result[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    personalPage();
    getAllStory();
    
  }, []);
  const function1= (show2) => {
    console.log(show2);
    if (show2.includes("ImageStorys")) {
      console.log("true");
      return true
    }
    console.log("false");
    return false
  }
  
  return (
    <div>
     
     <Modal show={openModal} onClose={() => setOpenModal(false)}>
          <Modal.Header>Terms of Service</Modal.Header>
          <Modal.Body>
            <div className="space-y-6">
              <div className="flex space-y-6">
                <label
                  for="image"
                  className=" block text-sm text-gray-500 dark:text-gray-300"
                >
                  Image
                </label>

                <input
                  onChange={(e) => {
                    setStoryUpload(e.target.files[0]);
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
                      `http://localhost:5000/story`,
                      {
                        video: storyUrls[storyUrls.length - 1]
                      },
                      {
                        headers: {
                          authorization: `Bearer ${auth.token}`
                        }
                      }
                    )
                    .then((result) => {
                      console.log("restult", result.data);
                      dispatch(createNewStory(result.data.result));
                    })
                    .catch((err) => {
                      console.log(err);
                    });

                  setOpenModal(false);
                }}
              >
                I accept
              </Button>
            )}
            <Button color="gray" onClick={() => setOpenModal(false)}>
              Decline
            </Button>
          </Modal.Footer>
        </Modal>
      
      <section className=" md:flex flex-col items-center justify-center">
        <ul className="md:flex items-center justify-center md:space-x-8">
          <li className="flex flex-col items-center space-y-2">
            <div className="bg-gradient-to-tr from-yellow-500 to-pink-600 rounded-full p-1 relative">
              <a onClick={() => setOpenModal(true)}
                className="block bg-white p-1 rounded-full transform transition hover:-rotate-12 duration-300"
                href="#"
              >
                <img
                  className="h-24 w-24 rounded-full"
                  src={personal.photo}
                  alt="image"
                />
              </a>
              <button className="transition duration-500 absolute bottom-0 right-0 bg-blue-700 h-8 w-8 rounded-full text-white text-2xl font-semibold border-4 border-white flex justify-center items-center hover:bg-blue-900">
                +
              </button>
            </div>
            <p>{personal.firstname}</p>
          </li>
          {story.map((slide, index) => (
            <div>
              <li class="flex flex-col items-center space-y-2">
                <div class="bg-gradient-to-tr from-yellow-500 to-pink-600 rounded-full p-1">
                  <a
                    class="block bg-white p-1 rounded-full transform transition hover:-rotate-12 duration-300"
                    href="#"
                  >
                    
                    <img
                      class="h-24 w-24 rounded-full"
                      src={slide.video}
                      alt="image"
                      onClick={() => {setShow2(slide.video), setShowModal(true)}}
                    />
                    
                  </a>
                  <Modal show={showModal} onClose={() => setShowModal(false)}>
        <Modal.Body>
          <div className="space-y-6">
            
          <img 
                  class="object-cover w-full h-96 rounded-xl lg:w-4/5"
                  src={show2}
                  
                />
            
          </div>
        </Modal.Body>
        <Modal.Footer>
       
          
          <Button color="gray" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
                </div>
                <p>{slide.firstname}</p>
              </li>
            </div>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default Story;