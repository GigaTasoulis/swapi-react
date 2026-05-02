import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import NavCard from "./NavCard";

function renderNavCard() {
  return render(
    <MemoryRouter>
      <NavCard
        to="/characters"
        title="Characters"
        description="Browse all the people of the galaxy."
      />
    </MemoryRouter>,
  );
}

describe("NavCard", () => {
  it("renders the title and description", () => {
    renderNavCard();
    expect(
      screen.getByRole("heading", { name: "Characters" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Browse all the people of the galaxy."),
    ).toBeInTheDocument();
  });

  it("links to the given route", () => {
    renderNavCard();
    expect(screen.getByRole("link")).toHaveAttribute("href", "/characters");
  });
});
