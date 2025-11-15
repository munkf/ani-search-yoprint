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
    <section className="relative w-full min-h-[70vh] overflow-hidden mb-10 mx-0 md:-mx-6 lg:-mx-8 rounded-3xl px-4 sm:px-6">
      {/* Background anime collage */}
      <div 
        className="absolute inset-0 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 p-2 sm:p-4 opacity-25 sm:opacity-40 parallax-bg justify-center items-center place-items-center rotate-0 md:rotate-[-2deg] scale-100 md:scale-[1.1]"
        style={{
          backgroundSize: '200% 200%',
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
              className="aspect-[2/3] rounded-sm overflow-hidden shadow-lg fade-in-up glow-float"
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
      <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/85 to-background/100" />

      {/* Content overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 sm:px-6 text-center py-12 sm:py-16">
        <div className="w-full max-w-xl sm:max-w-3xl mx-auto bg-card/40 sm:bg-transparent backdrop-blur-sm sm:backdrop-blur-0 rounded-2xl sm:rounded-none p-4 sm:p-0">
          <span className="uppercase tracking-widest text-xs md:text-sm text-white/60 mb-3 fade-in-up" style={{ animationDelay: '0.1s' }}>Discover Anime</span>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 drop-shadow-2xl max-w-3xl sm:max-w-4xl leading-tight fade-in-up" style={{ animationDelay: '0.2s' }}>
              Streamlined <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent animate-pulse">Anime</span> Discovery for Every Fan
            </h1>
          <p className="text-base sm:text-lg md:text-lg text-white/90 mb-8 sm:mb-10 max-w-xl sm:max-w-2xl fade-in-up" style={{ animationDelay: '0.3s' }}>
            Search, filter, and keep track of your favorite shows with lightning-fast results powered by the Jikan API.
          </p>
          <div className="w-full max-w-lg sm:max-w-3xl fade-in-up mx-auto" style={{ animationDelay: '0.4s' }}>
            <SearchBar variant="hero" />
          </div>

          <div className="flex justify-center">
            <button
              type="button"
              onClick={scrollToBrowse}
              className="mt-6 sm:mt-12 inline-flex items-center gap-2 text-sm text-white/70 hover:text-primary transition-all duration-300 fade-in-up pulse-ring"
              style={{ animationDelay: '0.5s' }}
            >
              <span>Browse trending anime</span>
              <ChevronDown className="h-4 w-4 animate-bounce" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

