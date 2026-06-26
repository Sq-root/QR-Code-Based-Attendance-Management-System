import * as React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'default' | 'lg' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'default', size = 'default', ...props }, ref) => {
    const baseClasses =
      'inline-flex items-center justify-center gap-2 whitespace-nowrap font-sans font-semibold tracking-tight transition-all duration-200 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/55 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-container-lowest';

    const variantClasses = {
      default:
        'bg-secondary text-on-secondary shadow-sm shadow-secondary/25 hover:bg-on-secondary-fixed-variant hover:shadow-md hover:shadow-secondary/25',
      secondary:
        'bg-surface-container-lowest hover:bg-surface-container border border-outline-variant text-on-surface hover:text-primary shadow-xs hover:shadow-sm',
      outline:
        'bg-transparent border border-outline-variant text-on-surface hover:bg-surface-container hover:border-outline',
      ghost: 'bg-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container',
      destructive:
        'bg-error text-on-error shadow-sm shadow-error/25 hover:bg-on-error-container hover:shadow-md',
    };

    const sizeClasses = {
      sm: 'h-9 px-4 rounded-lg text-xs',
      default: 'h-12 px-6 rounded-lg text-label-md',
      lg: 'h-14 px-8 rounded-xl text-body-lg',
      icon: 'h-9 w-9 p-0 rounded-lg',
    };

    const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

    return <button ref={ref} className={classes} {...props} />;
  }
);
Button.displayName = 'Button';

export { Button };
export default Button;
