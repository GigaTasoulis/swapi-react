import { Routes, Route } from "react-router-dom";
import Layout from "../components/Layout/Layout.tsx";
import HomePage from "../pages/HomePage/HomePage.tsx";
import CharactersPage from "../pages/CharactersPage/CharactersPage.tsx";
import CharacterDetailPage from "../pages/CharacterDetailPage/CharacterDetailsPage.tsx";
import FilmsPage from "../pages/FilmsPage/FilmsPage.tsx";
import FilmDetailPage from "../pages/FilmDetailPage/FilmDetailPage.tsx";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage.tsx";
import FavoritesPage from "../pages/FavouritesPage/FavoritesPage.tsx";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="characters" element={<CharactersPage />} />
        <Route path="characters/:id" element={<CharacterDetailPage />} />
        <Route path="films" element={<FilmsPage />} />
        <Route path="films/:id" element={<FilmDetailPage />} />
        <Route path="favorites" element={<FavoritesPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
