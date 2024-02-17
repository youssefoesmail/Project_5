// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyADcIV0MXQgrY4MdQi3F84BAa5p4sYron8",
  authDomain: "project-5-f5f85.firebaseapp.com",
  projectId: "project-5-f5f85",
  storageBucket: "project-5-f5f85.appspot.com",
  messagingSenderId: "296701965090",
  appId: "1:296701965090:web:d325df5a54280a92396b7b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);