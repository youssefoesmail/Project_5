import { configureStore } from "@reduxjs/toolkit";
import postReducer from "./post/postSlice";
import authReducer from "./auth/userSlice"

export default configureStore({
  reducer: {
    posts: postReducer,
    auth: authReducer,
  }
});
