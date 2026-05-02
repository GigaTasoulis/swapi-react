import { describe, it, expect, beforeEach, vi } from "vitest";
import { loadFavourites, saveFavourites } from "./favouritesStorage";
import type { FavouriteItem } from "../../types/favourites";

const sampleItem: FavouriteItem = {
  id: "1",
  type: "character",
  title: "Luke Skywalker",
  url: "https://swapi.py4e.com/api/people/1/",
};

beforeEach(() => {
  localStorage.clear();
});

describe("favouritesStorage", () => {
  describe("loadFavourites", () => {
    it("returns an empty array when nothing is stored", () => {
      expect(loadFavourites()).toEqual([]);
    });

    it("returns the stored items", () => {
      localStorage.setItem("swapi-favourites", JSON.stringify([sampleItem]));
      expect(loadFavourites()).toEqual([sampleItem]);
    });

    it("returns an empty array when stored data is corrupt JSON", () => {
      localStorage.setItem("swapi-favourites", "{not valid json");
      expect(loadFavourites()).toEqual([]);
    });

    it("returns an empty array when stored data is not an array", () => {
      localStorage.setItem("swapi-favourites", JSON.stringify({ id: "1" }));
      expect(loadFavourites()).toEqual([]);
    });

    it("returns an empty array when localStorage throws", () => {
      const spy = vi
        .spyOn(Storage.prototype, "getItem")
        .mockImplementation(() => {
          throw new Error("blocked");
        });
      expect(loadFavourites()).toEqual([]);
      spy.mockRestore();
    });
  });

  describe("saveFavourites", () => {
    it("writes items to localStorage as JSON", () => {
      saveFavourites([sampleItem]);
      const raw = localStorage.getItem("swapi-favourites");
      expect(raw).toBe(JSON.stringify([sampleItem]));
    });

    it("overwrites previous content", () => {
      saveFavourites([sampleItem]);
      saveFavourites([]);
      expect(localStorage.getItem("swapi-favourites")).toBe("[]");
    });

    it("does not throw when localStorage throws", () => {
      const spy = vi
        .spyOn(Storage.prototype, "setItem")
        .mockImplementation(() => {
          throw new Error("quota");
        });
      expect(() => saveFavourites([sampleItem])).not.toThrow();
      spy.mockRestore();
    });
  });
});
