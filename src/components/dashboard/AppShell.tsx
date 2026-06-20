import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import MobileHeader from './MobileHeader';
import { SidebarInset, SidebarProvider } from '../ui/sidebar';

interface AppShellProps {
  children: React.ReactNode;
  onLogout: () => void;
}

export const AppShell: React.FC<AppShellProps> = ({ children, onLogout }) => {
  return (
    <SidebarProvider>
      <div className="bg-surface-container-low text-on-surface font-sans min-h-screen flex antialiased relative">
        <Sidebar onLogout={onLogout} />
        <SidebarInset>
          <MobileHeader onLogout={onLogout} />
          <Header />
          {children}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AppShell;
