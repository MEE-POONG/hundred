'use client';

import { useState } from 'react';
import { products } from '@/data/products';
import Link from 'next/link';

export default function AdminProducts() {
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null);

  const categories = ['all', ...new Set(products.map(p => p.category))];

  const filteredProducts = products.filter(p => {
    const matchesCategory = filterCategory === 'all' || p.category === filterCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Products</h1>
          <p className="text-[rgb(var(--text-muted))]">จัดการสินค้าของร้าน</p>
        </div>
        <Link
          href="/admin/products/new"
          className="px-6 py-2.5 bg-gradient-primary text-white rounded-lg hover:opacity-90 transition-all font-semibold"
        >
          + สินค้าใหม่
        </Link>
      </div>

      {/* Filters */}
      <div className="card-surface p-4 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="ค้นหาสินค้า..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-4 py-2 bg-white/5 border border-white/[0.08] rounded-lg text-white placeholder-[rgb(var(--text-muted))] focus:outline-none focus:border-[rgb(var(--primary))]"
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2 bg-white/5 border border-white/[0.08] rounded-lg text-white focus:outline-none focus:border-[rgb(var(--primary))]"
        >
          {categories.map(cat => (
            <option key={cat} value={cat} className="bg-[rgb(var(--surface))]">
              {cat === 'all' ? 'ทั้งหมด' : cat}
            </option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <div className="card-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.08] bg-white/[0.02]">
                <th className="text-left py-4 px-6 text-[rgb(var(--text-muted))] font-semibold">สินค้า</th>
                <th className="text-left py-4 px-6 text-[rgb(var(--text-muted))] font-semibold">หมวดหมู่</th>
                <th className="text-center py-4 px-6 text-[rgb(var(--text-muted))] font-semibold">สต็อก</th>
                <th className="text-right py-4 px-6 text-[rgb(var(--text-muted))] font-semibold">ราคา</th>
                <th className="text-center py-4 px-6 text-[rgb(var(--text-muted))] font-semibold">ขาย</th>
                <th className="text-center py-4 px-6 text-[rgb(var(--text-muted))] font-semibold">ดำเนิน</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b border-white/[0.08] hover:bg-white/[0.03] transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-10 h-10 rounded object-cover"
                        />
                        <div>
                          <p className="font-medium text-white">{product.name}</p>
                          <p className="text-xs text-[rgb(var(--text-muted))]">{product.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-[rgb(var(--text-muted))]">{product.categoryName}</td>
                    <td className="py-4 px-6 text-center">
                      <span
                        className={`text-sm font-semibold px-3 py-1 rounded-full ${
                          product.stock < 10
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-green-500/20 text-green-400'
                        }`}
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex flex-col items-end">
                        {product.salePrice ? (
                          <>
                            <span className="text-white font-semibold">฿{product.salePrice}</span>
                            <span className="text-xs text-[rgb(var(--text-muted))] line-through">
                              ฿{product.price}
                            </span>
                          </>
                        ) : (
                          <span className="text-white font-semibold">฿{product.price}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {product.isOnSale && <span className="text-xs font-semibold px-2 py-1 rounded bg-pink-500/20 text-pink-400">Sale</span>}
                        {product.isFeatured && <span className="text-xs font-semibold px-2 py-1 rounded bg-purple-500/20 text-purple-400">Featured</span>}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setSelectedProduct(product)}
                          className="p-2 hover:bg-white/10 rounded transition-colors text-lg"
                        >
                          ✏️
                        </button>
                        <button className="p-2 hover:bg-red-500/10 rounded transition-colors text-lg">
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 px-6 text-center text-[rgb(var(--text-muted))]">
                    ไม่พบสินค้า
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[rgb(var(--surface))] rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-white/[0.08]">
            <div className="p-6 border-b border-white/[0.08] flex items-center justify-between sticky top-0 bg-[rgb(var(--surface))] z-10">
              <h2 className="text-xl font-bold text-white">แก้ไขสินค้า</h2>
              <button
                onClick={() => setSelectedProduct(null)}
                className="p-1 hover:bg-white/10 rounded text-lg"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm text-[rgb(var(--text-muted))] block mb-2">ชื่อสินค้า</label>
                <input
                  type="text"
                  defaultValue={selectedProduct.name}
                  className="w-full px-4 py-2 bg-white/5 border border-white/[0.08] rounded-lg text-white placeholder-[rgb(var(--text-muted))] focus:outline-none focus:border-[rgb(var(--primary))]"
                />
              </div>

              <div>
                <label className="text-sm text-[rgb(var(--text-muted))] block mb-2">ราคา</label>
                <input
                  type="number"
                  defaultValue={selectedProduct.price}
                  className="w-full px-4 py-2 bg-white/5 border border-white/[0.08] rounded-lg text-white placeholder-[rgb(var(--text-muted))] focus:outline-none focus:border-[rgb(var(--primary))]"
                />
              </div>

              <div>
                <label className="text-sm text-[rgb(var(--text-muted))] block mb-2">ราคาขาย</label>
                <input
                  type="number"
                  defaultValue={selectedProduct.salePrice || ''}
                  className="w-full px-4 py-2 bg-white/5 border border-white/[0.08] rounded-lg text-white placeholder-[rgb(var(--text-muted))] focus:outline-none focus:border-[rgb(var(--primary))]"
                />
              </div>

              <div>
                <label className="text-sm text-[rgb(var(--text-muted))] block mb-2">สต็อก</label>
                <input
                  type="number"
                  defaultValue={selectedProduct.stock}
                  className="w-full px-4 py-2 bg-white/5 border border-white/[0.08] rounded-lg text-white placeholder-[rgb(var(--text-muted))] focus:outline-none focus:border-[rgb(var(--primary))]"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="flex-1 px-4 py-2 border border-white/[0.08] rounded-lg text-white hover:bg-white/5 transition-colors"
                >
                  ยกเลิก
                </button>
                <button className="flex-1 px-4 py-2 bg-gradient-primary text-white rounded-lg hover:opacity-90 transition-all font-semibold">
                  บันทึก
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
