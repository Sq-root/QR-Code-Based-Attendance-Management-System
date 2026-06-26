import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import type { ActivityLog } from '../../mock/attendanceData';

interface AttendanceLogsTableProps {
  logs: ActivityLog[];
}

export const AttendanceLogsTable: React.FC<AttendanceLogsTableProps> = ({ logs }) => {
  return (
    <div className="hidden sm:block overflow-y-auto max-h-[500px] relative border-b border-outline-variant/40 custom-scrollbar">
      <Table>
        <TableHeader className="sticky top-0 bg-surface-container-lowest z-10 shadow-[0_1px_0_0_rgba(0,0,0,0.05)]">
          <TableRow className="bg-surface-container-low/50 hover:bg-surface-container-low/50 border-b border-outline-variant">
            <TableHead className="!py-2.5 !px-6 bg-surface-container-lowest">Name</TableHead>
            <TableHead className="!py-2.5 !px-6 bg-surface-container-lowest">Phone</TableHead>
            <TableHead className="!py-2.5 !px-6 bg-surface-container-lowest">Child Name</TableHead>
            <TableHead className="!py-2.5 !px-6 bg-surface-container-lowest">Area</TableHead>
            <TableHead className="!py-2.5 !px-6 bg-surface-container-lowest text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-12 text-on-surface-variant font-sans text-body-sm">
                No matching records found.
              </TableCell>
            </TableRow>
          ) : (
            logs.map((log) => (
              <TableRow key={log.id} className="group hover:bg-surface-container-low/20 transition-all duration-150 border-b border-outline-variant/40">
                <TableCell className="!py-2.5 !px-6">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ring-1 ring-inset ring-on-surface/5 ${log.avatarBg}`}>
                      {log.initials}
                    </div>
                    <span className="font-semibold text-on-surface group-hover:text-secondary transition-colors text-body-sm">
                      {log.name}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="!py-2 !px-6 font-mono text-body-sm text-on-surface-variant">
                  {log.phone || '-'}
                </TableCell>
                <TableCell className="!py-2 !px-6 text-on-surface-variant text-body-sm">
                  {log.childName || '-'}
                </TableCell>
                <TableCell className="!py-2 !px-6 text-on-surface-variant text-body-sm">
                  {log.area || '-'}
                </TableCell>
                <TableCell className="!py-2.5 !px-6 text-right">
                  <span className={`inline-flex items-center gap-1.5 pl-2 pr-2.5 py-1 rounded-full font-sans text-label-sm font-semibold ${
                    log.status === 'Present' || log.status === 'Success'
                      ? 'bg-success-container text-on-success-container'
                      : log.status === 'Late'
                        ? 'bg-warning-container text-on-warning-container'
                        : 'bg-error-container text-on-error-container'
                  }`}>
                    <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
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
