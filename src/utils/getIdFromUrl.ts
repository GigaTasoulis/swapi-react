/**
 * Extracts the trailing ID from a SWAPI resource URL.
 * Example: "https://swapi.dev/api/people/1/" → "1"
 */
export function getIdFromUrl(url: string): string {
  const parts = url.split("/").filter(Boolean);
  return parts[parts.length - 1];
}
