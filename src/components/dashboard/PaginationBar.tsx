import React from 'react';
import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationBarProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  startIndex: number;
  endIndex: number;
  onPrevPage: () => void;
  onNextPage: () => void;
}

export const PaginationBar: React.FC<PaginationBarProps> = ({
  currentPage,
  totalPages,
  totalItems,
  startIndex,
  endIndex,
  onPrevPage,
  onNextPage
}) => {
  return (
    <div className="px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 bg-surface-container-lowest border-t border-outline-variant text-body-sm font-sans font-medium text-on-surface-variant select-none">
      <div>
        {totalItems > 0 ? (
          <>
            Showing <span className="text-on-surface font-semibold tabular-nums">{startIndex + 1}</span> to{' '}
            <span className="text-on-surface font-semibold tabular-nums">{endIndex}</span> of{' '}
            <span className="text-on-surface font-semibold tabular-nums">{totalItems}</span> entries
          </>
        ) : (
          'Showing 0 to 0 of 0 entries'
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="icon"
          onClick={onPrevPage}
          disabled={currentPage === 1 || totalItems === 0}
          className="h-9 w-9 flex items-center justify-center disabled:opacity-40 disabled:pointer-events-none"
          aria-label="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        <div className="px-3.5 py-1.5 bg-surface-container-low rounded-lg border border-outline-variant min-w-max">
          <span className="text-body-sm font-semibold text-on-surface tabular-nums">
            {currentPage} <span className="text-on-surface-variant font-normal">of</span> {totalPages}
          </span>
        </div>

        <Button
          variant="secondary"
          size="icon"
          onClick={onNextPage}
          disabled={currentPage === totalPages || totalItems === 0}
          className="h-9 w-9 flex items-center justify-center disabled:opacity-40 disabled:pointer-events-none"
          aria-label="Next Page"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default PaginationBar;
