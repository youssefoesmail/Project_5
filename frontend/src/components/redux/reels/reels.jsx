import { createSlice } from "@reduxjs/toolkit";
const reelSlice = createSlice({
  name: "reels",
  initialState: {
    reels: []
  },
  reducers: {
    createNewReels: (state, action) => {
      state.reels = [action.payload, ...state.reels];
    },
    setReel: (state, action) => {
      state.reels = action.payload;
    }
  }
});
export const { createNewReels, setReel } = reelSlice.actions;
export default reelSlice.reducer;
