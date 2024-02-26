import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import "./index.css";
import { Card, Button } from "react-bootstrap"; 
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
 
  useEffect(() => {
    getAllStory();
  }, []);

   useEffect(() => {
    console.log("Slideshow component mounted");
    const interval = setInterval(() => {
      console.log("Changing slide...");
      setCurrentSlide((prevSlide) => (prevSlide + 1) % story.length);
    },5000); // Change slides every 5 seconds

    return () => {
      console.log("Slideshow component unmounted");
      clearInterval(interval);
    };
  }, [story]); 
  console.log(story);
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
      
      
<section className=" md:flex flex-col items-center justify-center">
        <div className="pt-10 pb-10">
        </div>
        <ul className="md:flex items-center justify-center md:space-x-8">
        <li className="flex flex-col items-center space-y-2">
                <div className="bg-gradient-to-tr from-yellow-500 to-pink-600 rounded-full p-1 relative">
                    <a className="block bg-white p-1 rounded-full transform transition hover:-rotate-12 duration-300" href="#">
                        <img className="h-24 w-24 rounded-full" src="https://i.ibb.co/yhh0Ljy/profile.jpg" alt="image"/>
                    </a>
                    <button className="transition duration-500 absolute bottom-0 right-0 bg-blue-700 h-8 w-8 rounded-full text-white text-2xl font-semibold border-4 border-white flex justify-center items-center hover:bg-blue-900">+</button>
                </div>
                <p>you</p>
            </li>
        {story.map((slide, index) => (
        <div>
               <li class="flex flex-col items-center space-y-2">
                <div class="bg-gradient-to-tr from-yellow-500 to-pink-600 rounded-full p-1">
                    <a class="block bg-white p-1 rounded-full transform transition hover:-rotate-12 duration-300" href="#">
                        <img class="h-24 w-24 rounded-full" src={slide.photo} alt="image"/>
                    </a>
                </div>
                <p>tahmina_tis_353</p>
            </li>
            </div>
              ))}
               </ul>
    </section>
    </div>
  );
};
   
  


export default Story;