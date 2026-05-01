import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout";

function renderLayout(initialPath = "/") {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<div>Home content</div>} />
          <Route path="characters" element={<div>Characters content</div>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
}

describe("Layout", () => {
  it("renders the brand", () => {
    renderLayout();
    expect(screen.getByText("SWAPI")).toBeInTheDocument();
  });

  it("renders all four navigation links", () => {
    renderLayout();
    expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Characters" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Films" })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Favourites" }),
    ).toBeInTheDocument();
  });

  it("renders the matching route content inside the outlet", () => {
    renderLayout("/characters");
    expect(screen.getByText("Characters content")).toBeInTheDocument();
  });

  it("marks the active link based on the current route", () => {
    renderLayout("/characters");
    const charactersLink = screen.getByRole("link", { name: "Characters" });
    // NavLink adds aria-current="page" automatically when active
    expect(charactersLink).toHaveAttribute("aria-current", "page");
  });
});
