import React from 'react';
import { Bell } from 'lucide-react';
import { toast } from 'sonner';

export const MobileHeader: React.FC = () => {
  return (
    <header className="bg-surface-bright border-b border-outline-variant/50 flex md:hidden justify-between items-center px-margin-mobile w-full h-16 sticky top-0 z-30 shadow-xs">
      <h1 className="text-title-md font-bold text-primary font-sans">AttendPro</h1>
      <div className="flex items-center gap-4">
        <button 
          className="text-on-surface-variant hover:text-secondary p-1.5 transition-colors cursor-pointer"
          onClick={() => toast.info('No new notifications.')}
        >
          <Bell className="w-5 h-5" />
        </button>
        <div className="w-8 h-8 rounded-full overflow-hidden bg-surface-container-highest border border-outline-variant cursor-pointer">
          <img 
            alt="Admin Profile" 
            className="w-full h-full object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCfqKSumn1giu2yyV39jRjy6nNKODaHcRjzoxlRnIJYmoLKXtxNnTJgc7EFJtL1_V6gm5F1MxlrrpEK6WrSg4dHP2j6QlBGFvAvb-InotEG9q7DDcxTftft2aI46AA_zLfRkxJLovJoqkW-igwh-HHOBnwMzCjxi4FStkB6Cw68ScpeiTv4n_bWeHWI0wVbDVsLW5akbS6rlSwdkR-Foph028GWFFylox1DKxeoQCd0tlf40uptXepA7Njn9brx19J0g5nptGgOxVA"
          />
        </div>
      </div>
    </header>
  );
};

export default MobileHeader;
