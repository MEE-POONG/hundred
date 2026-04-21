'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ProductItem {
  _id: string;
  name: string;
  description?: string;
  shortDescription?: string;
  price: number;
  salePrice?: number;
  stock: number;
  category: string;
  categoryName?: string;
  images: string[];
  isOnSale?: boolean;
  isFeatured?: boolean;
  ingredients?: string[];
  variants?: { id: string; name: string; type: string; options: string[] }[];
  isAvailable?: boolean;
}

interface CategoryItem {
  _id: string;
  name: string;
  slug: string;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]); // New state for real categories
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    shortDescription: '',
    price: 0,
    salePrice: '',
    stock: 0,
    category: 'weight-loss',
    images: [] as string[],
    ingredients: '',
    flavors: [] as string[], // Changed to array
    sizes: [] as string[],   // Changed to array
    isAvailable: true,
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Bulk Selection State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  // Temporary Inputs for Edit Modal
  const [editFlavorInput, setEditFlavorInput] = useState('');
  const [editSizeInput, setEditSizeInput] = useState('');

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
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/admin/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

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

  const categoryOptions = ['all', ...categories.map(c => c.slug)];

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

    // Map variants directly to array
    const flavors = product.variants?.find(v => v.type === 'flavor')?.options || [];
    const sizes = product.variants?.find(v => v.type === 'size')?.options || [];
    const ingredients = product.ingredients?.join('\n') || '';

    setEditForm({
      name: product.name,
      description: product.description || '',
      shortDescription: product.shortDescription || '',
      price: product.price,
      salePrice: product.salePrice?.toString() || '',
      stock: product.stock,
      category: product.category || 'weight-loss',
      images: product.images || [],
      ingredients,
      flavors,
      sizes,
      isAvailable: product.isAvailable !== false
    });
    // Reset temp inputs
    setEditFlavorInput('');
    setEditSizeInput('');
  };

  // Tag Handlers for Edit Modal
  const addEditFlavor = () => {
    if (editFlavorInput.trim()) {
      setEditForm(prev => ({ ...prev, flavors: [...prev.flavors, editFlavorInput.trim()] }));
      setEditFlavorInput('');
    }
  };
  const removeEditFlavor = (index: number) => {
    setEditForm(prev => ({ ...prev, flavors: prev.flavors.filter((_, i) => i !== index) }));
  };

  const addEditSize = () => {
    if (editSizeInput.trim()) {
      setEditForm(prev => ({ ...prev, sizes: [...prev.sizes, editSizeInput.trim()] }));
      setEditSizeInput('');
    }
  };
  const removeEditSize = (index: number) => {
    setEditForm(prev => ({ ...prev, sizes: prev.sizes.filter((_, i) => i !== index) }));
  };

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      action();
    }
  };

  const handleSave = async () => {
    if (!selectedProduct) return;
    setSaving(true);
    try {
      // Process Variants
      const variants = [];
      if (editForm.flavors.length > 0) {
        variants.push({
          id: `var_flavor_${Date.now()}`,
          name: 'รสชาติ',
          type: 'flavor',
          options: editForm.flavors
        });
      }
      if (editForm.sizes.length > 0) {
        variants.push({
          id: `var_size_${Date.now()}`,
          name: 'ขนาด',
          type: 'size',
          options: editForm.sizes
        });
      }

      // Process Ingredients
      const ingredientsList = editForm.ingredients.split('\n').map(s => s.trim()).filter(Boolean);

      // Find category name
      const categoryObj = categories.find(c => c.slug === editForm.category);
      const categoryName = categoryObj ? categoryObj.name : editForm.category;

      const res = await fetch(`/api/admin/products/${selectedProduct._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editForm.name,
          description: editForm.description,
          shortDescription: editForm.shortDescription,
          price: Number(editForm.price),
          salePrice: editForm.salePrice ? Number(editForm.salePrice) : undefined,
          stock: Number(editForm.stock),
          category: editForm.category,
          categoryName: categoryName,
          images: editForm.images,
          ingredients: ingredientsList,
          variants: variants,
          isAvailable: editForm.isAvailable,
        }),
      });
      if (res.ok) {
        setSelectedProduct(null);
        fetchProducts();
        alert('บันทึกสำเร็จ');
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
          {categoryOptions.map(catSlug => (
            <option key={catSlug} value={catSlug} className="bg-[rgb(var(--surface))]">
              {catSlug === 'all' ? 'ทั้งหมด' : (categories.find(c => c.slug === catSlug)?.name || catSlug)}
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-[rgb(var(--surface))] rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/[0.08] shadow-2xl">
            <div className="p-6 border-b border-white/[0.08] flex items-center justify-between sticky top-0 bg-[rgb(var(--surface))] z-10 glass">
              <h2 className="text-xl font-bold text-white">แก้ไขสินค้า</h2>
              <button onClick={() => setSelectedProduct(null)} className="p-2 hover:bg-white/10 rounded-full text-lg transition-colors">✕</button>
            </div>
            <div className="p-6 space-y-6">

              {/* Product Info Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-[rgb(var(--text-muted))] uppercase tracking-wider mb-2">ข้อมูลทั่วไป</h3>

                <div>
                  <label className="text-sm text-[rgb(var(--text-muted))] block mb-2">รูปสินค้า</label>
                  <div className="flex flex-wrap gap-3">
                    {editForm.images.map((img, idx) => (
                      <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border border-white/20 group">
                        <img src={img} alt="Product" className="w-full h-full object-cover" />
                        <button
                          onClick={() => removeImage(idx)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    <label className="w-20 h-20 rounded-lg border-2 border-dashed border-white/20 flex flex-col items-center justify-center cursor-pointer hover:border-white/40 hover:bg-white/5 transition-all">
                      <span className="text-xl mb-1">{uploading ? '⏳' : '+'}</span>
                      <input type="file" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <label className="text-sm text-[rgb(var(--text-muted))] block mb-2">หมวดหมู่</label>
                    <select
                      value={editForm.category}
                      onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                      className="w-full px-4 py-2 bg-white/5 border border-white/[0.08] rounded-lg text-white focus:outline-none focus:border-[rgb(var(--primary))]"
                    >
                      {categories.length > 0 ? (
                        categories.map(cat => (
                          <option key={cat._id} value={cat.slug} className="bg-[rgb(var(--surface))]">
                            {cat.name}
                          </option>
                        ))
                      ) : (
                        <>
                          <option value="weight-loss" className="bg-[rgb(var(--surface))]">ลดน้ำหนัก</option>
                          <option value="skin-care" className="bg-[rgb(var(--surface))]">บำรุงผิว</option>
                          <option value="fitness" className="bg-[rgb(var(--surface))]">ฟิตเนส</option>
                          <option value="health" className="bg-[rgb(var(--surface))]">สุขภาพ</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-[rgb(var(--text-muted))] block mb-2">คำโปรยสั้นๆ</label>
                  <input
                    type="text"
                    value={editForm.shortDescription}
                    onChange={(e) => setEditForm({ ...editForm, shortDescription: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/[0.08] rounded-lg text-white focus:outline-none focus:border-[rgb(var(--primary))]"
                  />
                </div>

                <div>
                  <label className="text-sm text-[rgb(var(--text-muted))] block mb-2">รายละเอียดสินค้า</label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/[0.08] rounded-lg text-white focus:outline-none focus:border-[rgb(var(--primary))] resize-none h-24"
                  />
                </div>
              </div>

              {/* Variants Section (New Tag Inputs) */}
              <div className="space-y-4 pt-4 border-t border-white/[0.08]">
                <h3 className="text-sm font-semibold text-[rgb(var(--text-muted))] uppercase tracking-wider mb-2">ตัวเลือกสินค้า</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Flavors */}
                  <div>
                    <label className="text-sm text-[rgb(var(--text-muted))] block mb-2">รสชาติ (กด Enter เพิ่ม)</label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={editFlavorInput}
                        onChange={(e) => setEditFlavorInput(e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, addEditFlavor)}
                        className="flex-1 px-3 py-1.5 bg-white/5 border border-white/[0.08] rounded-lg text-white text-sm focus:outline-none focus:border-[rgb(var(--primary))]"
                        placeholder="เพิ่มรสชาติ..."
                      />
                      <button type="button" onClick={addEditFlavor} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm transition-colors">
                        +
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2 min-h-[40px] p-2 bg-black/20 rounded-lg border border-white/[0.05]">
                      {editForm.flavors.length > 0 ? editForm.flavors.map((flavor, index) => (
                        <span key={index} className="inline-flex items-center gap-1 px-2 py-1 bg-pink-500/20 text-pink-300 rounded text-xs border border-pink-500/30">
                          {flavor}
                          <button type="button" onClick={() => removeEditFlavor(index)} className="hover:text-white ml-1 font-bold">×</button>
                        </span>
                      )) : <span className="text-xs text-[rgb(var(--text-muted))] italic">ไม่มีรสชาติ</span>}
                    </div>
                  </div>

                  {/* Sizes */}
                  <div>
                    <label className="text-sm text-[rgb(var(--text-muted))] block mb-2">ขนาด (กด Enter เพิ่ม)</label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={editSizeInput}
                        onChange={(e) => setEditSizeInput(e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, addEditSize)}
                        className="flex-1 px-3 py-1.5 bg-white/5 border border-white/[0.08] rounded-lg text-white text-sm focus:outline-none focus:border-[rgb(var(--primary))]"
                        placeholder="เพิ่มขนาด..."
                      />
                      <button type="button" onClick={addEditSize} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm transition-colors">
                        +
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2 min-h-[40px] p-2 bg-black/20 rounded-lg border border-white/[0.05]">
                      {editForm.sizes.length > 0 ? editForm.sizes.map((size, index) => (
                        <span key={index} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs border border-blue-500/30">
                          {size}
                          <button type="button" onClick={() => removeEditSize(index)} className="hover:text-white ml-1 font-bold">×</button>
                        </span>
                      )) : <span className="text-xs text-[rgb(var(--text-muted))] italic">ไม่มีขนาด</span>}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-[rgb(var(--text-muted))] block mb-2">ส่วนประกอบ (บรรทัดละ 1)</label>
                  <textarea
                    value={editForm.ingredients}
                    onChange={(e) => setEditForm({ ...editForm, ingredients: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/[0.08] rounded-lg text-white focus:outline-none focus:border-[rgb(var(--primary))] resize-none h-20"
                    placeholder="Whey Protein Isolate..."
                  />
                </div>
              </div>

              {/* Pricing & Stock Section */}
              <div className="space-y-4 pt-4 border-t border-white/[0.08]">
                <h3 className="text-sm font-semibold text-[rgb(var(--text-muted))] uppercase tracking-wider mb-2">ราคาและสต็อก</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm text-[rgb(var(--text-muted))] block mb-2">ราคาปกติ</label>
                    <input
                      type="number"
                      value={editForm.price}
                      onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })}
                      className="w-full px-4 py-2 bg-white/5 border border-white/[0.08] rounded-lg text-white focus:outline-none focus:border-[rgb(var(--primary))]"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-[rgb(var(--text-muted))] block mb-2">ราคาขาย (โปรโมชั่น)</label>
                    <input
                      type="number"
                      value={editForm.salePrice}
                      onChange={(e) => setEditForm({ ...editForm, salePrice: e.target.value })}
                      className="w-full px-4 py-2 bg-white/5 border border-white/[0.08] rounded-lg text-white focus:outline-none focus:border-[rgb(var(--primary))]"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-[rgb(var(--text-muted))] block mb-2">จำนวนในสต็อก</label>
                    <input
                      type="number"
                      value={editForm.stock}
                      onChange={(e) => setEditForm({ ...editForm, stock: Number(e.target.value) })}
                      className="w-full px-4 py-2 bg-white/5 border border-white/[0.08] rounded-lg text-white focus:outline-none focus:border-[rgb(var(--primary))]"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-3 p-3 rounded-lg border border-white/[0.08] bg-white/5 cursor-pointer hover:bg-white/10 transition-colors">
                    <input
                      type="checkbox"
                      checked={editForm.isAvailable}
                      onChange={(e) => setEditForm({ ...editForm, isAvailable: e.target.checked })}
                      className="w-5 h-5 rounded accent-green-500"
                    />
                    <div>
                      <span className="text-white font-medium block">วางจำหน่าย (In Stock)</span>
                      <span className="text-xs text-[rgb(var(--text-muted))]">หากเอาออก สินค้าจะแสดงว่า "สินค้าหมด"</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-6 border-t border-white/[0.08]">
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="flex-1 px-4 py-3 border border-white/[0.08] rounded-lg text-white hover:bg-white/5 transition-colors font-medium"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 px-4 py-3 bg-gradient-primary text-white rounded-lg hover:opacity-90 transition-all font-bold shadow-lg disabled:opacity-50"
                >
                  {saving ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
