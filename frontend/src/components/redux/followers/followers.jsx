import { createSlice } from "@reduxjs/toolkit";
const followersSlice = createSlice({
  name: "followers",
  initialState: {
    followers: [],counter:true,amount:0,
  },
  reducers: {
    setFollowers: (state, action) => {
      console.log("Action", action.payload);
      state.followers = action.payload;
    },
    createNewFollowed: (state, action) => {
      state.followers.push(action.payload);
    },
    deleteFollowers: (state, action) => {
      
      state.counter=true;
      state.followers = state.followers.filter(
        (elem) => elem.followed_user_id !== action.payload
      );
    },
    updateCounter:(state,action)=>{
      state.counter = false;
    },
    setAmount:(state,action)=>{
      state.amount = action.payload;
    },

  }
});
export const { setFollowers, createNewFollowed, deleteFollowers,updateCounter,setAmount } =
  followersSlice.actions;
export default followersSlice.reducer;
