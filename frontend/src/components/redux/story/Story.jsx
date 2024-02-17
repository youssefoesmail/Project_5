import { createSlice } from "@reduxjs/toolkit";
const storySlice = createSlice({
  name: "story",
  initialState: {
    story: []
  },
  reducers: {
    setStory: (state, action) => {
      state.story = action.payload;
    }
  }
});
export const { setStory } = storySlice.actions;
export default storySlice.reducer;
