import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Star, Calendar, Heart } from 'lucide-react';
import type { Anime } from '@/features/jikan/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toggleFavorite, selectIsFavorite } from '@/features/favorites/favoritesSlice';
import type { RootState } from '@/app/store';

interface AnimeCardProps {
  anime: Anime;
}

export const AnimeCard = ({ anime }: AnimeCardProps) => {
  const dispatch = useDispatch();
  const isFavorite = useSelector((state: RootState) => selectIsFavorite(state, anime.mal_id));
  const imageUrl = anime.images.webp.large_image_url || anime.images.jpg.large_image_url;
  
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleFavorite(anime));
  };

  return (
    <Link to={`/anime/${anime.mal_id}`}>
      <Card className="overflow-hidden group cursor-pointer card-hover bg-card border-border h-full transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20">
        <div className="relative aspect-[3/4] overflow-hidden">
          <img
            src={imageUrl}
            alt={anime.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 gradient-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute top-2 right-2 flex items-center gap-2">
            {anime.score && (
              <div className="flex items-center gap-1 bg-background/90 backdrop-blur-sm px-2 py-1 rounded-full text-sm font-semibold glow-pulse">
                <Star className="h-3 w-3 fill-primary text-primary" />
                <span>{anime.score.toFixed(1)}</span>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 left-2 h-8 w-8 p-0 bg-background/90 backdrop-blur-sm hover:bg-background/80 opacity-0 group-hover:opacity-100 transition-all duration-300 pulse-ring"
            onClick={handleFavoriteClick}
          >
            <Heart className={`h-4 w-4 transition-all ${isFavorite ? 'fill-primary text-primary scale-110' : 'text-muted-foreground'}`} />
          </Button>
        </div>
        <div className="p-4 space-y-2">
          <h3 className="font-semibold line-clamp-2 text-foreground group-hover:text-primary transition-colors duration-300">
            {anime.title}
          </h3>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span className="px-2 py-0.5 bg-primary/10 text-primary rounded text-xs font-medium group-hover:bg-primary/20 transition-colors">
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
