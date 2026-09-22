import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PageContainer from '../../components/layout/PageContainer.jsx';
import GigFilters from '../../components/marketplace/GigFilters.jsx';
import GigGrid from '../../components/marketplace/GigGrid.jsx';
import { useGigs } from '../../features/gigs/gigHooks.js';
import { useDebounce } from '../../hooks/useDebounce.js';

export default function Marketplace() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  const debouncedSearch = useDebounce(searchInput, 400);
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'newest';

  // Keeps the URL shareable (?search=video&category=Writing&sort=price-asc)
  // without firing a request on every keystroke — only once the debounced
  // value settles.
  useEffect(() => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (debouncedSearch) next.set('search', debouncedSearch);
        else next.delete('search');
        return next;
      },
      { replace: true },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  function updateParam(key, value) {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value) next.set(key, value);
        else next.delete(key);
        return next;
      },
      { replace: true },
    );
  }

  const { data: gigs, isLoading, isError, error, refetch, isFetching } = useGigs({
    search: debouncedSearch,
    category,
    sort,
  });

  return (
    <PageContainer>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Marketplace</h1>
        <p className="mt-1 text-sm text-slate-500">Discover creators offering design, dev, writing, and more.</p>
      </div>

      <GigFilters
        search={searchInput}
        onSearchChange={setSearchInput}
        category={category}
        onCategoryChange={(value) => updateParam('category', value)}
        sort={sort}
        onSortChange={(value) => updateParam('sort', value)}
      />

      {isFetching && !isLoading ? <p className="mt-4 text-xs text-slate-400">Searching…</p> : null}

      <div className="mt-6">
        <GigGrid
          gigs={gigs}
          isLoading={isLoading}
          isError={isError}
          error={error}
          onRetry={refetch}
          emptyTitle="No gigs match your filters"
          emptyDescription="Try clearing the search or switching category."
        />
      </div>
    </PageContainer>
  );
}
