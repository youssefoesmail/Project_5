import { createSlice } from "@reduxjs/toolkit";
const storySlice = createSlice({
  name: "story",
  initialState: {
    story: []
  },
  reducers: {
    setStory: (state, action) => {
      state.story = action.payload;
    },
    createNewStory: (state, action) => {
      state.story = [action.payload, ...state.story];
    }
  }
});
export const { setStory, createNewStory } = storySlice.actions;
export default storySlice.reducer;
