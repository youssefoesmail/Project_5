import { createSlice } from "@reduxjs/toolkit";
const postSlice = createSlice({
  name: "posts",
  initialState: {
    posts: [],
    comment: [],
    like: 0,
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
      state.posts = state.posts.map((id, index) => {
        if (id.id === action.payload.id) {
          id.comment = action.payload.comment;
        }
        return id;
      });
    },

    addComments: (state, action) => {
      state.posts = state.posts.map((id, index) => {
        if (id.id === action.payload.id) {
          id.comment.push(action.payload.comment);
        }
        return id;
      });
    },
  },

  updateLike: ()=>{
    state.like++
  },

  deleteLike:()=>{
    state.like--
    if(state.like<0){
      return state.like=0
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
  updateLike,
  deleteLike,
} = postSlice.actions;
export default postSlice.reducer;
