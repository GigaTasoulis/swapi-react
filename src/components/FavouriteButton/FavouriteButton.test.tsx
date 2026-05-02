import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import favouritesReducer from "../../features/favourites/favouritesSlice";
import { swapiApi } from "../../api/swapiApi";
import FavouriteButton from "./FavouriteButton";
import type { FavouriteItem } from "../../types/favourites";

const luke: FavouriteItem = {
  id: "1",
  type: "character",
  title: "Luke Skywalker",
  url: "https://swapi.py4e.com/api/people/1/",
};

// Builds a fresh store per test — no shared state between tests
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

function renderButton(preloaded: FavouriteItem[] = []) {
  const store = buildStore(preloaded);
  const utils = render(
    <Provider store={store}>
      <FavouriteButton item={luke} />
    </Provider>,
  );
  return { ...utils, store };
}

beforeEach(() => {
  localStorage.clear();
});

describe("FavouriteButton", () => {
  it("renders an unpressed button when item is not favourited", () => {
    renderButton();
    const button = screen.getByRole("button", {
      name: "Add Luke Skywalker to favourites",
    });
    expect(button).toHaveAttribute("aria-pressed", "false");
  });

  it("renders a pressed button when item is favourited", () => {
    renderButton([luke]);
    const button = screen.getByRole("button", {
      name: "Remove Luke Skywalker from favourites",
    });
    expect(button).toHaveAttribute("aria-pressed", "true");
  });

  it("adds the item to favourites when clicked while unpressed", async () => {
    const user = userEvent.setup();
    const { store } = renderButton();

    await user.click(screen.getByRole("button"));

    expect(store.getState().favourites.items).toEqual([luke]);
  });

  it("removes the item from favourites when clicked while pressed", async () => {
    const user = userEvent.setup();
    const { store } = renderButton([luke]);

    await user.click(screen.getByRole("button"));

    expect(store.getState().favourites.items).toEqual([]);
  });

  it("updates its label after toggling", async () => {
    const user = userEvent.setup();
    renderButton();

    await user.click(screen.getByRole("button"));

    expect(
      screen.getByRole("button", {
        name: "Remove Luke Skywalker from favourites",
      }),
    ).toBeInTheDocument();
  });
});
