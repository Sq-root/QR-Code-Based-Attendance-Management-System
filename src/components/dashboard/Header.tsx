import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="hidden md:flex bg-surface-container-lowest/80 backdrop-blur-md border-b border-outline-variant/50 justify-between items-center px-8 w-full h-16 sticky top-0 z-10">
      <div className="text-title-md font-bold text-primary font-sans tracking-tight">
        Admin Dashboard
      </div>
    </header>
  );
};

export default Header;
