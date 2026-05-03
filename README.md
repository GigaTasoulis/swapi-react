# SWAPI Explorer

A React + TypeScript application for browsing Star Wars characters and films via the [Star Wars API](https://swapi.dev). Built as a frontend technical assessment showcasing modern React patterns, Redux Toolkit, and accessible UI design.

🌐 **Live demo:** https://swapi-react-hazel.vercel.app/

---

## Features

- Browse, search, and paginate Star Wars characters
- Browse and search Star Wars films
- View detailed information for any character or film
- Mark items as favourites (persisted across sessions via `localStorage`)
- Responsive layout, mobile-first, works on a 360px phone
- Loading, error, and empty states everywhere data is fetched
- Retry recovery from API errors
- Debounced search — one request per pause, not per keystroke
- Full keyboard navigation and screen-reader support
- 120 tests across hooks, components, slices, and integration flows

---

## Tech Stack

| Concern      | Choice                              | Why                                            |
| ------------ | ----------------------------------- | ---------------------------------------------- |
| Framework    | React 18 + TypeScript               | Type-safe component development                |
| Build tool   | Vite                                | Fast dev server, instant HMR, native TS        |
| Routing      | React Router 6                      | Standard, declarative routing                  |
| Server state | Redux Toolkit Query (RTK Query)     | Caching, deduplication, loading/error states   |
| Client state | Redux Toolkit slice                 | Favourites — used across many pages, persists  |
| Persistence  | `localStorage` + Redux subscription | One-way Redux → storage sync                   |
| Styling      | SCSS Modules + design tokens        | Mobile-first, scoped styles, consistent design |
| Tests        | Vitest + React Testing Library      | Vite-native, fast, behaviour-focused           |
| Hosting      | Vercel                              | Auto-deploy on push to `main`                  |

---

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
git clone https://github.com/<your-username>/swapi-react.git
cd swapi-react
npm install
```

### Running locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Other scripts

```bash
npm run build       # Production build
npm run preview     # Preview the production build locally
npm test            # Run tests in watch mode
npm run test:run    # Run tests once and exit (used by CI)
npm run lint        # Lint the codebase
```

---

## Project Structure

```
src/
  api/                    # RTK Query SWAPI client + endpoints
  app/                    # Redux store + typed hooks
  components/             # Reusable UI components, one folder each
    BackLink/
    Card/
    DetailRow/
    FavouriteButton/
    Layout/
    NavCard/
    Pagination/
    SearchInput/
    Skeleton/
    StateMessage/
  features/
    favourites/           # Favourites slice + localStorage helpers
  hooks/                  # Reusable hooks (useDebouncedValue)
  pages/                  # One folder per route
  routes/                 # Route definitions (separate from BrowserRouter)
  styles/                 # Design tokens + breakpoint mixins
  types/                  # SWAPI + favourites types
  utils/                  # Pure helpers (getIdFromUrl)
```

Components and pages each live in their own folder with their `.tsx`, `.module.scss`, and `.test.tsx` files co-located. This makes it trivial to delete a component cleanly and ensures tests live next to the code they cover.

---

## Architecture

### State management: two tools, one store

The app uses **Redux Toolkit** for state, with two complementary tools depending on the kind of state being managed:

- **RTK Query** for server state (SWAPI data) — gives caching, request deduplication, automatic loading/error states, and refetch-on-focus for free.
- **A classic slice** (`favouritesSlice`) for client state (the user's favourites) — owns the data, exposes selectors and actions.

Both reducers register in a single `configureStore`, so everything is visible in Redux DevTools as one cohesive state tree:

```
state = {
  swapiApi:   { queries: {…}, … },   // managed by RTK Query
  favourites: { items: […] }          // managed by our slice
}
```

This split is the key architectural decision in the project. Server state and client state have different needs (caching, persistence, request lifecycle vs. ad-hoc reads/writes), and using the right tool for each keeps the code clean. UI state that's local to one component (search input value, current page number) lives in `useState` — lifting it would add ceremony for no benefit.

### How favourites persistence works

Favourites flow Redux → `localStorage` in one direction:

1. **On store creation**, the slice's `initialState` calls `loadFavourites()` to read the saved JSON. If parsing fails or the data is corrupt, it returns `[]` rather than crashing — a defensive boundary.
2. **The store subscribes** to its own changes. After every dispatch, it compares the current `favourites.items` reference against the previous one. If different, it writes to `localStorage`. Reference equality works because Immer (used by Redux Toolkit) only produces a new array reference when the state actually changes.
3. **Storage failures are silent** — Safari private mode, quota exceeded, or any other I/O error is caught. Favourites are a nice-to-have feature; they should never crash the app.

### How search and pagination work

Both list pages use a debounced search:

```ts
const [search, setSearch] = useState("");
const debouncedSearch = useDebouncedValue(search, 400);
const { data } = useGetCharactersQuery({ page, search: debouncedSearch });
```

Two state values — `search` updates on every keystroke (the input is responsive), `debouncedSearch` updates 400ms after typing stops (the API call only fires once per pause).

When the search term changes, `page` is reset to `1` in the same handler that updates `search`. React 18 batches both state updates into one render, so only one network request fires for the new search/page combination — instead of one for the new search at page 5, then another for page 1.

### SCSS architecture

Styles use SCSS Modules with three layers of abstraction:

- **`src/styles/_tokens.scss`** — colours, spacing scale, typography, shadows. Every visual value goes through a token; nothing is hardcoded.
- **`src/styles/_breakpoints.scss`** — breakpoint variables and `@include sm/md/lg/xl` mixins for clean media queries.
- **Per-component `*.module.scss`** — actual styles, scoped to their component via CSS Modules.

The codebase is mobile-first throughout: default styles target the smallest viewport, then `@include md { … }` and friends add styles as the screen grows. No `max-width` queries; less CSS, fewer overrides.

`prefers-reduced-motion` is respected globally — animations gracefully degrade to static states for users who request reduced motion.

---

## Testing

120 tests across 24 files, running in ~8 seconds.

```bash
npm run test:run
```

Coverage focuses on:

- **Pure logic** — `getIdFromUrl`, `useDebouncedValue` (with fake timers), `favouritesStorage` (including all defensive branches), `favouritesSlice` (every action and selector).
- **Components** — by behaviour and accessibility contract, not by implementation. We use `getByRole`, `getByLabelText`, and `aria-*` attributes as primary selectors.
- **Integration** — every page is tested with a mocked RTK Query hook to verify it correctly handles loading, error, empty, and success states. The store's persistence wiring is tested via dynamic module imports to prove dispatched actions flow through to `localStorage`.

The testing philosophy: **test what could realistically break** — conditional logic, accessibility contracts, integration seams between systems. Trivial render tests for static markup are deliberately avoided.

---

## Accessibility

Some specific decisions worth calling out:

- All interactive elements use the right HTML primitive — `<button>` for actions, `<Link>` for navigation. No clickable `<div>`s.
- Every form input has a real `<label>`, visually hidden via the standard `.sr-only` pattern when the design doesn't show one (e.g. the search inputs).
- The favourite button uses `aria-pressed` (the correct ARIA attribute for toggle buttons; not `aria-checked`, which is for checkboxes).
- Loading, error, and empty states use `role="status"` or `role="alert"` so assistive tech announces them appropriately.
- All decorative icons (back arrows, favourite stars) use `aria-hidden="true"` so screen readers don't read them on top of the meaningful labels.
- Focus styles use `:focus-visible` — visible for keyboard users, not on every mouse click.
- Animations respect `prefers-reduced-motion`.

---

## Notes & Known Limitations

- **SWAPI mirror used:** `swapi.dev`'s SSL certificate has been expired for some time, so the app uses [`swapi.py4e.com`](https://swapi.py4e.com), which mirrors the same API exactly. The base URL is a single constant in `src/api/swapiApi.ts` — swapping providers is a one-line change.
- **Films aren't paginated:** SWAPI returns all 6 films in a single response, so the Films page omits pagination entirely. The `Pagination` component is a separate, opt-in piece — composition rather than configuration.
- **No URL state for search/page:** the current page and search term live in component state, not the URL. Adding `?page=2&search=Luke` to the URL would be a small refactor with `useSearchParams`. Skipped because it wasn't a requirement and adds complexity for assessment scope.
- **Favourites store the data we have at favouriting time** (id, type, title, url) so the favourites page renders without re-fetching every item. The trade-off: if SWAPI ever updated a title, the favourites page would show the cached version until the user re-favourites.

---

## What I'd Add Next

Given more time, the things I'd reach for first:

- Add a `prefers-color-scheme` dark mode (the design token system is ready for it — only colour tokens would change).
- Lazy-load detail pages with `React.lazy` + `Suspense` for a smaller initial bundle.
- Add Playwright tests for one or two end-to-end flows (favourite a character → reload → still there) to prove production-style integration.
