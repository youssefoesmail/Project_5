import { createSlice } from "@reduxjs/toolkit";
const usersSlice = createSlice({
  name: "users",
  initialState: {
    users: {},
    postUser: []
  },
  reducers: {
    setPost: (state, action) => {
      state.postUser = state.postUser;
    },
    setUsers: (state, action) => {
      state.users = state.users;
    }
  }
});
export const { setPost, setUsers } = usersSlice.actions;
export default usersSlice.reducer;
