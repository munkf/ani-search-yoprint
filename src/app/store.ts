import { configureStore } from '@reduxjs/toolkit';
import { jikanApi } from '@/features/jikan/jikanApi';
import searchReducer from '@/features/search/searchSlice';

export const store = configureStore({
  reducer: {
    [jikanApi.reducerPath]: jikanApi.reducer,
    search: searchReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(jikanApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
