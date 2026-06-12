import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
}

const paddingClasses = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export default function Card({
  children,
  className = '',
  padding = 'md',
}: CardProps) {
  return (
    <div
      className={`glass rounded-2xl shadow-sm shadow-slate-200/50 dark:shadow-none ${paddingClasses[padding]} ${className}`}
    >
      {children}
    </div>
  );
}
