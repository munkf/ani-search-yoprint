import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/app/store';

interface SearchState {
  query: string;
  page: number;
  limit: number;
  sfw: boolean;
  genres: number[];
  yearMin: number | null;
  yearMax: number | null;
  scoreMin: number | null;
  season: string | null;
  format: string | null;
  airingStatus: string | null;
  streamingOn: string | null;
  countryOfOrigin: string | null;
  sourceMaterial: string | null;
  episodesMin: number | null;
  episodesMax: number | null;
  durationMin: number | null;
  durationMax: number | null;
  doujin: boolean;
}

const initialState: SearchState = {
  query: '',
  page: 1,
  limit: 24,
  sfw: true,
  genres: [],
  yearMin: null,
  yearMax: null,
  scoreMin: null,
  season: null,
  format: null,
  airingStatus: null,
  streamingOn: null,
  countryOfOrigin: null,
  sourceMaterial: null,
  episodesMin: null,
  episodesMax: null,
  durationMin: null,
  durationMax: null,
  doujin: false,
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
      state.page = 1; // Reset to first page on new search
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload;
      state.page = 1; // Reset to first page on limit change
    },
    toggleSfw: (state) => {
      state.sfw = !state.sfw;
      state.page = 1; // Reset to first page on filter change
    },
    setGenres: (state, action: PayloadAction<number[]>) => {
      state.genres = action.payload;
      state.page = 1;
    },
    setYearRange: (state, action: PayloadAction<{ min: number | null; max: number | null }>) => {
      state.yearMin = action.payload.min;
      state.yearMax = action.payload.max;
      state.page = 1;
    },
    setScoreMin: (state, action: PayloadAction<number | null>) => {
      state.scoreMin = action.payload;
      state.page = 1;
    },
    setSeason: (state, action: PayloadAction<string | null>) => {
      state.season = action.payload;
      state.page = 1;
    },
    setFormat: (state, action: PayloadAction<string | null>) => {
      state.format = action.payload;
      state.page = 1;
    },
    setAiringStatus: (state, action: PayloadAction<string | null>) => {
      state.airingStatus = action.payload;
      state.page = 1;
    },
    setStreamingOn: (state, action: PayloadAction<string | null>) => {
      state.streamingOn = action.payload;
      state.page = 1;
    },
    setCountryOfOrigin: (state, action: PayloadAction<string | null>) => {
      state.countryOfOrigin = action.payload;
      state.page = 1;
    },
    setSourceMaterial: (state, action: PayloadAction<string | null>) => {
      state.sourceMaterial = action.payload;
      state.page = 1;
    },
    setEpisodesRange: (state, action: PayloadAction<{ min: number | null; max: number | null }>) => {
      state.episodesMin = action.payload.min;
      state.episodesMax = action.payload.max;
      state.page = 1;
    },
    setDurationRange: (state, action: PayloadAction<{ min: number | null; max: number | null }>) => {
      state.durationMin = action.payload.min;
      state.durationMax = action.payload.max;
      state.page = 1;
    },
    setDoujin: (state, action: PayloadAction<boolean>) => {
      state.doujin = action.payload;
      state.page = 1;
    },
    resetSearch: (state) => {
      state.query = '';
      state.page = 1;
      state.limit = 24;
      state.sfw = true;
      state.genres = [];
      state.yearMin = null;
      state.yearMax = null;
      state.scoreMin = null;
      state.season = null;
      state.format = null;
      state.airingStatus = null;
      state.streamingOn = null;
      state.countryOfOrigin = null;
      state.sourceMaterial = null;
      state.episodesMin = null;
      state.episodesMax = null;
      state.durationMin = null;
      state.durationMax = null;
      state.doujin = false;
    },
  },
});

export const { 
  setQuery, 
  setPage, 
  setLimit, 
  toggleSfw, 
  setGenres, 
  setYearRange, 
  setScoreMin, 
  setSeason,
  setFormat,
  setAiringStatus,
  setStreamingOn,
  setCountryOfOrigin,
  setSourceMaterial,
  setEpisodesRange,
  setDurationRange,
  setDoujin,
  resetSearch 
} = searchSlice.actions;

export const selectSearchState = (state: RootState) => state.search;

export default searchSlice.reducer;
