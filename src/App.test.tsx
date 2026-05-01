import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { Provider } from "react-redux";
import { store } from "./app/store";

function renderApp(initialPath = "/") {
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[initialPath]}>
        <AppRoutes />
      </MemoryRouter>
    </Provider>,
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

  it("renders the character detail page when navigating to /characters/:id", () => {
    renderApp("/characters/42");
    expect(
      screen.getByRole("link", { name: "Back to characters" }),
    ).toBeInTheDocument();
  });
});
