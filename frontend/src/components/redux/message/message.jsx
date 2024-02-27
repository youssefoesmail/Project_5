import { createSlice } from "@reduxjs/toolkit";
const messageSlice = createSlice({
  name: "message",
  initialState: {
    message: []
  },
  reducers: {
    setMessage: (state, action) => {
      state.message = action.payload;
    },
    createMessage: (state, action) => {
      state.message.push(action.payload);
    }
  }
});
export const { setMessage, createMessage, sendMessage } = messageSlice.actions;
export default messageSlice.reducer;
