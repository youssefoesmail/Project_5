import { createSlice } from "@reduxjs/toolkit";
const personalSlice = createSlice({
  name: "personal",
  initialState: { personal: {}, post: [], followers:null },
  reducers: {
    setPosts: (state, action) => {
      state.post = action.payload;
    },
    setUserInfo: (state, action) => {
      state.personal = action.payload;
    },
    setFollowers:(state,action)=>{
      state.followers = action.payload;
    }
  }
});
export const { setPosts, setUserInfo,setFollowers } = personalSlice.actions;
export default personalSlice.reducer;
