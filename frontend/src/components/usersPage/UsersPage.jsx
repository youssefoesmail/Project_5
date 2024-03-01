import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setPost, setUsers } from "../redux/users/usersSlice";
import Navbar from "../Navbars/NavbarLogin";
import { Avatar, Card, Badge,Button, Modal } from "flowbite-react";
import {
  createNewFollowed,
  deleteFollowers,
  setAmount,
  setFollowers,
  updateCounter
} from "../redux/followers/followers";
import { HiCheck, HiClock } from "react-icons/hi";
import { IoPersonAddSharp, IoPersonOutline } from "react-icons/io5";


const UsersPage = () => {
  const { posts, users, auth, followers, counter,amount ,search} = useSelector((state) => {
    return {
      followers: state.followers.followers,
      auth: state.auth,
      users: state.users.users,
      posts: state.users.postUser,
      users: state.users.users,
      counter: state.followers.counter,
      amount:state.followers.amount,
      search:state.search.search
    };
  });




  console.log(search);
  const dispatch = useDispatch();
  const { id } = useParams();

  const createFollow = () => {
    axios
      .post(`http://localhost:5000/followers/${id}`, null, {
        headers: {
          authorization: `Bearer ${auth.token}`
        }
      })
      .then((result) => {
        console.log(result.data);
        dispatch(createNewFollowed(result.data.result));
        dispatch(updateCounter());
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const removeFollow = () => {
    axios
      .delete(`http://localhost:5000/followers/${id}`, {
        headers: {
          authorization: `Bearer ${auth.token}`
        }
      })
      .then((result) => {
        dispatch(deleteFollowers(id));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    axios
      .get(`http://localhost:5000/followers`, {
        headers: {
          authorization: `Bearer ${auth.token}`
        }
      })
      .then((result) => {
        console.log("followers", result.data.result);
        dispatch(setFollowers(result.data.result));
        dispatch(setAmount(followers.length));
      })
      .catch((err) => {
        console.log(err);
      });
      
    axios
      .get(`http://localhost:5000/posts/followers/${id}`, {
        headers: {
          authorization: `Bearer ${auth.token}`
        }
      })
      .then((result) => {
        console.log("result", result);
        dispatch(setPost(result.data.result));
      })
      .catch((err) => {});

    axios
      .get(`http://localhost:5000/users/${id}`)
      .then((result) => {
        dispatch(setUsers(result.data.result[0]));
        console.log(result.data.result[0]);
      })
      .catch((err) => {
        console.log(err);
      });
    axios
      .get(`http://localhost:5000/users/${id}`)
      .then((result) => {
        console.log(result.data.result[0]);
        dispatch(setUsers(result.data.result[0]));
      })
      .catch((err) => {});
  }, []);
  console.log(auth.token);

  console.log("posts", posts);
  console.log("length",followers.length);


  return (
    <>
      <div>
        <Navbar />

        <main className="flex flex-col items-center justify-center w-full ">
          <div className="container px-6 py-16 mx-auto text-center">
            <div className="container ">
              <div class="flex justify-center mt-10">
                <img
                  class="object-cover w-full h-96 rounded-xl lg:w-4/5"
                  src={users.cover}
                />

                <button className="px-4 py-2 font-medium text-gray-600 transition-colors duration-200 sm:px-6 dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-100">
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
            <div class="w-56 -mt-10 overflow-hidden bg-white rounded-lg shadow-lg md:w-64 dark:bg-gray-800">
              <Avatar img={users.photo} size="xl" />

              <h3 class="py-2 font-bold tracking-wide text-center text-gray-800 uppercase dark:text-white">
                {users.firstname} {users.lastname}
              </h3>

              {counter ? (
                <div
                  onClick={() => {
                    createFollow();
                  }}
                  className="flex px-4 py-4 font-medium text-gray-600 transition-colors duration-200 sm:px-6 dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-100"
                >
                  <h3 className="mx-4 text-center">Follow</h3>
                  <IoPersonAddSharp />
                </div>
              ) : (
                <div
                  onClick={() => {
                    removeFollow();
                  }}
                  className="flex px-4 py-4 font-medium text-gray-600 transition-colors duration-200 sm:px-6 dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-100"
                >
                  <h3 className="mx-4 text-center">UnFollow</h3>
                  <IoPersonOutline />
                </div>
              )}

              <a
                href="#"
                class="mx-2 text-gray-600 transition-colors duration-300 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
                aria-label="Reddit"
              >
                <p class="text-center text-gray-500 dark:text-gray-400">
                  followers {followers.length}{" "}
                </p>
              </a>
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
                    Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure
                    qui lorem cupidatat commodo. Elit sunt amet fugiat veniam
                    occaecat fugiat aliqua.
                  </p>
                  <div className="mt-10 flex items-center justify-center gap-x-6">
                    <a
                      href="#"
                      className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Get started
                    </a>
                    <a
                      href="#"
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


              {posts?.map((elem) => {
                return (
                  <>
                    <li>
                      <div className="flex items-center gap-x-6">
                        <Card
                          className="max-w-sm"
                          imgSrc={elem.video}
                          horizontal
                        >
                          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                            {elem.body}
                          </h5>
                          <p className="font-normal text-gray-700 dark:text-gray-400">
                            Anim aute id magna aliqua ad ad non deserunt sunt.
                            Qui irure qui lorem cupidatat commodo. Elit sunt
                            amet fugiat veniam occaecat fugiat aliqua.
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <Badge icon={HiCheck}>{elem.created_at}</Badge>
                          </div>
                        </Card>
                      </div>
                    </li>
                  </>
                );
              })}

              <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                Announcing our next round of funding.{" "}
                <a href="#" className="font-semibold text-indigo-600">
                  <span class="absolute inset-0" aria-hidden="true"></span>Read
                  more <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default UsersPage;
