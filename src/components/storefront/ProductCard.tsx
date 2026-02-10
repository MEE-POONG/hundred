import React from 'react';
import Link from 'next/link';
import { Product } from '@/data/types';
import Badge from '@/components/ui/Badge';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const displayPrice = product.salePrice || product.price;
  const hasDiscount = !!product.salePrice;

  return (
    <Link href={`/products/${product.slug}`}>
      <div className="card-surface p-2.5 sm:p-3 md:p-4 h-full hover:border-[rgb(var(--primary))]/30 hover:glow-pink transition-all duration-200 group">
        {/* Image */}
        <div className="relative aspect-square mb-2.5 sm:mb-3 md:mb-4 rounded-lg sm:rounded-xl overflow-hidden bg-white/5">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          {hasDiscount && (
            <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2">
              <Badge variant="pink" className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5">
                -{Math.round(((product.price - product.salePrice!) / product.price) * 100)}%
              </Badge>
            </div>
          )}
          {!product.isInStock && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
              <Badge variant="error" className="text-[10px] sm:text-xs">สินค้าหมด</Badge>
            </div>
          )}
        </div>

        {/* Category */}
        <div className="text-[10px] sm:text-xs text-[rgb(var(--text-muted))] mb-0.5 sm:mb-1 truncate">{product.categoryName}</div>

        {/* Name */}
        <h3 className="font-semibold text-xs sm:text-sm md:text-base mb-1.5 sm:mb-2 line-clamp-2 group-hover:text-[rgb(var(--primary))] transition-colors leading-snug">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-3">
          <div className="flex items-center gap-0.5 sm:gap-1">
            <span className="text-yellow-400 text-[10px] sm:text-sm">⭐</span>
            <span className="text-[10px] sm:text-sm font-medium">{product.rating.toFixed(1)}</span>
          </div>
          <span className="text-[9px] sm:text-xs text-[rgb(var(--text-muted))]">({product.reviewCount})</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-1.5 sm:gap-2 flex-wrap">
          <span className="text-sm sm:text-base md:text-xl font-bold text-[rgb(var(--primary))]">
            ฿{displayPrice.toLocaleString()}
          </span>
          {hasDiscount && (
            <span className="text-[10px] sm:text-xs md:text-sm text-[rgb(var(--text-muted))] line-through">
              ฿{product.price.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
