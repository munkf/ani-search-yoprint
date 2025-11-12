import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, Shield, ShieldOff, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { setQuery, toggleSfw, selectSearchState } from '@/features/search/searchSlice';
import { useDebounce } from '@/hooks/useDebounce';
import { FilterPanel } from '@/components/FilterPanel';

export const SearchBar = () => {
  const dispatch = useDispatch();
  const { query, sfw } = useSelector(selectSearchState);
  const [inputValue, setInputValue] = useState(query);
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

  return (
    <div className="space-y-4">
      <div className="flex gap-3 w-full max-w-3xl mx-auto">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search for anime..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="pl-10 pr-10 h-12 bg-card border-border focus-visible:ring-primary text-lg"
          />
          {inputValue && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
              onClick={handleClear}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <Button
          variant={sfw ? "default" : "outline"}
          size="lg"
          onClick={() => dispatch(toggleSfw())}
          className="gap-2 h-12"
        >
          {sfw ? <Shield className="h-5 w-5" /> : <ShieldOff className="h-5 w-5" />}
          <span className="hidden sm:inline">SFW</span>
        </Button>
      </div>
      <div className="flex gap-2 w-full max-w-3xl mx-auto">
        <FilterPanel />
      </div>
    </div>
  );
};
