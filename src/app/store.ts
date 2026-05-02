import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { swapiApi } from "../api/swapiApi";
import favouritesReducer from "../features/favourites/favouritesSlice";
import { saveFavourites } from "../features/favourites/favouritesStorage";

export const store = configureStore({
  reducer: {
    [swapiApi.reducerPath]: swapiApi.reducer,
    favourites: favouritesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(swapiApi.middleware),
});

setupListeners(store.dispatch);

let lastItems = store.getState().favourites.items;
store.subscribe(() => {
  const currentItems = store.getState().favourites.items;
  if (currentItems !== lastItems) {
    lastItems = currentItems;
    saveFavourites(currentItems);
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
