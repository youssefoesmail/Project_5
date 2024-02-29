import { configureStore } from "@reduxjs/toolkit";
import postReducer from "./post/postSlice";
import authReducer from "./auth/userSlice";
import personalReducer from "../redux/personalPage/personal";
import storyReducer from "./story/Story";
import reelsReducer from "./reels/reels";
import usersReducer from "./users/usersSlice";
import messageReducer from "./message/message";
import followersReducer from "./followers/followers";
export default configureStore({
  reducer: {
    posts: postReducer,
    auth: authReducer,
    personal: personalReducer,
    story: storyReducer,
    reels: reelsReducer,
    users: usersReducer,
    message: messageReducer,
    followers: followersReducer
  }
});
