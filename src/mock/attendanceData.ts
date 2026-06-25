import { Users, UserCheck, Percent, Layers } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface DashboardMetric {
  title: string;
  value: string;
  subtext: string;
  subtextColor: string;
  icon: LucideIcon;
  trendIcon?: 'up' | 'down' | 'neutral';
  progress?: number;
  iconBgColor: string;
  iconColor: string;
}

export interface ActivityLog {
  id: string;
  name: string;
  phone?: string;
  childName?: string;
  area?: string;
  initials: string;
  avatarBg: string;
  session: string;
  time: string;
  status: 'Present' | 'Success' | 'Late';
}

export const mockMetrics: DashboardMetric[] = [
  {
    title: 'Total Registered',
    value: '1,248',
    subtext: '+12 this week',
    subtextColor: 'text-on-tertiary-container',
    icon: Users,
    trendIcon: 'up',
    iconBgColor: 'bg-primary-fixed/30',
    iconColor: 'text-primary',
  },
  {
    title: 'Present Today',
    value: '984',
    subtext: 'As of 10:30 AM',
    subtextColor: 'text-on-surface-variant',
    icon: UserCheck,
    iconBgColor: 'bg-tertiary-fixed-dim/20',
    iconColor: 'text-on-tertiary-container',
  },
  {
    title: 'Attendance Rate %',
    value: '78.8%',
    subtext: '-2.1% from yesterday',
    subtextColor: 'text-error',
    icon: Percent,
    trendIcon: 'down',
    iconBgColor: 'bg-secondary-container/10',
    iconColor: 'text-secondary',
  },
  {
    title: 'Active Sessions',
    value: '14 / 20',
    subtext: '70% active sessions',
    subtextColor: 'text-on-surface-variant',
    icon: Layers,
    progress: 70,
    iconBgColor: 'bg-primary-fixed-dim/20',
    iconColor: 'text-on-primary-fixed-variant',
  },
];

