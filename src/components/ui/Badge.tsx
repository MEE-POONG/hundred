import React from 'react';

interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'pink';
  children: React.ReactNode;
  className?: string;
}

export default function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  const variants = {
    default: 'bg-white/10 text-[rgb(var(--text))]',
    success: 'bg-[rgb(var(--success))]/20 text-[rgb(var(--success))]',
    warning: 'bg-[rgb(var(--warning))]/20 text-[rgb(var(--warning))]',
    error: 'bg-[rgb(var(--error))]/20 text-[rgb(var(--error))]',
    info: 'bg-blue-500/20 text-blue-400',
    pink: 'bg-[rgb(var(--primary))]/20 text-[rgb(var(--primary))] glow-pink',
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
