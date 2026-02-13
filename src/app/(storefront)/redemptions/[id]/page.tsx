'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function RedemptionDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const [redemption, setRedemption] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRedemption = async () => {
            try {
                const res = await fetch(`/api/user/redemptions/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setRedemption(data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchRedemption();
    }, [id]);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <p className="text-[rgb(var(--text-muted))]">กำลังโหลดข้อมูล...</p>
            </div>
        );
    }

    if (!redemption) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <h1 className="text-2xl font-bold mb-4">ไม่พบข้อมูลการแลกรางวัล</h1>
                <Link href="/account" className="text-[rgb(var(--primary))] hover:underline">
                    กลับไปที่บัญชีของฉัน
                </Link>
            </div>
        );
    }

    // Timeline Step Logic
    const steps = [
        { status: 'pending', label: 'รอตรวจสอบ' },
        { status: 'approved', label: 'อนุมัติแล้ว' },
        { status: 'shipped', label: 'กำลังจัดส่ง' },
        { status: 'completed', label: 'สำเร็จ' }
    ];

    const currentStepIndex = steps.findIndex(s => s.status === redemption.status);
    // Special case for 'rejected'
    const isRejected = redemption.status === 'rejected';

    return (
        <div className="container mx-auto px-4 py-8 md:py-16">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/account" className="text-[rgb(var(--text-muted))] hover:text-white mb-4 inline-block">
                        ← ย้อนกลับ
                    </Link>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">รายละเอียดการแลกของรางวัล</h1>
                            <p className="text-[rgb(var(--text-muted))]">รหัส: <span className="font-mono">{redemption._id}</span></p>
                            <p className="text-[rgb(var(--text-muted))] text-sm">วันที่แลก: {new Date(redemption.createdAt).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                        {isRejected ? (
                            <span className="px-4 py-2 bg-red-500/20 text-red-500 rounded-full font-bold">ถูกปฏิเสธ</span>
                        ) : (
                            <div className="text-center md:text-right">
                                <p className="text-sm text-[rgb(var(--text-muted))] mb-1">สถานะปัจจุบัน</p>
                                <span className="text-xl font-bold text-[rgb(var(--primary))]">
                                    {steps.find(s => s.status === redemption.status)?.label || redemption.status}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Status Timeline */}
                {!isRejected && (
                    <div className="bg-white/5 border border-white/[0.08] rounded-2xl p-8 mb-8 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-primary opacity-20" />

                        <div className="flex items-center justify-between relative z-10">
                            {steps.map((step, idx) => {
                                const isCompleted = idx <= currentStepIndex;
                                const isCurrent = idx === currentStepIndex;

                                return (
                                    <div key={step.status} className="flex-1 flex flex-col items-center relative">
                                        {/* Line Connector */}
                                        {idx !== 0 && (
                                            <div className={`absolute top-4 right-[50%] w-full h-1 -translate-y-1/2 -z-10 
                                        ${isCompleted ? 'bg-gradient-primary' : 'bg-white/10'}`}
                                            />
                                        )}

                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mb-3 transition-all
                                    ${isCompleted ? 'bg-gradient-primary text-white shadow-lg shadow-[rgb(var(--primary))]/30' : 'bg-white/10 text-[rgb(var(--text-muted))]'}
                                    ${isCurrent ? 'scale-110 ring-4 ring-[rgb(var(--primary))]/20' : ''}
                                `}>
                                            {isCompleted ? '✓' : idx + 1}
                                        </div>
                                        <p className={`text-sm font-medium ${isCompleted ? 'text-white' : 'text-[rgb(var(--text-muted))]'}`}>
                                            {step.label}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Content Grid */}
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Main Details */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Product Detail */}
                        <div className="bg-white/5 border border-white/[0.08] rounded-2xl p-6">
                            <h2 className="text-xl font-bold mb-4">สินค้าที่ได้รับ</h2>
                            <div className="flex gap-6 items-start">
                                <div className="w-24 h-24 bg-black/40 rounded-xl overflow-hidden flex-shrink-0">
                                    {redemption.productImage ? (
                                        <img src={redemption.productImage} alt={redemption.productName} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-3xl">🎁</div>
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-1">{redemption.productName}</h3>
                                    <p className="text-[rgb(var(--text-muted))] text-sm mb-2">ใช้ตั๋วแลก:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {redemption.ticketsUsed.map((t: any, i: number) => (
                                            <span key={i} className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-white">
                                                {t.quantity} ใบ ({t.rarity})
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tracking Info (If Shipped) */}
                        {(redemption.status === 'shipped' || redemption.status === 'completed') && (
                            <div className="bg-gradient-to-r from-[rgb(var(--primary))]/10 to-[rgb(var(--secondary))]/10 border border-[rgb(var(--primary))]/20 rounded-2xl p-6">
                                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    🚚 ข้อมูลการจัดส่ง
                                </h2>
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <p className="text-[rgb(var(--text-muted))] text-sm mb-1">บริษัทขนส่ง</p>
                                        <p className="font-medium">Standard Delivery (ส่งธรรมดาในประเทศ)</p>
                                    </div>
                                    <div>
                                        <p className="text-[rgb(var(--text-muted))] text-sm mb-1">เลขพัสดุ (Tracking Detail)</p>
                                        <p className="font-mono text-xl font-bold text-[rgb(var(--primary))] tracking-wider">
                                            {redemption.trackingNumber || 'รออัปเดต...'}
                                        </p>
                                    </div>
                                    {redemption.trackingNumber && (
                                        <button
                                            onClick={() => navigator.clipboard.writeText(redemption.trackingNumber)}
                                            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors"
                                        >
                                            คัดลอก
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-white/5 border border-white/[0.08] rounded-2xl p-6">
                            <h2 className="text-lg font-bold mb-4">ที่อยู่จัดส่ง</h2>
                            <div className="text-sm space-y-2 text-[rgb(var(--text-muted))]">
                                <p className="font-semibold text-white text-base">{redemption.shippingAddress?.name}</p>
                                <p>{redemption.shippingAddress?.address}</p>
                                <p>{redemption.shippingAddress?.subDistrict} {redemption.shippingAddress?.district}</p>
                                <p>{redemption.shippingAddress?.province} {redemption.shippingAddress?.postalCode}</p>
                                <hr className="border-white/10 my-3" />
                                <p className="flex items-center gap-2">
                                    <span>📞</span> {redemption.shippingAddress?.phone}
                                </p>
                            </div>
                        </div>

                        <div className="bg-white/5 border border-white/[0.08] rounded-2xl p-6">
                            <h2 className="text-lg font-bold mb-4">บริการช่วยเหลือ</h2>
                            <p className="text-sm text-[rgb(var(--text-muted))] mb-4">
                                หากพบปัญหาเกี่ยวกับของรางวัล หรือการจัดส่งล่าช้า สามารถติดต่อเราได้ทันที
                            </p>
                            <Link href="/contact">
                                <button className="w-full py-2 border border-white/20 rounded-lg hover:bg-white/5 transition-colors text-sm font-medium">
                                    ติดต่อเจ้าหน้าที่
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
