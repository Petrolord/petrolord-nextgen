import React from 'react';
import { useSearch } from '@/contexts/SearchContext';
import { TrendingUp, Clock, Search } from 'lucide-react';

const SearchSuggestions = () => {
  const { setQuery, history, popularSearches, addToHistory } = useSearch();

  const handleSelect = (term) => {
    setQuery(term);
    addToHistory(term);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Recent Searches */}
      <div className="space-y-3">
        <h4 className="text-sm text-pl-muted font-medium flex items-center gap-2">
          <Clock className="w-4 h-4" aria-hidden="true" /> Recent Searches
        </h4>
        <div className="flex flex-col gap-1">
          {history.length === 0 ? (
            <span className="text-sm text-pl-muted italic px-2">No recent searches</span>
          ) : (
            history.slice(0, 5).map((term, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(term)}
                className="text-left text-sm text-pl-text hover:text-pl-primary-text hover:bg-pl-sunken px-3 py-2 rounded-md transition-colors flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pl-focus"
              >
                <Search className="w-3 h-3 text-pl-muted group-hover:text-pl-primary-text" aria-hidden="true" />
                {term}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Popular Searches */}
      <div className="space-y-3">
        <h4 className="text-sm text-pl-muted font-medium flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-pl-accent-text" aria-hidden="true" /> Trending
        </h4>
        <div className="flex flex-col gap-1">
          {popularSearches.map((term, idx) => (
            <button
              key={idx}
              onClick={() => handleSelect(term)}
              className="text-left text-sm text-pl-text hover:text-pl-primary-text hover:bg-pl-sunken px-3 py-2 rounded-md transition-colors flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pl-focus"
            >
              <TrendingUp className="w-3 h-3 text-pl-muted group-hover:text-pl-primary-text" aria-hidden="true" />
              {term}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchSuggestions;