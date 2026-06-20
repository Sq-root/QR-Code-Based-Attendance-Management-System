import React from 'react';
import { Search, X } from 'lucide-react';
import { Button } from '../ui/button';

interface AttendeesFiltersBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onClearFilters: () => void;
  totalCount: number;
}

export const AttendeesFiltersBar: React.FC<AttendeesFiltersBarProps> = ({
  searchQuery,
  onSearchChange,
  onClearFilters,
  totalCount,
}) => {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-4 space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-title-md font-semibold text-on-surface">Registered Attendees</h3>
          <p className="text-body-sm text-on-surface-variant mt-0.5">
            {totalCount} attendee{totalCount !== 1 ? 's' : ''} total
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial sm:min-w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name, phone, area..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full h-10 pl-10 pr-8 rounded-lg border border-outline-variant bg-surface-container-lowest text-body-sm placeholder:text-on-surface-variant outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/15 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 hover:bg-surface-container-low rounded transition-colors"
                aria-label="Clear search"
              >
                <X className="w-4 h-4 text-on-surface-variant" />
              </button>
            )}
          </div>
        </div>
      </div>

      {searchQuery && (
        <div className="flex items-center justify-between bg-secondary-container/30 border border-secondary-container/50 rounded-lg p-3">
          <span className="text-label-sm font-medium text-on-secondary-container">
            Filtered results for: <strong>"{searchQuery}"</strong>
          </span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="h-auto px-2 py-1 text-label-sm"
          >
            Clear
          </Button>
        </div>
      )}
    </div>
  );
};

export default AttendeesFiltersBar;
