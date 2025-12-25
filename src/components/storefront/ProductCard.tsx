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
      <div className="card-surface p-4 h-full hover:glow-pink-sm hover:border-[rgb(var(--primary))]/40 hover:-translate-y-1.5 transition-all duration-500 group relative overflow-hidden bg-gradient-to-b from-white/[0.03] to-transparent">
        {/* Shine effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

        {/* Image Container */}
        <div className="relative aspect-square mb-5 rounded-2xl overflow-hidden glass-dark ring-1 ring-white/10 group-hover:ring-white/20 transition-all duration-500">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
          {hasDiscount && (
            <div className="absolute top-3 right-3 z-10">
              <Badge variant="pink" className="shadow-lg backdrop-blur-md border border-white/20">
                -{Math.round(((product.price - product.salePrice!) / product.price) * 100)}%
              </Badge>
            </div>
          )}
          {!product.isInStock && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center z-10 transition-all">
              <Badge variant="error" className="py-1.5 px-4">สินค้าหมด</Badge>
            </div>
          )}
          
          {/* Quick info overlay on hover */}
          <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-500">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[rgb(var(--primary))]">Premium Quality</span>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          {/* Category */}
          <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-[rgb(var(--text-muted))] mb-2 opacity-80">{product.categoryName}</div>

          {/* Name */}
          <h3 className="text-base font-semibold mb-3 line-clamp-2 leading-snug group-hover:text-[rgb(var(--primary))] transition-colors duration-300 min-h-[2.8rem]">
            {product.name}
          </h3>

          {/* Meta Info */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1.5 glass bg-white/5 px-2 py-0.5 rounded-lg border-white/10">
              <span className="text-[10px]">⭐</span>
              <span className="text-xs font-bold text-white/90">{product.rating.toFixed(1)}</span>
              <span className="text-[10px] text-[rgb(var(--text-muted))] ml-0.5">({product.reviewCount})</span>
            </div>
          </div>

          {/* Price Section */}
          <div className="flex items-end gap-3 pt-2 border-t border-white/5">
            <div className="flex flex-col">
              {hasDiscount && (
                <span className="text-[10px] text-[rgb(var(--text-muted))] line-through opacity-60 mb-0.5">
                  ฿{product.price.toLocaleString()}
                </span>
              )}
              <span className="text-xl font-extrabold tracking-tight text-white group-hover:text-[rgb(var(--primary))] transition-colors duration-300">
                ฿{displayPrice.toLocaleString()}
              </span>
            </div>
            
            {/* Action Icon (Visible on hover in a premium way) */}
            <div className="ml-auto opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500">
              <div className="w-8 h-8 rounded-full bg-[rgb(var(--primary))] flex items-center justify-center shadow-lg shadow-[rgb(var(--primary))/0.3]">
                <span className="text-white text-lg">+</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
