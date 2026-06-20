import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../components/dashboard/AppShell';
import AttendeesFiltersBar from '../components/attendees/AttendeesFiltersBar';
import AttendeesTable from '../components/attendees/AttendeesTable';
import PaginationControls from '../components/attendees/PaginationControls';
import { EVENT_SESSION_ID, AUTH_KEYS, ROUTES } from '../constants';
import { useAttendees } from '../queries/attendanceQueries';
import { useIssuePass } from '../queries/attendanceQueries';
import { toast } from 'sonner';
import type { Attendee } from '../types';

const AttendeesList: React.FC = () => {
  const navigate = useNavigate();
  const hasValidSessionId =
    Boolean(EVENT_SESSION_ID) && EVENT_SESSION_ID !== 'replace-with-session-id-from-backend-logs';

  // Queries and mutations
  const attendeesQuery = useAttendees(EVENT_SESSION_ID, hasValidSessionId);
  const issuePassMutation = useIssuePass(EVENT_SESSION_ID);

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [successAttendeeId, setSuccessAttendeeId] = useState<string | number | null>(null);
  const itemsPerPage = 25;

  // Filter attendees based on search query
  const filteredAttendees = useMemo(() => {
    if (!attendeesQuery.data) return [];

    const attendees = attendeesQuery.data;
    if (!searchQuery.trim()) return attendees;

    const query = searchQuery.toLowerCase();
    return attendees.filter(
      (attendee) =>
        attendee.fullName?.toLowerCase().includes(query) ||
        attendee.phoneE164?.includes(query) ||
        attendee.fatherName?.toLowerCase().includes(query) ||
        attendee.motherName?.toLowerCase().includes(query) ||
        attendee.residentialSuburb?.toLowerCase().includes(query),
    );
  }, [attendeesQuery.data, searchQuery]);

  // Pagination
  const totalItems = filteredAttendees.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedAttendees = filteredAttendees.slice(startIndex, endIndex);

  // Pagination handlers
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  // Search handlers
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setCurrentPage(1);
  };

  // WhatsApp handler - Issue Pass
  const handleWhatsAppClick = (attendee: Attendee) => {
    const phoneNumber = attendee.phoneE164 || attendee.fatherPhone;
    const fullName = attendee.fullName;

    if (!phoneNumber) {
      toast.error('No phone number available', {
        description: 'Cannot send WhatsApp message without a phone number.',
      });
      return;
    }

    if (!fullName) {
      toast.error('No name available', {
        description: 'Cannot send WhatsApp message without attendee name.',
      });
      return;
    }

    issuePassMutation.mutate(
      {
        fullName,
        phoneNumber,
      },
      {
        onSuccess: (response) => {
          const displayId = (attendee.attendeeId ?? attendee.id) as string | number;
          setSuccessAttendeeId(displayId);

          toast.success('✓ Pass Issued & Dispatched', {
            description: `QR pass sent to ${fullName} via WhatsApp on ${phoneNumber}`,
            duration: 4000,
          });

          setTimeout(() => setSuccessAttendeeId(null), 3000);
          console.log('[AttendeesList] Issue pass success:', response);
        },
        onError: (error) => {
          console.error('[AttendeesList] Issue pass failed:', error);
          toast.error('✗ Failed to Issue Pass', {
            description:
              error.message || 'Unable to dispatch QR pass. Please check the phone number and try again.',
            duration: 5000,
          });
        },
      },
    );
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem(AUTH_KEYS.TOKEN);
    localStorage.removeItem(AUTH_KEYS.ROLE);
    toast.success('Signed out successfully.');
    navigate(ROUTES.LOGIN);
  };

  return (
    <AppShell onLogout={handleLogout}>
        {/* Page Content */}
        <main className="flex-1 px-margin-mobile md:px-8 py-6 w-full max-w-[1600px] mx-auto space-y-6 animate-fade-in">
          {/* Filters */}
          <AttendeesFiltersBar
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            onClearFilters={handleClearFilters}
            totalCount={attendeesQuery.data?.length || 0}
          />

          {/* Table with Cards Wrapper */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden">
            {/* Desktop Table */}
            <div className="hidden sm:block">
              <AttendeesTable
                attendees={paginatedAttendees}
                isLoading={attendeesQuery.isLoading}
                onWhatsAppClick={handleWhatsAppClick}
                successAttendeeId={successAttendeeId ?? undefined}
              />
            </div>

            {/* Mobile Card View */}
            <div className="sm:hidden divide-y divide-outline-variant/50">
              {attendeesQuery.isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-on-surface-variant text-body-sm">Loading...</div>
                </div>
              ) : paginatedAttendees.length === 0 ? (
                <div className="text-center py-12 text-on-surface-variant text-body-sm">
                  No attendees found.
                </div>
              ) : (
                paginatedAttendees.map((attendee) => (
                  <div
                    key={attendee.attendeeId ?? attendee.id}
                    className="p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-on-surface text-body-sm">
                          {attendee.fullName}
                        </p>
                        <p className="text-on-surface-variant font-mono text-body-xs">
                          {attendee.phoneE164 || attendee.fatherPhone || '-'}
                        </p>
                      </div>
                      <button
                        onClick={() => handleWhatsAppClick(attendee)}
                        disabled={issuePassMutation.isPending}
                        className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-100 hover:bg-green-200 text-green-700 font-medium text-label-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                      >
                        WhatsApp
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-body-xs">
                      <div>
                        <p className="text-on-surface-variant font-medium mb-0.5">Father</p>
                        <p className="text-on-surface">{attendee.fatherName || '-'}</p>
                      </div>
                      <div>
                        <p className="text-on-surface-variant font-medium mb-0.5">Mother</p>
                        <p className="text-on-surface">{attendee.motherName || '-'}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-on-surface-variant font-medium mb-0.5">Area</p>
                        <p className="text-on-surface">{attendee.residentialSuburb || '-'}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            {totalItems > 0 && (
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPrevPage={goToPrevPage}
                onNextPage={goToNextPage}
              />
            )}
          </div>
        </main>
    </AppShell>
  );
};

export default AttendeesList;
