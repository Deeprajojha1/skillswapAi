import SearchBar from './SearchBar.jsx';
import CategoryFilter from './CategoryFilter.jsx';
import SortDropdown from './SortDropdown.jsx';

export default function GigFilters({ search, onSearchChange, category, onCategoryChange, sort, onSortChange }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <SearchBar value={search} onChange={onSearchChange} />
        <SortDropdown value={sort} onChange={onSortChange} />
      </div>
      <CategoryFilter value={category} onChange={onCategoryChange} />
    </div>
  );
}
