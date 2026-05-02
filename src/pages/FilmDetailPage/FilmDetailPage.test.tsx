import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "../../app/store";
import FilmDetailPage from "./FilmDetailPage";
import * as swapiApi from "../../api/swapiApi";

const mockUseGetFilmByIdQuery = vi.spyOn(swapiApi, "useGetFilmByIdQuery");

function renderPage(id = "1") {
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[`/films/${id}`]}>
        <Routes>
          <Route path="/films/:id" element={<FilmDetailPage />} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  );
}

beforeEach(() => {
  mockUseGetFilmByIdQuery.mockReset();
});

describe("FilmDetailPage", () => {
  it("shows loading state while fetching", () => {
    mockUseGetFilmByIdQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      isFetching: true,
      refetch: vi.fn(),
    } as never);

    renderPage();
    expect(screen.getByText("Loading film…")).toBeInTheDocument();
  });

  it("shows error state when the request fails", () => {
    mockUseGetFilmByIdQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      isFetching: false,
      refetch: vi.fn(),
    } as never);

    renderPage();
    expect(screen.getByText("Couldn't load this film")).toBeInTheDocument();
  });

  it("renders film details and counts when data is loaded", () => {
    mockUseGetFilmByIdQuery.mockReturnValue({
      data: {
        title: "A New Hope",
        episode_id: 4,
        opening_crawl:
          "It is a period of civil war.\r\n\r\nRebel spaceships, striking from a hidden base.",
        director: "George Lucas",
        producer: "Gary Kurtz, Rick McCallum",
        release_date: "1977-05-25",
        characters: ["a", "b", "c"],
        planets: ["x", "y"],
        starships: ["s1"],
        vehicles: [],
        species: ["sp1", "sp2"],
        url: "https://swapi.py4e.com/api/films/1/",
      },
      isLoading: false,
      isError: false,
      isFetching: false,
      refetch: vi.fn(),
    } as never);

    renderPage();
    expect(
      screen.getByRole("heading", { name: "A New Hope" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Episode 4")).toBeInTheDocument();
    expect(screen.getByText("George Lucas")).toBeInTheDocument();
    expect(screen.getByText("1977-05-25")).toBeInTheDocument();
    const findRowValue = (label: string) =>
      within(screen.getByText(label).parentElement!).getByText(/^\d+$/);

    expect(findRowValue("Characters")).toHaveTextContent("3");
    expect(findRowValue("Planets")).toHaveTextContent("2");
    expect(findRowValue("Vehicles")).toHaveTextContent("0");
  });

  it("renders the opening crawl as separate paragraphs", () => {
    mockUseGetFilmByIdQuery.mockReturnValue({
      data: {
        title: "A New Hope",
        episode_id: 4,
        opening_crawl:
          "First paragraph.\r\n\r\nSecond paragraph.\r\n\r\nThird paragraph.",
        director: "GL",
        producer: "GK",
        release_date: "1977-05-25",
        characters: [],
        planets: [],
        starships: [],
        vehicles: [],
        species: [],
        url: "https://swapi.py4e.com/api/films/1/",
      },
      isLoading: false,
      isError: false,
      isFetching: false,
      refetch: vi.fn(),
    } as never);

    renderPage();
    const crawl = screen.getByLabelText("Opening crawl");
    expect(crawl.querySelectorAll("p")).toHaveLength(3);
    expect(screen.getByText("First paragraph.")).toBeInTheDocument();
    expect(screen.getByText("Second paragraph.")).toBeInTheDocument();
    expect(screen.getByText("Third paragraph.")).toBeInTheDocument();
  });

  it("renders a back link to the films list", () => {
    mockUseGetFilmByIdQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      isFetching: true,
      refetch: vi.fn(),
    } as never);

    renderPage();
    expect(screen.getByRole("link", { name: "Back to films" })).toHaveAttribute(
      "href",
      "/films",
    );
  });
});
