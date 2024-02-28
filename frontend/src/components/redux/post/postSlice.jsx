import { createSlice } from "@reduxjs/toolkit";
const postSlice = createSlice({
  name: "posts",
  initialState: {
    posts: [],
    like: []
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
          console.log(action.payload);
          return { ...elem, ...action.payload };
        }
        return elem;
      });
    },
    deletePost: (state, action) => {
      state.posts = state.posts.filter(
        (id, index) => id.id !== action.payload
      )
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
    updateComments: (state, action) => {
      state.posts = state.posts.map((post, index) => {
        if (post.id === action.payload.pID) {
          post.comment.map((com, index) => {
            if (com.id === action.payload.id) {
              com.comment = action.payload.comment.comment
            }
            return com
          })
        }
        return post
      })
    },
    deleteComments: (state, action) => {
      console.log(action.payload);
      state.posts = state.posts.map((post, index) => {
        if (post.id === action.payload.pID) {
          post.comment = post.comment.filter((comment) => {
            return comment.id !== action.payload.id
          });
        }

        return post
      })
      console.log(state.posts)
    },
    setLikes: (state, action) => {
      state.like = action.payload;
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
  updateComments,
  deleteComments,
  setLikes
} = postSlice.actions;
export default postSlice.reducer;
