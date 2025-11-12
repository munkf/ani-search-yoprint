import { configureStore } from '@reduxjs/toolkit';
import { jikanApi } from '@/features/jikan/jikanApi';
import searchReducer from '@/features/search/searchSlice';
import favoritesReducer from '@/features/favorites/favoritesSlice';

export const store = configureStore({
  reducer: {
    [jikanApi.reducerPath]: jikanApi.reducer,
    search: searchReducer,
    favorites: favoritesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(jikanApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
