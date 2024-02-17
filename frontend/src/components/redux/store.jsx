import { configureStore } from "@reduxjs/toolkit";
import postReducer from "./post/postSlice";
import authReducer from "./auth/userSlice";
import personalReducer from "../redux/personalPage/personal";
export default configureStore({
  reducer: {
    posts: postReducer,
    auth: authReducer,
    personal: personalReducer
  }
});
