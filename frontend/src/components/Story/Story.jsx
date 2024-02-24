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
  const [currentSlide, setCurrentSlide] = useState(0);

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
  const goToNextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % story.length);
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + story.length) % story.length);
  };
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
      <Card className="card-slider">
      <Card.Body>
        <div className="slider">
          <div className="slides" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
            {story.map((slide, index) => (
              <Card key={index} className="slide">
                <Card.Img variant="top" src={slide.photo} />
              </Card>
            ))}
          </div>
        </div>
        <div className="controls">
          <Button variant="outline-primary" onClick={goToPrevSlide}>Previous</Button>
          <Button variant="outline-primary" onClick={goToNextSlide}>Next</Button>
        </div>
      </Card.Body>
    </Card>
  
      
    </div>
  );
};

export default Story;