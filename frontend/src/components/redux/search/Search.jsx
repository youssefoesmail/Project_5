import { createSlice } from "@reduxjs/toolkit";
const searchSlice = createSlice({
  name: "search",
  initialState: {
    search: [],pool:false,
  },
  reducers: {
    setPool:(state,action)=>{
      state.pool= action.payload;
    },
    setUsers: (state, action) => {
      state.search = action.payload;
    }
  }
});


export const { setUsers,setPool } = searchSlice.actions;
export default searchSlice.reducer;
