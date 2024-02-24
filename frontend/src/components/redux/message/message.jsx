import { createSlice } from "@reduxjs/toolkit";
const messageSlice = createSlice({
  name: "message",
  initialState: {
    message: null
  },
  reducers: {
    setMessage: (state, action) => {
      state.message = action.payload;
    },
    createNewMessage: (state, action) => {
      state.message = action.payload;
    }
  }
});
export const { setMessage, createNewMessage } = messageSlice.actions;
export default messageSlice.reducer;
