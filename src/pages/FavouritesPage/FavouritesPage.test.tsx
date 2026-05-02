import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import favouritesReducer from "../../features/favourites/favouritesSlice";
import { swapiApi } from "../../api/swapiApi";
import FavouritesPage from "./FavouritesPage";
import type { FavouriteItem } from "../../types/favourites";

const luke: FavouriteItem = {
  id: "1",
  type: "character",
  title: "Luke Skywalker",
  url: "https://swapi.py4e.com/api/people/1/",
};

const leia: FavouriteItem = {
  id: "5",
  type: "character",
  title: "Leia Organa",
  url: "https://swapi.py4e.com/api/people/5/",
};

const newHope: FavouriteItem = {
  id: "1",
  type: "film",
  title: "A New Hope",
  url: "https://swapi.py4e.com/api/films/1/",
};

function buildStore(preloadedFavourites: FavouriteItem[] = []) {
  return configureStore({
    reducer: {
      [swapiApi.reducerPath]: swapiApi.reducer,
      favourites: favouritesReducer,
    },
    middleware: (getDefault) => getDefault().concat(swapiApi.middleware),
    preloadedState: {
      favourites: { items: preloadedFavourites },
    },
  });
}

function renderPage(preloaded: FavouriteItem[] = []) {
  const store = buildStore(preloaded);
  const utils = render(
    <Provider store={store}>
      <MemoryRouter>
        <FavouritesPage />
      </MemoryRouter>
    </Provider>,
  );
  return { ...utils, store };
}

beforeEach(() => {
  localStorage.clear();
});

describe("FavouritesPage", () => {
  it("shows the empty state when no favourites exist", () => {
    renderPage();
    expect(screen.getByText("No favourites yet")).toBeInTheDocument();
  });

  it("renders only a Characters section when only characters are favourited", () => {
    renderPage([luke, leia]);
    expect(
      screen.getByRole("heading", { name: "Characters" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Films" }),
    ).not.toBeInTheDocument();
    expect(screen.getByText("Luke Skywalker")).toBeInTheDocument();
    expect(screen.getByText("Leia Organa")).toBeInTheDocument();
  });

  it("renders only a Films section when only films are favourited", () => {
    renderPage([newHope]);
    expect(
      screen.queryByRole("heading", { name: "Characters" }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Films" })).toBeInTheDocument();
    expect(screen.getByText("A New Hope")).toBeInTheDocument();
  });

  it("renders both sections when characters and films are favourited", () => {
    renderPage([luke, newHope]);
    expect(
      screen.getByRole("heading", { name: "Characters" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Films" })).toBeInTheDocument();
  });

  it("links characters to their detail pages", () => {
    renderPage([luke]);
    expect(
      screen.getByRole("link", { name: /Luke Skywalker/ }),
    ).toHaveAttribute("href", "/characters/1");
  });

  it("links films to their detail pages", () => {
    renderPage([newHope]);
    expect(screen.getByRole("link", { name: /A New Hope/ })).toHaveAttribute(
      "href",
      "/films/1",
    );
  });

  it("removes an item when its favourite button is clicked", async () => {
    const user = userEvent.setup();
    const { store } = renderPage([luke, newHope]);

    await user.click(
      screen.getByRole("button", {
        name: "Remove Luke Skywalker from favourites",
      }),
    );

    expect(store.getState().favourites.items).toEqual([newHope]);
    // The Characters section should disappear because no characters remain
    expect(
      screen.queryByRole("heading", { name: "Characters" }),
    ).not.toBeInTheDocument();
  });
});
