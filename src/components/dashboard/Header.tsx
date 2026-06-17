import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="hidden md:flex bg-surface-container-lowest/80 backdrop-blur-md border-b border-outline-variant/50 justify-between items-center px-8 w-full h-16 sticky top-0 z-10">
      <div className="text-title-md font-bold text-primary font-sans tracking-tight">
        Admin Dashboard
      </div>
      <div className="w-8 h-8 rounded-full bg-secondary-container overflow-hidden border border-outline-variant cursor-pointer">
        <img 
          alt="Admin Profile" 
          className="w-full h-full object-cover" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCfqKSumn1giu2yyV39jRjy6nNKODaHcRjzoxlRnIJYmoLKXtxNnTJgc7EFJtL1_V6gm5F1MxlrrpEK6WrSg4dHP2j6QlBGFvAvb-InotEG9q7DDcxTftft2aI46AA_zLfRkxJLovJoqkW-igwh-HHOBnwMzCjxi4FStkB6Cw68ScpeiTv4n_bWeHWI0wVbDVsLW5akbS6rlSwdkR-Foph028GWFFylox1DKxeoQCd0tlf40uptXepA7Njn9brx19J0g5nptGgOxVA"
        />
      </div>
    </header>
  );
};

export default Header;
