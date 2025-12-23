import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  elevated?: boolean;
  hover?: boolean;
}

export default function Card({ children, className = '', elevated = false, hover = false }: CardProps) {
  const baseClass = elevated ? 'card-elevated' : 'card-surface';
  const hoverClass = hover ? 'hover:border-[rgb(var(--primary))]/30 hover:glow-pink transition-all duration-200 cursor-pointer' : '';

  return (
    <div className={`${baseClass} ${hoverClass} ${className}`}>
      {children}
    </div>
  );
}
