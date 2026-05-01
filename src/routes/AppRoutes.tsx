import { Routes, Route } from "react-router-dom";
import Layout from "../components/Layout/Layout.tsx";
import HomePage from "../pages/HomePage";
import CharactersPage from "../pages/CharactersPage";
import CharacterDetailPage from "../pages/CharacterDetailsPage";
import FilmsPage from "../pages/FilmsPage";
import FilmDetailPage from "../pages/FilmDetailPage";
import NotFoundPage from "../pages/NotFoundPage";
import FavoritesPage from "../pages/FavoritesPage";

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
