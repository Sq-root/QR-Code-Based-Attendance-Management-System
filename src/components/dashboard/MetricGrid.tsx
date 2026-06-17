import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Users, TrendingUp, UserCheck, Clock, Percent, TrendingDown, Layers } from 'lucide-react';

interface MetricGridProps {
  totalRegistered?: string;
  presentToday?: string | number;
  attendanceRate?: string;
  activeSessions?: string;
  sessionProgressPercentage?: number;
}

export const MetricGrid: React.FC<MetricGridProps> = ({
  totalRegistered = "1,248",
  presentToday = "984",
  attendanceRate = "78.8%",
  activeSessions = "14 / 20",
  sessionProgressPercentage = 70
}) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {/* Metric 1: Total Registered */}
      <Card className="col-span-2 lg:col-span-1 hover:-translate-y-1 hover:border-secondary/35 hover:shadow-md transition-all duration-300 min-h-[110px]">
        <CardContent className="p-4 md:p-5 flex flex-col justify-between h-full">
          <div className="flex items-center justify-between pb-2">
            <span className="text-label-md font-semibold text-on-surface-variant uppercase tracking-wider font-sans">
              Total Registered
            </span>
            <div className="p-2 rounded-lg bg-gradient-to-tr from-secondary/5 to-secondary/15 border border-secondary/10">
              <Users className="w-4.5 h-4.5 text-primary" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-[30px] font-bold text-on-surface tracking-tight font-sans leading-none">
              {totalRegistered}
            </div>
            <p className="mt-2 text-[11px] font-bold flex items-center gap-1 font-sans text-on-tertiary-container">
              <TrendingUp className="w-3.5 h-3.5 text-on-tertiary-container" />
              +12% from last week
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Metric 2: Present Today */}
      <Card className="col-span-1 hover:-translate-y-1 hover:border-secondary/35 hover:shadow-md transition-all duration-300 min-h-[110px]">
        <CardContent className="p-4 md:p-5 flex flex-col justify-between h-full">
          <div className="flex items-center justify-between pb-2">
            <span className="text-label-md font-semibold text-on-surface-variant uppercase tracking-wider font-sans">
              Present Today
            </span>
            <div className="p-2 rounded-lg bg-gradient-to-tr from-secondary/5 to-secondary/15 border border-secondary/10">
              <UserCheck className="w-4.5 h-4.5 text-on-tertiary-container" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-[30px] font-bold text-on-surface tracking-tight font-sans leading-none">
              {presentToday}
            </div>
            <p className="mt-2 text-[11px] font-bold flex items-center gap-1 font-sans text-on-surface-variant">
              <Clock className="w-3.5 h-3.5" />
              Last scan 2m ago
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Metric 3: Attendance Rate */}
      <Card className="col-span-1 hover:-translate-y-1 hover:border-secondary/35 hover:shadow-md transition-all duration-300 min-h-[110px]">
        <CardContent className="p-4 md:p-5 flex flex-col justify-between h-full">
          <div className="flex items-center justify-between pb-2">
            <span className="text-label-md font-semibold text-on-surface-variant uppercase tracking-wider font-sans">
              Rate
            </span>
            <div className="p-2 rounded-lg bg-gradient-to-tr from-secondary/5 to-secondary/15 border border-secondary/10">
              <Percent className="w-4.5 h-4.5 text-secondary" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-[30px] font-bold text-on-surface tracking-tight font-sans leading-none">
              {attendanceRate}
            </div>
            <p className="mt-2 text-[11px] font-bold flex items-center gap-1 font-sans text-error">
              <TrendingDown className="w-3.5 h-3.5" />
              -2.1% from yesterday
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Metric 4: Active Sessions */}
      <Card className="col-span-2 lg:col-span-1 hover:-translate-y-1 hover:border-secondary/35 hover:shadow-md transition-all duration-300 min-h-[110px]">
        <CardContent className="p-4 md:p-5 flex flex-col justify-between h-full">
          <div className="flex items-center justify-between pb-2">
            <span className="text-label-md font-semibold text-on-surface-variant uppercase tracking-wider font-sans">
              Active Sessions
            </span>
            <div className="p-2 rounded-lg bg-gradient-to-tr from-secondary/5 to-secondary/15 border border-secondary/10">
              <Layers className="w-4.5 h-4.5 text-on-primary-fixed-variant" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-[30px] font-bold text-on-surface tracking-tight font-sans leading-none">
              {activeSessions}
            </div>
            <div className="mt-3 space-y-1">
              <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-secondary h-full rounded-full transition-all duration-300" 
                  style={{ width: `${sessionProgressPercentage}%` }} 
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MetricGrid;
