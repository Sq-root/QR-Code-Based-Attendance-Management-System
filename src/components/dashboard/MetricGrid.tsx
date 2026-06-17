import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Users, UserCheck, Percent } from 'lucide-react';

interface MetricGridProps {
  totalRegistered?: string;
  presentToday?: string | number;
  attendanceRate?: string;
}

export const MetricGrid: React.FC<MetricGridProps> = ({
  totalRegistered = "1,248",
  presentToday = "984",
  attendanceRate = "78.8%",
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6">
      <Card className="hover:-translate-y-1 hover:border-secondary/35 hover:shadow-md transition-all duration-300">
        <CardContent className="p-4 md:p-5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-gradient-to-tr from-secondary/5 to-secondary/15 border border-secondary/10 shrink-0">
              <Users className="w-4 h-4 text-primary" />
            </div>
            <span className="text-label-md font-semibold text-on-surface-variant uppercase tracking-wider font-sans">Total Registered</span>
          </div>
          <div className="text-[30px] font-bold text-on-surface tracking-tight font-sans leading-none mt-3">
            {totalRegistered}
          </div>
        </CardContent>
      </Card>

      <Card className="hover:-translate-y-1 hover:border-secondary/35 hover:shadow-md transition-all duration-300">
        <CardContent className="p-4 md:p-5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-gradient-to-tr from-secondary/5 to-secondary/15 border border-secondary/10 shrink-0">
              <UserCheck className="w-4 h-4 text-on-tertiary-container" />
            </div>
            <span className="text-label-md font-semibold text-on-surface-variant uppercase tracking-wider font-sans">Present Today</span>
          </div>
          <div className="text-[30px] font-bold text-on-surface tracking-tight font-sans leading-none mt-3">
            {presentToday}
          </div>
        </CardContent>
      </Card>

      <Card className="hover:-translate-y-1 hover:border-secondary/35 hover:shadow-md transition-all duration-300">
        <CardContent className="p-4 md:p-5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-gradient-to-tr from-secondary/5 to-secondary/15 border border-secondary/10 shrink-0">
              <Percent className="w-4 h-4 text-secondary" />
            </div>
            <span className="text-label-md font-semibold text-on-surface-variant uppercase tracking-wider font-sans">Rate</span>
          </div>
          <div className="text-[30px] font-bold text-on-surface tracking-tight font-sans leading-none mt-3">
            {attendanceRate}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MetricGrid;
