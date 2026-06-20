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
    </header>
  );
};

export default MobileHeader;
