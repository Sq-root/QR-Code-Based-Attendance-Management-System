import * as React from 'react';
import { cn } from '../../lib/utils';

type SidebarContextValue = {
  openMobile: boolean;
  setOpenMobile: React.Dispatch<React.SetStateAction<boolean>>;
  toggleSidebar: () => void;
};

const SidebarContext = React.createContext<SidebarContextValue | null>(null);

const useSidebar = () => {
  const context = React.useContext(SidebarContext);

  if (!context) {
    throw new Error('useSidebar must be used within SidebarProvider.');
  }

  return context;
};

const SidebarProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [openMobile, setOpenMobile] = React.useState(false);

  const toggleSidebar = React.useCallback(() => {
    setOpenMobile((open) => !open);
  }, []);

  return (
    <SidebarContext.Provider value={{ openMobile, setOpenMobile, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};

const SidebarTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className = '', onClick, ...props }, ref) => {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        'w-10 h-10 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors',
        className,
      )}
      onClick={(event) => {
        onClick?.(event);
        toggleSidebar();
      }}
      {...props}
    />
  );
});
SidebarTrigger.displayName = 'SidebarTrigger';

const Sidebar = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className = '', children, ...props }, ref) => {
  const { openMobile, setOpenMobile } = useSidebar();

  return (
    <>
      <button
        type="button"
        aria-label="Close navigation menu"
        onClick={() => setOpenMobile(false)}
        className={cn(
          'fixed inset-0 bg-primary/35 backdrop-blur-[1px] z-40 transition-opacity md:hidden',
          openMobile ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
      />
      <aside
        ref={ref}
        aria-label="Primary navigation"
        className={cn(
          'h-screen w-64 fixed left-0 top-0 bg-surface-container-lowest border-r border-outline-variant/60 flex flex-col py-6 z-50 transition-transform duration-200 ease-out',
          openMobile ? 'translate-x-0 shadow-xl' : '-translate-x-full md:translate-x-0',
          className,
        )}
        {...props}
      >
        {children}
      </aside>
    </>
  );
});
Sidebar.displayName = 'Sidebar';

const SidebarInset = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className = '', ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex-1 flex flex-col md:ml-64 min-w-0', className)}
    {...props}
  />
));
SidebarInset.displayName = 'SidebarInset';

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className = '', ...props }, ref) => (
  <div ref={ref} className={cn('px-6 mb-8', className)} {...props} />
));
SidebarHeader.displayName = 'SidebarHeader';

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className = '', ...props }, ref) => (
  <div ref={ref} className={cn('flex-1 flex flex-col gap-1 px-3', className)} {...props} />
));
SidebarContent.displayName = 'SidebarContent';

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className = '', ...props }, ref) => (
  <div ref={ref} className={cn('mt-auto px-3 pt-4 border-t border-outline-variant/50', className)} {...props} />
));
SidebarFooter.displayName = 'SidebarFooter';

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className = '', ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      'w-full flex items-center gap-3 px-4 py-2.5 rounded-lg font-sans text-body-sm font-semibold transition-all duration-150 cursor-pointer text-left',
      className,
    )}
    {...props}
  />
));
SidebarMenuButton.displayName = 'SidebarMenuButton';

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
};
