'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ProductItem {
  _id: string;
  name: string;
  price: number;
  salePrice?: number;
  stock: number;
  category: string;
  categoryName?: string;
  images: string[];
  isOnSale?: boolean;
  isFeatured?: boolean;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [editForm, setEditForm] = useState({ name: '', price: 0, salePrice: '', stock: 0, images: [] as string[] });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Bulk Selection State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);





  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const data = new FormData();
    data.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      });
      if (res.ok) {
        const json = await res.json();
        setEditForm(prev => ({ ...prev, images: [...prev.images, json.url] }));
      } else {
        alert('Upload failed');
      }
    } catch (err) {
      console.error(err);
      alert('Upload error');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setEditForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', ...new Set(products.map(p => p.category))];

  const filteredProducts = products.filter(p => {
    const matchesCategory = filterCategory === 'all' || p.category === filterCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredProducts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredProducts.map(p => p._id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    if (!confirm(`คุณต้องการลบสินค้า ${selectedIds.length} รายการที่เลือกใช่หรือไม่?`)) return;

    setIsDeleting(true);
    try {
      const res = await fetch('/api/admin/products/bulk-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds }),
      });

      if (res.ok) {
        setSelectedIds([]);
        fetchProducts();
      } else {
        alert('Failed to delete products');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting products');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (product: ProductItem) => {
    setSelectedProduct(product);
    setEditForm({
      name: product.name,
      price: product.price,
      salePrice: product.salePrice?.toString() || '',
      stock: product.stock,
      images: product.images || [],
    });
  };

  const handleSave = async () => {
    if (!selectedProduct) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/products/${selectedProduct._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editForm.name,
          price: Number(editForm.price),
          salePrice: editForm.salePrice ? Number(editForm.salePrice) : undefined,
          stock: Number(editForm.stock),
          images: editForm.images,
        }),
      });
      if (res.ok) {
        setSelectedProduct(null);
        fetchProducts();
      }
    } catch (err) {
      console.error('Failed to save product:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบสินค้านี้?')) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      if (res.ok) fetchProducts();
    } catch (err) {
      console.error('Failed to delete product:', err);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-white mb-1">Products</h1>
        <p className="text-[rgb(var(--text-muted))]">กำลังโหลดข้อมูล...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Products</h1>
            <p className="text-[rgb(var(--text-muted))]">จัดการสินค้าของร้าน ({products.length} รายการ)</p>
          </div>
          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2 animate-fadeIn">
              <span className="text-sm text-white bg-white/10 px-3 py-1 rounded-full">
                เลือกแล้ว {selectedIds.length} รายการ
              </span>
              <button
                onClick={handleBulkDelete}
                disabled={isDeleting}
                className="px-4 py-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg text-sm font-medium transition-colors border border-red-500/20"
              >
                {isDeleting ? 'กำลังลบ...' : 'ลบที่เลือก'}
              </button>
            </div>
          )}
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
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/[0.08] bg-white/[0.02]">
                <th className="py-4 px-6 w-12">
                  <input
                    type="checkbox"
                    checked={filteredProducts.length > 0 && selectedIds.length === filteredProducts.length}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded accent-[rgb(var(--primary))]"
                  />
                </th>
                <th className="py-4 px-6 font-semibold text-[rgb(var(--text-muted))]">สินค้า</th>
                <th className="py-4 px-6 font-semibold text-[rgb(var(--text-muted))]">หมวดหมู่</th>
                <th className="py-4 px-6 font-semibold text-[rgb(var(--text-muted))] text-center">สต็อก</th>
                <th className="py-4 px-6 font-semibold text-[rgb(var(--text-muted))] text-right">ราคา</th>
                <th className="py-4 px-6 font-semibold text-[rgb(var(--text-muted))] text-center">สถานะ</th>
                <th className="py-4 px-6 font-semibold text-[rgb(var(--text-muted))] text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.08]">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product._id} className={`hover:bg-white/[0.02] transition-colors ${selectedIds.includes(product._id) ? 'bg-white/[0.04]' : ''}`}>
                    <td className="py-4 px-6">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(product._id)}
                        onChange={() => toggleSelect(product._id)}
                        className="w-4 h-4 rounded accent-[rgb(var(--primary))]"
                      />
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-white/5 overflow-hidden flex-shrink-0">
                          {product.images?.[0] ? (
                            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xl">📦</div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-white">{product.name}</p>
                          <p className="text-xs text-[rgb(var(--text-muted))]">ID: {product._id.slice(-6)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-[rgb(var(--text-muted))]">{product.categoryName || product.category}</td>
                    <td className="py-4 px-6 text-center">
                      <span className={`text-sm font-semibold px-3 py-1 rounded-full ${product.stock < 10 ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex flex-col items-end">
                        {product.salePrice ? (
                          <>
                            <span className="text-white font-semibold">฿{product.salePrice}</span>
                            <span className="text-xs text-[rgb(var(--text-muted))] line-through">฿{product.price}</span>
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
                        <button onClick={() => handleEdit(product)} className="p-2 hover:bg-white/10 rounded transition-colors text-lg">✏️</button>
                        <button onClick={() => handleDelete(product._id)} className="p-2 hover:bg-red-500/10 rounded transition-colors text-lg">🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 px-6 text-center text-[rgb(var(--text-muted))]">ไม่พบสินค้า</td>
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
              <button onClick={() => setSelectedProduct(null)} className="p-1 hover:bg-white/10 rounded text-lg">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm text-[rgb(var(--text-muted))] block mb-2">รูปสินค้า</label>
                <div className="flex flex-wrap gap-2">
                  {editForm.images.map((img, idx) => (
                    <div key={idx} className="relative w-16 h-16 rounded border border-white/20">
                      <img src={img} alt="Product" className="w-full h-full object-cover rounded" />
                      <button
                        onClick={() => removeImage(idx)}
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <label className="w-16 h-16 rounded border border-dashed border-white/20 flex items-center justify-center cursor-pointer hover:bg-white/5">
                    <span className="text-xl">{uploading ? '⏳' : '+'}</span>
                    <input type="file" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                  </label>
                </div>
              </div>

              <div>
                <label className="text-sm text-[rgb(var(--text-muted))] block mb-2">ชื่อสินค้า</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/[0.08] rounded-lg text-white focus:outline-none focus:border-[rgb(var(--primary))]"
                />
              </div>
              <div>
                <label className="text-sm text-[rgb(var(--text-muted))] block mb-2">ราคา</label>
                <input
                  type="number"
                  value={editForm.price}
                  onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/[0.08] rounded-lg text-white focus:outline-none focus:border-[rgb(var(--primary))]"
                />
              </div>
              <div>
                <label className="text-sm text-[rgb(var(--text-muted))] block mb-2">ราคาขาย</label>
                <input
                  type="number"
                  value={editForm.salePrice}
                  onChange={(e) => setEditForm({ ...editForm, salePrice: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/[0.08] rounded-lg text-white focus:outline-none focus:border-[rgb(var(--primary))]"
                />
              </div>
              <div>
                <label className="text-sm text-[rgb(var(--text-muted))] block mb-2">สต็อก</label>
                <input
                  type="number"
                  value={editForm.stock}
                  onChange={(e) => setEditForm({ ...editForm, stock: Number(e.target.value) })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/[0.08] rounded-lg text-white focus:outline-none focus:border-[rgb(var(--primary))]"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="flex-1 px-4 py-2 border border-white/[0.08] rounded-lg text-white hover:bg-white/5 transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-gradient-primary text-white rounded-lg hover:opacity-90 transition-all font-semibold disabled:opacity-50"
                >
                  {saving ? 'กำลังบันทึก...' : 'บันทึก'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
