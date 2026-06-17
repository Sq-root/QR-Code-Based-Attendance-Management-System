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
    <div className="px-6 py-3.5 flex flex-col sm:flex-row justify-between items-center gap-4 bg-surface-container-lowest text-body-sm font-sans font-medium text-on-surface-variant select-none">
      <div>
        {totalItems > 0 ? (
          <>
            Showing <span className="text-on-surface font-semibold">{startIndex + 1}</span> to{' '}
            <span className="text-on-surface font-semibold">{endIndex}</span> of{' '}
            <span className="text-on-surface font-semibold">{totalItems}</span> entries
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
          className="h-8 w-8 flex items-center justify-center border border-outline-variant hover:bg-surface-container disabled:opacity-30 disabled:pointer-events-none transition-all"
          aria-label="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        <div className="text-body-sm font-semibold text-on-surface px-2">
          Page {currentPage} of {totalPages}
        </div>

        <Button
          variant="secondary"
          size="icon"
          onClick={onNextPage}
          disabled={currentPage === totalPages || totalItems === 0}
          className="h-8 w-8 flex items-center justify-center border border-outline-variant hover:bg-surface-container disabled:opacity-30 disabled:pointer-events-none transition-all"
          aria-label="Next Page"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default PaginationBar;
