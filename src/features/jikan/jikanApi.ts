import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { SearchAnimeResponse, AnimeDetailResponse, SearchParams } from './types';

export const jikanApi = createApi({
  reducerPath: 'jikanApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://api.jikan.moe/v4' }),
  keepUnusedDataFor: 30,
  endpoints: (builder) => ({
    searchAnime: builder.query<SearchAnimeResponse, SearchParams>({
      query: ({ q = '', page = 1, limit = 24, sfw = true, genres, start_date, end_date, min_score }) => {
        const params: any = { q, page, limit, sfw };
        if (genres) params.genres = genres;
        if (start_date) params.start_date = start_date;
        if (end_date) params.end_date = end_date;
        if (min_score) params.min_score = min_score;
        return { url: '/anime', params };
      },
    }),
    getAnimeById: builder.query<AnimeDetailResponse, number>({
      query: (id) => `/anime/${id}`,
    }),
  }),
});

export const { useSearchAnimeQuery, useGetAnimeByIdQuery } = jikanApi;
