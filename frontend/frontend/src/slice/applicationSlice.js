import { createSlice } from "@reduxjs/toolkit";
import { baseService } from "../service/loginservice";

const initialState = { isLoading: false, permission: null, user: null };

const userMatcher = baseService.endpoints.userMe;

const applicationSlice = createSlice({
  name: "applicationSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(userMatcher.matchFulfilled, (state, action) => {
      return { ...state, user: action.payload?.user };
    });
  },
});

export default applicationSlice.reducer;
