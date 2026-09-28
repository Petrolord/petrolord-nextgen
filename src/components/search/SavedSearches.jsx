import React, { useState } from 'react';
import { useSearch } from '@/contexts/SearchContext';
import { Bookmark, Trash2, Play, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const SavedSearches = () => {
  const { savedSearches, deleteSavedSearch, loadSavedSearch, saveSearch, query, filters } = useSearch();
  const [newSaveName, setNewSaveName] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSave = () => {
    if (newSaveName.trim()) {
      saveSearch(newSaveName, query, filters);
      setNewSaveName('');
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="bg-pl-surface border border-pl-border rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-pl-text font-medium flex items-center gap-2">
          <Bookmark className="w-4 h-4 text-pl-accent-text" aria-hidden="true" />
          Saved Searches
        </h3>
        
        {query && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="h-7 text-xs">
                <Save className="w-3 h-3 mr-1.5" /> Save Current
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Save Search Configuration</DialogTitle>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm text-pl-muted">Name</label>
                  <Input 
                    value={newSaveName} 
                    onChange={(e) => setNewSaveName(e.target.value)} 
                    placeholder="e.g., Active Reservoir Apps"
                  />
                </div>
                <div className="text-xs text-pl-muted bg-pl-sunken p-3 rounded">
                  <p><strong>Query:</strong> {query}</p>
                  <p><strong>Module:</strong> {filters.module}</p>
                </div>
                <Button onClick={handleSave} className="w-full">
                  Save Search
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="space-y-2">
        {savedSearches.length === 0 ? (
          <p className="text-xs text-pl-muted italic text-center py-4">No saved searches yet.</p>
        ) : (
          savedSearches.map((item) => (
            <div key={item.id} className="group flex items-center justify-between p-2 rounded bg-pl-sunken/60 hover:bg-pl-sunken transition-colors">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-pl-text font-medium truncate">{item.name}</p>
                <p className="text-xs text-pl-muted truncate">{item.query || '(No keywords)'} • {item.filters.module}</p>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-7 w-7 text-pl-primary-text hover:text-pl-primary-text-hover hover:bg-pl-primary/10"
                  onClick={() => loadSavedSearch(item)}
                >
                  <Play className="w-3 h-3" />
                </Button>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-7 w-7 text-pl-danger-text hover:text-pl-danger-text hover:bg-pl-danger-bg"
                  onClick={() => deleteSavedSearch(item.id)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SavedSearches;