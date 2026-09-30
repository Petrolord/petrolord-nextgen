import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '@/contexts/SearchContext';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Search, ArrowRight, CornerDownLeft } from 'lucide-react';
import { SYSTEM_MODULES } from '@/utils/searchUtils';
import { useActiveTheme } from '@/design/activeTheme';
import { FixedTheme } from '@/design/ThemeProvider';

// Design system (docs/scope/DesignSystem-Rollout.md, batch 1A): the modal is
// mounted at the app root, outside every scope. Like the toaster it follows
// the theme of the screen on show (useActiveTheme): it opens on theme roles
// in that screen's theme (a FixedTheme gives the ui kit and the portal the
// scope); with no themed screen mounted (the homepage) it is light.

const GlobalSearchModal = () => {
  const { isGlobalSearchOpen, setIsGlobalSearchOpen, addToHistory } = useSearch();
  const [localQuery, setLocalQuery] = React.useState('');
  const navigate = useNavigate();
  const active = useActiveTheme();

  const filteredResults = localQuery 
    ? SYSTEM_MODULES.filter(m => m.title.toLowerCase().includes(localQuery.toLowerCase())).slice(0, 5)
    : [];

  const handleNavigate = (path, title) => {
    addToHistory(title); // Track even if clicked
    setIsGlobalSearchOpen(false);
    setLocalQuery('');
    navigate(path);
  };

  const handleSearchPage = () => {
      setIsGlobalSearchOpen(false);
      navigate('/search');
  };

  const dialog = (
    <Dialog open={isGlobalSearchOpen} onOpenChange={setIsGlobalSearchOpen}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden">
        <div className="flex items-center pl-4 pr-12 border-b border-pl-border">
          <Search className="w-5 h-5 text-pl-muted mr-3" aria-hidden="true" />
          <Input 
            aria-label="Search"
            className="flex-1 h-14 border-none bg-transparent text-lg text-pl-text placeholder:text-pl-muted focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
            placeholder="Search anything... (Press Enter for full search)"
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            onKeyDown={(e) => {
                if(e.key === 'Enter') handleSearchPage();
            }}
            autoFocus
          />
          <div className="hidden sm:flex items-center gap-2">
            <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-pl-border bg-pl-sunken px-1.5 font-pl-mono text-[10px] font-medium text-pl-muted opacity-100">
              <span className="text-xs">ESC</span>
            </kbd>
          </div>
        </div>

        {localQuery && (
          <div className="p-2">
            {filteredResults.length > 0 ? (
              <div className="space-y-1">
                <p className="px-3 py-2 text-xs font-semibold text-pl-muted uppercase">Quick Results</p>
                {filteredResults.map(res => (
                  <button
                    key={res.id}
                    onClick={() => handleNavigate(res.path, res.title)}
                    className="w-full flex items-center justify-between px-3 py-3 rounded-lg hover:bg-pl-sunken group transition-colors text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pl-focus"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 bg-pl-sunken rounded text-pl-muted group-hover:text-pl-primary-text group-hover:bg-pl-primary/10 transition-colors">
                        <Search className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-pl-text">{res.title}</p>
                        <p className="text-xs text-pl-muted">{res.module}</p>
                      </div>
                    </div>
                    <CornerDownLeft className="w-4 h-4 text-pl-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            ) : (
               <div className="p-8 text-center text-pl-muted">
                   <p>No quick matches found.</p>
                   <button onClick={handleSearchPage} className="text-pl-primary-text hover:text-pl-primary-text-hover hover:underline mt-2 text-sm">Go to Advanced Search page</button>
               </div>
            )}
            
            <div className="mt-2 border-t border-pl-border pt-2 px-2 pb-1">
                 <button 
                    onClick={handleSearchPage}
                    className="w-full flex items-center justify-center gap-2 py-2 text-sm text-pl-primary-text hover:bg-pl-primary/10 rounded transition-colors"
                 >
                    View all results for "{localQuery}" <ArrowRight className="w-4 h-4" />
                 </button>
            </div>
          </div>
        )}

        {!localQuery && (
            <div className="p-8 text-center">
                 <p className="text-pl-muted mb-2">Search across all modules, tools, and settings.</p>
                 <div className="flex justify-center gap-2 text-xs text-pl-muted">
                     <span>Pro tip: Use</span>
                     <kbd className="font-pl-mono border border-pl-border bg-pl-sunken px-1 rounded">CMD + K</kbd>
                     <span>to open this anytime.</span>
                 </div>
            </div>
        )}
      </DialogContent>
    </Dialog>
  );

  return <FixedTheme theme={active || 'light'}>{dialog}</FixedTheme>;
};

export default GlobalSearchModal;