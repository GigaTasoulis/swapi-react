import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { FavouriteItem, FavouriteType } from "../../types/favourites";
import { loadFavourites } from "./favouritesStorage";
import type { RootState } from "../../app/store";

type FavouritesState = {
  items: FavouriteItem[];
};

const initialState: FavouritesState = {
  items: loadFavourites(),
};

const favouritesSlice = createSlice({
  name: "favourites",
  initialState,
  reducers: {
    addFavourite(state, action: PayloadAction<FavouriteItem>) {
      const exists = state.items.some(
        (item) =>
          item.id === action.payload.id && item.type === action.payload.type,
      );
      if (!exists) {
        state.items.push(action.payload);
      }
    },
    removeFavourite(
      state,
      action: PayloadAction<{ id: string; type: FavouriteType }>,
    ) {
      state.items = state.items.filter(
        (item) =>
          !(item.id === action.payload.id && item.type === action.payload.type),
      );
    },
    toggleFavourite(state, action: PayloadAction<FavouriteItem>) {
      const index = state.items.findIndex(
        (item) =>
          item.id === action.payload.id && item.type === action.payload.type,
      );
      if (index >= 0) {
        state.items.splice(index, 1);
      } else {
        state.items.push(action.payload);
      }
    },
    clearFavourites(state) {
      state.items = [];
    },
  },
});

export const {
  addFavourite,
  removeFavourite,
  toggleFavourite,
  clearFavourites,
} = favouritesSlice.actions;

// --- Selectors ---

export const selectFavourites = (state: RootState) => state.favourites.items;

export const selectIsFavourite =
  (id: string, type: FavouriteType) =>
  (state: RootState): boolean =>
    state.favourites.items.some((item) => item.id === id && item.type === type);

export default favouritesSlice.reducer;
