import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import BackLink from "./BackLink";

describe("BackLink", () => {
  it("renders the label", () => {
    render(
      <MemoryRouter>
        <BackLink to="/characters" label="Back to characters" />
      </MemoryRouter>,
    );
    expect(
      screen.getByRole("link", { name: "Back to characters" }),
    ).toBeInTheDocument();
  });

  it("links to the given route", () => {
    render(
      <MemoryRouter>
        <BackLink to="/films" label="Back to films" />
      </MemoryRouter>,
    );
    expect(screen.getByRole("link", { name: "Back to films" })).toHaveAttribute(
      "href",
      "/films",
    );
  });
});
