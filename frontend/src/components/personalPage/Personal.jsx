import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  setPosts,
  setUserInfo,
  setCover,
  setPhoto
} from "../redux/personalPage/personal";
import Posts from "../posts/Posts";
import { Avatar, Card, Badge } from "flowbite-react";
import Navbar from "../Navbars/NavbarLogin";
import { HiCheck, HiClock } from "react-icons/hi";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  list
} from "firebase/storage";
import { storage } from "../firebase";
import { v4 } from "uuid";
import { setFollowers } from "../redux/followers/followers";
import { Button, Modal } from "flowbite-react";
import { setPool } from "../redux/search/Search";
import FooterDown from "../FooterDown/FooterDown";
import { useNavigate } from "react-router-dom";

const Personal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { auth, personal, post, followers, cover, photo,search,pool } = useSelector(
    (state) => {
      return {
        photo: state.personal.photo,
        followers: state.followers.followers,
        cover: state.personal.cover,
        auth: state.auth,
        post: state.personal.post,
        personal: state.personal.personal,
        search:state.search.search,
        pool:state.search.pool,
      };
    }
  );

  console.log(followers ,"folleors");
  console.log("post",post);
  const [first, setFirst] = useState(true)
  const [openModal, setOpenModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [onModal, setOnModal] = useState(false);
const [show, setShow] = useState(false)
  const [user, setUser] = useState(null);
  const [coverImageUpload, setCoverImageUpload] = useState(null);
  const [coverImageUrls, setCoverImageUrls] = useState([] || null);
  const coverImageListRef = ref(storage, "coverImages/");

  const [photoImageUpload, setPhotoImageUpload] = useState(null);
  const [photoImageUrls, setPhotoImageUrls] = useState([] || null);
  const photoImageListRef = ref(storage, "photoImages/");

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
  const getPostByAuthor = () => {
    axios
      .get(`http://localhost:5000/posts/authorPosts/${auth.userId}`)
      .then((result) => {
        dispatch(setPosts(result.data.result));
        console.log(result.data.result);
      })
      .catch((err) => {});
  };

  const getFollowers = () => {
    axios
      .get(`http://localhost:5000/followers`, {
        headers: {
          authorization: `Bearer ${auth.token}`
        }
      })
      .then((result) => {
        console.log("followers", result.data.result);
        dispatch(setFollowers(result.data.result));
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const createFollow= ()=>{
    axios.post(`http://localhost:5000/followers/${id}`, {
      headers: {
        authorization: `Bearer ${auth.token}`,
      }
    }).then((result) => {
      console.log(result);
      dispatch(updateCounter());
    })
    .catch((err) => {
      console.log(err);
    });
  }

  useEffect(() => {
    getFollowers();
    getPostByAuthor();
    personalPage();
    console.log("followers", followers);
  }, []);
  console.log(personal);

  const uploadFilePhoto = () => {
    if (photoImageUpload == null) return;
    const photoImageListRef = ref(
      storage,
      `photos/${photoImageUpload.name + v4()}`
    );
    uploadBytes(photoImageListRef, photoImageUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((urlPhoto) => {
        setPhotoImageUrls((prev) => [...prev, urlPhoto]);
        dispatch(setPhoto(urlPhoto));
        console.log(urlPhoto);
        setShow(true);
      });
    });
  };
  const uploadFileCover = () => {
    if (coverImageUpload == null) return;
    const coverImageRef = ref(storage, `cover/${coverImageUpload.name + v4()}`);
    uploadBytes(coverImageRef, coverImageUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((urlCover) => {
        setCoverImageUrls((prev) => [...prev, urlCover]);
        console.log(urlCover);
        dispatch(setCover(urlCover));
        setShow(true);
      });
    });
  };

  useEffect(() => {
    listAll(coverImageListRef).then((response) => {
      response.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
          setCoverImageUrls((prev) => [...prev, url]);
        });
      });
    });
    listAll(photoImageListRef).then((response) => {
      response.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
          setPhotoImageUrls((prev) => [...prev, url]);
        });
      });
    });
  }, []);


  return (
    <>
      <div>
        <Navbar />

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
                    setCoverImageUpload(e.target.files[0]);
                  }}
                  type="file"
                  class="block w-full px-3 py-2 mt-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg file:bg-gray-200 file:text-gray-700 file:text-sm file:px-4 file:py-1 file:border-none file:rounded-full dark:file:bg-gray-800 dark:file:text-gray-200 dark:text-gray-300 placeholder-gray-400/70 dark:placeholder-gray-500 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:focus:border-blue-300"
                />

                <button
                  onClick={() => {
                    uploadFileCover();
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
                    .put(
                      `http://localhost:5000/users/${auth.userId}`,
                      {
                        cover: coverImageUrls[coverImageUrls.length - 1]
                      },
                      {
                        headers: {
                          authorization: `Bearer ${auth.token}`
                        }
                      }
                    )
                    .then((result) => {
                      console.log("restult", result.data);
                      dispatch(setUserInfo(result.data.result));
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

        <Modal dismissible show={pool} onClose={() => setPool(false)}>
        <Modal.Header>Terms of Service</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            {search.map((user)=>{
              return <>
              <div class="flex items-center gap-x-2">
                            <img
                              class="object-cover w-16 h-16 rounded-full"
                              src={user.photo}
                              alt=""
                            />

                            <div>
                              <h1 class="text-xl font-semibold text-gray-700 capitalize dark:text-white">
                                {user.firstname} {user.lastname}{" "}
                              </h1>

                              <p class="text-base text-gray-500 dark:text-gray-400">
                                {user.email}
                              </p>
                            </div>
                          </div>
              </>
            })}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button color="gray" onClick={() => setPool(false)}>
            Back
          </Button>
        </Modal.Footer>
      </Modal>

        <main className="flex flex-col items-center justify-center w-full ">
          <div className="container px-6 py-16 mx-auto text-center">
            <div className="container ">
              <div class="flex justify-center mt-10">
                <img
                  class="object-cover w-full h-96 rounded-xl lg:w-4/5"
                  src={personal.cover || cover}
                />

                <button
                  onClick={() => setOpenModal(true)}
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




              <Modal show={showModal} onClose={() => setShowModal(false)}>
                <Modal.Header>Followers</Modal.Header>
                <Modal.Body>
                  <div className="space-y-6">
                    {followers.map((elem, i) => {
                      return (
                        <>
                          <div class="flex items-center gap-x-2">
                            <img
                              class="object-cover w-16 h-16 rounded-full"
                              src={elem.photo || photo}
                              alt=""
                            />

                            <div>
                              <h1 class="text-xl font-semibold text-gray-700 capitalize dark:text-white">
                                {elem.firstname} {elem.lastname}{" "}
                              </h1>

                              <p class="text-base text-gray-500 dark:text-gray-400">
                                {elem.email}
                              </p>
                            </div>
                          </div>
                        </>
                      );
                    })}
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <Button color="gray" onClick={() => setShowModal(false)}>
                    Decline
                  </Button>
                </Modal.Footer>
              </Modal>
            </div>
            <div class="w-56 -mt-10 overflow-hidden bg-white rounded-lg shadow-lg md:w-64 dark:bg-gray-800">
              <Avatar
                onClick={() => setOnModal(true)}
                img={personal.photo}
                size="xl"
              />

              <h3 class="py-2 font-bold tracking-wide text-center text-gray-800 uppercase dark:text-white">
                {personal.firstname} {personal.lastname}
              </h3>

              <a
                href="#"
                onClick={() => setShowModal(true)}
                class="mx-2 text-gray-600 transition-colors duration-300 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
                aria-label="Reddit"
              >
                <p class="text-center text-gray-500 dark:text-gray-400">
                  followers {followers.length}{" "}
                </p>
              </a>

              <Modal show={onModal} onClose={() => setOnModal(false)}>
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
                          setPhotoImageUpload(e.target.files[0]);
                        }}
                        type="file"
                        class="block w-full px-3 py-2 mt-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg file:bg-gray-200 file:text-gray-700 file:text-sm file:px-4 file:py-1 file:border-none file:rounded-full dark:file:bg-gray-800 dark:file:text-gray-200 dark:text-gray-300 placeholder-gray-400/70 dark:placeholder-gray-500 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:focus:border-blue-300"
                      />

                      <button
                        onClick={uploadFilePhoto()}
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
                          .put(
                            `http://localhost:5000/users/${auth.userId}`,
                            {
                              photo: photoImageUrls[photoImageUrls.length - 1]
                            },
                            {
                              headers: {
                                authorization: `Bearer ${auth.token}`
                              }
                            }
                          )
                          .then((result) => {
                            console.log("restult", result.data);
                            dispatch(setUserInfo(result.data.result));
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
            </div>
          </div>
        </main>

        <div className="bg-white py-24 sm:py-32">
          <div className="mx-auto grid max-w-7xl gap-x-8 gap-y-20 px-6 lg:px-8 xl:grid-cols-3">
            <div class="max-w-2xl">
              <div className="relative isolate px-6 pt-14 lg:px-8">
                <div className="text-center">
                  <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                    Check all Posts that posted
                  </h1>
                  <p className="mt-6 text-lg leading-8 text-gray-600">
                    Our NotNull team is so happy in reagrds to your posts on our special media space
                  </p>
                  <div className="mt-10 flex items-center justify-center gap-x-6">
                    <a
                      href="/post"
                      className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Get started
                    </a>
                    <a
                      href="/post"
                      className="text-sm font-semibold leading-6 text-gray-900"
                    >
                      Learn more <span aria-hidden="true">→</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <ul
              role="list"
              className="grid gap-x-8 gap-y-12 sm:grid-cols-2 sm:gap-y-16 xl:col-span-2"
            >
              {post.map((elem) => {
                return (
                  <>
                    <li>
                      <div className="flex items-center gap-x-6">
                        <Card
                          className="max-w-sm"
                          imgSrc={elem.video}
                          horizontal
                        >
                          <div className="flex flex-wrap gap-2">
                            <Badge icon={HiCheck}>{elem.created_at}</Badge>
                          </div>
                          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                            {elem.body}
                          </h5>
                          <img
                            class="object-cover justify-items-center object-center lg:mx-6 w-full h-96 rounded-lg lg:h-[36rem]"
                            alt=""
                            width="230px"
                            height="150px"
                            src={elem.pic}
                          />
                          
                        </Card>
                      </div>
                    </li>
                  </>
                );
              })}

              
            </ul>
            <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                post our next round of funding.{" "}
                <a href="#" className="font-semibold text-indigo-600">
                  <span class="absolute inset-0" aria-hidden="true"></span>Read
                  more <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
          </div>
        </div>
        <FooterDown/>
      </div>
    </>
  );
};

export default Personal;
