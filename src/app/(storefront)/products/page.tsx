'use client';
import React, { Suspense } from 'react';
import ProductsContent from './ProductsContent';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';

export default function ProductsPageWrapper() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
