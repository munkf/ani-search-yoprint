import { useState, createContext, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
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
  setFormat,
  setAiringStatus,
  setSfw,
  setRating,
} from '@/features/search/searchSlice';

export const FilterPanelContext = createContext<{
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
} | null>(null);

export const useFilterPanel = () => {
  const context = useContext(FilterPanelContext);
  if (!context) {
    throw new Error('useFilterPanel must be used within FilterPanelProvider');
  }
  return context;
};

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
];

const AIRING_STATUS = ['Airing', 'Upcoming', 'Complete'];

const ORDER_OPTIONS = ['Score', 'Title', 'Episodes', 'Status', 'Start Date', 'Mean Score', 'Aired'];

const SORT_OPTIONS = ['Desc', 'Asc'];

interface FilterPanelProps {
  // No longer used; component manages its own open state
}

export const FilterPanel = ({}: FilterPanelProps) => {
  const dispatch = useDispatch();
  const filterContext = useContext(FilterPanelContext);
  const [localOpen, setLocalOpen] = useState(false);
  
  // Use context if available, otherwise use local state
  const isOpen = filterContext?.isOpen ?? localOpen;
  const setIsOpen = filterContext?.setIsOpen ?? setLocalOpen;
  
  const [orderBy, setOrderBy] = useState('Score');
  const [sortBy, setSortByState] = useState('Desc');
  const [yearInput, setYearInput] = useState<string>('');
  const [scoreMin, setScoreMin] = useState<string>('');
  const [scoreMax, setScoreMax] = useState<string>('');
  
  const {
    genres,
    format,
    airingStatus,
    sfw,
    rating,
  } = useSelector(selectSearchState);
  const [isAgeDialogOpen, setIsAgeDialogOpen] = useState(false);

  const handleGenreChange = (genreId: number) => {
    const newGenres = genres.includes(genreId)
      ? genres.filter(id => id !== genreId)
      : [...genres, genreId];
    dispatch(setGenres(newGenres));
  };

  const clearAllFilters = () => {
    dispatch(setGenres([]));
    dispatch(setFormat(null));
    dispatch(setAiringStatus(null));
    dispatch(setRating(null));
    dispatch(setSfw(true));
    setYearInput('');
    setScoreMin('');
    setScoreMax('');
    setOrderBy('Score');
    setSortByState('Desc');
  };

  const handleSfwToggle = () => {
    if (sfw) {
      setIsAgeDialogOpen(true);
    } else {
      dispatch(setSfw(true));
    }
  };

  const handleConfirmAge = () => {
    dispatch(setSfw(false));
    setIsAgeDialogOpen(false);
  };

  // Store context in window for SearchPage to access
  if (typeof window !== 'undefined') {
    (window as any).__filterPanelState = {
      isOpen,
      setIsOpen,
    };
  }

  return (
    <FilterPanelContent 
      isOpen={isOpen} 
      setIsOpen={setIsOpen}
      genres={genres}
      format={format}
      airingStatus={airingStatus}
      sfw={sfw}
      rating={rating}
      orderBy={orderBy}
      setOrderBy={setOrderBy}
      sortBy={sortBy}
      setSortBy={setSortByState}
      yearInput={yearInput}
      setYearInput={setYearInput}
      scoreMin={scoreMin}
      setScoreMin={setScoreMin}
      scoreMax={scoreMax}
      setScoreMax={setScoreMax}
      handleGenreChange={handleGenreChange}
      clearAllFilters={clearAllFilters}
      handleSfwToggle={handleSfwToggle}
      isAgeDialogOpen={isAgeDialogOpen}
      setIsAgeDialogOpen={setIsAgeDialogOpen}
      handleConfirmAge={handleConfirmAge}
    />
  );
};

