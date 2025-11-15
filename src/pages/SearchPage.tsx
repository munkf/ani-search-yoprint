import { useEffect, useState, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { AlertCircle, Search as SearchIcon, Loader2 } from 'lucide-react';
import { Banner } from '@/components/Banner';
import { FilterPanel, FilterPanelContext } from '@/components/FilterPanel';
import { AnimeGrid } from '@/components/AnimeGrid';
import { SkeletonGrid } from '@/components/SkeletonCard';
import { Button } from '@/components/ui/button';
import { useSearchAnimeQuery } from '@/features/jikan/jikanApi';
import { selectSearchState, setQuery, setPage, setLimit, setGenres, setYearRange, setScoreMin, setSfw, resetSearch } from '@/features/search/searchSlice';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import type { Anime } from '@/features/jikan/types';

const SearchPage = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchState = useSelector(selectSearchState);
  const [allAnime, setAllAnime] = useState<Anime[]>([]);
  const hasInitialized = useRef(false);
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  
  // Sync URL params with Redux state on mount only (one time)
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const urlQuery = searchParams.get('q') || '';
    const urlPage = parseInt(searchParams.get('page') || '1');
    const urlLimit = parseInt(searchParams.get('limit') || '24');
    const urlSfw = searchParams.get('sfw') !== 'false';
    const urlGenres = searchParams.get('genres')?.split(',').map(Number).filter(Boolean) || [];
    const urlYearMin = searchParams.get('yearMin') ? parseInt(searchParams.get('yearMin')!) : null;
    const urlYearMax = searchParams.get('yearMax') ? parseInt(searchParams.get('yearMax')!) : null;
    const urlScoreMin = searchParams.get('scoreMin') ? parseFloat(searchParams.get('scoreMin')!) : null;

    // Build list of dispatches needed
    const dispatches = [];
    if (urlQuery !== '') dispatches.push(() => dispatch(setQuery(urlQuery)));
    if (urlPage !== 1) dispatches.push(() => dispatch(setPage(urlPage)));
    if (urlLimit !== 24) dispatches.push(() => dispatch(setLimit(urlLimit)));
    if (urlSfw !== true) {
      dispatches.push(() => dispatch(setSfw(urlSfw)));
    }
    if (urlGenres.length > 0) dispatches.push(() => dispatch(setGenres(urlGenres)));
    if (urlYearMin || urlYearMax) dispatches.push(() => dispatch(setYearRange({ min: urlYearMin, max: urlYearMax })));
    if (urlScoreMin !== null) dispatches.push(() => dispatch(setScoreMin(urlScoreMin)));

    dispatches.forEach(d => d());
  }, [dispatch, searchParams]);

  useEffect(() => {
    setAllAnime([]);
    // Ensure Redux page resets to first page when filters change so the query uses a single source of truth
    dispatch(setPage(1));
  }, [
    searchState.query,
    searchState.genres,
    searchState.yearMin,
    searchState.yearMax,
    searchState.scoreMin,
    searchState.sfw,
    searchState.season,
    searchState.format,
    searchState.airingStatus,
    searchState.streamingOn,
    searchState.countryOfOrigin,
    searchState.sourceMaterial,
    searchState.episodesMin,
    searchState.episodesMax,
    searchState.durationMin,
    searchState.durationMax,
    searchState.doujin,
    dispatch,
  ]);

  // Update URL when state changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchState.query) params.set('q', searchState.query);
    params.set('page', searchState.page.toString());
    params.set('limit', searchState.limit.toString());
    params.set('sfw', searchState.sfw.toString());
    if (searchState.genres.length > 0) params.set('genres', searchState.genres.join(','));
    if (searchState.yearMin) params.set('yearMin', searchState.yearMin.toString());
    if (searchState.yearMax) params.set('yearMax', searchState.yearMax.toString());
    if (searchState.scoreMin !== null) params.set('scoreMin', searchState.scoreMin.toString());
    setSearchParams(params, { replace: true });
  }, [searchState, setSearchParams]);

  const queryParams = useMemo(() => {
    const params: any = {
      q: searchState.query,
      page: searchState.page,
      limit: searchState.limit,
      sfw: searchState.sfw,
    };
    
    if (searchState.genres.length > 0) {
      params.genres = searchState.genres.join(',');
    }
    
    if (searchState.yearMin) {
      params.start_date = `${searchState.yearMin}-01-01`;
    }
    
    if (searchState.yearMax) {
      params.end_date = `${searchState.yearMax}-12-31`;
    }
    
    if (searchState.scoreMin !== null) {
      params.min_score = searchState.scoreMin;
    }

    if (searchState.season) {
      params.season = searchState.season;
    }

    if (searchState.format) {
      params.format = searchState.format;
    }

    if (searchState.airingStatus) {
      params.status = searchState.airingStatus;
    }

    if (searchState.sourceMaterial) {
      params.source = searchState.sourceMaterial;
    }

    if (searchState.episodesMin) {
      params.episodes = `${searchState.episodesMin}-`;
    } else if (searchState.episodesMax) {
      params.episodes = `-${searchState.episodesMax}`;
    } else if (searchState.episodesMin && searchState.episodesMax) {
      params.episodes = `${searchState.episodesMin}-${searchState.episodesMax}`;
    }

    if (searchState.durationMin) {
      params.duration = `${searchState.durationMin}-`;
    } else if (searchState.durationMax) {
      params.duration = `-${searchState.durationMax}`;
    } else if (searchState.durationMin && searchState.durationMax) {
      params.duration = `${searchState.durationMin}-${searchState.durationMax}`;
    }
    
    // Debug: log the params being sent to the API
    console.log('[SearchPage] API Params:', params);
    
    return params;
  }, [searchState]);

  const { data, error, isLoading, isFetching } = useSearchAnimeQuery(queryParams);

  // Append new data to accumulated anime
  useEffect(() => {
    if (data?.data && !isLoading) {
      console.log('[SearchPage] Received data:', { dataLength: data.data.length, hasMore: data.pagination?.has_next_page });
      setAllAnime(prev => {
        if (searchState.page === 1) return data.data;
        const existingIds = new Set(prev.map(a => a.mal_id));
        const newAnime = data.data.filter(a => !existingIds.has(a.mal_id));
        return [...prev, ...newAnime];
      });
    }
  }, [data, searchState.page, isLoading]);

  const hasMore = data?.pagination?.has_next_page || false;

  const handleLoadMore = () => {
    if (!isFetching && hasMore) {
      // advance the Redux page so queryParams (which read from searchState.page) update
      dispatch(setPage(searchState.page + 1));
    }
  };

  const { observerTarget } = useInfiniteScroll({
    hasMore,
    isLoading: isFetching,
    onLoadMore: handleLoadMore,
  });

  return (
    <FilterPanelContext.Provider value={{ isOpen: filterPanelOpen, setIsOpen: setFilterPanelOpen }}>
      <div className="space-y-8">
        <Banner />

        <section id="browse-section" className="space-y-6">
          {/* Filter and Safe buttons above inline filter panel */}
          <div className="flex flex-col gap-3 w-full max-w-sm">
            <Button
              onClick={() => setFilterPanelOpen(!filterPanelOpen)}
              className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg shadow-lg transition-all"
            >
              {filterPanelOpen ? 'Hide filters' : 'Show filters'}
            </Button>
          </div>

          {/* Inline filter panel */}
          <FilterPanel />

          {error && (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <AlertCircle className="h-16 w-16 text-destructive mb-4" />
              <h3 className="text-xl font-semibold mb-2">Something went wrong</h3>
              <p className="text-muted-foreground mb-4 max-w-md">
                {(error as any)?.data?.message || 'Failed to fetch anime data. Please try again.'}
              </p>
              {/* Debug info */}
              {(error as any) && (
                <pre className="bg-muted p-2 rounded text-xs text-left max-w-md overflow-auto mb-4">
                  {JSON.stringify(error, null, 2)}
                </pre>
              )}
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          )}
          
          {isLoading && allAnime.length === 0 ? (
            <SkeletonGrid />
          ) : allAnime.length === 0 && !isLoading && !isFetching ? (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
              <SearchIcon className="h-20 w-20 text-muted-foreground mb-4 opacity-50" />
              <h3 className="text-2xl font-semibold mb-2">No Results Found</h3>
              <p className="text-muted-foreground max-w-md">
                {searchState.query 
                  ? `No anime found matching "${searchState.query}". Try a different search term.`
                  : 'Start searching for your favorite anime!'}
              </p>
            </div>
          ) : allAnime.length > 0 ? (
            <>
              {data?.pagination && (
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-muted-foreground">
                    Showing {allAnime.length.toLocaleString()} of {data.pagination.items.total.toLocaleString()} results
                  </p>
                </div>
              )}
              <AnimeGrid anime={allAnime} />
              
              {/* Infinite scroll trigger */}
              <div ref={observerTarget} className="py-8 flex justify-center">
                {isFetching && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Loading more...</span>
                  </div>
                )}
                {!hasMore && allAnime.length > 0 && (
                  <p className="text-sm text-muted-foreground">No more results</p>
                )}
              </div>
            </>
          ) : null}
        </section>
      </div>
    </FilterPanelContext.Provider>
  );
};

export default SearchPage;
