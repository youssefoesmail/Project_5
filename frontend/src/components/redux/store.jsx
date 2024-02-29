import { configureStore } from "@reduxjs/toolkit";
import postReducer from "./post/postSlice";
import authReducer from "./auth/userSlice";
import personalReducer from "../redux/personalPage/personal";
import storyReducer from "./story/Story";
import reelsReducer from "./reels/reels";
import usersReducer from "./users/usersSlice";
import messageReducer from "./message/message";
import followersReducer from "./followers/followers";
import searchReducer from "./search/Search";
import userReducer from "./homepage/users";
export default configureStore({
  reducer: {
    posts: postReducer,
    auth: authReducer,
    personal: personalReducer,
    story: storyReducer,
    reels: reelsReducer,
    users: usersReducer,
    message: messageReducer,
    followers: followersReducer,
    search: searchReducer,
    user: userReducer
  }
});
