import CategoryFilter from './CategoryFilter.jsx';
import SearchBar from './SearchBar.jsx';

export default function GigFilters({ filters, setFilters }) {
  return (
    <div className="filters">
      <SearchBar value={filters.query} onChange={(query) => setFilters((current) => ({ ...current, query }))} />
      <CategoryFilter value={filters.category} onChange={(category) => setFilters((current) => ({ ...current, category }))} />
    </div>
  );
}
