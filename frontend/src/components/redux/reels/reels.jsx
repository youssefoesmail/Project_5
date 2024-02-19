import { createSlice } from "@reduxjs/toolkit";
const reelSlice = createSlice({
  name: "reel",
  initialState: {
    reel: []
  },
  reducers: {
    createNewReels: (state, action) => {
      state.reel = [action.payload, ...state.reel];
    }
  }
});
export const { createNewReels } = reelSlice.actions;
export default reelSlice.reducer;
