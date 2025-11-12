import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  selectSearchState,
  setGenres,
  setYearRange,
  setSeason,
  setFormat,
  setAiringStatus,
  setStreamingOn,
  setCountryOfOrigin,
  setSourceMaterial,
  setEpisodesRange,
  setDurationRange,
  setDoujin,
} from '@/features/search/searchSlice';

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

const YEARS = Array.from({ length: new Date().getFullYear() - 1959 }, (_, i) => 1960 + i).reverse();

const SEASONS = ['Winter', 'Spring', 'Summer', 'Fall'];

const FORMATS = ['TV', 'TV Short', 'Movie', 'Special', 'OVA', 'ONA', 'Music'];

const AIRING_STATUS = ['Airing', 'Complete', 'Upcoming'];

const STREAMING_PLATFORMS = ['Crunchyroll', 'Funimation', 'Netflix', 'Hulu', 'Amazon Prime', 'Disney+', 'HIDIVE'];

const COUNTRIES = ['Japan', 'South Korea', 'China', 'United States'];

const SOURCE_MATERIAL = ['Manga', 'Light Novel', 'Original', 'Visual Novel', 'Game', 'Novel', 'Other'];

interface FilterPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const FilterPanel = ({ open, onOpenChange }: FilterPanelProps) => {
  const dispatch = useDispatch();
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const {
    genres,
    yearMin,
    yearMax,
    season,
    format,
    airingStatus,
    streamingOn,
    countryOfOrigin,
    sourceMaterial,
    episodesMin,
    episodesMax,
    durationMin,
    durationMax,
    doujin,
  } = useSelector(selectSearchState);

  const currentYear = new Date().getFullYear();
  const minYear = 1960;

  const handleGenreChange = (genreId: number) => {
    const newGenres = genres.includes(genreId)
      ? genres.filter(id => id !== genreId)
      : [...genres, genreId];
    dispatch(setGenres(newGenres));
  };

  const handleYearChange = (values: number[]) => {
    dispatch(setYearRange({ min: values[0], max: values[1] }));
  };

  const handleEpisodesChange = (values: number[]) => {
    dispatch(setEpisodesRange({ min: values[0], max: values[1] }));
  };

  const handleDurationChange = (values: number[]) => {
    dispatch(setDurationRange({ min: values[0], max: values[1] }));
  };

  const selectedGenreNames = genres.map(id => GENRES.find(g => g.id === id)?.name).filter(Boolean);

  const hasActiveFilters = 
    genres.length > 0 || 
    yearMin !== null || 
    season !== null || 
    format !== null || 
    airingStatus !== null || 
    streamingOn !== null || 
    countryOfOrigin !== null || 
    sourceMaterial !== null || 
    episodesMin !== null || 
    episodesMax !== null || 
    durationMin !== null || 
    durationMax !== null || 
    doujin;

