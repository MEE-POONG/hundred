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
      <div className="card-surface p-4 h-full hover:border-[rgb(var(--primary))]/30 hover:glow-pink transition-all duration-200 group">
        {/* Image */}
        <div className="relative aspect-square mb-4 rounded-xl overflow-hidden bg-white/5">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          {hasDiscount && (
            <div className="absolute top-2 right-2">
              <Badge variant="pink">
                -{Math.round(((product.price - product.salePrice!) / product.price) * 100)}%
              </Badge>
            </div>
          )}
          {!product.isInStock && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
              <Badge variant="error">สินค้าหมด</Badge>
            </div>
          )}
        </div>

        {/* Category */}
        <div className="text-xs text-[rgb(var(--text-muted))] mb-1">{product.categoryName}</div>

        {/* Name */}
        <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-[rgb(var(--primary))] transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            <span className="text-yellow-400">⭐</span>
            <span className="text-sm font-medium">{product.rating.toFixed(1)}</span>
          </div>
          <span className="text-xs text-[rgb(var(--text-muted))]">({product.reviewCount})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-[rgb(var(--primary))]">
            ฿{displayPrice.toLocaleString()}
          </span>
          {hasDiscount && (
            <span className="text-sm text-[rgb(var(--text-muted))] line-through">
              ฿{product.price.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
