import { HTMLAttributes } from 'react';
import { clsx } from 'clsx';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'featured' | 'highlighted';
}

export function Card({ variant = 'default', className, children, ...props }: CardProps) {
  return (
    <div
      className={clsx(
        'rounded-xl border bg-white dark:bg-slate-800 shadow-sm',
        variant === 'featured' && 'border-accent-500 ring-2 ring-accent-400',
        variant === 'highlighted' && 'border-primary-300 ring-1 ring-primary-200',
        variant === 'default' && 'border-slate-200 dark:border-slate-700',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
