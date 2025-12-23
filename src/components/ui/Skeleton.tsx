import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rect' | 'circle';
}

export default function Skeleton({ className = '', variant = 'rect' }: SkeletonProps) {
  const variants = {
    text: 'h-4 w-full rounded',
    rect: 'h-48 w-full rounded-2xl',
    circle: 'h-12 w-12 rounded-full',
  };

  return (
    <div className={`animate-pulse bg-white/5 ${variants[variant]} ${className}`} />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="card-surface p-4 space-y-3">
      <Skeleton variant="rect" />
      <Skeleton variant="text" />
      <Skeleton variant="text" className="w-2/3" />
      <div className="flex justify-between">
        <Skeleton variant="text" className="w-1/3" />
        <Skeleton variant="text" className="w-1/4" />
      </div>
    </div>
  );
}
