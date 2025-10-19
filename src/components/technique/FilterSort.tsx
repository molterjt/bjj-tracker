import React from 'react';
import { Search, Filter, SortAsc } from 'lucide-react';
import { SortOption } from '../../state/types';


interface FilterSortProps {
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  resultCount: number;
  totalCount: number;
}

export default function FilterSort({
  categories,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  searchQuery,
  setSearchQuery,
  resultCount,
  totalCount
}: FilterSortProps) {
  return (
    <div className="filter-sort-container">
      {/* Search Bar */}
      <div className="search-bar">
        <Search size={18} color="#9ca3af" />
        <input
          type="text"
          placeholder="Search techniques..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Filter and Sort Row */}
      <div className="filter-sort-row">
        {/* Category Filter */}
        <div className="filter-group">
          <div className="filter-label">
            <Filter size={16} />
            <span>Category:</span>
          </div>
          <div className="tag-container">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`tag ${selectedCategory === category ? 'selected' : ''}`}
              >
                {category === 'all' ? 'All' : category}
              </button>
            ))}
          </div>
        </div>

        {/* Sort Options */}
        <div className="sort-group">
          <div className="filter-label">
            <SortAsc size={16} />
            <span>Sort:</span>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="sort-select"
          >
            <option value="date-newest">Newest First</option>
            <option value="date-oldest">Oldest First</option>
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="results-count">
        Showing {resultCount} of {totalCount} techniques
      </div>
    </div>
  );
}