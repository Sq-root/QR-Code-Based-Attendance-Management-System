import React from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Search, X, RefreshCw } from 'lucide-react';
import AttendanceLogsTable from './AttendanceLogsTable';
import AttendanceLogsList from './AttendanceLogsList';
import PaginationBar from './PaginationBar';
import type { ActivityLog } from '../../mock/attendanceData';

interface AttendanceLogsCardProps {
  logs: ActivityLog[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isRefreshing: boolean;
  onRefresh: () => void;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  startIndex: number;
  endIndex: number;
  onPrevPage: () => void;
  onNextPage: () => void;
}

export const AttendanceLogsCard: React.FC<AttendanceLogsCardProps> = ({
  logs,
  searchQuery,
  onSearchChange,
  isRefreshing,
  onRefresh,
  currentPage,
  totalPages,
  totalItems,
  startIndex,
  endIndex,
  onPrevPage,
  onNextPage
}) => {
  return (
    <Card className="shadow-sm overflow-hidden flex flex-col">
      <div className="px-6 py-4 border-b border-outline-variant/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface-container-lowest">
        <div className="flex items-center gap-3">
          <h3 className="text-body-lg font-bold text-primary font-sans">Attendance Logs</h3>
          <span className="text-label-md font-mono text-secondary bg-secondary/10 px-2 py-0.5 rounded-md border border-secondary/15 font-semibold">
            Live Feed
          </span>
        </div>

        {/* Client Search and Refresh controls */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex items-center flex-1 sm:flex-initial">
            <Search className="absolute left-3 w-4 h-4 text-on-surface-variant/70 pointer-events-none" />
            <input
              type="text"
              placeholder="Search attendee or session..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full sm:w-64 pl-9 pr-8 py-2 border border-outline-variant bg-surface-container-lowest rounded-lg text-body-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors font-sans"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 p-1 rounded-full text-on-surface-variant/70 hover:text-on-surface hover:bg-surface-container-high transition-all"
                title="Clear search"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
          <Button
            variant="secondary"
            size="icon"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center justify-center border border-outline-variant hover:bg-surface-container disabled:opacity-50 disabled:pointer-events-none transition-all"
            title="Refresh logs"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-secondary' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Responsive View: Table on desktop, list view on mobile */}
      <AttendanceLogsTable logs={logs} />
      <AttendanceLogsList logs={logs} />

      {/* Pagination Controls Bar */}
      <PaginationBar
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        startIndex={startIndex}
        endIndex={endIndex}
        onPrevPage={onPrevPage}
        onNextPage={onNextPage}
      />
    </Card>
  );
};

export default AttendanceLogsCard;
