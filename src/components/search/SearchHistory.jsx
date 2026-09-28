import React from 'react';
import { useSearch } from '@/contexts/SearchContext';
import { History, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SearchHistory = () => {
  const { history, clearHistory, removeHistoryItem, setQuery } = useSearch();

  if (history.length === 0) return null;

  return (
    <div className="bg-pl-surface border border-pl-border rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-pl-text font-medium flex items-center gap-2">
          <History className="w-4 h-4 text-pl-accent-text" aria-hidden="true" />
          History
        </h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={clearHistory}
          className="text-xs hover:text-pl-danger-text h-6 px-2"
        >
          Clear All
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {history.map((term, idx) => (
          <div 
            key={idx}
            className="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-pl-sunken border border-pl-border hover:border-pl-border-strong transition-colors"
          >
            <button 
              onClick={() => setQuery(term)}
              className="text-xs text-pl-text hover:text-pl-primary-text"
            >
              {term}
            </button>
            <button
              onClick={() => removeHistoryItem(term)}
              className="text-pl-muted hover:text-pl-text"
              aria-label={`Remove ${term}`}
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchHistory;