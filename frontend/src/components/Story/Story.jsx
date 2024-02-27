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
  list,
} from "firebase/storage";
import { setUserInfo } from "../redux/personalPage/personal";
import { storage } from "../firebase";
import { v4 } from "uuid";
import { Button, Modal,FileInput, Label } from 'flowbite-react';

const Story = () => {
  const [storyImageUpload, setStoryImageUpload] = useState(null);
  const [storyImageUrls, setStoryImageUrls] = useState([] || null);
  const storyImageListRef = ref(storage, "storyImages/");

  const [storyVideoUpload, setStoryVideoUpload] = useState(null);
  const [storyVideoUrls, setStoryVideoUrls] = useState([] || null);
  const storyVideoListRef = ref(storage, "storyVideos/");
  const [openModal, setOpenModal] = useState(false);

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
    if (storyImageUpload == null) return;
    const storyImageRef = ref(
      storage,
      `storys/${storyImageUpload.name + v4()}`
    );
    uploadBytes(storyImageRef, storyImageUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setStoryImageUrls((prev) => [...prev, url]);
        console.log(url);
      });
    });
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
  };

  useEffect(() => {
    listAll(storyImageListRef).then((response) => {
      response.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
          setStoryImageUrls((prev) => [...prev, url]);
        });
      });
    });
    listAll(storyVideoListRef).then((response) => {
      response.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
          setStoryVideoUrls((prev) => [...prev, url]);
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
  const handleCreateNewStory = () => {
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
    setOpenModal(false)
  };
console.log(storyImageUrls);
  return (
    <div>
      <div class="flex bg-white shadow-lg rounded-lg mx-4 md:mx-auto my-56 max-w-md md:max-w-2xl marginElement">
        <div class="flex items-start px-4 py-6">
          <div class="flex items-center justify-between"></div>
          <input
            type="file"
            class="block  mt-2 w-full placeholder-gray-400/70 dark:placeholder-gray-500 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
            onChange={(event) => {
              setStoryImageUpload(event.target.files[0]);
            }}
          />
          <input
            type="file"
            class="block  mt-2 w-full placeholder-gray-400/70 dark:placeholder-gray-500 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
            onChange={(event) => {
              setStoryVideoUpload(event.target.files[0]);
            }}
          />
        </div>
      </div>

      <button
         class="px-6 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-lg hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80"
         onClick={() => {
           handleCreateNewStory();
         }}
      >
        createNewStory
      </button>
      <button onClick={uploadFile}> Upload</button>
      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header></Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
          <div className="flex w-full items-center justify-center">
      <Label 
        htmlFor="dropzone-file"
        className="dark:hover:bg-bray-800 flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
      >
        <div className="flex flex-col items-center justify-center pb-6 pt-5">
       
          <svg 
            className="fill-current w-12 h-12 mb-3 text-blue-700" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
          >
            
            <path
              d="M19.479 10.092c-.212-3.951-3.473-7.092-7.479-7.092-4.005 0-7.267 3.141-7.479 7.092-2.57.463-4.521 2.706-4.521 5.408 0 3.037 2.463 5.5 5.5 5.5h13c3.037 0 5.5-2.463 5.5-5.5 0-2.702-1.951-4.945-4.521-5.408zm-7.479-1.092l4 4h-3v4h-2v-4h-3l4-4z"/>
          </svg>
          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
        </div>
        
        <FileInput id="dropzone-file" onChange={(event) => {setStoryImageUpload(event.target.files[0]);}}className="hidden" />
        </Label>
    </div>
          </div>
          <h1 class="pt-8 pb-3 font-semibold sm:text-lg text-gray-900">
              To Upload
            </h1>

            <ul id="gallery" className="flex flex-1 flex-wrap -m-1">
             { storyImageUrls.map((slide, index) => (<div>
              <li id="empty" className="h-full w-full text-center flex flex-col items-center justify-center items-center">

              <img className="mx-auto w-32" src={slide} alt="no data" />
              </li>
             </div>)
             )
            };
                
              
            </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button  onClick={uploadFile}>Upload</Button>
          <Button   onClick={() => {
           handleCreateNewStory();
         }}>I accept</Button>
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
                  src="https://i.ibb.co/yhh0Ljy/profile.jpg"
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
                      src={slide.photo}
                      alt="image"
                    />
                  </a>
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