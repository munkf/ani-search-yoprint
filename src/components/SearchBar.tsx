import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, X, Shield, ShieldOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { setQuery, selectSearchState, setSfw } from '@/features/search/searchSlice';
import { useDebounce } from '@/hooks/useDebounce';

type SearchBarVariant = 'default' | 'hero';

interface SearchBarProps {
  variant?: SearchBarVariant;
}

export const SearchBar = ({ variant = 'default' }: SearchBarProps) => {
  const dispatch = useDispatch();
  const { query, sfw } = useSelector(selectSearchState);
  const [inputValue, setInputValue] = useState(query);
  const [isAgeDialogOpen, setIsAgeDialogOpen] = useState(false);
  const debouncedValue = useDebounce(inputValue, 400);

  useEffect(() => {
    if (debouncedValue !== query) {
      dispatch(setQuery(debouncedValue));
    }
  }, [debouncedValue, dispatch, query]);

  const handleClear = () => {
    setInputValue('');
    dispatch(setQuery(''));
  };

  const handleSfwToggle = () => {
    // If currently in safe mode and trying to turn on unsafe mode, show dialog
    if (sfw) {
      setIsAgeDialogOpen(true);
    } else {
      // If already in unsafe mode, just toggle back to safe
      dispatch(setSfw(true));
    }
  };

  const handleConfirmAge = () => {
    dispatch(setSfw(false));
    setIsAgeDialogOpen(false);
  };

  // Hero variant (banner search)
  if (variant === 'hero') {
    return (
      <>
        <div className="w-full space-y-8" data-search-bar>
          <div className="flex flex-col gap-6 items-center justify-center">
            {/* Search Input */}
            <div className="w-full max-w-md sm:max-w-2xl mx-auto px-4">
              <div className="relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50 group-focus-within:text-primary transition-colors" />
                <Input
                  type="text"
                  placeholder="Search for anime..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-full pl-14 pr-12 h-14 sm:h-16 bg-white/10 sm:bg-white/5 border border-white/12 sm:border-white/10 text-white placeholder:text-white/70 sm:placeholder:text-white/40 rounded-xl backdrop-blur-sm shadow-2xl focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary transition-all hover:bg-white/8 hover:border-white/20 text-base sm:text-lg glow-pulse"
                />
                {inputValue && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-white/10"
                    onClick={handleClear}
                  >
                    <X className="h-5 w-5 text-white/70 hover:text-white" />
                  </Button>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 items-center justify-center flex-col sm:flex-row sm:items-center sm:justify-center w-full">
              <Button
                onClick={handleSfwToggle}
                className={`w-full sm:w-auto gap-2 h-12 sm:h-12 px-6 py-4 sm:py-3 text-base rounded-lg font-medium transition-all ${
                  sfw
                    ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40'
                    : 'bg-primary hover:bg-primary/90 text-white glow-pulse hover:shadow-lg hover:shadow-primary/50'
                } mt-3 sm:mt-0`}
              >
                {sfw ? (
                  <>
                    <Shield className="h-5 w-5" />
                    <span>Safe</span>
                  </>
                ) : (
                  <>
                    <ShieldOff className="h-5 w-5" />
                    <span>18+</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        <AlertDialog open={isAgeDialogOpen} onOpenChange={setIsAgeDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Age Verification Required</AlertDialogTitle>
              <AlertDialogDescription>
                The 18+ mode displays mature anime content. By clicking "I Confirm", you certify that you are 18 years old or older.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="flex gap-3 justify-end">
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmAge}>
                I Confirm, I am 18+
              </AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  }

  // Default variant (header search)
  return (
    <>
      <div className="w-full" data-search-bar>
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 group-focus-within:text-primary transition-colors" />
          <Input
            type="text"
            placeholder=""
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full pl-11 pr-10 h-11 bg-muted border border-border rounded-lg focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-transparent transition-all hover:bg-muted/80 placeholder:text-muted-foreground/50"
          />
          {inputValue && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0 hover:bg-muted"
              onClick={handleClear}
            >
              <X className="h-4 w-4 text-muted-foreground/60 hover:text-muted-foreground" />
            </Button>
          )}
        </div>
      </div>

      <AlertDialog open={isAgeDialogOpen} onOpenChange={setIsAgeDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Age Verification Required</AlertDialogTitle>
            <AlertDialogDescription>
              The 18+ mode displays mature anime content. By clicking "I Confirm", you certify that you are 18 years old or older.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmAge}>
              I Confirm, I am 18+
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
