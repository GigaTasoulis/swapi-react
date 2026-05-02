import { describe, it, expect } from "vitest";
import reducer, {
  addFavourite,
  removeFavourite,
  toggleFavourite,
  clearFavourites,
  selectFavourites,
  selectIsFavourite,
} from "./favouritesSlice";
import type { FavouriteItem } from "../../types/favourites";
import type { RootState } from "../../app/store";

const luke: FavouriteItem = {
  id: "1",
  type: "character",
  title: "Luke Skywalker",
  url: "https://swapi.py4e.com/api/people/1/",
};

const newHope: FavouriteItem = {
  id: "1",
  type: "film",
  title: "A New Hope",
  url: "https://swapi.py4e.com/api/films/1/",
};

const emptyState = { items: [] };

describe("favouritesSlice — reducers", () => {
  describe("addFavourite", () => {
    it("adds an item to an empty list", () => {
      const next = reducer(emptyState, addFavourite(luke));
      expect(next.items).toEqual([luke]);
    });

    it("does not add a duplicate (same id and type)", () => {
      const startState = { items: [luke] };
      const next = reducer(startState, addFavourite(luke));
      expect(next.items).toHaveLength(1);
    });

    it("treats same id with different type as different items", () => {
      const startState = { items: [luke] }; // character #1
      const next = reducer(startState, addFavourite(newHope)); // film #1
      expect(next.items).toEqual([luke, newHope]);
    });
  });

  describe("removeFavourite", () => {
    it("removes the matching item", () => {
      const startState = { items: [luke, newHope] };
      const next = reducer(
        startState,
        removeFavourite({ id: "1", type: "character" }),
      );
      expect(next.items).toEqual([newHope]);
    });

    it("does nothing if the item is not present", () => {
      const startState = { items: [luke] };
      const next = reducer(
        startState,
        removeFavourite({ id: "99", type: "character" }),
      );
      expect(next.items).toEqual([luke]);
    });

    it("only removes the matching type when ids overlap", () => {
      const startState = { items: [luke, newHope] };
      const next = reducer(
        startState,
        removeFavourite({ id: "1", type: "film" }),
      );
      expect(next.items).toEqual([luke]);
    });
  });

  describe("toggleFavourite", () => {
    it("adds the item when not present", () => {
      const next = reducer(emptyState, toggleFavourite(luke));
      expect(next.items).toEqual([luke]);
    });

    it("removes the item when already present", () => {
      const startState = { items: [luke] };
      const next = reducer(startState, toggleFavourite(luke));
      expect(next.items).toEqual([]);
    });
  });

  describe("clearFavourites", () => {
    it("empties the list", () => {
      const startState = { items: [luke, newHope] };
      const next = reducer(startState, clearFavourites());
      expect(next.items).toEqual([]);
    });
  });
});

describe("favouritesSlice — selectors", () => {
  const buildState = (items: FavouriteItem[]) =>
    ({ favourites: { items } }) as RootState;

  it("selectFavourites returns the items", () => {
    expect(selectFavourites(buildState([luke]))).toEqual([luke]);
  });

  it("selectIsFavourite returns true when item is in list", () => {
    expect(selectIsFavourite("1", "character")(buildState([luke]))).toBe(true);
  });

  it("selectIsFavourite returns false when item is not in list", () => {
    expect(selectIsFavourite("99", "character")(buildState([luke]))).toBe(
      false,
    );
  });

  it("selectIsFavourite distinguishes type", () => {
    expect(selectIsFavourite("1", "film")(buildState([luke]))).toBe(false);
  });
});
