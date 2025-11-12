import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, X, Filter, Shield, ShieldOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { setQuery, selectSearchState, toggleSfw } from '@/features/search/searchSlice';
import { useDebounce } from '@/hooks/useDebounce';
import { FilterPanel } from '@/components/FilterPanel';

type SearchBarVariant = 'default' | 'hero';

interface SearchBarProps {
  variant?: SearchBarVariant;
}

export const SearchBar = ({ variant = 'default' }: SearchBarProps) => {
  const dispatch = useDispatch();
  const { query, sfw } = useSelector(selectSearchState);
  const [inputValue, setInputValue] = useState(query);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
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

  const labelClasses =
    variant === 'hero'
      ? 'text-sm text-white/90'
      : 'text-sm text-muted-foreground';

  const inputClasses =
    variant === 'hero'
      ? 'pl-12 pr-12 h-14 bg-white/10 border-white/20 text-white placeholder:text-white/70 backdrop-blur-sm shadow-lg focus-visible:ring-white/70'
      : 'pl-10 pr-10 h-10 bg-card border-border focus-visible:ring-primary';

  const containerClasses =
    variant === 'hero'
      ? 'flex flex-wrap gap-3 items-end justify-center'
      : 'flex flex-wrap gap-3 items-end';

  const filterButtonVariant = variant === 'hero' ? 'default' : 'outline';
  const filterButtonClasses =
    variant === 'hero'
      ? 'gap-2 h-14 px-6 text-base shadow-lg'
      : 'gap-2 h-10';

  const nsfwButtonClasses =
    variant === 'hero'
      ? 'gap-2 h-14 px-6 text-base shadow-lg'
      : 'gap-2 h-10';

  return (
    <>
      <div className={`space-y-4 ${variant === 'hero' ? 'text-white' : ''}`} data-search-bar>
        <div className={containerClasses}>
          <div className={`flex-1 ${variant === 'hero' ? 'min-w-[260px]' : 'min-w-[200px]'}`}>
            <Label className={`mb-2 block ${labelClasses}`}>
              Search
            </Label>
            <div className="relative">
              <Search
                className={`absolute ${variant === 'hero' ? 'left-4' : 'left-3'} top-1/2 -translate-y-1/2 h-5 w-5 ${
                  variant === 'hero' ? 'text-white/70' : 'text-muted-foreground'
                }`}
              />
              <Input
                type="text"
                placeholder="Q"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className={inputClasses}
              />
              {inputValue && (
                <Button
                  variant="ghost"
                  size="sm"
                  className={`absolute ${variant === 'hero' ? 'right-2' : 'right-1'} top-1/2 -translate-y-1/2 ${
                    variant === 'hero' ? 'h-9 w-9' : 'h-8 w-8'
                  } p-0`}
                  onClick={handleClear}
                >
                  <X className={`h-4 w-4 ${variant === 'hero' ? 'text-white' : ''}`} />
                </Button>
              )}
            </div>
          </div>

          <div className="flex gap-2 items-end">
            <Button
              variant={filterButtonVariant}
              onClick={() => setIsFilterOpen(true)}
              className={filterButtonClasses}
            >
              <Filter className="h-4 w-4" />
              <span>{variant === 'hero' ? 'Explore Filters' : 'Filters'}</span>
            </Button>

            <Button
              variant={sfw ? "outline" : "default"}
              size="sm"
              onClick={() => dispatch(toggleSfw())}
              className={nsfwButtonClasses}
            >
              {sfw ? (
                <>
                  <Shield className="h-4 w-4" />
                  <span className="hidden sm:inline">{variant === 'hero' ? 'Safe' : 'SFW'}</span>
                </>
              ) : (
                <>
                  <ShieldOff className="h-4 w-4" />
                  <span className="hidden sm:inline">NSFW</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <FilterPanel open={isFilterOpen} onOpenChange={setIsFilterOpen} />
    </>
  );
};
