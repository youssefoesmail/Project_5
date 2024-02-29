import { createSlice } from "@reduxjs/toolkit";
const reelsSlice = createSlice({
  name: "reels",
  initialState: {
    reels: [],
    comment: []
  },
  reducers: {
    setReel: (state, action) => {
      state.reels = action.payload;
    },
    createNewReels: (state, action) => {
      state.reels = [action.payload, ...state.reels];
    },

    setCommentReels: (state, action) => {
      state.reels = state.reels.map((elem, ind) => {
        if (elem.id === action.payload.id) {
          elem.comment = action.payload.comment;
        }
        return elem;
      });
    },
    createCommentReels: (state, action) => {
      state.comment = [action.payload, ...state.comment];
    }
  }
});
export const { createNewReels, setReel, setCommentReels, createCommentReels } =
  reelsSlice.actions;
export default reelsSlice.reducer;
