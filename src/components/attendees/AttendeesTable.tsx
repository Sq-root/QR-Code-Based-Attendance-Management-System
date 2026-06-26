import React from 'react';
import { Check, Loader2, QrCode, UserCheck } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import type { Attendee } from '../../types';

interface AttendeesTableProps {
  attendees: Attendee[];
  isLoading?: boolean;
  onQrClick?: (attendee: Attendee) => void;
  onAttendanceClick?: (attendee: Attendee) => void;
  loadingQrAttendeeId?: string | number;
  successQrAttendeeId?: string | number;
  loadingAttendanceAttendeeId?: string | number;
  successAttendanceAttendeeId?: string | number;
}

export const AttendeesTable: React.FC<AttendeesTableProps> = React.memo(({
  attendees,
  isLoading,
  onQrClick,
  onAttendanceClick,
  loadingQrAttendeeId,
  successQrAttendeeId,
  loadingAttendanceAttendeeId,
  successAttendanceAttendeeId,
}) => {
  const canIssueQr = typeof onQrClick === 'function';
  const canMarkAttendance = typeof onAttendanceClick === 'function';

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-secondary" />
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="bg-surface-container-low sticky top-0 z-10">
          <TableRow className="border-b border-outline-variant hover:bg-surface-container-low">
            <TableHead className="!py-3.5 !px-6">Parent Name</TableHead>
            <TableHead className="!py-3.5 !px-6">Phone</TableHead>
            <TableHead className="!py-3.5 !px-6">Child Name</TableHead>
            <TableHead className="!py-3.5 !px-6">Area</TableHead>
            <TableHead className="!py-3.5 !px-6 text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {attendees.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center py-12 text-on-surface-variant font-sans text-body-sm"
              >
                No attendees found.
              </TableCell>
            </TableRow>
          ) : (
            attendees.map((attendee, index) => {
              const displayId = attendee.attendeeId ?? attendee.id;
              const hasDisplayId = displayId !== undefined && displayId !== null;
              const isQrLoading = hasDisplayId && loadingQrAttendeeId === displayId;
              const isQrSuccess = hasDisplayId && successQrAttendeeId === displayId;
              const isAttendanceLoading = hasDisplayId && loadingAttendanceAttendeeId === displayId;
              const isAttendanceSuccess = hasDisplayId && successAttendanceAttendeeId === displayId;
              const rowKey =
                attendee.pass?.passId ??
                [displayId, attendee.pass?.eventSessionId, attendee.fullName, index]
                  .filter(Boolean)
                  .join('-');

              return (
                <TableRow
                  key={rowKey}
                  className="group hover:bg-surface-container-low/40 transition-colors duration-150 border-b border-outline-variant/50"
                >
                  <TableCell className="!py-3 !px-6">
                    <span className="font-medium text-on-surface text-body-sm">
                      {attendee.fullName || '-'}
                    </span>
                  </TableCell>
                  <TableCell className="!py-3 !px-6">
                    <span className="text-on-surface-variant font-mono text-body-sm">
                      {attendee.phoneE164 || attendee.phoneNumber || attendee.fatherPhone || '-'}
                    </span>
                  </TableCell>
                  <TableCell className="!py-3 !px-6">
                    <span className="text-on-surface-variant text-body-sm">
                      {attendee.youthName || '-'}
                    </span>
                  </TableCell>
                  <TableCell className="!py-3 !px-6">
                    <span className="text-on-surface-variant text-body-sm">
                      {attendee.residentialSuburb || '-'}
                    </span>
                  </TableCell>
                  <TableCell className="!py-3 !px-6 text-center">
                    <div className="inline-flex items-center justify-center gap-2">
                      <button
                        onClick={() => onQrClick?.(attendee)}
                        disabled={!canIssueQr || isQrLoading || isAttendanceLoading}
                        className={`inline-flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group/btn ${
                          isQrSuccess
                            ? 'bg-success-container text-on-success-container hover:bg-success-container/80'
                            : 'bg-secondary-fixed text-on-secondary-fixed-variant hover:bg-secondary-fixed-dim'
                        }`}
                        title={isQrSuccess ? 'QR pass issued' : 'Issue QR pass'}
                      >
                        {isQrLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : isQrSuccess ? (
                          <Check className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                        ) : (
                          <QrCode className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                        )}
                      </button>
                      <button
                        onClick={() => onAttendanceClick?.(attendee)}
                        disabled={!canMarkAttendance || isQrLoading || isAttendanceLoading}
                        className={`inline-flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group/btn ${
                          isAttendanceSuccess
                            ? 'bg-success-container text-on-success-container hover:bg-success-container/80'
                            : 'bg-tertiary-fixed text-on-tertiary-fixed-variant hover:bg-tertiary-fixed-dim'
                        }`}
                        title={isAttendanceSuccess ? 'Attendance marked' : 'Mark attendance'}
                      >
                        {isAttendanceLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : isAttendanceSuccess ? (
                          <Check className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                        ) : (
                          <UserCheck className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                        )}
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
});

export default AttendeesTable;
