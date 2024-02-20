import { createSlice } from "@reduxjs/toolkit";
const postSlice = createSlice({
  name: "posts",
  initialState: {
    posts: [],
    comment: null
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
      state.comment = action.payload
    },
    addComments: (state, action) => {
      state.comment = state.comment.map((id, index) => {
        if (id.id === action.payload.id) {
          id.comment.push(action.payload.comment);
        }
      return id.comment;
      })
    },
    updateComments: (state, action) => {
      state.comment = state.comment.map((id, index) => {
        if (id.id === action.payload.id) {
          return { ...id, ...action.payload.comment }
        }
        return id
      })
    }
  }
});
export const {
  setPosts,
  createNewPost,
  updatePostById,
  deletePost,
  setComments,
  addComments,
  updateComments
} = postSlice.actions;
export default postSlice.reducer;
