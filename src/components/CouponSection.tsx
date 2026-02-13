'use client';

import { useState, useEffect } from 'react';

interface Coupon {
    _id: string;
    code: string;
    description?: string;
    discountType: 'fixed' | 'percent';
    discountValue: number;
    minPurchase: number;
    expirationDate?: string;
}

export default function CouponSection() {
    const [coupons, setCoupons] = useState<Coupon[]>([]);

    useEffect(() => {
        fetch('/api/coupons/active')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setCoupons(data);
            })
            .catch(console.error);
    }, []);

    const handleCopy = (code: string) => {
        navigator.clipboard.writeText(code);
        alert(`Copied "${code}" to clipboard! 🎉`);
    };

    if (coupons.length === 0) return null;

    return (
        <section className="container mx-auto px-4 py-8">
            <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">🎟️</span>
                <h2 className="text-2xl font-bold text-white uppercase tracking-wider">
                    คูปองส่วนลดพิเศษ
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {coupons.map((coupon, index) => (
                    <div
                        key={coupon._id}
                        className="relative flex bg-gradient-to-br from-[#1a1a2e] to-[#16213e] rounded-xl overflow-hidden border border-white/10 shadow-lg group hover:scale-[1.02] transition-transform duration-300"
                    >
                        {/* Left: Discount Info */}
                        <div className="flex-1 p-5 flex flex-col justify-center border-r-2 border-dashed border-white/20 relative">
                            <div className="absolute -top-3 -right-3 w-6 h-6 bg-[rgb(var(--background))] rounded-full"></div>
                            <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-[rgb(var(--background))] rounded-full"></div>

                            <h3 className="font-black text-4xl text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 font-mono">
                                {coupon.discountType === 'percent' ? `${coupon.discountValue}%` : `฿${coupon.discountValue}`}
                                <span className="text-sm font-medium text-white ml-1 align-top">OFF</span>
                            </h3>
                            <p className="text-xs text-[rgb(var(--text-muted))] mt-1">
                                {coupon.description || `ลดทันทีเมื่อซื้อครบ ${coupon.minPurchase} บาท`}
                            </p>
                            {coupon.minPurchase > 0 && (
                                <p className="text-[10px] text-gray-400 mt-2 bg-white/5 inline-block px-2 py-1 rounded">
                                    Min. Spend: ฿{coupon.minPurchase}
                                </p>
                            )}
                        </div>

                        {/* Right: Code & Action */}
                        <div className="w-1/3 min-w-[100px] bg-white/5 p-4 flex flex-col items-center justify-center gap-2">
                            <span className="text-xs text-[rgb(var(--text-muted))] uppercase tracking-widest text-center">CODE</span>
                            <button
                                onClick={() => handleCopy(coupon.code)}
                                className="w-full py-1.5 bg-white/10 hover:bg-white/20 rounded border border-white/10 text-white font-mono font-bold text-sm transition-all active:scale-95 text-center truncate px-2"
                                title="Click to copy"
                            >
                                {coupon.code}
                            </button>
                            <div className="text-[10px] text-[rgb(var(--text-muted))] text-center">
                                {coupon.expirationDate
                                    ? `Exp: ${new Date(coupon.expirationDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}`
                                    : 'No Expiry'}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
