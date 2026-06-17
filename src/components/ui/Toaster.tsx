import React from 'react';
import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

export const Toaster: React.FC<ToasterProps> = ({ ...props }) => {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-surface-container-lowest group-[.toaster]:text-on-surface group-[.toaster]:border-outline-variant group-[.toaster]:shadow-md group-[.toaster]:rounded-lg group-[.toaster]:font-sans group-[.toaster]:p-4 group-[.toaster]:flex group-[.toaster]:gap-3 group-[.toaster]:items-center',
          description: 'group-[.toast]:text-on-surface-variant group-[.toast]:text-body-sm',
          actionButton:
            'group-[.toast]:bg-secondary group-[.toast]:text-on-secondary group-[.toast]:font-semibold group-[.toast]:rounded-md group-[.toast]:px-3 group-[.toast]:py-1.5 group-[.toast]:text-label-md',
          cancelButton:
            'group-[.toast]:bg-surface-container group-[.toast]:text-on-surface-variant group-[.toast]:font-semibold group-[.toast]:rounded-md group-[.toast]:px-3 group-[.toast]:py-1.5 group-[.toast]:text-label-md',
          success:
            'group-[.toast]:!bg-tertiary-fixed/10 group-[.toast]:!border-on-tertiary-fixed-variant/10 group-[.toast]:!text-on-tertiary-container',
          error:
            'group-[.toast]:!bg-error-container/20 group-[.toast]:!border-error/10 group-[.toast]:!text-error',
        },
      }}
      {...props}
    />
  );
};

export default Toaster;
