import { createSlice } from "@reduxjs/toolkit";
const followersSlice = createSlice({
  name: "followers",
  initialState: {
    followers: []
  },
  reducers: {
    setFollowers: (state, action) => {
      console.log("Action",action.payload);
      state.followers = action.payload;
    }
  }
});
export const { setFollowers } = followersSlice.actions;
export default followersSlice.reducer;
