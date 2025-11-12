import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { SearchAnimeResponse, AnimeDetailResponse, SearchParams } from './types';

export const jikanApi = createApi({
  reducerPath: 'jikanApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://api.jikan.moe/v4' }),
  keepUnusedDataFor: 30,
  endpoints: (builder) => ({
    searchAnime: builder.query<SearchAnimeResponse, SearchParams>({
      query: ({ q = '', page = 1, limit = 24, sfw = true }) => ({
        url: '/anime',
        params: {
          q,
          page,
          limit,
          sfw,
        },
      }),
    }),
    getAnimeById: builder.query<AnimeDetailResponse, number>({
      query: (id) => `/anime/${id}`,
    }),
  }),
});

export const { useSearchAnimeQuery, useGetAnimeByIdQuery } = jikanApi;
