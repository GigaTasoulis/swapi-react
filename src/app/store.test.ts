import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  addFavourite,
  removeFavourite,
} from "../features/favourites/favouritesSlice";
import { loadFavourites } from "../features/favourites/favouritesStorage";
import type { FavouriteItem } from "../types/favourites";

const luke: FavouriteItem = {
  id: "1",
  type: "character",
  title: "Luke Skywalker",
  url: "https://swapi.py4e.com/api/people/1/",
};

beforeEach(() => {
  localStorage.clear();
  // Reset module cache so each test re-imports the store fresh.
  // This is essential because the store and its subscription are created
  // at module load time — not per test.
  vi.resetModules();
});

describe("store + favourites persistence wiring", () => {
  it("writes to localStorage when a favourite is added", async () => {
    const { store } = await import("./store");

    store.dispatch(addFavourite(luke));

    expect(loadFavourites()).toEqual([luke]);
  });

  it("writes to localStorage when a favourite is removed", async () => {
    const { store } = await import("./store");

    store.dispatch(addFavourite(luke));
    store.dispatch(removeFavourite({ id: "1", type: "character" }));

    expect(loadFavourites()).toEqual([]);
  });

  it("loads existing favourites from localStorage on store creation", async () => {
    localStorage.setItem("swapi-favourites", JSON.stringify([luke]));

    const { store } = await import("./store");

    expect(store.getState().favourites.items).toEqual([luke]);
  });
});
