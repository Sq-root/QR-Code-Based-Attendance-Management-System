import React from 'react';
import type { ActivityLog } from '../../mock/attendanceData';

interface AttendanceLogsListProps {
  logs: ActivityLog[];
}

export const AttendanceLogsList: React.FC<AttendanceLogsListProps> = ({ logs }) => {
  return (
    <div className="block sm:hidden flex-1 overflow-y-auto max-h-[500px] border-b border-outline-variant/40">
      <ul className="flex flex-col divide-y divide-outline-variant/30">
        {logs.length === 0 ? (
          <li className="text-center py-12 text-on-surface-variant font-sans text-body-sm bg-surface-container-lowest">
            No matching records found.
          </li>
        ) : (
          logs.map((log) => (
            <li key={log.id} className="p-4 flex items-center gap-3 bg-surface-container-lowest active:bg-surface-container-low transition-colors">
              <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-sm ring-1 ring-inset ring-on-surface/5 ${log.avatarBg}`}>
                {log.initials}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-on-surface text-body-sm truncate">{log.name}</h4>
                {log.phone && (
                  <p className="text-on-surface-variant text-xs font-mono truncate mt-0.5">{log.phone}</p>
                )}
              </div>
              <div className="flex-shrink-0">
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
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default AttendanceLogsList;
