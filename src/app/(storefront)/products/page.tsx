'use client';

import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { products } from '@/data/products';
import { categories } from '@/data/categories';
import ProductCard from '@/components/storefront/ProductCard';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import Button from '@/components/ui/Button';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam || '');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [loading, setLoading] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = !selectedCategory || product.category === selectedCategory;
      const price = product.salePrice || product.price;
      const matchesPrice = price >= priceRange[0] && price <= priceRange[1];
      const matchesRating = product.rating >= minRating;
      const matchesStock = !inStockOnly || product.isInStock;

      return matchesSearch && matchesCategory && matchesPrice && matchesRating && matchesStock;
    });

    // Sort
    if (sortBy === 'price-asc') {
      filtered.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
    } else if (sortBy === 'price-desc') {
      filtered.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else {
      filtered.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    return filtered;
  }, [search, selectedCategory, priceRange, minRating, inStockOnly, sortBy]);

  const handleClearFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setPriceRange([0, 5000]);
    setMinRating(0);
    setInStockOnly(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">สินค้าทั้งหมด</h1>
        <p className="text-[rgb(var(--text-muted))]">
          อาหารเสริมคุณภาพ ได้มาตรฐาน อย. เลือกซื้อได้ตามต้องการ
        </p>
      </div>

      <div className="flex gap-8">
        {/* Sidebar Filters - Desktop */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="card-surface p-6 sticky top-24 space-y-6">
            <div>
              <h3 className="font-semibold mb-3">ค้นหา</h3>
              <input
                type="text"
                placeholder="ค้นหาสินค้า..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/[0.08] focus:border-[rgb(var(--primary))] outline-none transition-colors"
              />
            </div>

            <div>
              <h3 className="font-semibold mb-3">หมวดหมู่</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={!selectedCategory}
                    onChange={() => setSelectedCategory('')}
                    className="accent-[rgb(var(--primary))]"
                  />
                  <span className="text-sm">ทั้งหมด</span>
                </label>
                {categories.map(cat => (
                  <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={selectedCategory === cat.slug}
                      onChange={() => setSelectedCategory(cat.slug)}
                      className="accent-[rgb(var(--primary))]"
                    />
                    <span className="text-sm">{cat.icon} {cat.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">ราคา</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <span>฿{priceRange[0]}</span>
                  <span>-</span>
                  <span>฿{priceRange[1]}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5000"
                  step="100"
                  value={priceRange[1]}
                  onChange={e => setPriceRange([0, parseInt(e.target.value)])}
                  className="w-full accent-[rgb(var(--primary))]"
                />
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">คะแนนขั้นต่ำ</h3>
              <div className="space-y-2">
                {[0, 3, 4, 4.5].map(rating => (
                  <label key={rating} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={minRating === rating}
                      onChange={() => setMinRating(rating)}
                      className="accent-[rgb(var(--primary))]"
                    />
                    <span className="text-sm flex items-center gap-1">
                      {rating > 0 ? `${rating}+ ⭐` : 'ทั้งหมด'}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={e => setInStockOnly(e.target.checked)}
                  className="accent-[rgb(var(--primary))]"
                />
                <span className="text-sm">มีสินค้าในสต็อกเท่านั้น</span>
              </label>
            </div>

            <Button variant="ghost" onClick={handleClearFilters} fullWidth size="sm">
              ล้างตัวกรอง
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* Mobile Filter Button */}
          <div className="lg:hidden mb-4">
            <Button onClick={() => setFilterOpen(!filterOpen)} fullWidth>
              🔍 ตัวกรอง
            </Button>
          </div>

          {/* Top Bar */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-[rgb(var(--text-muted))]">
              พบ {filteredProducts.length} รายการ
            </p>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/[0.08] focus:border-[rgb(var(--primary))] outline-none transition-colors"
            >
              <option value="featured">แนะนำ</option>
              <option value="price-asc">ราคา: ต่ำ - สูง</option>
              <option value="price-desc">ราคา: สูง - ต่ำ</option>
              <option value="rating">คะแนนสูงสุด</option>
            </select>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <EmptyState
              icon="🔍"
              title="ไม่พบสินค้า"
              description="ลองเปลี่ยนเงื่อนไขการค้นหาหรือตัวกรอง"
              actionLabel="ล้างตัวกรอง"
              onAction={handleClearFilters}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
