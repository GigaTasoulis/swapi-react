import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";

function renderApp(initialPath = "/") {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <AppRoutes />
    </MemoryRouter>,
  );
}

describe("App routing", () => {
  it("renders the home page on /", () => {
    renderApp("/");
    expect(screen.getByRole("heading", { name: "Home" })).toBeInTheDocument();
  });

  it("renders the 404 page for unknown routes", () => {
    renderApp("/something-random");
    expect(
      screen.getByRole("heading", { name: "404 — Not Found" }),
    ).toBeInTheDocument();
  });

  it("navigates to characters when the Characters link is clicked", async () => {
    const user = userEvent.setup();
    renderApp("/");

    await user.click(screen.getByRole("link", { name: "Characters" }));

    expect(
      screen.getByRole("heading", { name: "Characters" }),
    ).toBeInTheDocument();
  });

  it("shows the dynamic id on character detail pages", () => {
    renderApp("/characters/42");
    expect(
      screen.getByRole("heading", { name: "Character #42" }),
    ).toBeInTheDocument();
  });
});
