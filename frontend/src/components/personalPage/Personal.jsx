import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import axios from "axios";
import { setPosts, setUserInfo } from "../redux/personalPage/personal";
import Posts from "../posts/Posts";
import { Avatar ,Card,Badge } from 'flowbite-react';
import Navbar from '../Navbars/NavbarLogin';
import { HiCheck, HiClock } from 'react-icons/hi';

const Personal = () => {
  const [user, setUser] = useState(null);
  const dispatch = useDispatch();
  const { auth, personal, post } = useSelector((state) => {
    return {
      auth: state.auth,
      post: state.personal.post,
      personal: state.personal.personal
    };
  });
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
      .catch((err) => {
        log;
      });
  };
  useEffect(() => {
    getPostByAuthor();
    personalPage();
    //console.log(post);
  }, []);
  console.log(personal);


  
  return (
    <div>
      <Navbar/>
      <main class="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
  <div class="text-center">
      <img src={personal.cover} alt="..." /> 
      <Avatar img={personal.photo} size="xl" />
      <h1 class="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">{personal.firstname} {personal.lastname}</h1>
      </div>
      </main>

      
      <div class="bg-white py-24 sm:py-32">
  <div class="mx-auto grid max-w-7xl gap-x-8 gap-y-20 px-6 lg:px-8 xl:grid-cols-3">
    <div class="max-w-2xl">
    <div className="relative isolate px-6 pt-14 lg:px-8">
    <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">Check all Posts that posted</h1>
        <p className="mt-6 text-lg leading-8 text-gray-600">Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat fugiat aliqua.</p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <a href="#" className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Get started</a>
          <a href="#" className="text-sm font-semibold leading-6 text-gray-900">Learn more <span aria-hidden="true">→</span></a>
        </div>
      </div>
      </div>
    </div>
    <ul role="list" class="grid gap-x-8 gap-y-12 sm:grid-cols-2 sm:gap-y-16 xl:col-span-2">
    {post.map((elem) => {
        return (
          <>
          <li>
          <div class="flex items-center gap-x-6">
            <Card className="max-w-sm" imgSrc={elem.video} horizontal>
      <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        {elem.body}
      </h5>
      <p className="font-normal text-gray-700 dark:text-gray-400">
      Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat fugiat aliqua.
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
          Announcing our next round of funding. <a href="#" className="font-semibold text-indigo-600"><span class="absolute inset-0" aria-hidden="true"></span>Read more <span aria-hidden="true">&rarr;</span></a>
        </div>

    </ul>
    


    


  </div>

</div>


    </div>
  );
};

export default Personal;
