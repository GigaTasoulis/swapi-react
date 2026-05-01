import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "../../app/store";
import CharacterDetailPage from "./CharacterDetailPage";
import * as swapiApi from "../../api/swapiApi";

const mockUseGetCharacterByIdQuery = vi.spyOn(
  swapiApi,
  "useGetCharacterByIdQuery",
);

function renderPage(id = "1") {
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[`/characters/${id}`]}>
        <Routes>
          <Route path="/characters/:id" element={<CharacterDetailPage />} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  );
}

beforeEach(() => {
  mockUseGetCharacterByIdQuery.mockReset();
});

describe("CharacterDetailPage", () => {
  it("shows loading state while fetching", () => {
    mockUseGetCharacterByIdQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      isFetching: true,
      refetch: vi.fn(),
    } as never);

    renderPage();
    expect(screen.getByText("Loading character…")).toBeInTheDocument();
  });

  it("shows error state when the request fails", () => {
    mockUseGetCharacterByIdQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      isFetching: false,
      refetch: vi.fn(),
    } as never);

    renderPage();
    expect(
      screen.getByText("Couldn't load this character"),
    ).toBeInTheDocument();
  });

  it("renders character details when data is loaded", () => {
    mockUseGetCharacterByIdQuery.mockReturnValue({
      data: {
        name: "Luke Skywalker",
        birth_year: "19BBY",
        gender: "male",
        height: "172",
        mass: "77",
        eye_color: "blue",
        hair_color: "blond",
        skin_color: "fair",
        films: ["a", "b", "c"],
        url: "https://swapi.py4e.com/api/people/1/",
      },
      isLoading: false,
      isError: false,
      isFetching: false,
      refetch: vi.fn(),
    } as never);

    renderPage();
    expect(
      screen.getByRole("heading", { name: "Luke Skywalker" }),
    ).toBeInTheDocument();
    expect(screen.getByText("19BBY")).toBeInTheDocument();
    expect(screen.getByText("172 cm")).toBeInTheDocument();
    expect(screen.getByText("77 kg")).toBeInTheDocument();
    expect(screen.getByText("blue")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument(); // films count
  });

  it("renders a back link to the characters list", () => {
    mockUseGetCharacterByIdQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      isFetching: true,
      refetch: vi.fn(),
    } as never);

    renderPage();
    expect(
      screen.getByRole("link", { name: "Back to characters" }),
    ).toHaveAttribute("href", "/characters");
  });
});
