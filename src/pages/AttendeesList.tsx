import React, { useCallback, useDeferredValue, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode, UserCheck, Check, Loader2 } from 'lucide-react';
import AppShell from '../components/dashboard/AppShell';
import AttendeesFiltersBar from '../components/attendees/AttendeesFiltersBar';
import AttendeesTable from '../components/attendees/AttendeesTable';
import PaginationControls from '../components/attendees/PaginationControls';
import { EVENT_SESSION_ID, AUTH_KEYS, ROUTES } from '../constants';
import { useAttendees, useCheckInAttendee, useIssuePass } from '../queries/attendanceQueries';
import { toast } from 'sonner';
import type { Attendee } from '../types';
import { logger } from '../lib/logger';

const getAttendeeDisplayId = (attendee: Attendee) => attendee.attendeeId ?? attendee.id;

const getAttendeePhone = (attendee: Attendee) =>
  attendee.phoneE164 || attendee.phoneNumber || attendee.fatherPhone || '';

const normalizeSearchText = (value?: string | number | null) =>
  String(value ?? '').toLowerCase();


const AttendeesList: React.FC = () => {
  const navigate = useNavigate();
  const hasValidSessionId =
    Boolean(EVENT_SESSION_ID) && EVENT_SESSION_ID !== 'replace-with-session-id-from-backend-logs';

  const attendeesQuery = useAttendees(EVENT_SESSION_ID, hasValidSessionId);
  const issuePassMutation = useIssuePass(EVENT_SESSION_ID);
  const checkInAttendeeMutation = useCheckInAttendee(EVENT_SESSION_ID);

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingQrAttendeeId, setLoadingQrAttendeeId] = useState<string | number | null>(null);
  const [successQrAttendeeId, setSuccessQrAttendeeId] = useState<string | number | null>(null);
  const [loadingAttendanceAttendeeId, setLoadingAttendanceAttendeeId] = useState<string | number | null>(null);
  const [successAttendanceAttendeeId, setSuccessAttendanceAttendeeId] = useState<string | number | null>(null);
  const itemsPerPage = 25;
  const deferredSearchQuery = useDeferredValue(searchQuery);

  const attendeesWithSearchText = useMemo(() => {
    return (attendeesQuery.data ?? []).map((attendee) => ({
      attendee,
      searchText: [
        attendee.fullName,
        attendee.youthName,
        attendee.phoneE164,
        attendee.phoneNumber,
        attendee.fatherPhone,
        attendee.residentialSuburb,
      ]
        .map(normalizeSearchText)
        .join(' '),
    }));
  }, [attendeesQuery.data]);

  const filteredAttendees = useMemo(() => {
    const query = deferredSearchQuery.trim().toLowerCase();

    if (!query) {
      return attendeesWithSearchText.map(({ attendee }) => attendee);
    }

    return attendeesWithSearchText
      .filter(({ searchText }) => searchText.includes(query))
      .map(({ attendee }) => attendee);
  }, [attendeesWithSearchText, deferredSearchQuery]);

  const totalItems = filteredAttendees.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedAttendees = filteredAttendees.slice(startIndex, endIndex);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchQuery('');
    setCurrentPage(1);
  }, []);

  const handleQrClick = useCallback((attendee: Attendee) => {
    const phoneNumber = getAttendeePhone(attendee);
    const fullName = attendee.fullName;
    const displayId = getAttendeeDisplayId(attendee);

    if (!displayId) {
      toast.error('Attendee ID missing', {
        description: 'Cannot issue a QR pass without an attendee ID.',
      });
      return;
    }

    if (!phoneNumber) {
      toast.error('No phone number available', {
        description: 'Cannot issue a QR pass without a phone number.',
      });
      return;
    }

    if (!fullName) {
      toast.error('No name available', {
        description: 'Cannot issue a QR pass without attendee name.',
      });
      return;
    }

    setLoadingQrAttendeeId(displayId);

    issuePassMutation.mutate(
      {
        fullName,
        phoneNumber,
      },
      {
        onSuccess: (response) => {
          setSuccessQrAttendeeId(displayId);
          toast.success('QR pass issued', {
            description: response.message || `QR pass created for ${fullName}.`,
            duration: 4000,
          });
          setTimeout(() => setSuccessQrAttendeeId(null), 3000);
          logger.info('[AttendeesList] Issue pass success:', response);
        },
        onError: (error) => {
          logger.error('[AttendeesList] Issue pass failed:', error);
          toast.error('Failed to issue QR pass', {
            description:
              error.message || 'Unable to issue QR pass. Please check the phone number and try again.',
            duration: 5000,
          });
        },
        onSettled: () => {
          setLoadingQrAttendeeId(null);
        },
      },
    );
  }, [issuePassMutation]);

  const handleAttendanceClick = useCallback((attendee: Attendee) => {
    const displayId = getAttendeeDisplayId(attendee);

    if (!displayId) {
      toast.error('Attendee ID missing', {
        description: 'Cannot mark attendance without an attendee ID.',
      });
      return;
    }

    setLoadingAttendanceAttendeeId(displayId);

    checkInAttendeeMutation.mutate(displayId, {
      onSuccess: (response) => {
        setSuccessAttendanceAttendeeId(displayId);
        toast.success('Attendance marked', {
          description: response.message || `${response.attendeeName || attendee.fullName} marked present.`,
          duration: 4000,
        });
        attendeesQuery.refetch();
        setTimeout(() => setSuccessAttendanceAttendeeId(null), 3000);
        logger.info('[AttendeesList] Attendance success:', response);
      },
      onError: (error) => {
        logger.error('[AttendeesList] Attendance failed:', error);
        toast.error('Failed to mark attendance', {
          description: error.message || 'Unable to mark attendance. Please try again.',
          duration: 5000,
        });
      },
      onSettled: () => {
        setLoadingAttendanceAttendeeId(null);
      },
    });
  }, [attendeesQuery, checkInAttendeeMutation]);

  const handleLogout = () => {
    localStorage.removeItem(AUTH_KEYS.TOKEN);
    localStorage.removeItem(AUTH_KEYS.ROLE);
    toast.success('Signed out successfully.');
    navigate(ROUTES.LOGIN);
  };

  return (
    <AppShell onLogout={handleLogout}>
      <main className="flex-1 px-margin-mobile md:px-8 py-6 w-full max-w-[1600px] mx-auto space-y-6 animate-fade-in">
        <AttendeesFiltersBar
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onClearFilters={handleClearFilters}
          totalCount={attendeesQuery.data?.length || 0}
        />

        <div className="sm:bg-surface-container-lowest sm:border sm:border-outline-variant sm:rounded-lg sm:overflow-hidden">
          <div className="hidden sm:block">
            <AttendeesTable
              attendees={paginatedAttendees}
              isLoading={attendeesQuery.isLoading}
              onQrClick={handleQrClick}
              onAttendanceClick={handleAttendanceClick}
              loadingQrAttendeeId={loadingQrAttendeeId ?? undefined}
              successQrAttendeeId={successQrAttendeeId ?? undefined}
              loadingAttendanceAttendeeId={loadingAttendanceAttendeeId ?? undefined}
              successAttendanceAttendeeId={successAttendanceAttendeeId ?? undefined}
            />
          </div>

          <div className="sm:hidden space-y-2">
            {attendeesQuery.isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-on-surface-variant text-body-sm">Loading...</div>
              </div>
            ) : paginatedAttendees.length === 0 ? (
              <div className="text-center py-12 text-on-surface-variant text-body-sm">
                No attendees found.
              </div>
            ) : (
              paginatedAttendees.map((attendee, index) => {
                const displayId = getAttendeeDisplayId(attendee);
                const isQrLoading = loadingQrAttendeeId === displayId;
                const isQrSuccess = successQrAttendeeId === displayId;
                const isAttendanceLoading = loadingAttendanceAttendeeId === displayId;
                const isAttendanceSuccess = successAttendanceAttendeeId === displayId;

                return (
                  <div
                    key={
                      attendee.pass?.passId ??
                      [displayId, attendee.pass?.eventSessionId, index].filter(Boolean).join('-')
                    }
                    className="bg-surface-container-lowest rounded-xl border border-outline-variant px-4 py-3 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="space-y-3">
                      <div>
                        <div className="mb-3">
                          <p className="font-bold text-on-surface text-sm">
                            {attendee.fullName || '-'}
                          </p>
                          <p className="text-on-surface-variant text-xs font-mono mt-0.5">
                            {getAttendeePhone(attendee) || '-'}
                          </p>
                        </div>

                        <div className="space-y-2 pt-3 border-t border-outline-variant/60">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-on-surface-variant font-semibold text-xs">Child</span>
                            {attendee.youthName ? (
                              <span className="bg-secondary/10 text-secondary px-2.5 py-1 rounded-md font-semibold text-xs">
                                {attendee.youthName}
                              </span>
                            ) : (
                              <span className="text-outline text-xs">-</span>
                            )}
                          </div>
                          {attendee.age && (
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-on-surface-variant font-semibold">Age</span>
                              <span className="text-on-surface font-medium">{attendee.age}</span>
                            </div>
                          )}
                          {attendee.standard && (
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-on-surface-variant font-semibold">Standard</span>
                              <span className="text-on-surface font-medium">{attendee.standard}</span>
                            </div>
                          )}
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-on-surface-variant font-semibold">Area</span>
                            <span className="text-on-surface font-medium text-right">
                              {attendee.residentialSuburb || '-'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => handleQrClick(attendee)}
                          disabled={isQrLoading || isAttendanceLoading}
                          className={`flex-1 inline-flex items-center justify-center gap-1.5 px-2 py-2 rounded-md text-xs font-medium transition-all duration-200 cursor-pointer ${
                            isQrSuccess
                              ? 'bg-success text-on-success hover:bg-on-success-container'
                              : 'bg-secondary text-on-secondary hover:bg-on-secondary-fixed-variant'
                          } disabled:opacity-50 disabled:cursor-not-allowed active:scale-95`}
                          title={isQrSuccess ? 'QR pass issued' : 'Issue QR pass'}
                        >
                          {isQrLoading ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : isQrSuccess ? (
                            <Check className="w-3.5 h-3.5" />
                          ) : (
                            <QrCode className="w-3.5 h-3.5" />
                          )}
                          <span>{isQrLoading ? 'Issuing...' : isQrSuccess ? 'Issued' : 'QR'}</span>
                        </button>
                        <button
                          onClick={() => handleAttendanceClick(attendee)}
                          disabled={isQrLoading || isAttendanceLoading}
                          className={`flex-1 inline-flex items-center justify-center gap-1.5 px-2 py-2 rounded-md text-xs font-medium transition-all duration-200 cursor-pointer ${
                            isAttendanceSuccess
                              ? 'bg-success text-on-success hover:bg-on-success-container'
                              : 'bg-tertiary-fixed-dim text-on-tertiary-fixed-variant hover:bg-tertiary-fixed'
                          } disabled:opacity-50 disabled:cursor-not-allowed active:scale-95`}
                          title={isAttendanceSuccess ? 'Attendance marked' : 'Mark attendance'}
                        >
                          {isAttendanceLoading ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : isAttendanceSuccess ? (
                            <Check className="w-3.5 h-3.5" />
                          ) : (
                            <UserCheck className="w-3.5 h-3.5" />
                          )}
                          <span>{isAttendanceLoading ? 'Marking...' : isAttendanceSuccess ? 'Done' : 'Attend'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {totalItems > 0 && (
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPrevPage={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              onNextPage={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            />
          )}
        </div>
      </main>
    </AppShell>
  );
};

export default AttendeesList;
