import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPrevPage: () => void;
  onNextPage: () => void;
}

export const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPrevPage,
  onNextPage,
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex items-center justify-between gap-4 px-4 py-4 border-t border-outline-variant bg-surface-container-lowest rounded-b-lg">
      <div className="text-body-sm text-on-surface-variant font-sans">
        Showing <span className="font-semibold text-on-surface">{startItem}</span> to{' '}
        <span className="font-semibold text-on-surface">{endItem}</span> of{' '}
        <span className="font-semibold text-on-surface">{totalItems}</span> attendees
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={onPrevPage}
          disabled={currentPage === 1}
          className="gap-1.5"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Previous</span>
        </Button>

        <div className="px-3 py-1.5 bg-surface-container-low rounded-lg border border-outline-variant">
          <span className="text-body-sm font-semibold text-on-surface">
            {currentPage} / {totalPages}
          </span>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={onNextPage}
          disabled={currentPage === totalPages}
          className="gap-1.5"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default PaginationControls;
