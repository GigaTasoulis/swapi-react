import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "../../app/store";
import FilmsPage from "./FilmsPage";
import * as swapiApi from "../../api/swapiApi";

const mockUseGetFilmsQuery = vi.spyOn(swapiApi, "useGetFilmsQuery");

function renderPage() {
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <FilmsPage />
      </MemoryRouter>
    </Provider>,
  );
}

beforeEach(() => {
  mockUseGetFilmsQuery.mockReset();
});

describe("FilmsPage", () => {
  it("shows loading state on first load", () => {
    mockUseGetFilmsQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      isFetching: true,
      refetch: vi.fn(),
    } as never);

    renderPage();
    expect(screen.getByText("Loading films…")).toBeInTheDocument();
  });

  it("shows error state when the request fails", () => {
    mockUseGetFilmsQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      isFetching: false,
      refetch: vi.fn(),
    } as never);

    renderPage();
    expect(screen.getByText("Couldn't load films")).toBeInTheDocument();
  });

  it("shows empty state when no films are returned", () => {
    mockUseGetFilmsQuery.mockReturnValue({
      data: { count: 0, next: null, previous: null, results: [] },
      isLoading: false,
      isError: false,
      isFetching: false,
      refetch: vi.fn(),
    } as never);

    renderPage();
    expect(screen.getByText("No films found.")).toBeInTheDocument();
  });

  it("renders film cards with title, director and release date", () => {
    mockUseGetFilmsQuery.mockReturnValue({
      data: {
        count: 1,
        next: null,
        previous: null,
        results: [
          {
            title: "A New Hope",
            director: "George Lucas",
            release_date: "1977-05-25",
            url: "https://swapi.py4e.com/api/films/1/",
          },
        ],
      },
      isLoading: false,
      isError: false,
      isFetching: false,
      refetch: vi.fn(),
    } as never);

    renderPage();
    expect(screen.getByText("A New Hope")).toBeInTheDocument();
    expect(screen.getByText(/George Lucas/)).toBeInTheDocument();
    expect(screen.getByText(/1977-05-25/)).toBeInTheDocument();
  });

  it("does not render pagination", () => {
    mockUseGetFilmsQuery.mockReturnValue({
      data: {
        count: 1,
        next: null,
        previous: null,
        results: [
          {
            title: "A New Hope",
            director: "GL",
            release_date: "1977-05-25",
            url: "https://swapi.py4e.com/api/films/1/",
          },
        ],
      },
      isLoading: false,
      isError: false,
      isFetching: false,
      refetch: vi.fn(),
    } as never);

    renderPage();
    expect(
      screen.queryByRole("navigation", { name: "Pagination" }),
    ).not.toBeInTheDocument();
  });
});
