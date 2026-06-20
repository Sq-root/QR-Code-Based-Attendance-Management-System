import React from "react";
import { LayoutDashboard, LogOut, UserPlus } from "lucide-react";
import { NavLink } from "react-router-dom";

import { APP_NAME, ROUTES } from "../../constants";

interface MobileHeaderProps {
  onLogout: () => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({ onLogout }) => {
  return (
    <header className="bg-surface-bright border-b border-outline-variant/50 md:hidden w-full sticky top-0 z-30 shadow-xs">
      <div className="flex justify-between items-center px-margin-mobile h-16">
        <h1 className="text-title-md font-bold text-primary font-sans">
          {APP_NAME}
        </h1>
        <div className="flex items-center gap-3">
          <button
            onClick={onLogout}
            className="text-on-surface-variant hover:text-error p-1.5 transition-colors cursor-pointer"
            aria-label="Log out"
          >
            <LogOut className="w-5 h-5" />
          </button>
          <div className="w-8 h-8 rounded-full overflow-hidden bg-surface-container-highest border border-outline-variant cursor-pointer">
            <img
              alt="Admin Profile"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCfqKSumn1giu2yyV39jRjy6nNKODaHcRjzoxlRnIJYmoLKXtxNnTJgc7EFJtL1_V6gm5F1MxlrrpEK6WrSg4dHP2j6QlBGFvAvb-InotEG9q7DDcxTftft2aI46AA_zLfRkxJLovJoqkW-igwh-HHOBnwMzCjxi4FStkB6Cw68ScpeiTv4n_bWeHWI0wVbDVsLW5akbS6rlSwdkR-Foph028GWFFylox1DKxeoQCd0tlf40uptXepA7Njn9brx19J0g5nptGgOxVA"
            />
          </div>
        </div>
      </div>
      <nav className="grid grid-cols-2 gap-2 px-margin-mobile pb-3">
        <NavLink
          to={ROUTES.HOME}
          className={({ isActive }) =>
            `h-10 rounded-lg flex items-center justify-center gap-2 text-label-md font-bold border transition-colors ${
              isActive
                ? "bg-secondary/10 text-secondary border-secondary/20"
                : "bg-surface-container-lowest text-on-surface-variant border-outline-variant"
            }`
          }
        >
          <LayoutDashboard className="w-4 h-4" />
          Dashboard
        </NavLink>
        <NavLink
          to={ROUTES.NEW_ATTENDEE}
          className={({ isActive }) =>
            `h-10 rounded-lg flex items-center justify-center gap-2 text-label-md font-bold border transition-colors ${
              isActive
                ? "bg-secondary/10 text-secondary border-secondary/20"
                : "bg-surface-container-lowest text-on-surface-variant border-outline-variant"
            }`
          }
        >
          <UserPlus className="w-4 h-4" />
          Register
        </NavLink>
      </nav>
    </header>
  );
};

export default MobileHeader;
