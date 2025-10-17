import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '../../lib/utils.tsx';

// CVA: Manage button styles
const buttonVariants = cva(
  'flex items-center justify-center font-semibold transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer',
  {
    variants: {
      variant: {
        login: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-400 w-full',
        primary:
          'bg-blue-500 hover:bg-blue-400 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors shadow-md',
        danger: 'bg-red-600 text-white hover:bg-red-700 shadow-lg hover:shadow-red-500/40 focus:ring-red-500',
        warning: 'bg-amber-100 text-amber-600 hover:bg-amber-200 focus:ring-amber-500',
        secondary: 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-400',
        outline: 'border border-green-600 text-green-600 bg-transparent hover:bg-green-50 focus:ring-green-500 rounded-md',
      },
      size: {
        normal: 'px-6 py-3 rounded-lg gap-2 text-base',
        mid: 'px-4 py-2.5 rounded-lg gap-2 text-base',
        small: 'px-4 py-2 rounded-lg text-sm gap-2',
        icon: 'w-7 h-7 rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'normal',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  icon?: string;
  applyDisabledStyle?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, size, className, isLoading, icon, children, applyDisabledStyle = true, ...props }, ref) => {
    const classes = cn(
      buttonVariants({ variant, size }),
      'relative',
      !applyDisabledStyle && props.disabled ? 'opacity-100 cursor-default' : '',
      className
    );

    return (
      <button ref={ref} className={classes} disabled={isLoading || props.disabled} {...props}>
        {isLoading && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <i className="fas fa-spinner animate-spin"></i>
          </div>
        )}

        <span className={cn('flex items-center justify-center', { invisible: isLoading })}>
          {icon && <i className={`${icon} ${children ? 'mr-2' : ''}`}></i>}
          {children}
        </span>
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };