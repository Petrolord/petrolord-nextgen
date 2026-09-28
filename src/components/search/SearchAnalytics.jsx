import React from 'react';
import { useSearch } from '@/contexts/SearchContext';
import { BarChart2, TrendingUp } from 'lucide-react';

const SearchAnalytics = () => {
  const { analytics } = useSearch();
  const topSearches = Object.entries(analytics.topTerms)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  return (
    <div className="bg-pl-surface border border-pl-border rounded-lg p-4 space-y-4">
      <h3 className="text-pl-text font-medium flex items-center gap-2">
        <BarChart2 className="w-4 h-4 text-pl-accent-text" aria-hidden="true" />
        Analytics
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-pl-sunken/60 p-3 rounded border border-pl-border">
          <span className="text-xs text-pl-muted uppercase">Total Searches</span>
          <p className="text-2xl font-bold text-pl-text font-pl-mono tabular-nums">{analytics.totalSearches}</p>
        </div>
        <div className="bg-pl-sunken/60 p-3 rounded border border-pl-border">
          <span className="text-xs text-pl-muted uppercase">Unique Terms</span>
          <p className="text-2xl font-bold text-pl-text font-pl-mono tabular-nums">{Object.keys(analytics.topTerms).length}</p>
        </div>
      </div>

      <div className="space-y-2">
        <span className="text-xs text-pl-muted uppercase">Your Top Searches</span>
        {topSearches.length === 0 ? (
          <p className="text-xs text-pl-muted">No data yet</p>
        ) : (
          <div className="space-y-1">
            {topSearches.map(([term, count], idx) => (
              <div key={term} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                   <span className="text-pl-muted w-4">{idx + 1}.</span>
                   <span className="text-pl-text">{term}</span>
                </div>
                <span className="text-pl-muted text-xs font-pl-mono tabular-nums">{count}x</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchAnalytics;