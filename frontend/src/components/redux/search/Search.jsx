import { createSlice } from "@reduxjs/toolkit";
const searchSlice = createSlice({
  name: "search",
  initialState: {
    search: [],pool:false,
  },
  reducers: {

    setUsers: (state, action) => {
      state.search = action.payload;
      state.pool= localStorage.setItem("show", true);
    }
  }
});


export const { setUsers } = searchSlice.actions;
export default searchSlice.reducer;
