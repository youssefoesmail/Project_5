import { createSlice } from "@reduxjs/toolkit";
const postSlice = createSlice({
  name: "posts",
  initialState: {
    posts: []
  },
  reducers: {
    setPosts: (state, action) => {
      state.posts = action.payload;
    },
    createNewPost: (state, action) => {
      state.posts.unshift(action.payload);
    },
    updatePostById: (state, action) => {
      state.posts = state.posts.map((elem, ind) => {
        if (elem.id === action.payload.id) {
          return { ...elem, ...action.payload };
        }
        return elem;
      });
    }
  }
});
export const { setPosts, createNewPost, updatePostById } = postSlice.actions;
export default postSlice.reducer;
