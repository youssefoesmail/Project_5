import { createSlice } from "@reduxjs/toolkit";
const searchSlice = createSlice({
  name: "search",
  initialState: {
    search: []
  },
  reducers: {
    setUsers: (state, action) => {
      state.search = action.payload;
    }
  }
});
export const { setUsers } = searchSlice.actions;
export default searchSlice.reducer;
