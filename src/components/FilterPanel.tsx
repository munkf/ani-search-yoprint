import { useDispatch, useSelector } from 'react-redux';
import { SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { selectSearchState, setGenres, setYearRange, setScoreMin } from '@/features/search/searchSlice';

const GENRES = [
  { id: 1, name: 'Action' },
  { id: 2, name: 'Adventure' },
  { id: 4, name: 'Comedy' },
  { id: 8, name: 'Drama' },
  { id: 10, name: 'Fantasy' },
  { id: 14, name: 'Horror' },
  { id: 7, name: 'Mystery' },
  { id: 22, name: 'Romance' },
  { id: 24, name: 'Sci-Fi' },
  { id: 36, name: 'Slice of Life' },
  { id: 30, name: 'Sports' },
  { id: 37, name: 'Supernatural' },
  { id: 41, name: 'Thriller' },
];

export const FilterPanel = () => {
  const dispatch = useDispatch();
  const { genres, yearMin, yearMax, scoreMin } = useSelector(selectSearchState);

  const currentYear = new Date().getFullYear();
  const minYear = 1960;

  const handleGenreToggle = (genreId: number) => {
    const newGenres = genres.includes(genreId)
      ? genres.filter(id => id !== genreId)
      : [...genres, genreId];
    dispatch(setGenres(newGenres));
  };

  const handleYearChange = (values: number[]) => {
    dispatch(setYearRange({ min: values[0], max: values[1] }));
  };

  const handleScoreChange = (values: number[]) => {
    dispatch(setScoreMin(values[0]));
  };

  const hasActiveFilters = genres.length > 0 || yearMin !== null || scoreMin !== null;

  const clearFilters = () => {
    dispatch(setGenres([]));
    dispatch(setYearRange({ min: null, max: null }));
    dispatch(setScoreMin(null));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {hasActiveFilters && (
            <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
              {genres.length + (yearMin !== null ? 1 : 0) + (scoreMin !== null ? 1 : 0)}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-card border-border" align="start">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-sm">Filters</h4>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="h-auto p-1 text-xs">
                <X className="h-3 w-3 mr-1" />
                Clear
              </Button>
            )}
          </div>

          <div className="space-y-3">
            <div>
              <Label className="text-sm font-medium mb-2 block">Genres</Label>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                {GENRES.map((genre) => (
                  <div key={genre.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`genre-${genre.id}`}
                      checked={genres.includes(genre.id)}
                      onCheckedChange={() => handleGenreToggle(genre.id)}
                    />
                    <Label
                      htmlFor={`genre-${genre.id}`}
                      className="text-sm cursor-pointer"
                    >
                      {genre.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">
                Year Range: {yearMin || minYear} - {yearMax || currentYear}
              </Label>
              <Slider
                min={minYear}
                max={currentYear}
                step={1}
                value={[yearMin || minYear, yearMax || currentYear]}
                onValueChange={handleYearChange}
                className="mt-2"
              />
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">
                Minimum Score: {scoreMin !== null ? scoreMin.toFixed(1) : 'Any'}
              </Label>
              <Slider
                min={0}
                max={10}
                step={0.5}
                value={[scoreMin || 0]}
                onValueChange={handleScoreChange}
                className="mt-2"
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
