import { configureStore } from "@reduxjs/toolkit";

import { stupifyApi } from "./apiSlice";
import searchReducer from "./searchSlice";
import { setupListeners } from "@reduxjs/toolkit/dist/query";

export const store = configureStore({
  reducer: {
    search: searchReducer,
    [stupifyApi.reducerPath]: stupifyApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(stupifyApi.middleware),
});

setupListeners(store.dispatch);
