import React from "react";
import { LogOut, Menu } from "lucide-react";

import { APP_NAME } from "../../constants";
import { SidebarTrigger } from "../ui/sidebar";

interface MobileHeaderProps {
  onLogout: () => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({ onLogout }) => {
  return (
    <header className="bg-surface-bright border-b border-outline-variant/50 md:hidden w-full sticky top-0 z-30 shadow-xs">
      <div className="flex justify-between items-center px-margin-mobile h-16">
        <div className="flex items-center gap-3 min-w-0">
          <SidebarTrigger
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </SidebarTrigger>
          <h1 className="text-title-md font-bold text-primary font-sans truncate">
            {APP_NAME}
          </h1>
        </div>
        <button
          onClick={onLogout}
          className="text-on-surface-variant hover:text-error p-1.5 transition-colors cursor-pointer"
          aria-label="Log out"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};

export default MobileHeader;
