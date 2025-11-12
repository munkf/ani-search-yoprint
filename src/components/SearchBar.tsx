import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, Shield, ShieldOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { setQuery, toggleSfw, selectSearchState } from '@/features/search/searchSlice';
import { useDebounce } from '@/hooks/useDebounce';

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

  return (
    <div className="flex gap-3 w-full max-w-3xl mx-auto mb-8">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search for anime..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="pl-10 h-12 bg-card border-border focus-visible:ring-primary text-lg"
        />
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
  );
};
