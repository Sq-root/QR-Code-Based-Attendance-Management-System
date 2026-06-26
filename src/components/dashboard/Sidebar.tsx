import React from 'react';
import { LayoutDashboard, LogOut, QrCode, UserPlus, Users, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { APP_NAME, ROUTES } from '../../constants';
import {
  Sidebar as SidebarPrimitive,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  useSidebar,
} from '../ui/sidebar';

interface SidebarProps {
  onLogout: () => void;
}

const navItems = [
  { to: ROUTES.HOME,          label: 'Dashboard',         icon: LayoutDashboard, end: true },
  { to: ROUTES.NEW_ATTENDEE,  label: 'Register Attendee', icon: UserPlus,        end: true },
  { to: ROUTES.ATTENDEES_LIST,label: 'Attendees List',    icon: Users,           end: true },
];

export const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
  const { setOpenMobile } = useSidebar();
  const closeMobileSidebar = () => setOpenMobile(false);

  return (
    <SidebarPrimitive>
      <SidebarHeader className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-secondary to-on-secondary-fixed-variant flex items-center justify-center text-on-secondary shrink-0 shadow-sm shadow-secondary/30">
          <QrCode className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="font-sans text-title-md font-bold text-primary tracking-tight leading-tight truncate">
            {APP_NAME}
          </h1>
          <p className="text-[10px] text-on-surface-variant font-semibold uppercase tracking-[0.18em] mt-0.5">
            Control Center
          </p>
        </div>
        <button
          type="button"
          onClick={closeMobileSidebar}
          className="w-9 h-9 rounded-lg flex md:hidden items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </SidebarHeader>

      <SidebarContent>
        <p className="px-4 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant/70">
          Menu
        </p>
        <nav className="flex flex-col gap-1">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={closeMobileSidebar}
              className={({ isActive }) =>
                `group w-full flex items-center gap-3 rounded-xl px-4 py-2.5 font-sans text-body-sm font-semibold transition-all duration-150 relative cursor-pointer ${
                  isActive
                    ? 'bg-secondary/10 text-secondary shadow-xs'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 bg-secondary rounded-r-full" />}
                  <Icon className={`w-4.5 h-4.5 transition-colors ${isActive ? 'text-secondary' : 'text-on-surface-variant/80 group-hover:text-on-surface'}`} />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenuButton
          onClick={() => {
            closeMobileSidebar();
            onLogout();
          }}
          className="rounded-xl text-on-surface-variant hover:text-error hover:bg-error-container/70"
        >
          <LogOut className="w-4.5 h-4.5" />
          Log Out
        </SidebarMenuButton>
      </SidebarFooter>
    </SidebarPrimitive>
  );
};

export default Sidebar;
