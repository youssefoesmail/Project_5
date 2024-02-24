import { configureStore } from "@reduxjs/toolkit";
import postReducer from "./post/postSlice";
import authReducer from "./auth/userSlice";
import personalReducer from "../redux/personalPage/personal";
import storyReducer from "./story/Story";
import reelReducer from "./reels/reels";
import usersReducer from "./users/usersSlice";
import messageReducer from "./message/message";
export default configureStore({
  reducer: {
    posts: postReducer,
    auth: authReducer,
    personal: personalReducer,
    story: storyReducer,
    reels: reelReducer,
    users: usersReducer,
    message: messageReducer
  }
});
