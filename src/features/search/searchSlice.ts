import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/app/store';

interface SearchState {
  query: string;
  page: number;
  limit: number;
  sfw: boolean;
}

const initialState: SearchState = {
  query: '',
  page: 1,
  limit: 24,
  sfw: true,
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
    resetSearch: (state) => {
      state.query = '';
      state.page = 1;
      state.limit = 24;
      state.sfw = true;
    },
  },
});

export const { setQuery, setPage, setLimit, toggleSfw, resetSearch } = searchSlice.actions;

export const selectSearchState = (state: RootState) => state.search;

export default searchSlice.reducer;
