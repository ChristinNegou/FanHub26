import { HTMLAttributes } from 'react';
import { clsx } from 'clsx';

type BadgeVariant = 'default' | 'featured' | 'verified' | 'live' | 'success' | 'warning';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variants: Record<BadgeVariant, string> = {
  default: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
  featured: 'bg-accent-500 text-white',
  verified: 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300',
  live: 'bg-red-500 text-white animate-pulse',
  success: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
};

export function Badge({ variant = 'default', className, children, ...props }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold',
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
