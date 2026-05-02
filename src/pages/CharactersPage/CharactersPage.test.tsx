import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "../../app/store";
import CharactersPage from "./CharactersPage";
import * as swapiApi from "../../api/swapiApi";

// Mock the RTK Query hook directly — keeps tests fast and deterministic
const mockUseGetCharactersQuery = vi.spyOn(swapiApi, "useGetCharactersQuery");

function renderPage() {
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <CharactersPage />
      </MemoryRouter>
    </Provider>,
  );
}

beforeEach(() => {
  mockUseGetCharactersQuery.mockReset();
});

describe("CharactersPage", () => {
  it("shows loading state on first load", () => {
    mockUseGetCharactersQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      isFetching: true,
      refetch: vi.fn(),
    } as never);

    renderPage();
    expect(
      screen.getByRole("status", { name: "Loading characters" }),
    ).toBeInTheDocument();
  });

  it("shows error state when the request fails", () => {
    mockUseGetCharactersQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      isFetching: false,
      refetch: vi.fn(),
    } as never);

    renderPage();
    expect(screen.getByText("Couldn't load characters")).toBeInTheDocument();
  });

  it("shows empty state when no results are returned", () => {
    mockUseGetCharactersQuery.mockReturnValue({
      data: { count: 0, next: null, previous: null, results: [] },
      isLoading: false,
      isError: false,
      isFetching: false,
      refetch: vi.fn(),
    } as never);

    renderPage();
    expect(screen.getByText("No characters found.")).toBeInTheDocument();
  });

  it("renders character cards with names and birth years", () => {
    mockUseGetCharactersQuery.mockReturnValue({
      data: {
        count: 1,
        next: null,
        previous: null,
        results: [
          {
            name: "Luke Skywalker",
            birth_year: "19BBY",
            url: "https://swapi.dev/api/people/1/",
          },
        ],
      },
      isLoading: false,
      isError: false,
      isFetching: false,
      refetch: vi.fn(),
    } as never);

    renderPage();
    expect(screen.getByText("Luke Skywalker")).toBeInTheDocument();
    expect(screen.getByText("Born 19BBY")).toBeInTheDocument();
  });

  it("advances the page when Next is clicked", async () => {
    const user = userEvent.setup();
    mockUseGetCharactersQuery.mockReturnValue({
      data: {
        count: 20,
        next: "https://swapi.dev/api/people/?page=2",
        previous: null,
        results: [
          {
            name: "Luke",
            birth_year: "19BBY",
            url: "https://swapi.dev/api/people/1/",
          },
        ],
      },
      isLoading: false,
      isError: false,
      isFetching: false,
      refetch: vi.fn(),
    } as never);

    renderPage();
    await user.click(screen.getByRole("button", { name: /Next/ }));

    // After click, the hook should be called again with page: 2
    expect(mockUseGetCharactersQuery).toHaveBeenLastCalledWith({
      page: 2,
      search: "",
    });
  });

  it("passes the search input value through (debounced) to the query", async () => {
    const user = userEvent.setup();
    mockUseGetCharactersQuery.mockReturnValue({
      data: { count: 0, next: null, previous: null, results: [] },
      isLoading: false,
      isError: false,
      isFetching: false,
      refetch: vi.fn(),
    } as never);

    renderPage();
    await user.type(screen.getByLabelText("Search characters"), "Luke");

    // Wait for the debounce delay to flush, then assert
    await new Promise((resolve) => setTimeout(resolve, 500));

    // The hook should have been called with the typed search value
    expect(mockUseGetCharactersQuery).toHaveBeenLastCalledWith({
      page: 1,
      search: "Luke",
    });
  });

  it("resets to page 1 when the search value changes", async () => {
    const user = userEvent.setup();
    mockUseGetCharactersQuery.mockReturnValue({
      data: {
        count: 100,
        next: "https://swapi.py4e.com/api/people/?page=2",
        previous: null,
        results: [
          {
            name: "Luke",
            birth_year: "19BBY",
            url: "https://swapi.py4e.com/api/people/1/",
          },
        ],
      },
      isLoading: false,
      isError: false,
      isFetching: false,
      refetch: vi.fn(),
    } as never);

    renderPage();

    // Move to page 2
    await user.click(screen.getByRole("button", { name: /Next/ }));

    // Type into the search box — should reset to page 1
    await user.type(screen.getByLabelText("Search characters"), "Luke");
    await new Promise((resolve) => setTimeout(resolve, 500));

    expect(mockUseGetCharactersQuery).toHaveBeenLastCalledWith({
      page: 1,
      search: "Luke",
    });
  });

  it("calls refetch when the retry button is clicked", async () => {
    const user = userEvent.setup();
    const refetch = vi.fn();
    mockUseGetCharactersQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      isFetching: false,
      refetch,
    } as never);

    renderPage();
    await user.click(screen.getByRole("button", { name: "Try again" }));

    expect(refetch).toHaveBeenCalled();
  });

  it("shows a search-specific empty message when results are empty after a search", async () => {
    const user = userEvent.setup();
    mockUseGetCharactersQuery.mockReturnValue({
      data: { count: 0, next: null, previous: null, results: [] },
      isLoading: false,
      isError: false,
      isFetching: false,
      refetch: vi.fn(),
    } as never);

    renderPage();
    await user.type(screen.getByLabelText("Search characters"), "xyzqq");
    await new Promise((resolve) => setTimeout(resolve, 500));

    expect(screen.getByText(/No characters match "xyzqq"/)).toBeInTheDocument();
  });
});
