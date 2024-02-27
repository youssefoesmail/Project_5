import { createSlice } from "@reduxjs/toolkit";
const usersSlice = createSlice({
  name: "users",
  initialState: {
    users: {},
    postUser: [],
  },
  reducers: {
    setPost: (state, action) => {
      //console.log("result1",action.payload);
      state.postUser = action.payload;
    },
    setUsers: (state, action) => {
      //console.log("result",action.payload);
      state.users = action.payload;
    },
  },
});
export const { setPost, setUsers } = usersSlice.actions;
export default usersSlice.reducer;
