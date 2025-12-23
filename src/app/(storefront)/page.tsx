import React from 'react';
import Link from 'next/link';
import { categories } from '@/data/categories';
import { getFeaturedProducts, getOnSaleProducts } from '@/data/products';
import { mockReviews } from '@/data/reviews';
import ProductCard from '@/components/storefront/ProductCard';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function HomePage() {
  const featuredProducts = getFeaturedProducts();
  const flashDeals = getOnSaleProducts().slice(0, 4);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[rgb(var(--primary))]/20 via-transparent to-[rgb(var(--secondary))]/20" />
        <div className="container mx-auto px-4 py-20 relative">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="text-gradient">อาหารเสริม</span>
              <br />
              คุณภาพพรีเมียม
            </h1>
            <p className="text-xl text-[rgb(var(--text-muted))] mb-8">
              ดูแลสุขภาพด้วยผลิตภัณฑ์คุณภาพ ได้มาตรฐาน อย. พร้อมระบบตั๋วแลกของรางวัล
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/products">
                <Button size="lg">🛍️ ช้อปเลย</Button>
              </Link>
              <Link href="/tickets">
                <Button variant="outline" size="lg">🎫 ลุ้นของรางวัล</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8">หมวดหมู่สินค้า</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map(category => (
            <Link key={category.id} href={`/products?category=${category.slug}`}>
              <Card hover className="p-6 text-center">
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="font-semibold mb-1">{category.name}</h3>
                <p className="text-xs text-[rgb(var(--text-muted))] line-clamp-2">
                  {category.description}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Flash Deals */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">⚡ โปรโมชันพิเศษ</h2>
            <p className="text-[rgb(var(--text-muted))]">ลดราคาสุดคุ้ม อัพเดตทุกวัน</p>
          </div>
          <div className="hidden md:block">
            <div className="card-surface px-4 py-2 inline-flex items-center gap-2">
              <span className="text-sm text-[rgb(var(--text-muted))]">เหลือเวลา</span>
              <span className="text-lg font-bold text-[rgb(var(--primary))]">12:34:56</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {flashDeals.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">✨ สินค้าแนะนำ</h2>
          <Link href="/products">
            <Button variant="ghost">ดูทั้งหมด →</Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.slice(0, 8).map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Reviews */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8">💬 รีวิวจากลูกค้า</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockReviews.slice(0, 6).map(review => (
            <Card key={review.id} className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={review.userAvatar}
                  alt={review.userName}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <div className="font-semibold">{review.userName}</div>
                  <div className="flex items-center gap-1 text-yellow-400">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <span key={i}>⭐</span>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-[rgb(var(--text-muted))] text-sm line-clamp-4">
                {review.comment}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="p-12 text-center bg-gradient-to-br from-[rgb(var(--primary))]/10 to-[rgb(var(--secondary))]/10 border-[rgb(var(--primary))]/30">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-4xl font-bold mb-4">
              <span className="text-gradient">ลองระบบตั๋วแลกของรางวัล</span>
            </h2>
            <p className="text-[rgb(var(--text-muted))] mb-8">
              สุ่มตั๋วฟรีทุกวัน แลกรับสินค้าคุณภาพและของรางวัลพิเศษมากมาย
            </p>
            <Link href="/tickets">
              <Button size="lg">🎫 เริ่มลุ้นเลย</Button>
            </Link>
          </div>
        </Card>
      </section>
    </div>
  );
}
