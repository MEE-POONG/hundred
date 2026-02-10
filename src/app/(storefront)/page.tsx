'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { categories } from '@/data/categories';
import { mockReviews } from '@/data/reviews';
import ProductCard from '@/components/storefront/ProductCard';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { Product } from '@/data/types';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [flashDeals, setFlashDeals] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [featuredRes, allRes] = await Promise.all([
          fetch('/api/products?featured=true'),
          fetch('/api/products'),
        ]);
        if (featuredRes.ok) {
          const data = await featuredRes.json();
          setFeaturedProducts(data);
        }
        if (allRes.ok) {
          const all = await allRes.json();
          const onSale = all.filter((p: Product) => p.salePrice && p.salePrice < p.price);
          setFlashDeals(onSale.slice(0, 4));
        }
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="overflow-x-hidden">
      {/* ============================================================ */}
      {/* Hero Section */}
      {/* ============================================================ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[rgb(var(--primary))]/20 via-transparent to-[rgb(var(--secondary))]/20" />
        {/* Floating orbs for depth */}
        <div className="absolute top-10 right-10 w-64 h-64 md:w-96 md:h-96 bg-[rgb(var(--primary))]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-48 h-48 md:w-72 md:h-72 bg-[rgb(var(--secondary))]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 lg:py-28 relative">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight">
              <span className="text-gradient">อาหารเสริม</span>
              <br />
              คุณภาพพรีเมียม
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-[rgb(var(--text-muted))] mb-6 sm:mb-8 max-w-xl leading-relaxed">
              ดูแลสุขภาพด้วยผลิตภัณฑ์คุณภาพ ได้มาตรฐาน อย. พร้อมระบบตั๋วแลกของรางวัล
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link href="/products" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto">🛍️ ช้อปเลย</Button>
              </Link>
              <Link href="/tickets" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">🎫 ลุ้นของรางวัล</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* Categories */}
      {/* ============================================================ */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 md:py-16">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-5 sm:mb-6 md:mb-8">หมวดหมู่สินค้า</h2>

        {/* Mobile: Horizontal scroll, Tablet: 3 cols, Desktop: 5 cols */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {categories.map(category => (
            <Link key={category.id} href={`/products?category=${category.slug}`}>
              <Card hover className="p-4 sm:p-5 md:p-6 text-center h-full">
                <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">{category.icon}</div>
                <h3 className="font-semibold text-xs sm:text-sm md:text-base mb-1">{category.name}</h3>
                <p className="text-[10px] sm:text-xs text-[rgb(var(--text-muted))] line-clamp-2 hidden sm:block">
                  {category.description}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* Flash Deals */}
      {/* ============================================================ */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 md:py-16">
        <div className="flex items-start sm:items-center justify-between mb-5 sm:mb-6 md:mb-8 gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2">⚡ โปรโมชันพิเศษ</h2>
            <p className="text-xs sm:text-sm text-[rgb(var(--text-muted))]">ลดราคาสุดคุ้ม อัพเดตทุกวัน</p>
          </div>
          <div className="hidden sm:block shrink-0">
            <div className="card-surface px-3 sm:px-4 py-1.5 sm:py-2 inline-flex items-center gap-2">
              <span className="text-xs sm:text-sm text-[rgb(var(--text-muted))]">เหลือเวลา</span>
              <span className="text-sm sm:text-lg font-bold text-[rgb(var(--primary))]">12:34:56</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
          ) : (
            flashDeals.map(product => (
              <ProductCard key={product.id || (product as any)._id} product={product} />
            ))
          )}
        </div>
      </section>

      {/* ============================================================ */}
      {/* Featured Products */}
      {/* ============================================================ */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 md:py-16">
        <div className="flex items-center justify-between mb-5 sm:mb-6 md:mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">✨ สินค้าแนะนำ</h2>
          <Link href="/products">
            <Button variant="ghost" size="sm" className="text-xs sm:text-sm">ดูทั้งหมด →</Button>
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
          ) : (
            featuredProducts.slice(0, 8).map(product => (
              <ProductCard key={product.id || (product as any)._id} product={product} />
            ))
          )}
        </div>
      </section>

      {/* ============================================================ */}
      {/* Reviews */}
      {/* ============================================================ */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 md:py-16">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-5 sm:mb-6 md:mb-8">💬 รีวิวจากลูกค้า</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {mockReviews.slice(0, 6).map(review => (
            <Card key={review.id} className="p-4 sm:p-5 md:p-6">
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <img
                  src={review.userAvatar}
                  alt={review.userName}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                />
                <div className="min-w-0">
                  <div className="font-semibold text-sm sm:text-base truncate">{review.userName}</div>
                  <div className="flex items-center gap-0.5 text-yellow-400">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <span key={i} className="text-xs sm:text-sm">⭐</span>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-[rgb(var(--text-muted))] text-xs sm:text-sm line-clamp-4 leading-relaxed">
                {review.comment}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* CTA Section */}
      {/* ============================================================ */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 md:py-16">
        <Card className="p-6 sm:p-8 md:p-12 text-center bg-gradient-to-br from-[rgb(var(--primary))]/10 to-[rgb(var(--secondary))]/10 border-[rgb(var(--primary))]/30 relative overflow-hidden">
          {/* Glow orbs */}
          <div className="absolute -top-16 -right-16 w-32 h-32 md:w-48 md:h-48 bg-[rgb(var(--primary))]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-32 h-32 md:w-48 md:h-48 bg-[rgb(var(--secondary))]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-2xl mx-auto relative">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
              <span className="text-gradient">ลองระบบตั๋วแลกของรางวัล</span>
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-[rgb(var(--text-muted))] mb-5 sm:mb-6 md:mb-8 leading-relaxed">
              สุ่มตั๋วฟรีทุกวัน แลกรับสินค้าคุณภาพและของรางวัลพิเศษมากมาย
            </p>
            <Link href="/tickets" className="inline-block">
              <Button size="lg" className="px-6 sm:px-8">🎫 เริ่มลุ้นเลย</Button>
            </Link>
          </div>
        </Card>
      </section>
    </div>
  );
}
