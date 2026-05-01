import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Character, Film, SwapiListResponse } from "../types/swapi";

const SWAPI_BASE_URL = "https://swapi.py4e.com/api/";

export const swapiApi = createApi({
  reducerPath: "swapiApi",
  baseQuery: fetchBaseQuery({ baseUrl: SWAPI_BASE_URL }),
  endpoints: (builder) => ({
    // --- Characters ---
    getCharacters: builder.query<
      SwapiListResponse<Character>,
      { page: number; search: string }
    >({
      query: ({ page, search }) => ({
        url: "people/",
        params: { page, search: search || undefined },
      }),
    }),

    getCharacterById: builder.query<Character, string>({
      query: (id) => `people/${id}/`,
    }),

    // --- Films ---
    getFilms: builder.query<SwapiListResponse<Film>, { search: string }>({
      query: ({ search }) => ({
        url: "films/",
        params: { search: search || undefined },
      }),
    }),

    getFilmById: builder.query<Film, string>({
      query: (id) => `films/${id}/`,
    }),
  }),
});

export const {
  useGetCharactersQuery,
  useGetCharacterByIdQuery,
  useGetFilmsQuery,
  useGetFilmByIdQuery,
} = swapiApi;
