import { createSlice } from "@reduxjs/toolkit";
const personalSlice = createSlice({
  name: "personal",
  initialState: { personal: {}, post: [], followers:null,cover:"" ,photo:""},
  reducers: {
    setPosts: (state, action) => {
      state.post = action.payload;
    },
    setUserInfo: (state, action) => {
      state.personal = action.payload;
    },
    setCover:(state,action)=>{
      console.log("coverNew",action.payload);
      state.cover=action.payload;
    },
    
    setPhoto:(state,action)=>{
      state.photo=action.payload;
    }

  }
});
export const { setPosts, setUserInfo,setFollowers,setCover,setPhoto } = personalSlice.actions;
export default personalSlice.reducer;
