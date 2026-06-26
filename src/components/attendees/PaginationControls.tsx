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
    <div className="border-t border-outline-variant bg-surface-container-lowest">
      <div className="px-4 py-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-on-surface-variant font-sans">
          Showing <span className="font-semibold text-on-surface tabular-nums">{startItem}</span> to{' '}
          <span className="font-semibold text-on-surface tabular-nums">{endItem}</span> of{' '}
          <span className="font-semibold text-on-surface tabular-nums">{totalItems}</span> attendees
        </div>

        <div className="flex items-center justify-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={onPrevPage}
            disabled={currentPage === 1}
            className="gap-1.5 h-9 px-3 disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline text-xs">Previous</span>
          </Button>

          <div className="px-3.5 py-2 bg-surface-container-low rounded-lg border border-outline-variant min-w-max">
            <span className="text-sm font-semibold text-on-surface tabular-nums">
              {currentPage} <span className="text-on-surface-variant font-normal">of</span> {totalPages}
            </span>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={onNextPage}
            disabled={currentPage === totalPages}
            className="gap-1.5 h-9 px-3 disabled:opacity-40"
          >
            <span className="hidden sm:inline text-xs">Next</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaginationControls;
