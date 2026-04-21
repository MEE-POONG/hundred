'use client';

import { useState, useEffect } from 'react';

interface CouponItem {
    _id: string;
    code: string;
    type: 'discount' | 'shipping';
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
        type: 'discount' as 'discount' | 'shipping',
        description: '',
        discountType: 'fixed' as 'fixed' | 'percent',
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

    const handleOpenModal = (coupon?: CouponItem, type: 'discount' | 'shipping' = 'discount') => {
        if (coupon) {
            setSelectedCoupon(coupon);
            setFormData({
                code: coupon.code,
                type: coupon.type || 'discount',
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
                code: '', type, description: '', discountType: 'fixed', discountValue: 0,
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

    const discountCoupons = coupons.filter(c => !c.type || c.type === 'discount');
    const shippingCoupons = coupons.filter(c => c.type === 'shipping');

    const CouponCard = ({ coupon }: { coupon: CouponItem }) => (
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
                        <span className="text-[rgb(var(--text-muted))] block text-xs">ประเภท</span>
                        <span className="font-bold text-white">
                            {coupon.type === 'shipping' ? 'ส่งฟรี' : 'ส่วนลด'}
                        </span>
                    </div>
                    <div className="bg-black/20 p-2 rounded">
                        <span className="text-[rgb(var(--text-muted))] block text-xs">
                            {coupon.type === 'shipping' ? 'ส่วนลดค่าส่ง' : 'Discount'}
                        </span>
                        <span className="font-bold text-white">
                            {coupon.type === 'shipping' && coupon.discountValue === 0 
                                ? 'ฟรีทั้งหมด' 
                                : coupon.discountType === 'percent' 
                                    ? `${coupon.discountValue}%` 
                                    : `฿${coupon.discountValue}`}
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
                    <div className="bg-black/20 p-2 rounded col-span-2">
                        <span className="text-[rgb(var(--text-muted))] block text-xs">Expires</span>
                        <span className={`text-white ${coupon.expirationDate && new Date(coupon.expirationDate) < new Date() ? 'text-red-400' : ''}`}>
                            {coupon.expirationDate ? new Date(coupon.expirationDate).toLocaleDateString() : 'Never'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-brand flex items-center justify-center text-2xl shadow-lg shadow-[rgb(var(--primary))]/20">
                        🎟️
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-1">Coupons</h1>
                        <p className="text-[rgb(var(--text-muted))]">จัดการโค้ดส่วนลดและโปรโมชั่น</p>
                    </div>
                </div>
                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={() => handleOpenModal(undefined, 'discount')}
                        className="px-6 py-2.5 bg-gradient-primary text-white rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[rgb(var(--primary))]/20 font-semibold flex items-center gap-2"
                    >
                        <span>+ เพิ่มโค้ดส่วนลด</span>
                    </button>
                    <button
                        onClick={() => handleOpenModal(undefined, 'shipping')}
                        className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 hover:scale-105 active:scale-95 transition-all font-semibold flex items-center gap-2 shadow-xl"
                    >
                        <span>🚚 เพิ่มโค้ดส่งฟรี</span>
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-20">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[rgb(var(--primary))] border-t-transparent"></div>
                    <p className="mt-4 text-[rgb(var(--text-muted))]">Loading coupons...</p>
                </div>
            ) : (
                <div className="space-y-12">
                    {/* Discount Section */}
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <h2 className="text-xl font-bold text-white">💰 โค้ดส่วนลด (Discount)</h2>
                            <span className="px-2 py-0.5 rounded-full bg-white/5 text-sm text-[rgb(var(--text-muted))]">{discountCoupons.length}</span>
                        </div>
                        {discountCoupons.length === 0 ? (
                            <div className="card-surface p-8 text-center text-[rgb(var(--text-muted))]">ยังไม่มีโค้ดส่วนลด</div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {discountCoupons.map((coupon) => (
                                    <CouponCard key={coupon._id} coupon={coupon} />
                                ))}
                            </div>
                        )}
                    </section>

                    {/* Free Shipping Section */}
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <h2 className="text-xl font-bold text-white">🚚 โค้ดส่งฟรี (Free Shipping)</h2>
                            <span className="px-2 py-0.5 rounded-full bg-white/5 text-sm text-[rgb(var(--text-muted))]">{shippingCoupons.length}</span>
                        </div>
                        {shippingCoupons.length === 0 ? (
                            <div className="card-surface p-8 text-center text-[rgb(var(--text-muted))]">ยังไม่มีโค้ดส่งฟรี</div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {shippingCoupons.map((coupon) => (
                                    <CouponCard key={coupon._id} coupon={coupon} />
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-md transition-all">
                    <div className="bg-[rgb(var(--surface))] rounded-2xl border border-white/[0.08] w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-white/10 bg-white/5">
                            <h2 className="text-xl font-bold text-white">{selectedCoupon ? 'Edit Coupon' : 'เพิ่มโค้ดใหม่'}</h2>
                        </div>
                        
                        <form onSubmit={handleSave} className="p-6 space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-[rgb(var(--text-muted))] mb-1.5 font-medium">Coupon Code</label>
                                    <input
                                        type="text" required
                                        value={formData.code}
                                        onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white font-mono uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]/50 transition-all"
                                        placeholder="e.g. WELCOME100"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-[rgb(var(--text-muted))] mb-1.5 font-medium">Coupon Type</label>
                                    <select 
                                        value={formData.type} 
                                        onChange={e => setFormData({ ...formData, type: e.target.value as any })} 
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]/50 transition-all"
                                    >
                                        <option value="discount">💰 โค้ดส่วนลด</option>
                                        <option value="shipping">🚚 โค้ดส่งฟรี</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-[rgb(var(--text-muted))] mb-1.5 font-medium">Description</label>
                                <input type="text" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]/50 transition-all" />
                            </div>

                            <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-200">
                                <div>
                                    <label className="block text-sm text-[rgb(var(--text-muted))] mb-1.5 font-medium">
                                        {formData.type === 'shipping' ? 'ประเภทส่วนลดค่าส่ง' : 'Discount Type'}
                                    </label>
                                    <select value={formData.discountType} onChange={e => setFormData({ ...formData, discountType: e.target.value as any })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]/50 transition-all">
                                        <option value="fixed">{formData.type === 'shipping' ? 'หักค่าส่ง (฿)' : 'Fixed Amount (฿)'}</option>
                                        <option value="percent">{formData.type === 'shipping' ? 'ลดค่าส่ง (%)' : 'Percentage (%)'}</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-[rgb(var(--text-muted))] mb-1.5 font-medium">
                                        {formData.type === 'shipping' ? 'ส่วนลดค่าส่ง (0 = ฟรี)' : 'Discount Value'}
                                    </label>
                                    <input type="number" min="0" required value={formData.discountValue} onChange={e => setFormData({ ...formData, discountValue: Number(e.target.value) })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]/50 transition-all" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-[rgb(var(--text-muted))] mb-1.5 font-medium">Min Purchase (฿)</label>
                                    <input type="number" min="0" value={formData.minPurchase} onChange={e => setFormData({ ...formData, minPurchase: Number(e.target.value) })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]/50 transition-all" />
                                </div>
                                <div>
                                    <label className="block text-sm text-[rgb(var(--text-muted))] mb-1.5 font-medium">Usage Limit (Blank = ∞)</label>
                                    <input type="number" min="1" value={formData.usageLimit} onChange={e => setFormData({ ...formData, usageLimit: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]/50 transition-all" placeholder="Unlimited" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-[rgb(var(--text-muted))] mb-1.5 font-medium">Expiration Date</label>
                                <input type="date" value={formData.expirationDate} onChange={e => setFormData({ ...formData, expirationDate: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]/50 transition-all" />
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                                <input type="checkbox" id="isActive" checked={formData.isActive} onChange={e => setFormData({ ...formData, isActive: e.target.checked })} className="w-5 h-5 rounded border-white/20 bg-white/5 text-[rgb(var(--primary))] focus:ring-[rgb(var(--primary))]" />
                                <label htmlFor="isActive" className="text-white font-medium cursor-pointer flex-1">เปิดใช้งานทันที</label>
                            </div>

                            <div className="flex justify-end gap-3 pt-6 border-t border-white/10 mt-2">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 hover:bg-white/10 rounded-xl text-[rgb(var(--text-muted))] transition-colors font-medium">Cancel</button>
                                <button type="submit" disabled={saving} className="px-8 py-2.5 bg-gradient-primary text-white rounded-xl hover:brightness-110 active:scale-95 transition-all font-semibold disabled:opacity-50 shadow-lg shadow-[rgb(var(--primary))]/20">
                                    {saving ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            <span>Saving...</span>
                                        </div>
                                    ) : 'บันทึกโค้ด'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

