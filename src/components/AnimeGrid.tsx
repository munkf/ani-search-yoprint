import type { Anime } from '@/features/jikan/types';
import { AnimeCard } from './AnimeCard';

interface AnimeGridProps {
  anime: Anime[];
}

export const AnimeGrid = ({ anime }: AnimeGridProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
      {anime.map((item) => (
        <AnimeCard key={item.mal_id} anime={item} />
      ))}
    </div>
  );
};
