import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import type { ActivityLog } from '../../mock/attendanceData';

interface AttendanceLogsTableProps {
  logs: ActivityLog[];
}

export const AttendanceLogsTable: React.FC<AttendanceLogsTableProps> = ({ logs }) => {
  return (
    <div className="hidden sm:block overflow-y-auto max-h-[440px] relative border-b border-outline-variant/40 custom-scrollbar">
      <Table>
        <TableHeader className="sticky top-0 bg-surface-container-lowest z-10 shadow-[0_1px_0_0_rgba(0,0,0,0.05)]">
          <TableRow className="bg-surface-container-low/50 hover:bg-surface-container-low/50 border-b border-outline-variant">
            <TableHead className="py-2.5 bg-surface-container-lowest">Attendee Name</TableHead>
            <TableHead className="py-2.5 bg-surface-container-lowest">Event/Session</TableHead>
            <TableHead className="py-2.5 bg-surface-container-lowest">Time</TableHead>
            <TableHead className="py-2.5 bg-surface-container-lowest text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-12 text-on-surface-variant font-sans text-body-sm">
                No matching records found.
              </TableCell>
            </TableRow>
          ) : (
            logs.map((log) => (
              <TableRow key={log.id} className="group hover:bg-surface-container-low/20 transition-all duration-150 border-b border-outline-variant/40">
                <TableCell className="py-1.5">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[10px] shadow-xs ${log.avatarBg}`}>
                      {log.initials}
                    </div>
                    <span className="font-semibold text-on-surface group-hover:text-secondary transition-colors text-body-sm">
                      {log.name}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="py-1.5 text-on-surface-variant text-body-sm">{log.session}</TableCell>
                <TableCell className="py-1.5 font-mono text-body-sm text-on-surface-variant">{log.time}</TableCell>
                <TableCell className="py-1.5 text-right">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-sans text-[10px] font-bold uppercase tracking-wider ${
                    log.status === 'Success'
                      ? 'bg-tertiary-fixed/20 text-on-tertiary-container border border-on-tertiary-container/15'
                      : 'bg-error-container text-on-error-container border border-error/20'
                  }`}>
                    <span className={`w-1.2 h-1.2 rounded-full ${
                      log.status === 'Success' ? 'bg-on-tertiary-container' : 'bg-on-error-container'
                    }`} />
                    {log.status}
                  </span>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AttendanceLogsTable;
