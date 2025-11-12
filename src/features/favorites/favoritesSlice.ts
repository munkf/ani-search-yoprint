import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/app/store';
import type { Anime } from '@/features/jikan/types';

interface FavoritesState {
  favorites: Anime[];
}

const loadFavorites = (): Anime[] => {
  try {
    const stored = localStorage.getItem('animeFavorites');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveFavorites = (favorites: Anime[]) => {
  try {
    localStorage.setItem('animeFavorites', JSON.stringify(favorites));
  } catch (error) {
    console.error('Failed to save favorites:', error);
  }
};

const initialState: FavoritesState = {
  favorites: loadFavorites(),
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addFavorite: (state, action: PayloadAction<Anime>) => {
      const exists = state.favorites.find(a => a.mal_id === action.payload.mal_id);
      if (!exists) {
        state.favorites.push(action.payload);
        saveFavorites(state.favorites);
      }
    },
    removeFavorite: (state, action: PayloadAction<number>) => {
      state.favorites = state.favorites.filter(a => a.mal_id !== action.payload);
      saveFavorites(state.favorites);
    },
    toggleFavorite: (state, action: PayloadAction<Anime>) => {
      const index = state.favorites.findIndex(a => a.mal_id === action.payload.mal_id);
      if (index >= 0) {
        state.favorites.splice(index, 1);
      } else {
        state.favorites.push(action.payload);
      }
      saveFavorites(state.favorites);
    },
  },
});

export const { addFavorite, removeFavorite, toggleFavorite } = favoritesSlice.actions;

export const selectFavorites = (state: RootState) => state.favorites.favorites;
export const selectIsFavorite = (state: RootState, malId: number) => 
  state.favorites.favorites.some(a => a.mal_id === malId);

export default favoritesSlice.reducer;
