import { createSlice } from "@reduxjs/toolkit";
const reelSlice = createSlice({
  name: "reel",
  initialState: {
    reel: []
  },
  reducers: {
    createNewReels: (state, action) => {
      state.reel = [action.payload, ...state.reel];
    },
    setReel: (state, action) => {
      state.reel = action.payload;
    }
  }
});
export const { createNewReels, setReel } = reelSlice.actions;
export default reelSlice.reducer;
