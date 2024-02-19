import { createSlice } from "@reduxjs/toolkit";
const reelSlice = createSlice({
  name: "reels",
  initialState: {
    reels: [],
    comment: []
  },
  reducers: {
    createNewReels: (state, action) => {
      state.reels = [action.payload, ...state.reels];
    },
    setReel: (state, action) => {
      state.reels = action.payload;
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
export const { createNewReels, setReel } = reelSlice.actions;
export default reelSlice.reducer;
