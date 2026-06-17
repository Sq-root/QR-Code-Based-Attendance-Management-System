import * as React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'default' | 'lg' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'default', size = 'default', ...props }, ref) => {
    const baseClasses =
      'inline-flex items-center justify-center gap-2 whitespace-nowrap font-sans font-semibold transition-all duration-200 active:scale-95 disabled:pointer-events-none disabled:opacity-50 cursor-pointer shadow-sm';

    const variantClasses = {
      default: 'bg-secondary text-on-secondary hover:bg-on-secondary-fixed-variant',
      secondary:
        'bg-surface-container hover:bg-surface-container-high border border-outline-variant text-on-surface hover:text-primary',
      outline: 'bg-transparent border border-outline text-on-surface hover:bg-surface-container',
      ghost: 'bg-transparent text-on-surface-variant hover:text-primary hover:bg-surface-container',
      destructive: 'bg-error text-on-error hover:bg-opacity-95',
    };

    const sizeClasses = {
      sm: 'h-9 px-4 rounded-md text-xs',
      default: 'h-12 px-6 rounded-lg text-label-md',
      lg: 'h-14 px-8 rounded-xl text-body-lg',
      icon: 'h-9 w-9 p-0 rounded-md',
    };

    const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

    return <button ref={ref} className={classes} {...props} />;
  }
);
Button.displayName = 'Button';

export { Button };
export default Button;
