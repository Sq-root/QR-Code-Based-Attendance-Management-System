import React from 'react';
import { LayoutDashboard, LogOut, UserPlus } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { ROUTES } from '../../constants';

interface SidebarProps {
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
  return (
    <aside className="hidden md:flex h-screen w-64 fixed left-0 top-0 bg-surface-container-lowest border-r border-outline-variant/60 flex-col py-6 z-35">
      {/* Header branding */}
      <div className="px-6 mb-8 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-secondary/10 to-secondary/20 flex items-center justify-center text-secondary shrink-0 border border-secondary/20">
          <LayoutDashboard className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-sans text-title-md font-bold text-primary tracking-tight leading-tight">Attend<span className="text-secondary">Pro</span></h1>
          <p className="text-[10px] text-on-surface-variant font-semibold uppercase tracking-widest mt-0.5">Control Center</p>
        </div>
      </div>

      {/* Sidebar Navigation Tabs (Dashboard only) */}
      <nav className="flex-1 flex flex-col gap-1 px-3">
        <NavLink
          to={ROUTES.HOME}
          className={({ isActive }) =>
            `w-full flex items-center gap-3 rounded-lg px-4 py-3 font-sans text-label-md font-bold transition-all duration-150 relative cursor-pointer ${
              isActive ? 'bg-secondary/10 text-secondary' : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && <div className="absolute left-0 top-1/4 h-1/2 w-1 bg-secondary rounded-r-md" />}
              <LayoutDashboard className="w-4.5 h-4.5" />
              Dashboard
            </>
          )}
        </NavLink>

        <NavLink
          to={ROUTES.NEW_ATTENDEE}
          className={({ isActive }) =>
            `w-full flex items-center gap-3 rounded-lg px-4 py-3 font-sans text-label-md font-bold transition-all duration-150 relative cursor-pointer ${
              isActive ? 'bg-secondary/10 text-secondary' : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && <div className="absolute left-0 top-1/4 h-1/2 w-1 bg-secondary rounded-r-md" />}
              <UserPlus className="w-4.5 h-4.5" />
              Register Attendee
            </>
          )}
        </NavLink>
      </nav>

      {/* Sidebar Log Out Button */}
      <div className="mt-auto px-3 pt-4 border-t border-outline-variant/50">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 text-on-surface-variant hover:text-error hover:bg-error-container/10 px-4 py-3 rounded-lg font-sans text-label-md font-semibold transition-all duration-150 cursor-pointer text-left"
        >
          <LogOut className="w-4.5 h-4.5" />
          Log Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
