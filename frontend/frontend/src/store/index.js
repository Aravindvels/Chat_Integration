import { configureStore } from "@reduxjs/toolkit";
import middleware from "./middleware";
import rootReducer from "./rootReducer";

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(middleware),
});

export const { dispatch, getState } = store;
