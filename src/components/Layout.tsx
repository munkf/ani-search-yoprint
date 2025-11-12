import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Film, Heart } from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useSelector } from 'react-redux';
import { selectFavorites } from '@/features/favorites/favoritesSlice';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const favorites = useSelector(selectFavorites);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/search" className="flex items-center gap-2 w-fit">
              <Film className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                AnimeSearch
              </span>
            </Link>
            <nav className="flex items-center gap-2">
              <NavLink to="/search">Search</NavLink>
              <NavLink to="/favorites">
                <div className="flex items-center gap-1">
                  <Heart className="h-4 w-4" />
                  Favorites
                  {favorites.length > 0 && (
                    <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                      {favorites.length}
                    </span>
                  )}
                </div>
              </NavLink>
            </nav>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
};
