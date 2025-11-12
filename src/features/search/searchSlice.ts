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
    resetSearch: (state) => {
      state.query = '';
      state.page = 1;
      state.limit = 24;
      state.sfw = true;
      state.genres = [];
      state.yearMin = null;
      state.yearMax = null;
      state.scoreMin = null;
    },
  },
});

export const { setQuery, setPage, setLimit, toggleSfw, setGenres, setYearRange, setScoreMin, resetSearch } = searchSlice.actions;

export const selectSearchState = (state: RootState) => state.search;

export default searchSlice.reducer;
