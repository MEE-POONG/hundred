'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function NewProductPage() {
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
    flavors: '',
    sizes: '',
    isAvailable: true,
  });
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Process Variants
      const variants = [];
      if (formData.flavors.trim()) {
        variants.push({
          id: `var_flavor_${Date.now()}`,
          name: 'รสชาติ',
          type: 'flavor',
          options: formData.flavors.split(',').map(s => s.trim()).filter(Boolean)
        });
      }
      if (formData.sizes.trim()) {
        variants.push({
          id: `var_size_${Date.now()}`,
          name: 'ขนาด',
          type: 'size',
          options: formData.sizes.split(',').map(s => s.trim()).filter(Boolean)
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
        window.location.href = '/admin/products';
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
    <div className="max-w-3xl mx-auto">
      {/* ... Header ... */}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Basic Info */}
          <div className="card-surface p-6 md:col-span-2">
            <h2 className="text-lg font-bold text-white mb-4">ข้อมูลพื้นฐาน</h2>
            <div className="space-y-4">
              {/* Image Upload Block (Previous Code) */}
              <div>
                <label className="text-sm text-[rgb(var(--text-muted))] block mb-2">รูปสินค้า</label>
                <div className="flex flex-wrap gap-4">
                  {formData.images.map((img, idx) => (
                    <div key={idx} className="relative w-24 h-24 rounded-lg overflow-hidden border border-white/20">
                      <img src={img} alt="Product" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <label className="w-24 h-24 rounded-lg border-2 border-dashed border-white/20 flex flex-col items-center justify-center cursor-pointer hover:border-white/40 hover:bg-white/5 transition-all">
                    <span className="text-2xl mb-1">{uploading ? '⏳' : '+'}</span>
                    <span className="text-xs text-[rgb(var(--text-muted))]">
                      {uploading ? 'Upload...' : 'เพิ่มรูป'}
                    </span>
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
                <label className="text-sm text-[rgb(var(--text-muted))] block mb-2">คำโปรยสั้นๆ (Short Description)</label>
                <input
                  type="text"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/[0.08] rounded-lg text-white placeholder-[rgb(var(--text-muted))] focus:outline-none focus:border-[rgb(var(--primary))]"
                  placeholder="เช่น โปรตีนสูง สร้างกล้ามเนื้อ..."
                />
              </div>

              <div>
                <label className="text-sm text-[rgb(var(--text-muted))] block mb-2">รายละเอียดสินค้าครบถ้วน</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/[0.08] rounded-lg text-white placeholder-[rgb(var(--text-muted))] focus:outline-none focus:border-[rgb(var(--primary))] resize-none h-32"
                />
              </div>
            </div>
          </div>

          {/* Detailed Info (New Section) */}
          <div className="card-surface p-6 md:col-span-2">
            <h2 className="text-lg font-bold text-white mb-4">ข้อมูลเพิ่มเติม</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-[rgb(var(--text-muted))] block mb-2">รสชาติ (คั่นด้วยคอมม่า ,)</label>
                <input
                  type="text"
                  value={formData.flavors}
                  onChange={(e) => setFormData({ ...formData, flavors: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/[0.08] rounded-lg text-white placeholder-[rgb(var(--text-muted))] focus:outline-none focus:border-[rgb(var(--primary))]"
                  placeholder="เช่น ช็อกโกแลต, วนิลา, กล้วยหอม"
                />
              </div>
              <div>
                <label className="text-sm text-[rgb(var(--text-muted))] block mb-2">ขนาด (คั่นด้วยคอมม่า ,)</label>
                <input
                  type="text"
                  value={formData.sizes}
                  onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/[0.08] rounded-lg text-white placeholder-[rgb(var(--text-muted))] focus:outline-none focus:border-[rgb(var(--primary))]"
                  placeholder="เช่น 1kg, 2kg, 5lb"
                />
              </div>
              <div>
                <label className="text-sm text-[rgb(var(--text-muted))] block mb-2">ส่วนประกอบ (บรรทัดละ 1 รายการ)</label>
                <textarea
                  value={formData.ingredients}
                  onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/[0.08] rounded-lg text-white placeholder-[rgb(var(--text-muted))] focus:outline-none focus:border-[rgb(var(--primary))] resize-none h-24"
                  placeholder="Whey Protein Isolate\nBCAA\n..."
                />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="card-surface p-6">
            <h2 className="text-lg font-bold text-white mb-4">ราคา</h2>
            <div className="space-y-4">
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
                <label className="text-sm text-[rgb(var(--text-muted))] block mb-2">ราคาขาย</label>
                <input
                  type="number"
                  value={formData.salePrice}
                  onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/[0.08] rounded-lg text-white placeholder-[rgb(var(--text-muted))] focus:outline-none focus:border-[rgb(var(--primary))]"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Inventory */}
          <div className="card-surface p-6">
            <h2 className="text-lg font-bold text-white mb-4">สต็อก</h2>
            {/* ... (Copy existing Inventory Code) ... */}
            <div className="space-y-4">
              <div>
                <label className="text-sm text-[rgb(var(--text-muted))] block mb-2">จำนวนสินค้า *</label>
                <input
                  type="number"
                  required
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/[0.08] rounded-lg text-white placeholder-[rgb(var(--text-muted))] focus:outline-none focus:border-[rgb(var(--primary))]"
                  placeholder="0"
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
          </div>

          {/* Status */}
          <div className="card-surface p-6 md:col-span-2">
            <h2 className="text-lg font-bold text-white mb-4">สถานะ</h2>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 rounded accent-pink-500"
                />
                <span className="text-white">เป็นสินค้าโดดเด่น</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.onSale}
                  onChange={(e) => setFormData({ ...formData, onSale: e.target.checked })}
                  className="w-4 h-4 rounded accent-pink-500"
                />
                <span className="text-white">เป็นสินค้าขายของ</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isAvailable}
                  onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                  className="w-4 h-4 rounded accent-green-500"
                />
                <span className="text-white">วางจำหน่าย (In Stock)</span>
              </label>
            </div>
          </div>

        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Link
            href="/admin/products"
            className="flex-1 px-6 py-3 border border-white/[0.08] rounded-lg text-white hover:bg-white/5 transition-colors font-semibold text-center"
          >
            ยกเลิก
          </Link>
          <button
            type="submit"
            className="flex-1 px-6 py-3 bg-gradient-primary text-white rounded-lg hover:opacity-90 transition-all font-semibold"
          >
            สร้างสินค้า
          </button>
        </div>
      </form>
    </div>
  );
}
