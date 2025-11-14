import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { SearchAnimeResponse, AnimeDetailResponse, SearchParams } from './types';

export const jikanApi = createApi({
  reducerPath: 'jikanApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://api.jikan.moe/v4' }),
  keepUnusedDataFor: 30,
  endpoints: (builder) => ({
    searchAnime: builder.query<SearchAnimeResponse, SearchParams>({
      query: ({ q = '', page = 1, limit = 24, sfw = true, genres, start_date, end_date, min_score, season, format, status, source, episodes, duration, rating }) => {
        const params: any = { q, page, limit, sfw };
        if (genres) params.genres = genres;
        if (start_date) params.start_date = start_date;
        if (end_date) params.end_date = end_date;
        if (min_score) params.min_score = min_score;
        if (season) params.season = season.toLowerCase();
        if (format) params.type = format;
        if (status) params.status = status.toLowerCase();
        if (source) params.source = source;
        if (episodes) params.episodes = episodes;
        if (duration) params.duration = duration;
        if (rating) params.rating = rating;
        return { url: '/anime', params };
      },
    }),
    getAnimeById: builder.query<AnimeDetailResponse, number>({
      query: (id) => `/anime/${id}`,
    }),
    getAnimeCharacters: builder.query<any, number>({
      query: (id) => `/anime/${id}/characters`,
    }),
    getAnimeStaff: builder.query<any, number>({
      query: (id) => `/anime/${id}/staff`,
    }),
    getAnimeRelations: builder.query<any, number>({
      query: (id) => `/anime/${id}/relations`,
    }),
    getAnimeRecommendations: builder.query<any, number>({
      query: (id) => `/anime/${id}/recommendations`,
    }),
    getAnimeStatistics: builder.query<any, number>({
      query: (id) => `/anime/${id}/statistics`,
    }),
    getTopAnime: builder.query<SearchAnimeResponse, { limit?: number }>({
      query: ({ limit = 25 }) => ({ url: '/top/anime', params: { limit } }),
    }),
  }),
});

export const {
  useSearchAnimeQuery,
  useGetAnimeByIdQuery,
  useGetAnimeCharactersQuery,
  useGetAnimeStaffQuery,
  useGetAnimeRelationsQuery,
  useGetAnimeRecommendationsQuery,
  useGetAnimeStatisticsQuery,
  useGetTopAnimeQuery,
} = jikanApi;
