import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import axios from "axios";
import { setPosts, setUserInfo } from "../redux/personalPage/personal";
import Posts from "../posts/Posts";
import { Avatar ,Card,Badge } from 'flowbite-react';
import Navbar from '../Navbars/NavbarLogin';
import { HiCheck, HiClock } from 'react-icons/hi';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  list,
} from "firebase/storage";
import { storage } from "../firebase";
import { v4 } from "uuid";

const Personal = () => {
  const [show, setShow] = useState(false)
  const [user, setUser] = useState(null);
  const [coverImageUpload, setcoverImageUpload] = useState(null);
  const [coverImageUrls, setcoverImageUrls] = useState([] || null);
  const coverImageListRef = ref(storage, "coverImages/");

  const [photoImageUpload, setphotoImageUpload] = useState(null);
  const [photoImageUrls, setphotoImageUrls] = useState([] || null);
  const photoImageListRef = ref(storage, "photoImages/");

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

  const uploadFile = () => {
   
    if (coverImageUpload == null) return;
    const coverImageRef = ref(
      storage,
      `covers/${coverImageUpload.name + v4()}`
    );
    uploadBytes(coverImageRef, coverImageUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setcoverImageUrls((prev) => [...prev, url]);
        console.log(url);
      });
    });
    if (photoImageUpload == null) return;
    const photoImageListRef = ref(
      storage,
      `photos/${photoImageUpload.name + v4()}`
    );
    uploadBytes(photoImageListRef, photoImageUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setphotoImageUrls((prev) => [...prev, url]);
      });
    });
  };

  useEffect(() => {
   
    listAll(coverImageListRef).then((response) => {
      response.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
          setcoverImageUrls((prev) => [...prev, url]);
          
        });
      });
    });
    listAll(photoImageListRef).then((response) => {
      response.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
          setphotoImageUrls((prev) => [...prev, url]);
        });
      });
    });
  }, []);


  
  return (
    <>
    <div>
      <Navbar/>



      






      
      <main className="flex flex-col items-center justify-center w-full ">
      <div className="container px-6 py-16 mx-auto text-center">
  <div className="container ">
  <div class="flex justify-center mt-10">
            <img class="object-cover w-full h-96 rounded-xl lg:w-4/5" src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1632&q=80" />
        </div>

            
    
{ show&&
    <div x-data="{ isOpen: false }" class="relative flex justify-center">
    
    <button onClick="isOpen = false" class="px-4 py-2 font-medium text-gray-600 transition-colors duration-200 sm:px-6 dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-100">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 sm:w-6 sm:h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
        </svg>
    </button>

    <div x-show="isOpen" 
        x-transition:enter="transition duration-300 ease-out"
        x-transition:enter-start="translate-y-4 opacity-0 sm:translate-y-0 sm:scale-95"
        x-transition:enter-end="translate-y-0 opacity-100 sm:scale-100"
        x-transition:leave="transition duration-150 ease-in"
        x-transition:leave-start="translate-y-0 opacity-100 sm:scale-100"
        x-transition:leave-end="translate-y-4 opacity-0 sm:translate-y-0 sm:scale-95"
        class="fixed inset-0 z-10 overflow-y-auto" 
        aria-labelledby="modal-title" role="dialog" aria-modal="true"
    >
        <div class="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div class="relative inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl rtl:text-right dark:bg-gray-900 sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
                <div>
                    <div class="flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                        </svg>
                    </div>

                    <div class="mt-2 text-center">
                        <h3 class="text-lg font-medium leading-6 text-gray-800 capitalize dark:text-white" id="modal-title">Archive Project</h3>
                        <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            Lorem, ipsum dolor sit amet consectetur
                            adipisicing elit. Aspernatur dolorum aliquam ea, ratione deleniti porro officia? Explicabo
                            maiores suscipit.
                        </p>
                    </div>
                </div>

                <div class="mt-5 sm:flex sm:items-center sm:justify-between">
                    <a href="#" class="text-sm text-blue-500 hover:underline">Learn more</a>

                    <div class="sm:flex sm:items-center ">
                        <button onClick="isOpen = false" class="w-full px-4 py-2 mt-2 text-sm font-medium tracking-wide text-gray-700 capitalize transition-colors duration-300 transform border border-gray-200 rounded-md sm:mt-0 sm:w-auto sm:mx-2 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800 hover:bg-gray-100 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-40">
                            Cancel
                        </button>

                        <button class="w-full px-4 py-2 mt-2 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-md sm:w-auto sm:mt-0 hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40">
                            Archive
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
}
    
    
   



        </div>
        <div class="w-56 -mt-10 overflow-hidden bg-white rounded-lg shadow-lg md:w-64 dark:bg-gray-800">
      <Avatar img={personal.photo} size="xl" />
      
        <h3 class="py-2 font-bold tracking-wide text-center text-gray-800 uppercase dark:text-white">{personal.firstname} {personal.lastname}</h3>
      </div>
      </div>
      </main>

      
      <div className="bg-white py-24 sm:py-32">
  <div className="mx-auto grid max-w-7xl gap-x-8 gap-y-20 px-6 lg:px-8 xl:grid-cols-3">
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
    <ul role="list" className="grid gap-x-8 gap-y-12 sm:grid-cols-2 sm:gap-y-16 xl:col-span-2">
    {post.map((elem) => {
        return (
          <>
          <li>
          <div className="flex items-center gap-x-6">
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
    </>
  );
};

export default Personal;
