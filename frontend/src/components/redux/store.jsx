import { configureStore } from "@reduxjs/toolkit";
import postReducer from "./post/postSlice";
export default configureStore({
  reducer: {
    posts: postReducer
  }
});
