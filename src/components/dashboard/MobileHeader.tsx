import React from "react";
import { LogOut, Menu, QrCode } from "lucide-react";

import { APP_NAME } from "../../constants";
import { SidebarTrigger } from "../ui/sidebar";

interface MobileHeaderProps {
  onLogout: () => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({ onLogout }) => {
  return (
    <header className="bg-surface-container-lowest/85 backdrop-blur-xl border-b border-outline-variant md:hidden w-full sticky top-0 z-30">
      <div className="flex justify-between items-center px-margin-mobile h-16">
        <div className="flex items-center gap-2.5 min-w-0">
          <SidebarTrigger
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </SidebarTrigger>
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-secondary to-on-secondary-fixed-variant flex items-center justify-center text-on-secondary shrink-0 shadow-sm shadow-secondary/30">
            <QrCode className="w-4 h-4" />
          </div>
          <h1 className="text-title-md font-bold text-primary font-sans truncate tracking-tight">
            {APP_NAME}
          </h1>
        </div>
        <button
          onClick={onLogout}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-error hover:bg-error-container/60 transition-colors cursor-pointer"
          aria-label="Log out"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};

export default MobileHeader;