export const mockLogs: ActivityLog[] = [
  { id: '1', name: 'Eleanor Shellstrop', initials: 'ES', avatarBg: 'bg-primary-fixed text-on-primary-fixed', session: 'Morning Keynote - Hall A', time: '10:28 AM', status: 'Success' },
  { id: '2', name: 'Chidi Anagonye', initials: 'CA', avatarBg: 'bg-secondary-fixed text-on-secondary-fixed', session: 'Ethics Workshop - Room 102', time: '10:15 AM', status: 'Success' },
  { id: '3', name: 'Tahani Al-Jamil', initials: 'TJ', avatarBg: 'bg-error-container text-on-error-container', session: 'VIP Networking - Lounge', time: '09:42 AM', status: 'Late' },
  { id: '4', name: 'Jason Mendoza', initials: 'JM', avatarBg: 'bg-surface-container-highest text-on-surface-variant', session: 'DJ Masterclass - Studio B', time: '09:10 AM', status: 'Success' },
  { id: '5', name: 'Michael Architect', initials: 'MA', avatarBg: 'bg-primary-fixed text-on-primary-fixed', session: 'System Architecture Keynote', time: '09:02 AM', status: 'Success' },
  { id: '6', name: 'Janet Database', initials: 'JD', avatarBg: 'bg-tertiary-fixed-dim/20 text-on-tertiary-container', session: 'Cloud Scaling - Room 303', time: '09:05 AM', status: 'Success' },
  { id: '7', name: 'Shawn Judge', initials: 'SJ', avatarBg: 'bg-secondary-fixed text-on-secondary-fixed', session: 'Compliance Panel - Hall C', time: '09:44 AM', status: 'Late' },
  { id: '8', name: 'Vicky Actor', initials: 'VA', avatarBg: 'bg-error-container text-on-error-container', session: 'Morning Keynote - Hall A', time: '09:50 AM', status: 'Late' },
  { id: '9', name: 'Simone Garnet', initials: 'SG', avatarBg: 'bg-surface-container-highest text-on-surface-variant', session: 'Ethics Workshop - Room 102', time: '09:08 AM', status: 'Success' },
  { id: '10', name: 'John Locke', initials: 'JL', avatarBg: 'bg-primary-fixed text-on-primary-fixed', session: 'Leadership Forum - Hall B', time: '09:12 AM', status: 'Success' },
  { id: '11', name: 'Jack Shephard', initials: 'JS', avatarBg: 'bg-secondary-fixed text-on-secondary-fixed', session: 'Emergency Response - Room 201', time: '09:00 AM', status: 'Success' },
  { id: '12', name: 'Kate Austen', initials: 'KA', avatarBg: 'bg-tertiary-fixed-dim/20 text-on-tertiary-container', session: 'Agile Strategy - Room 205', time: '09:04 AM', status: 'Success' },
  { id: '13', name: 'Hugo Reyes', initials: 'HR', avatarBg: 'bg-surface-container-highest text-on-surface-variant', session: 'Team Bonding - Garden', time: '09:25 AM', status: 'Success' },
  { id: '14', name: 'James Ford', initials: 'JF', avatarBg: 'bg-error-container text-on-error-container', session: 'Negotiation Tactics - Room 104', time: '09:55 AM', status: 'Late' },
  { id: '15', name: 'Sayid Jarrah', initials: 'SJ', avatarBg: 'bg-primary-fixed text-on-primary-fixed', session: 'Network Security - Lab 1', time: '09:07 AM', status: 'Success' },
  { id: '16', name: 'Sun-Hwa Kwon', initials: 'SK', avatarBg: 'bg-secondary-fixed text-on-secondary-fixed', session: 'Morning Keynote - Hall A', time: '09:11 AM', status: 'Success' },
  { id: '17', name: 'Jin-Soo Kwon', initials: 'JK', avatarBg: 'bg-tertiary-fixed-dim/20 text-on-tertiary-container', session: 'Morning Keynote - Hall A', time: '09:15 AM', status: 'Success' },
  { id: '18', name: 'Claire Littleton', initials: 'CL', avatarBg: 'bg-surface-container-highest text-on-surface-variant', session: 'Pediatric Care Seminar', time: '09:22 AM', status: 'Success' },
  { id: '19', name: 'Charlie Pace', initials: 'CP', avatarBg: 'bg-error-container text-on-error-container', session: 'Sound Check - Studio A', time: '10:02 AM', status: 'Late' },
  { id: '20', name: 'Desmond Hume', initials: 'DH', avatarBg: 'bg-primary-fixed text-on-primary-fixed', session: 'Quantum Dynamics - Lab 2', time: '09:01 AM', status: 'Success' },
  { id: '21', name: 'Ben Linus', initials: 'BL', avatarBg: 'bg-secondary-fixed text-on-secondary-fixed', session: 'Crisis Management - Hall B', time: '09:33 AM', status: 'Success' },
  { id: '22', name: 'Juliet Burke', initials: 'JB', avatarBg: 'bg-tertiary-fixed-dim/20 text-on-tertiary-container', session: 'Bioethics Panel - Room 301', time: '09:09 AM', status: 'Success' },
  { id: '23', name: 'Richard Alpert', initials: 'RA', avatarBg: 'bg-surface-container-highest text-on-surface-variant', session: 'Long-term Planning - Room 402', time: '09:00 AM', status: 'Success' },
  { id: '24', name: 'Penny Widmore', initials: 'PW', avatarBg: 'bg-primary-fixed text-on-primary-fixed', session: 'Communications Hub', time: '09:14 AM', status: 'Success' },
  { id: '25', name: 'Daniel Faraday', initials: 'DF', avatarBg: 'bg-error-container text-on-error-container', session: 'Advanced Physics Lecture', time: '10:10 AM', status: 'Late' },
];
