'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { categories } from '@/data/categories';
import ProductCard from '@/components/storefront/ProductCard';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import Button from '@/components/ui/Button';
import { Product } from '@/data/types';

export default function ProductsContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');

  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam || '');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]); // Increased max price
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/products');
        if (response.ok) {
          const data = await response.json();
          const mappedData = data.map((p: any) => ({ ...p, id: p._id }));
          setProducts(mappedData);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let filtered = [...products].filter(product => {
      const nameMatch = product.name?.toLowerCase().includes(search.toLowerCase()) || false;
      const descMatch = product.description?.toLowerCase().includes(search.toLowerCase()) || false;
      const matchesSearch = nameMatch || descMatch;

      const matchesCategory = !selectedCategory || product.category === selectedCategory || product.categoryName === selectedCategory; // Check both fields

      const price = Number(product.salePrice || product.price || 0);
      const matchesPrice = price >= priceRange[0] && price <= priceRange[1];

      const matchesRating = (product.rating || 0) >= minRating;
      const matchesStock = !inStockOnly || (product.stock || 0) > 0;

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
  }, [products, search, selectedCategory, priceRange, minRating, inStockOnly, sortBy]); // Added products to dependency

  const handleClearFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setPriceRange([0, 1000000]); // Matches initial state
    setMinRating(0);
    setInStockOnly(false);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-5 sm:mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4">สินค้าทั้งหมด</h1>
        <p className="text-xs sm:text-sm md:text-base text-[rgb(var(--text-muted))]">
          อาหารเสริมคุณภาพ ได้มาตรฐาน อย. เลือกซื้อได้ตามต้องการ
        </p>
      </div>

      <div className="flex gap-6 lg:gap-8">
        {/* Sidebar Filters - Desktop */}
        <aside className="hidden lg:block w-60 xl:w-64 flex-shrink-0">
          <div className="card-surface p-5 xl:p-6 sticky top-20 space-y-5">
            <div>
              <h3 className="font-semibold mb-3 text-sm">ค้นหา</h3>
              <input
                type="text"
                placeholder="ค้นหาสินค้า..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl bg-white/5 border border-white/[0.08] focus:border-[rgb(var(--primary))] outline-none transition-colors"
                suppressHydrationWarning
              />
            </div>

            <div>
              <h3 className="font-semibold mb-3 text-sm">หมวดหมู่</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={!selectedCategory}
                    onChange={() => setSelectedCategory('')}
                    className="accent-[rgb(var(--primary))]"
                    suppressHydrationWarning
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
                      suppressHydrationWarning
                    />
                    <span className="text-sm">{cat.icon} {cat.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3 text-sm">ราคา</h3>
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
                  suppressHydrationWarning
                />
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3 text-sm">คะแนนขั้นต่ำ</h3>
              <div className="space-y-2">
                {[0, 3, 4, 4.5].map(rating => (
                  <label key={rating} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={minRating === rating}
                      onChange={() => setMinRating(rating)}
                      className="accent-[rgb(var(--primary))]"
                      suppressHydrationWarning
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
                  suppressHydrationWarning
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
        <div className="flex-1 min-w-0">
          {/* Mobile Filter Button */}
          <div className="lg:hidden mb-4">
            <Button onClick={() => setFilterOpen(!filterOpen)} fullWidth>
              🔍 ตัวกรอง
            </Button>
          </div>

          {/* Mobile Filter Panel */}
          {filterOpen && (
            <div className="lg:hidden card-surface p-4 mb-4 space-y-4 animate-scale-in">
              <div>
                <h3 className="font-semibold mb-2 text-sm">ค้นหา</h3>
                <input
                  type="text"
                  placeholder="ค้นหาสินค้า..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl bg-white/5 border border-white/[0.08] focus:border-[rgb(var(--primary))] outline-none transition-colors"
                  suppressHydrationWarning
                />
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-sm">หมวดหมู่</h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedCategory('')}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${!selectedCategory ? 'bg-gradient-primary text-white' : 'bg-white/5 text-[rgb(var(--text-muted))] hover:bg-white/10'}`}
                  >
                    ทั้งหมด
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.slug)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${selectedCategory === cat.slug ? 'bg-gradient-primary text-white' : 'bg-white/5 text-[rgb(var(--text-muted))] hover:bg-white/10'}`}
                    >
                      {cat.icon} {cat.name}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={handleClearFilters} size="sm" fullWidth>ล้างตัวกรอง</Button>
                <Button onClick={() => setFilterOpen(false)} size="sm" fullWidth>ปิด</Button>
              </div>
            </div>
          )}

          {/* Top Bar */}
          <div className="flex items-center justify-between mb-4 sm:mb-6 gap-3">
            <p className="text-xs sm:text-sm text-[rgb(var(--text-muted))] whitespace-nowrap">
              พบ {filteredProducts.length} รายการ
            </p>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-xl bg-black border focus:border-[rgb(var(--primary))] outline-none transition-colors"
              suppressHydrationWarning
            >
              <option value="featured">แนะนำ</option>
              <option value="price-asc">ราคา: ต่ำ - สูง</option>
              <option value="price-desc">ราคา: สูง - ต่ำ</option>
              <option value="rating">คะแนนสูงสุด</option>
            </select>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
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
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
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

