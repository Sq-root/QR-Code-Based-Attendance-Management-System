import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="hidden md:flex bg-surface-container-lowest/75 backdrop-blur-xl border-b border-outline-variant justify-between items-center px-8 w-full h-16 sticky top-0 z-10">
      <div className="flex items-center gap-2.5">
        <span className="text-title-md font-bold text-primary font-sans tracking-tight">
          Admin Dashboard
        </span>
      </div>
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-success-container/70 border border-on-tertiary-fixed-variant/15">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
        </span>
        <span className="text-label-sm font-semibold text-on-success-container">Live</span>
      </div>
    </header>
  );
};

export default Header;
