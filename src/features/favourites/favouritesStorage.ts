import type { FavouriteItem } from "../../types/favourites";

const STORAGE_KEY = "swapi-favourites";

/**
 * Load favourites from localStorage.
 * Returns an empty array on first run, parse errors, or unavailable storage.
 */
export function loadFavourites(): FavouriteItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Save favourites to localStorage. Silently no-ops if storage is unavailable
 * (e.g., private browsing mode with quota exceeded, or SSR environments).
 */
export function saveFavourites(items: FavouriteItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Intentionally ignored — favourites should not break the app.
  }
}
