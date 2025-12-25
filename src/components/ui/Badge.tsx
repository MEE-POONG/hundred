import React from 'react';

interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'pink';
  children: React.ReactNode;
  className?: string;
}

export default function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  const variants = {
    default: 'bg-white/5 backdrop-blur-md text-[rgb(var(--text))] border border-white/10',
    success: 'bg-[rgb(var(--success))]/10 backdrop-blur-md text-[rgb(var(--success))] border border-[rgb(var(--success))]/20',
    warning: 'bg-[rgb(var(--warning))]/10 backdrop-blur-md text-[rgb(var(--warning))] border border-[rgb(var(--warning))]/20',
    error: 'bg-[rgb(var(--error))]/10 backdrop-blur-md text-[rgb(var(--error))] border border-[rgb(var(--error))]/20',
    info: 'bg-blue-500/10 backdrop-blur-md text-blue-400 border border-blue-500/20',
    pink: 'bg-[rgb(var(--primary))]/15 backdrop-blur-md text-[rgb(var(--primary))] border border-[rgb(var(--primary))]/30 glow-pink-sm',
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