interface FilterPanelContentProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  genres: number[];
  format: string | null;
  airingStatus: string | null;
  sfw: boolean;
  rating: string | null;
  orderBy: string;
  setOrderBy: (order: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  yearInput: string;
  setYearInput: (year: string) => void;
  scoreMin: string;
  setScoreMin: (score: string) => void;
  scoreMax: string;
  setScoreMax: (score: string) => void;
  handleGenreChange: (genreId: number) => void;
  clearAllFilters: () => void;
  handleSfwToggle: () => void;
  isAgeDialogOpen: boolean;
  setIsAgeDialogOpen: (open: boolean) => void;
  handleConfirmAge: () => void;
}

const FilterPanelContent = (props: FilterPanelContentProps) => {
  const dispatch = useDispatch();
  const {
    isOpen,
    setIsOpen,
    genres,
    format,
    airingStatus,
    sfw,
    rating,
    orderBy,
    setOrderBy,
    sortBy,
    setSortBy,
    yearInput,
    setYearInput,
    scoreMin,
    setScoreMin,
    scoreMax,
    setScoreMax,
    handleGenreChange,
    clearAllFilters,
    handleSfwToggle,
    isAgeDialogOpen,
    setIsAgeDialogOpen,
    handleConfirmAge,
  } = props;

  return (
    <div className="w-full space-y-4">
      {/* Expandable filters container */}
      {isOpen && (
        <div className="bg-card border border-border rounded-lg p-6 space-y-6">
          
          {/* Type + Status row */}
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-3">
              <span className="text-sm font-medium">Type:</span>
              {['TV','Movie','OVA'].map(t => (
                <button
                  key={t}
                  onClick={() => dispatch(setFormat(format === t ? null : t))}
                  className={`chip ${format === t ? 'chip-active' : ''}`}
                  aria-pressed={format === t}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium">Status:</span>
              {AIRING_STATUS.map(s => (
                <button
                  key={s}
                  onClick={() => dispatch(setAiringStatus(airingStatus === s ? null : s))}
                  className={`chip ${airingStatus === s ? 'chip-active' : ''}`}
                  aria-pressed={airingStatus === s}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Rating + Score + Year + SFW row */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Rating:</span>
              <div className="flex items-center gap-2">
                {['Any','G','PG','R','R18'].map((r) => {
                  const isAny = r === 'Any';
                  const active = isAny ? rating === null : rating === r;
                  return (
                    <button
                      key={r}
                      onClick={() => dispatch(setRating(isAny ? null : r))}
                      className={`chip ${active ? 'chip-active' : ''}`}
                      aria-pressed={active}
                    >
                      {r}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Score:</span>
              <input 
                type="number" 
                placeholder="Min" 
                value={scoreMin}
                onChange={(e) => setScoreMin(e.target.value)}
                className="w-16 px-2 py-1 rounded-md bg-transparent border border-border text-sm" 
              />
              <input 
                type="number" 
                placeholder="Max" 
                value={scoreMax}
                onChange={(e) => setScoreMax(e.target.value)}
                className="w-16 px-2 py-1 rounded-md bg-transparent border border-border text-sm" 
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Year:</span>
              <input 
                type="text" 
                placeholder="e.g. 2025" 
                value={yearInput}
                onChange={(e) => setYearInput(e.target.value)}
                className="px-3 py-1 rounded-md bg-transparent border border-border text-sm w-28" 
              />
            </div>
          </div>

          {/* Order + Sort row */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Order:</span>
              <Select value={orderBy} onValueChange={setOrderBy}>
                <SelectTrigger className="w-32">
                  <SelectValue>{orderBy}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {ORDER_OPTIONS.map((opt) => (
                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-24">
                  <SelectValue>{sortBy}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((opt) => (
                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Genres section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-foreground">Genres</h3>
              {genres.length > 0 && (
                <span className="text-xs text-muted-foreground">{genres.length} selected</span>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {GENRES.map((genre) => {
                const active = genres.includes(genre.id);
                return (
                  <button 
                    key={genre.id} 
                    onClick={() => handleGenreChange(genre.id)} 
                    className={`chip ${active ? 'chip-active' : ''}`} 
                    aria-pressed={active}
                  >
                    {genre.name}
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      )}

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
            <AlertDialogAction onClick={handleConfirmAge}>I Confirm, I am 18+</AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

