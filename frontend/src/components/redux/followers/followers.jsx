import { createSlice } from "@reduxjs/toolkit";
const followersSlice = createSlice({
  name: "followers",
  initialState: {
    followers: []
  },
  reducers: {
    setFollowers: (state, action) => {
      state.followers = action.payload;
    }
  }
});
export const { setFollowers } = followersSlice.actions;
export default followersSlice.reducer;
