import { describe, it, expect } from "vitest";
import { getIdFromUrl } from "./getIdFromUrl";

describe("getIdFromUrl", () => {
  it("extracts the trailing id from a SWAPI url", () => {
    expect(getIdFromUrl("https://swapi.dev/api/people/1/")).toBe("1");
  });

  it("handles urls without a trailing slash", () => {
    expect(getIdFromUrl("https://swapi.dev/api/films/4")).toBe("4");
  });

  it("handles multi-digit ids", () => {
    expect(getIdFromUrl("https://swapi.dev/api/people/42/")).toBe("42");
  });
});
