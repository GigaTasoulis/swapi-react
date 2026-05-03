import { Routes, Route } from "react-router-dom";
import Layout from "../components/Layout/Layout.tsx";
import HomePage from "../pages/HomePage/HomePage.tsx";
import CharactersPage from "../pages/CharactersPage/CharactersPage.tsx";
import FilmsPage from "../pages/FilmsPage/FilmsPage.tsx";
import { lazy, Suspense } from "react";

const CharacterDetailPage = lazy(
  () => import("../pages/CharacterDetailPage/CharacterDetailPage.tsx"),
);
const FilmDetailPage = lazy(
  () => import("../pages/FilmDetailPage/FilmDetailPage.tsx"),
);

const NotFoundPage = lazy(
  () => import("../pages/NotFoundPage/NotFoundPage.tsx"),
);

const FavouritesPage = lazy(
  () => import("../pages/FavouritesPage/FavouritesPage.tsx"),
);

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="characters" element={<CharactersPage />} />
        <Route
          path="characters/:id"
          element={
            <Suspense fallback={<PageLoadingFallback />}>
              <CharacterDetailPage />
            </Suspense>
          }
        />
        <Route path="films" element={<FilmsPage />} />
        <Route
          path="films/:id"
          element={
            <Suspense fallback={<PageLoadingFallback />}>
              <FilmDetailPage />
            </Suspense>
          }
        />
        <Route
          path="favourites"
          element={
            <Suspense fallback={<PageLoadingFallback />}>
              <FavouritesPage />
            </Suspense>
          }
        />
        <Route
          path="*"
          element={
            <Suspense fallback={<PageLoadingFallback />}>
              <NotFoundPage />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  );
}

function PageLoadingFallback() {
  return (
    <div
      style={{
        padding: "1.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
      role="status"
      aria-label="Loading page"
    >
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          style={{
            height: "1.5rem",
            borderRadius: "4px",
            background: "var(--color-bg-subtle)",
            animation: "skeleton-pulse 1.5s ease-in-out infinite",
            width: i === 0 ? "40%" : i === 1 ? "70%" : "55%",
          }}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}
