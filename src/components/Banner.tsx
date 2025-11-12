import { useGetTopAnimeQuery } from '@/features/jikan/jikanApi';
import { ChevronDown } from 'lucide-react';
import { SearchBar } from '@/components/SearchBar';

export const Banner = () => {
  const { data, isLoading } = useGetTopAnimeQuery({ limit: 25 });

  const animeImages = data?.data?.slice(0, 20) || [];

  const scrollToBrowse = () => {
    const browseSection = document.getElementById('browse-section');
    if (browseSection) {
      browseSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="relative w-full min-h-[70vh] overflow-hidden mb-10 -mx-4 md:-mx-6 lg:-mx-8 rounded-3xl">
      {/* Background anime collage */}
      <div 
        className="absolute inset-0 grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 p-4 opacity-40"
        style={{
          transform: 'rotate(-2deg) scale(1.1)',
        }}
      >
        {isLoading ? (
          // Skeleton loading
          Array.from({ length: 24 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[2/3] bg-muted rounded-sm animate-pulse"
            />
          ))
        ) : (
          animeImages.map((anime, index) => (
            <div
              key={anime.mal_id}
              className="aspect-[2/3] rounded-sm overflow-hidden shadow-lg"
              style={{
                transform: `rotate(${(index % 3 - 1) * 3}deg)`,
                animationDelay: `${index * 0.1}s`,
              }}
            >
              <img
                src={anime.images.jpg.large_image_url || anime.images.jpg.image_url}
                alt={anime.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          ))
        )}
      </div>

      {/* Dark overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background/95" />

      {/* Content overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center py-16">
        <span className="uppercase tracking-widest text-xs md:text-sm text-white/60 mb-3">Discover Anime</span>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-2xl max-w-4xl leading-tight">
          Streamlined <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Anime</span> Discovery for Every Fan
        </h1>
        <p className="text-base md:text-lg text-white/80 mb-10 max-w-2xl">
          Search, filter, and keep track of your favorite shows with lightning-fast results powered by the Jikan API.
        </p>
        <div className="w-full max-w-4xl">
          <SearchBar variant="hero" />
        </div>

        <button
          type="button"
          onClick={scrollToBrowse}
          className="mt-12 inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
        >
          <span>Browse trending anime</span>
          <ChevronDown className="h-4 w-4 animate-bounce" />
        </button>
      </div>
    </section>
  );
};

