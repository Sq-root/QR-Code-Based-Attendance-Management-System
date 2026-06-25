import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Users, UserCheck, Percent } from 'lucide-react';

interface MetricGridProps {
  totalRegistered?: string;
  presentToday?: string | number;
  attendanceRate?: string;
}

export const MetricGrid: React.FC<MetricGridProps> = ({
  totalRegistered = "-",
  presentToday = "-",
  attendanceRate = "-",
}) => {
  return (
    <Card className="rounded-lg border-outline-variant shadow-sm overflow-hidden">
      <CardContent className="p-0">
        <div className="grid grid-cols-3 divide-x divide-outline-variant">
          <div className="min-w-0 p-3 sm:p-4">
            <div className="flex items-center gap-2 min-w-0">
              <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-secondary/10 border border-secondary/10 shrink-0 flex items-center justify-center">
                <Users className="w-4 h-4 text-primary" />
              </div>
              <span className="text-[10px] sm:text-label-md font-semibold text-on-surface-variant uppercase font-sans truncate">
                Registered
              </span>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-on-surface font-sans leading-none mt-3">
              {totalRegistered}
            </div>
          </div>

          <div className="min-w-0 p-3 sm:p-4">
            <div className="flex items-center gap-2 min-w-0">
              <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-tertiary-fixed/20 border border-on-tertiary-container/10 shrink-0 flex items-center justify-center">
                <UserCheck className="w-4 h-4 text-on-tertiary-container" />
              </div>
              <span className="text-[10px] sm:text-label-md font-semibold text-on-surface-variant uppercase font-sans truncate">
                Present
              </span>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-on-surface font-sans leading-none mt-3">
              {presentToday}
            </div>
          </div>

          <div className="min-w-0 p-3 sm:p-4">
            <div className="flex items-center gap-2 min-w-0">
              <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-secondary/10 border border-secondary/10 shrink-0 flex items-center justify-center">
                <Percent className="w-4 h-4 text-secondary" />
              </div>
              <span className="text-[10px] sm:text-label-md font-semibold text-on-surface-variant uppercase font-sans truncate">
                Rate
              </span>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-on-surface font-sans leading-none mt-3">
              {attendanceRate}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricGrid;
