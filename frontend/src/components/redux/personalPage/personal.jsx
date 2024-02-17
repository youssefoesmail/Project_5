import { createSlice } from "@reduxjs/toolkit";
const personalSlice = createSlice({
  name: "personal",
  initialState: { personal: {}, post: [] },
  reducers: {
    setPosts: (state, action) => {
      state.post = action.payload;
    },
    setUserInfo: (state, action) => {
      state.personal = action.payload;
    }
  }
});
export const { setPosts, setUserInfo } = personalSlice.actions;
export default personalSlice.reducer;
