import { createSlice } from "@reduxjs/toolkit";
const usersSlice = createSlice({
  name: "user",
  initialState: {
    user: []
  },
  reducers: {
    getAllUsers: (state, action) => {
      state.user = action.payload;
    }
  }
});
export const { getAllUsers } = usersSlice.actions;
export default usersSlice.reducer;
