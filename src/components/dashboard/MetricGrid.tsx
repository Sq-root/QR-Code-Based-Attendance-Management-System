import React from 'react';
import { Card } from '../ui/card';
import { Users, UserCheck, Percent } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface MetricGridProps {
  totalRegistered?: string;
  presentToday?: string | number;
  attendanceRate?: string;
}

interface MetricCell {
  label: string;
  value: string | number;
  icon: LucideIcon;
  iconWrap: string;
}

export const MetricGrid: React.FC<MetricGridProps> = ({
  totalRegistered = "-",
  presentToday = "-",
  attendanceRate = "-",
}) => {
  const metrics: MetricCell[] = [
    {
      label: "Registered",
      value: totalRegistered,
      icon: Users,
      iconWrap: "bg-secondary/10 text-secondary",
    },
    {
      label: "Present",
      value: presentToday,
      icon: UserCheck,
      iconWrap: "bg-tertiary-fixed text-on-tertiary-fixed-variant",
    },
    {
      label: "Rate",
      value: attendanceRate,
      icon: Percent,
      iconWrap: "bg-secondary/10 text-secondary",
    },
  ];

  return (
    <Card className="overflow-hidden">
      <div className="grid grid-cols-3 divide-x divide-outline-variant">
        {metrics.map(({ label, value, icon: Icon, iconWrap }) => (
          <div key={label} className="min-w-0 p-4 sm:p-5 transition-colors hover:bg-surface-container-low/60">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className={`h-8 w-8 sm:h-9 sm:w-9 rounded-xl shrink-0 flex items-center justify-center ${iconWrap}`}>
                <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </div>
              <span className="text-[10px] sm:text-label-md font-semibold text-on-surface-variant uppercase tracking-wide font-sans truncate">
                {label}
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-on-surface font-sans leading-none mt-3.5 tracking-tight tabular-nums">
              {value}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default MetricGrid;
