import { createSlice } from "@reduxjs/toolkit";
const postSlice = createSlice({
  name: "posts",
  initialState: {
    posts: [],
    comment: []
  },
  reducers: {
    setPosts: (state, action) => {
      state.posts = action.payload;
    },
    createNewPost: (state, action) => {
      state.posts = [action.payload, ...state.posts];
    },
    updatePostById: (state, action) => {
      state.posts = state.posts.map((elem, ind) => {
        if (elem.id === action.payload.id) {
          return { ...elem, ...action.payload };
        }
        return elem;
      });
    },
    deletePost: (state, action) => {
      state.posts = state.posts.filter((elem) => elem.id !== action.payload.id);
    },
    setComments: (state, action) => {
      state.comment = action.payload;
    }
  }
});
export const {
  setPosts,
  createNewPost,
  updatePostById,
  deletePost,
  setComments
} = postSlice.actions;
export default postSlice.reducer;
