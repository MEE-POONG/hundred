'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NewProductPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    shortDescription: '',
    price: '',
    salePrice: '',
    stock: '',
    category: 'weight-loss',
    featured: false,
    onSale: false,
    images: [] as string[],
    ingredients: '',
    flavors: [] as string[],
    sizes: [] as string[],
    isAvailable: true,
  });
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Temporary state for tag inputs
  const [flavorInput, setFlavorInput] = useState('');
  const [sizeInput, setSizeInput] = useState('');

  // Image Upload Handlers
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
        setFormData(prev => ({ ...prev, images: [...prev.images, json.url] }));
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
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // Tag Handlers
  const addFlavor = () => {
    if (flavorInput.trim()) {
      setFormData(prev => ({ ...prev, flavors: [...prev.flavors, flavorInput.trim()] }));
      setFlavorInput('');
    }
  };

  const removeFlavor = (index: number) => {
    setFormData(prev => ({ ...prev, flavors: prev.flavors.filter((_, i) => i !== index) }));
  };

  const addSize = () => {
    if (sizeInput.trim()) {
      setFormData(prev => ({ ...prev, sizes: [...prev.sizes, sizeInput.trim()] }));
      setSizeInput('');
    }
  };

  const removeSize = (index: number) => {
    setFormData(prev => ({ ...prev, sizes: prev.sizes.filter((_, i) => i !== index) }));
  };

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      action();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Process Variants
      const variants = [];
      if (formData.flavors.length > 0) {
        variants.push({
          id: `var_flavor_${Date.now()}`,
          name: 'รสชาติ',
          type: 'flavor',
          options: formData.flavors
        });
      }
      if (formData.sizes.length > 0) {
        variants.push({
          id: `var_size_${Date.now()}`,
          name: 'ขนาด',
          type: 'size',
          options: formData.sizes
        });
      }

      // Process Ingredients (split by newline)
      const ingredientsList = formData.ingredients.split('\n').map(s => s.trim()).filter(Boolean);

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          shortDescription: formData.shortDescription,
          price: Number(formData.price),
          salePrice: formData.salePrice ? Number(formData.salePrice) : undefined,
          stock: Number(formData.stock),
          category: formData.category,
          isFeatured: formData.featured,
          isOnSale: formData.onSale,
          images: formData.images,
          ingredients: ingredientsList,
          variants: variants,
          isAvailable: formData.isAvailable,
        }),
      });

      if (res.ok) {
        alert('สินค้าใหม่ถูกสร้างสำเร็จ!');
        router.push('/admin/products');
      } else {
        alert('Failed to create product');
      }
    } catch (err) {
      console.error(err);
      alert('Error creating product');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <h1 className="text-2xl font-bold text-white">เพิ่มสินค้าใหม่</h1>

      {/* Main Form Card */}
      <div className="card-surface p-8 border border-white/[0.08] rounded-xl shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Product Info Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-[rgb(var(--text-muted))] uppercase tracking-wider mb-2">ข้อมูลทั่วไป</h3>

            {/* Image Upload */}
            <div>
              <label className="text-sm text-[rgb(var(--text-muted))] block mb-2">รูปสินค้า</label>
              <div className="flex flex-wrap gap-3">
                {formData.images.map((img, idx) => (
                  <div key={idx} className="relative w-24 h-24 rounded-lg overflow-hidden border border-white/20 group">
                    <img src={img} alt="Product" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <label className="w-24 h-24 rounded-lg border-2 border-dashed border-white/20 flex flex-col items-center justify-center cursor-pointer hover:border-white/40 hover:bg-white/5 transition-all">
                  <span className="text-2xl mb-1">{uploading ? '⏳' : '+'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={uploading}
                  />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-[rgb(var(--text-muted))] block mb-2">ชื่อสินค้า *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/[0.08] rounded-lg text-white placeholder-[rgb(var(--text-muted))] focus:outline-none focus:border-[rgb(var(--primary))]"
                />
              </div>
              <div>
                <label className="text-sm text-[rgb(var(--text-muted))] block mb-2">หมวดหมู่</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/[0.08] rounded-lg text-white focus:outline-none focus:border-[rgb(var(--primary))]"
                >
                  <option value="weight-loss" className="bg-[rgb(var(--surface))]">ลดน้ำหนัก</option>
                  <option value="skin-care" className="bg-[rgb(var(--surface))]">บำรุงผิว</option>
                  <option value="fitness" className="bg-[rgb(var(--surface))]">ฟิตเนส</option>
                  <option value="health" className="bg-[rgb(var(--surface))]">สุขภาพ</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm text-[rgb(var(--text-muted))] block mb-2">คำโปรยสั้นๆ</label>
              <input
                type="text"
                value={formData.shortDescription}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                className="w-full px-4 py-2 bg-white/5 border border-white/[0.08] rounded-lg text-white placeholder-[rgb(var(--text-muted))] focus:outline-none focus:border-[rgb(var(--primary))]"
                placeholder="เช่น โปรตีนสูง สร้างกล้ามเนื้อ..."
              />
            </div>

            <div>
              <label className="text-sm text-[rgb(var(--text-muted))] block mb-2">รายละเอียดสินค้าแบบเต็ม</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 bg-white/5 border border-white/[0.08] rounded-lg text-white placeholder-[rgb(var(--text-muted))] focus:outline-none focus:border-[rgb(var(--primary))] resize-none h-32"
              />
            </div>
          </div>

          {/* Variants Section */}
          <div className="space-y-4 pt-6 border-t border-white/[0.08]">
            <h3 className="text-sm font-semibold text-[rgb(var(--text-muted))] uppercase tracking-wider mb-2">ตัวเลือกสินค้า</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Flavors Input */}
              <div>
                <label className="text-sm text-[rgb(var(--text-muted))] block mb-2">รสชาติ (กด Enter เพื่อเพิ่ม)</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={flavorInput}
                    onChange={(e) => setFlavorInput(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, addFlavor)}
                    className="flex-1 px-3 py-1.5 bg-white/5 border border-white/[0.08] rounded-lg text-white text-sm focus:outline-none focus:border-[rgb(var(--primary))]"
                    placeholder="เพิ่มรสชาติ..."
                  />
                  <button type="button" onClick={addFlavor} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm transition-colors">
                    +
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 min-h-[40px] p-3 bg-black/20 rounded-lg border border-white/[0.05]">
                  {formData.flavors.length > 0 ? formData.flavors.map((flavor, index) => (
                    <span key={index} className="inline-flex items-center gap-1 px-2 py-1 bg-pink-500/20 text-pink-300 rounded text-xs border border-pink-500/30">
                      {flavor}
                      <button type="button" onClick={() => removeFlavor(index)} className="hover:text-white ml-1 font-bold">×</button>
                    </span>
                  )) : <span className="text-xs text-[rgb(var(--text-muted))] italic">ไม่มีรสชาติ</span>}
                </div>
              </div>

              {/* Sizes Input */}
              <div>
                <label className="text-sm text-[rgb(var(--text-muted))] block mb-2">ขนาด (กด Enter เพื่อเพิ่ม)</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={sizeInput}
                    onChange={(e) => setSizeInput(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, addSize)}
                    className="flex-1 px-3 py-1.5 bg-white/5 border border-white/[0.08] rounded-lg text-white text-sm focus:outline-none focus:border-[rgb(var(--primary))]"
                    placeholder="เพิ่มขนาด..."
                  />
                  <button type="button" onClick={addSize} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm transition-colors">
                    +
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 min-h-[40px] p-3 bg-black/20 rounded-lg border border-white/[0.05]">
                  {formData.sizes.length > 0 ? formData.sizes.map((size, index) => (
                    <span key={index} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs border border-blue-500/30">
                      {size}
                      <button type="button" onClick={() => removeSize(index)} className="hover:text-white ml-1 font-bold">×</button>
                    </span>
                  )) : <span className="text-xs text-[rgb(var(--text-muted))] italic">ไม่มีขนาด</span>}
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm text-[rgb(var(--text-muted))] block mb-2 pt-2">ส่วนประกอบ (บรรทัดละ 1)</label>
              <textarea
                value={formData.ingredients}
                onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                className="w-full px-4 py-2 bg-white/5 border border-white/[0.08] rounded-lg text-white placeholder-[rgb(var(--text-muted))] focus:outline-none focus:border-[rgb(var(--primary))] resize-none h-24"
                placeholder="Whey Protein Isolate&#10;BCAA&#10;..."
              />
            </div>
          </div>

          {/* Pricing & Stock Section */}
          <div className="space-y-4 pt-6 border-t border-white/[0.08]">
            <h3 className="text-sm font-semibold text-[rgb(var(--text-muted))] uppercase tracking-wider mb-2">ราคาและสต็อก</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-sm text-[rgb(var(--text-muted))] block mb-2">ราคาปกติ *</label>
                <input
                  type="number"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/[0.08] rounded-lg text-white placeholder-[rgb(var(--text-muted))] focus:outline-none focus:border-[rgb(var(--primary))]"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="text-sm text-[rgb(var(--text-muted))] block mb-2">ราคาขาย (โปรโมชั่น)</label>
                <input
                  type="number"
                  value={formData.salePrice}
                  onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/[0.08] rounded-lg text-white placeholder-[rgb(var(--text-muted))] focus:outline-none focus:border-[rgb(var(--primary))]"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="text-sm text-[rgb(var(--text-muted))] block mb-2">จำนวนสินค้า (Stock) *</label>
                <input
                  type="number"
                  required
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/[0.08] rounded-lg text-white placeholder-[rgb(var(--text-muted))] focus:outline-none focus:border-[rgb(var(--primary))]"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="pt-2 space-y-3">
              <label className="flex items-center gap-3 p-3 rounded-lg border border-white/[0.08] bg-white/5 cursor-pointer hover:bg-white/10 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.isAvailable}
                  onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                  className="w-5 h-5 rounded accent-green-500"
                />
                <div>
                  <span className="text-white font-medium block">วางจำหน่าย (In Stock)</span>
                  <span className="text-xs text-[rgb(var(--text-muted))]">หากเอาออก สินค้าจะแสดงว่า "สินค้าหมด"</span>
                </div>
              </label>

              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center gap-3 p-3 rounded-lg border border-white/[0.08] bg-white/5 cursor-pointer hover:bg-white/10 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-5 h-5 rounded accent-pink-500"
                  />
                  <span className="text-white font-medium">✨ สินค้าแนะนำ</span>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-lg border border-white/[0.08] bg-white/5 cursor-pointer hover:bg-white/10 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.onSale}
                    onChange={(e) => setFormData({ ...formData, onSale: e.target.checked })}
                    className="w-5 h-5 rounded accent-pink-500"
                  />
                  <span className="text-white font-medium">🔥 สินค้าลดราคา</span>
                </label>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-6 border-t border-white/[0.08]">
            <Link
              href="/admin/products"
              className="flex-1 px-6 py-3 border border-white/[0.08] rounded-lg text-white hover:bg-white/5 transition-colors font-semibold text-center"
            >
              ยกเลิก
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-6 py-3 bg-gradient-primary text-white rounded-lg hover:opacity-90 transition-all font-bold shadow-lg disabled:opacity-50"
            >
              {submitting ? 'กำลังสร้าง...' : 'สร้างสินค้าใหม่'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
