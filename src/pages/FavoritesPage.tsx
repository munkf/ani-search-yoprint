import { useSelector } from 'react-redux';
import { Heart } from 'lucide-react';
import { selectFavorites } from '@/features/favorites/favoritesSlice';
import { AnimeGrid } from '@/components/AnimeGrid';

const FavoritesPage = () => {
  const favorites = useSelector(selectFavorites);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Heart className="h-8 w-8 text-primary fill-primary" />
        <h1 className="text-3xl font-bold">My Favorites</h1>
      </div>

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <Heart className="h-20 w-20 text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-2xl font-semibold mb-2">No Favorites Yet</h3>
          <p className="text-muted-foreground max-w-md">
            Start adding your favorite anime by clicking the heart icon on anime cards!
          </p>
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            {favorites.length} {favorites.length === 1 ? 'anime' : 'anime'} in your favorites
          </p>
          <AnimeGrid anime={favorites} />
        </>
      )}
    </div>
  );
};

export default FavoritesPage;
