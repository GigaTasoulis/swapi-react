import { describe, it, expect } from "vitest";
import { Suspense } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { Provider } from "react-redux";
import { store } from "./app/store";

function renderApp(initialPath = "/") {
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[initialPath]}>
        <Suspense fallback={<div>Loading...</div>}>
          <AppRoutes />
        </Suspense>
      </MemoryRouter>
    </Provider>,
  );
}

describe("App routing", () => {
  it("renders the home page on /", () => {
    renderApp("/");
    expect(
      screen.getByRole("heading", { name: "Welcome" }),
    ).toBeInTheDocument();
  });

  it("renders the 404 page for unknown routes", async () => {
    renderApp("/something-random");
    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "Lost in hyperspace" }),
      ).toBeInTheDocument();
    });
  });

  it("navigates to characters when the Characters link is clicked", async () => {
    const user = userEvent.setup();
    renderApp("/");

    await user.click(screen.getByRole("link", { name: "Characters" }));

    expect(
      screen.getByRole("heading", { name: "Characters" }),
    ).toBeInTheDocument();
  });

  it("renders the character detail page when navigating to /characters/:id", async () => {
    renderApp("/characters/42");
    await waitFor(() => {
      expect(
        screen.getByRole("link", { name: "Back to characters" }),
      ).toBeInTheDocument();
    });
  });
});
