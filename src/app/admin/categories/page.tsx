'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

interface CategoryItem {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
  createdAt: string;
  productCount?: number;
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
    isActive: true,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
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
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (category: CategoryItem | null = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        slug: category.slug,
        description: category.description || '',
        image: category.image || '',
        isActive: category.isActive,
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        slug: '',
        description: '',
        image: '',
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as any;
    const val = type === 'checkbox' ? (e.target as any).checked : value;
    
    setFormData(prev => {
        const newData = { ...prev, [name]: val };
        // Auto-generate slug from name if editing new category
        if (name === 'name' && !editingCategory) {
            newData.slug = value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        }
        return newData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editingCategory 
        ? `/api/admin/categories/${editingCategory._id}` 
        : '/api/admin/categories';
      const method = editingCategory ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        fetchCategories();
        handleCloseModal();
      } else {
        const error = await res.json();
        alert(error.error || 'Something went wrong');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to save category');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchCategories();
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to delete');
      }
    } catch (err) {
        console.error(err);
        alert('Error deleting category');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-white mb-1">Categories</h1>
        <p className="text-[rgb(var(--text-muted))]">กำลังโหลดข้อมูล...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Categories</h1>
          <p className="text-[rgb(var(--text-muted))]">จัดการประเภทสินค้าทั้งหมดในระบบ</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="px-6 py-2.5">
          + เพิ่มประเภทใหม่
        </Button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/[0.05] border-b border-white/[0.08]">
              <th className="px-6 py-4 text-sm font-semibold text-white/70 uppercase">ลำดับ</th>
              <th className="px-6 py-4 text-sm font-semibold text-white/70 uppercase">ไอคอน/รูปภาพ</th>
              <th className="px-6 py-4 text-sm font-semibold text-white/70 uppercase">ชื่อประเภทสินค้า</th>
              <th className="px-6 py-4 text-sm font-semibold text-white/70 uppercase">Slug</th>
              <th className="px-6 py-4 text-sm font-semibold text-white/70 uppercase text-center">จำนวนสินค้า</th>
              <th className="px-6 py-4 text-sm font-semibold text-white/70 uppercase text-center">สถานะ</th>
              <th className="px-6 py-4 text-sm font-semibold text-white/70 uppercase text-right">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.05]">
            {categories.map((cat, index) => (
              <tr key={cat._id} className="hover:bg-white/[0.03] transition-colors group">
                <td className="px-6 py-4 text-white/60 font-mono text-sm">{index + 1}</td>
                <td className="px-6 py-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center text-white text-lg shadow-sm">
                    {cat.image ? (
                      <img src={cat.image} alt={cat.name} className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      cat.name.charAt(0).toUpperCase()
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <div className="text-white font-bold">{cat.name}</div>
                    <div className="text-xs text-white/40 line-clamp-1 max-w-[200px]">{cat.description || 'ไม่มีคำอธิบาย'}</div>
                  </div>
                </td>
                <td className="px-6 py-4 text-white/50 font-mono text-xs">{cat.slug}</td>
                <td className="px-6 py-4 text-center">
                  <span className="px-3 py-1 rounded-full bg-white/5 text-white/80 text-sm font-bold border border-white/10 group-hover:bg-[rgb(var(--primary))]/10 group-hover:text-[rgb(var(--primary))] transition-all">
                    {cat.productCount || 0}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${cat.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {cat.isActive ? 'Active' : 'Hidden'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2 transition-opacity">
                    <button 
                      onClick={() => handleOpenModal(cat)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/70 hover:text-white"
                      title="แก้ไข"
                    >
                      ✏️
                    </button>
                    <button 
                      onClick={() => handleDelete(cat._id)}
                      className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-red-400/70 hover:text-red-400"
                      title="ลบ"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            
            {categories.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-20 text-center">
                  <div className="text-4xl mb-4 opacity-20">📁</div>
                  <p className="text-[rgb(var(--text-muted))]">ยังไม่มีประเภทสินค้าในระบบ</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[rgb(var(--surface))] rounded-2xl max-w-lg w-full overflow-hidden border border-white/10 shadow-2xl">
            <div className="p-6 border-b border-white/[0.08] flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">
                {editingCategory ? 'แก้ไขประเภทสินค้า' : 'เพิ่มประเภทสินค้าใหม่'}
              </h2>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-white transition-colors">✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">ชื่อประเภทสินค้า</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[rgb(var(--primary))] transition-all"
                  placeholder="เช่น Whey Protein, Vitamin"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Slug (URL)</label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[rgb(var(--primary))] transition-all font-mono"
                  placeholder="เช่น whey-protein"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">คำอธิบาย</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[rgb(var(--primary))] transition-all resize-none"
                  placeholder="รายละเอียดสั้นๆ ของหมวดหมู่นี้"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">รูปภาพ / ไอคอน (URL)</label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[rgb(var(--primary))] transition-all"
                  placeholder="https://..."
                />
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="w-5 h-5 rounded accent-[rgb(var(--primary))]"
                  id="isActive"
                />
                <label htmlFor="isActive" className="text-sm text-gray-300 cursor-pointer">เปิดใช้งานทันที</label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 py-3 px-4 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-all"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-primary text-white font-bold hover:opacity-90 transition-all shadow-lg disabled:opacity-50"
                >
                  {saving ? 'กำลังบันทึก...' : editingCategory ? 'บันทึกการแก้ไข' : 'สร้างประเภทใหม่'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
