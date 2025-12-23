'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function NewProductPage() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    salePrice: '',
    stock: '',
    category: 'weight-loss',
    featured: false,
    onSale: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Product created:', formData);
    alert('สินค้าใหม่ถูกสร้างสำเร็จ!');
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link href="/admin/products" className="text-[rgb(var(--text-muted))] hover:text-white mb-4 inline-block">
          ← ย้อนกลับ
        </Link>
        <h1 className="text-3xl font-bold text-white">สินค้าใหม่</h1>
        <p className="text-[rgb(var(--text-muted))] mt-2">เพิ่มสินค้าใหม่ลงในระบบ</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Basic Info */}
          <div className="card-surface p-6 md:col-span-2">
            <h2 className="text-lg font-bold text-white mb-4">ข้อมูลพื้นฐาน</h2>
            <div className="space-y-4">
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
                <label className="text-sm text-[rgb(var(--text-muted))] block mb-2">คำอธิบาย</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/[0.08] rounded-lg text-white placeholder-[rgb(var(--text-muted))] focus:outline-none focus:border-[rgb(var(--primary))] resize-none h-24"
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
