import React from 'react';
import { Send, Loader2, Check } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import type { Attendee } from '../../types';

interface AttendeesTableProps {
  attendees: Attendee[];
  isLoading?: boolean;
  onWhatsAppClick: (attendee: Attendee) => void;
  loadingAttendeeId?: string | number;
  successAttendeeId?: string | number;
}

export const AttendeesTable: React.FC<AttendeesTableProps> = ({
  attendees,
  isLoading,
  onWhatsAppClick,
  successAttendeeId,
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-secondary" />
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-outline-variant rounded-lg">
      <Table>
        <TableHeader className="bg-surface-container-low sticky top-0 z-10">
          <TableRow className="border-b border-outline-variant">
            <TableHead className="!py-3 !px-6 font-semibold text-on-surface">Full Name</TableHead>
            <TableHead className="!py-3 !px-6 font-semibold text-on-surface">Phone</TableHead>
            <TableHead className="!py-3 !px-6 font-semibold text-on-surface">Father Name</TableHead>
            <TableHead className="!py-3 !px-6 font-semibold text-on-surface">Mother Name</TableHead>
            <TableHead className="!py-3 !px-6 font-semibold text-on-surface">Area</TableHead>
            <TableHead className="!py-3 !px-6 font-semibold text-on-surface text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {attendees.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center py-12 text-on-surface-variant font-sans text-body-sm"
              >
                No attendees found.
              </TableCell>
            </TableRow>
          ) : (
            attendees.map((attendee) => {
              const displayId = attendee.attendeeId ?? attendee.id;

              return (
                <TableRow
                  key={displayId}
                  className="group hover:bg-surface-container-low/40 transition-colors duration-150 border-b border-outline-variant/50"
                >
                  <TableCell className="!py-3 !px-6">
                    <span className="font-medium text-on-surface text-body-sm">
                      {attendee.fullName || '-'}
                    </span>
                  </TableCell>
                  <TableCell className="!py-3 !px-6">
                    <span className="text-on-surface-variant font-mono text-body-sm">
                      {attendee.phoneE164 || attendee.fatherPhone || '-'}
                    </span>
                  </TableCell>
                  <TableCell className="!py-3 !px-6">
                    <span className="text-on-surface-variant text-body-sm">
                      {attendee.fatherName || '-'}
                    </span>
                  </TableCell>
                  <TableCell className="!py-3 !px-6">
                    <span className="text-on-surface-variant text-body-sm">
                      {attendee.motherName || '-'}
                    </span>
                  </TableCell>
                  <TableCell className="!py-3 !px-6">
                    <span className="text-on-surface-variant text-body-sm">
                      {attendee.residentialSuburb || '-'}
                    </span>
                  </TableCell>
                  <TableCell className="!py-3 !px-6 text-center">
                    <button
                      onClick={() => onWhatsAppClick(attendee)}
                      disabled={isLoading}
                      className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-label-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group/btn ${
                        successAttendeeId === displayId
                          ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                          : 'bg-green-100 hover:bg-green-200 text-green-700'
                      }`}
                      title={successAttendeeId === displayId ? 'Pass dispatched successfully' : 'Send WhatsApp message with QR pass'}
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : successAttendeeId === displayId ? (
                        <>
                          <Check className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                          <span className="hidden sm:inline">Sent</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                          <span className="hidden sm:inline">WhatsApp</span>
                        </>
                      )}
                    </button>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AttendeesTable;
