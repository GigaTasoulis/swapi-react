import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import HomePage from "./HomePage";

function renderHome() {
  return render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>,
  );
}

describe("HomePage", () => {
  it("renders the welcome heading", () => {
    renderHome();
    expect(
      screen.getByRole("heading", { name: "Welcome", level: 1 }),
    ).toBeInTheDocument();
  });

  it("links to characters, films, and favourites", () => {
    renderHome();
    expect(screen.getByRole("link", { name: /Characters/ })).toHaveAttribute(
      "href",
      "/characters",
    );
    expect(screen.getByRole("link", { name: /Films/ })).toHaveAttribute(
      "href",
      "/films",
    );
    expect(screen.getByRole("link", { name: /Favourites/ })).toHaveAttribute(
      "href",
      "/favourites",
    );
  });
});
