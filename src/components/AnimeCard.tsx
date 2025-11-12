import { Link } from 'react-router-dom';
import { Star, Calendar } from 'lucide-react';
import type { Anime } from '@/features/jikan/types';
import { Card } from '@/components/ui/card';

interface AnimeCardProps {
  anime: Anime;
}

export const AnimeCard = ({ anime }: AnimeCardProps) => {
  const imageUrl = anime.images.webp.large_image_url || anime.images.jpg.large_image_url;
  
  return (
    <Link to={`/anime/${anime.mal_id}`}>
      <Card className="overflow-hidden group cursor-pointer card-hover bg-card border-border h-full">
        <div className="relative aspect-[3/4] overflow-hidden">
          <img
            src={imageUrl}
            alt={anime.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 gradient-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          {anime.score && (
            <div className="absolute top-2 right-2 flex items-center gap-1 bg-background/90 backdrop-blur-sm px-2 py-1 rounded-full text-sm font-semibold">
              <Star className="h-3 w-3 fill-primary text-primary" />
              <span>{anime.score.toFixed(1)}</span>
            </div>
          )}
        </div>
        <div className="p-4 space-y-2">
          <h3 className="font-semibold line-clamp-2 text-foreground group-hover:text-primary transition-colors">
            {anime.title}
          </h3>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span className="px-2 py-0.5 bg-primary/10 text-primary rounded text-xs font-medium">
              {anime.type || 'Unknown'}
            </span>
            {anime.year && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{anime.year}</span>
              </div>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
};
