import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { AlertCircle, Search as SearchIcon } from 'lucide-react';
import { SearchBar } from '@/components/SearchBar';
import { AnimeGrid } from '@/components/AnimeGrid';
import { SkeletonGrid } from '@/components/SkeletonCard';
import { Pagination } from '@/components/Pagination';
import { Button } from '@/components/ui/button';
import { useSearchAnimeQuery } from '@/features/jikan/jikanApi';
import { selectSearchState, setQuery, setPage, setLimit, toggleSfw } from '@/features/search/searchSlice';

const SearchPage = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchState = useSelector(selectSearchState);
  
  // Sync URL params with Redux state on mount
  useEffect(() => {
    const urlQuery = searchParams.get('q') || '';
    const urlPage = parseInt(searchParams.get('page') || '1');
    const urlLimit = parseInt(searchParams.get('limit') || '24');
    const urlSfw = searchParams.get('sfw') !== 'false';

    if (urlQuery !== searchState.query) dispatch(setQuery(urlQuery));
    if (urlPage !== searchState.page) dispatch(setPage(urlPage));
    if (urlLimit !== searchState.limit) dispatch(setLimit(urlLimit));
    if (urlSfw !== searchState.sfw) dispatch(toggleSfw());
  }, []);

  // Update URL when state changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchState.query) params.set('q', searchState.query);
    params.set('page', searchState.page.toString());
    params.set('limit', searchState.limit.toString());
    params.set('sfw', searchState.sfw.toString());
    setSearchParams(params, { replace: true });
  }, [searchState, setSearchParams]);

  const { data, error, isLoading, isFetching } = useSearchAnimeQuery({
    q: searchState.query,
    page: searchState.page,
    limit: searchState.limit,
    sfw: searchState.sfw,
  });

  const handlePageChange = (page: number) => {
    dispatch(setPage(page));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6">
      <SearchBar />
      
      {error && (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <AlertCircle className="h-16 w-16 text-destructive mb-4" />
          <h3 className="text-xl font-semibold mb-2">Something went wrong</h3>
          <p className="text-muted-foreground mb-4 max-w-md">
            {(error as any)?.data?.message || 'Failed to fetch anime data. Please try again.'}
          </p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      )}
      
      {isLoading || isFetching ? (
        <SkeletonGrid />
      ) : data?.data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <SearchIcon className="h-20 w-20 text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-2xl font-semibold mb-2">No Results Found</h3>
          <p className="text-muted-foreground max-w-md">
            {searchState.query 
              ? `No anime found matching "${searchState.query}". Try a different search term.`
              : 'Start searching for your favorite anime!'}
          </p>
        </div>
      ) : data?.data ? (
        <>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">
              Found {data.pagination.items.total.toLocaleString()} results
            </p>
          </div>
          <AnimeGrid anime={data.data} />
          {data.pagination.last_visible_page > 1 && (
            <Pagination
              current={searchState.page}
              totalPages={data.pagination.last_visible_page}
              onChange={handlePageChange}
            />
          )}
        </>
      ) : null}
    </div>
  );
};

export default SearchPage;
