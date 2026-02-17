'use client';

import { useState, useEffect } from 'react';

interface CouponItem {
    _id: string;
    code: string;
    description?: string;
    discountType: 'fixed' | 'percent';
    discountValue: number;
    minPurchase: number;
    expirationDate?: string;
    usageLimit?: number;
    usedCount: number;
    isActive: boolean;
}

export default function AdminCoupons() {
    const [coupons, setCoupons] = useState<CouponItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCoupon, setSelectedCoupon] = useState<CouponItem | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [saving, setSaving] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        code: '',
        description: '',
        discountType: 'fixed',
        discountValue: 0,
        minPurchase: 0,
        expirationDate: '',
        usageLimit: '',
        isActive: true,
    });

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        try {
            const res = await fetch('/api/admin/coupons');
            if (res.ok) {
                const data = await res.json();
                setCoupons(data);
            }
        } catch (error) {
            console.error('Failed to fetch coupons:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (coupon?: CouponItem) => {
        if (coupon) {
            setSelectedCoupon(coupon);
            setFormData({
                code: coupon.code,
                description: coupon.description || '',
                discountType: coupon.discountType,
                discountValue: coupon.discountValue,
                minPurchase: coupon.minPurchase,
                expirationDate: coupon.expirationDate ? new Date(coupon.expirationDate).toISOString().split('T')[0] : '',
                usageLimit: coupon.usageLimit ? String(coupon.usageLimit) : '',
                isActive: coupon.isActive,
            });
        } else {
            setSelectedCoupon(null);
            setFormData({
                code: '', description: '', discountType: 'fixed', discountValue: 0,
                minPurchase: 0, expirationDate: '', usageLimit: '', isActive: true,
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        const payload = {
            ...formData,
            discountValue: Number(formData.discountValue),
            minPurchase: Number(formData.minPurchase),
            usageLimit: formData.usageLimit ? Number(formData.usageLimit) : null,
            expirationDate: formData.expirationDate ? new Date(formData.expirationDate) : null,
        };

        try {
            const method = selectedCoupon ? 'PUT' : 'POST';
            const url = selectedCoupon
                ? `/api/admin/coupons/${selectedCoupon._id}`
                : '/api/admin/coupons';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                setIsModalOpen(false);
                fetchCoupons();
            } else {
                const err = await res.json();
                alert(err.error || 'Failed to save coupon');
            }
        } catch (error) {
            alert('Error saving coupon');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this coupon?')) return;
        try {
            await fetch(`/api/admin/coupons/${id}`, { method: 'DELETE' });
            fetchCoupons();
        } catch {
            alert('Failed to delete');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-1">Coupons</h1>
                    <p className="text-[rgb(var(--text-muted))]">จัดการโค้ดส่วนลด</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="px-4 py-2 bg-gradient-primary text-white rounded-lg hover:brightness-110 transition-all shadow-lg shadow-[rgb(var(--primary))]/20"
                >
                    + เพิ่มโค้ดใหม่
                </button>
            </div>

            {loading ? (
                <div className="text-center py-12"><p>Loading...</p></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {coupons.map((coupon) => (
                        <div key={coupon._id} className={`card-surface p-4 relative group border-l-4 ${coupon.isActive ? 'border-green-500' : 'border-gray-500'}`}>
                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleOpenModal(coupon)} className="p-2 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/40">✏️</button>
                                <button onClick={() => handleDelete(coupon._id)} className="p-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500/40">🗑️</button>
                            </div>

                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="font-mono text-xl font-bold text-white tracking-wider bg-white/10 px-2 py-1 rounded inline-block">
                                        {coupon.code}
                                    </h3>
                                    <span className={`text-xs px-2 py-1 rounded ${coupon.isActive ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                                        {coupon.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </div>

                                <p className="text-sm text-[rgb(var(--text-muted))] mb-3">{coupon.description || 'No description'}</p>

                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div className="bg-black/20 p-2 rounded">
                                        <span className="text-[rgb(var(--text-muted))] block text-xs">Discount</span>
                                        <span className="font-bold text-white">
                                            {coupon.discountType === 'percent' ? `${coupon.discountValue}%` : `฿${coupon.discountValue}`}
                                        </span>
                                    </div>
                                    <div className="bg-black/20 p-2 rounded">
                                        <span className="text-[rgb(var(--text-muted))] block text-xs">Min Purchase</span>
                                        <span className="text-white">฿{coupon.minPurchase}</span>
                                    </div>
                                    <div className="bg-black/20 p-2 rounded">
                                        <span className="text-[rgb(var(--text-muted))] block text-xs">Usage</span>
                                        <span className="text-white">{coupon.usedCount} / {coupon.usageLimit || '∞'}</span>
                                    </div>
                                    <div className="bg-black/20 p-2 rounded">
                                        <span className="text-[rgb(var(--text-muted))] block text-xs">Expires</span>
                                        <span className={`text-white ${coupon.expirationDate && new Date(coupon.expirationDate) < new Date() ? 'text-red-400' : ''}`}>
                                            {coupon.expirationDate ? new Date(coupon.expirationDate).toLocaleDateString() : 'Never'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-[rgb(var(--surface))] rounded-xl border border-white/[0.08] w-full max-w-lg">
                        <form onSubmit={handleSave} className="p-6 space-y-4">
                            <h2 className="text-xl font-bold text-white mb-4">{selectedCoupon ? 'Edit Coupon' : 'New Coupon'}</h2>

                            <div>
                                <label className="block text-sm text-[rgb(var(--text-muted))] mb-1">Coupon Code</label>
                                <input
                                    type="text" required
                                    value={formData.code}
                                    onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                    className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white font-mono uppercase tracking-wider"
                                    placeholder="e.g. WELCOME100"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-[rgb(var(--text-muted))] mb-1">Description</label>
                                <input type="text" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-[rgb(var(--text-muted))] mb-1">Discount Type</label>
                                    <select value={formData.discountType} onChange={e => setFormData({ ...formData, discountType: e.target.value as any })} className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white">
                                        <option value="fixed">Fixed Amount (฿)</option>
                                        <option value="percent">Percentage (%)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-[rgb(var(--text-muted))] mb-1">Discount Value</label>
                                    <input type="number" min="0" required value={formData.discountValue} onChange={e => setFormData({ ...formData, discountValue: Number(e.target.value) })} className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-[rgb(var(--text-muted))] mb-1">Min Purchase (฿)</label>
                                    <input type="number" min="0" value={formData.minPurchase} onChange={e => setFormData({ ...formData, minPurchase: Number(e.target.value) })} className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm text-[rgb(var(--text-muted))] mb-1">Usage Limit (Blank = ∞)</label>
                                    <input type="number" min="1" value={formData.usageLimit} onChange={e => setFormData({ ...formData, usageLimit: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white" placeholder="Unlimited" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-[rgb(var(--text-muted))] mb-1">Expiration Date</label>
                                <input type="date" value={formData.expirationDate} onChange={e => setFormData({ ...formData, expirationDate: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white" />
                            </div>

                            <div className="flex items-center gap-2 pt-2">
                                <input type="checkbox" id="isActive" checked={formData.isActive} onChange={e => setFormData({ ...formData, isActive: e.target.checked })} className="w-4 h-4 bg-white/5 border-white/10 rounded" />
                                <label htmlFor="isActive" className="text-white cursor-pointer">Active Status</label>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-white/10 mt-2">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 hover:bg-white/10 rounded-lg text-[rgb(var(--text-muted))] transition-colors">Cancel</button>
                                <button type="submit" disabled={saving} className="px-6 py-2 bg-gradient-primary text-white rounded-lg hover:brightness-110 transition-all font-medium disabled:opacity-50">
                                    {saving ? 'Saving...' : 'Save Coupon'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