  const clearAllFilters = () => {
    dispatch(setGenres([]));
    dispatch(setYearRange({ min: null, max: null }));
    dispatch(setSeason(null));
    dispatch(setFormat(null));
    dispatch(setAiringStatus(null));
    dispatch(setStreamingOn(null));
    dispatch(setCountryOfOrigin(null));
    dispatch(setSourceMaterial(null));
    dispatch(setEpisodesRange({ min: null, max: null }));
    dispatch(setDurationRange({ min: null, max: null }));
    dispatch(setDoujin(false));
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="pb-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle>Filters</SheetTitle>
              <SheetDescription>
                Refine your search with advanced filters
              </SheetDescription>
            </div>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-xs"
              >
                Clear All
              </Button>
            )}
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Quick Filters Row */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">Genres</Label>
                <Select
                  value={genres.length > 0 ? genres[0].toString() : 'any'}
                  onValueChange={(value) => {
                    if (value === 'any') {
                      dispatch(setGenres([]));
                    } else {
                      const genreId = parseInt(value);
                      if (genres.includes(genreId)) {
                        dispatch(setGenres(genres.filter(id => id !== genreId)));
                      } else {
                        dispatch(setGenres([...genres, genreId]));
                      }
                    }
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Any">
                      {genres.length > 0 ? (genres.length === 1 ? selectedGenreNames[0] : `${genres.length} selected`) : 'Any'}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    {GENRES.map((genre) => (
                      <SelectItem key={genre.id} value={genre.id.toString()}>
                        {genre.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Year</Label>
                <Select
                  value={yearMin?.toString() || 'any'}
                  onValueChange={(value) => {
                    if (value === 'any') {
                      dispatch(setYearRange({ min: null, max: null }));
                    } else {
                      const year = parseInt(value);
                      dispatch(setYearRange({ min: year, max: year }));
                    }
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Any">
                      {yearMin ? yearMin.toString() : 'Any'}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    {YEARS.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Season</Label>
                <Select
                  value={season || 'any'}
                  onValueChange={(value) => dispatch(setSeason(value === 'any' ? null : value))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Any">
                      {season || 'Any'}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    {SEASONS.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Format</Label>
                <Select
                  value={format || 'any'}
                  onValueChange={(value) => dispatch(setFormat(value === 'any' ? null : value))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Any">
                      {format || 'Any'}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    {FORMATS.map((f) => (
                      <SelectItem key={f} value={f}>
                        {f}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Additional Filters */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Additional Filters</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">Airing Status</Label>
                <Select
                  value={airingStatus || 'any'}
                  onValueChange={(value) => dispatch(setAiringStatus(value === 'any' ? null : value))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Any">
                      {airingStatus || 'Any'}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    {AIRING_STATUS.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Streaming On</Label>
                <Select
                  value={streamingOn || 'any'}
                  onValueChange={(value) => dispatch(setStreamingOn(value === 'any' ? null : value))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Any">
                      {streamingOn || 'Any'}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    {STREAMING_PLATFORMS.map((platform) => (
                      <SelectItem key={platform} value={platform}>
                        {platform}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Country Of Origin</Label>
                <Select
                  value={countryOfOrigin || 'any'}
                  onValueChange={(value) => dispatch(setCountryOfOrigin(value === 'any' ? null : value))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Any">
                      {countryOfOrigin || 'Any'}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    {COUNTRIES.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Source Material</Label>
                <Select
                  value={sourceMaterial || 'any'}
                  onValueChange={(value) => dispatch(setSourceMaterial(value === 'any' ? null : value))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Any">
                      {sourceMaterial || 'Any'}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    {SOURCE_MATERIAL.map((source) => (
                      <SelectItem key={source} value={source}>
                        {source}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Range Sliders */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Range Filters</h3>
            <div className="space-y-5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium">Year Range</Label>
                  <span className="text-xs text-muted-foreground">
                    {yearMin || minYear} - {yearMax || currentYear}
                  </span>
                </div>
                <Slider
                  min={minYear}
                  max={currentYear}
                  step={1}
                  value={[yearMin || minYear, yearMax || currentYear]}
                  onValueChange={handleYearChange}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium">Episodes</Label>
                  <span className="text-xs text-muted-foreground">
                    {episodesMin || 0} - {episodesMax || 1000}
                  </span>
                </div>
                <Slider
                  min={0}
                  max={1000}
                  step={1}
                  value={[episodesMin || 0, episodesMax || 1000]}
                  onValueChange={handleEpisodesChange}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium">Duration (min)</Label>
                  <span className="text-xs text-muted-foreground">
                    {durationMin || 0} - {durationMax || 180}
                  </span>
                </div>
                <Slider
                  min={0}
                  max={180}
                  step={5}
                  value={[durationMin || 0, durationMax || 180]}
                  onValueChange={handleDurationChange}
                />
              </div>
            </div>
          </div>

          {/* Checkboxes */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="doujin"
                checked={doujin}
                onCheckedChange={(checked) => dispatch(setDoujin(checked as boolean))}
              />
              <Label htmlFor="doujin" className="text-sm cursor-pointer">
                Doujin
              </Label>
            </div>
          </div>

          {/* Advanced Genres & Tag Filters */}
          <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-0 h-auto font-normal">
                <span className="text-sm font-medium">Advanced Genres & Tag Filters</span>
                <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform ${isAdvancedOpen ? 'rotate-90' : ''}`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4 space-y-0 overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
              <div className="grid grid-cols-2 gap-3 pt-2">
                {GENRES.map((genre) => (
                  <div key={genre.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`genre-${genre.id}`}
                      checked={genres.includes(genre.id)}
                      onCheckedChange={() => handleGenreChange(genre.id)}
                    />
                    <Label
                      htmlFor={`genre-${genre.id}`}
                      className="text-sm cursor-pointer font-normal"
                    >
                      {genre.name}
                    </Label>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </SheetContent>
    </Sheet>
  );
};
