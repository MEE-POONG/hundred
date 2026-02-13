'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function AdminRedemptionDetail() {
    const params = useParams();
    const id = params.id as string;
    const [redemption, setRedemption] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [newStatus, setNewStatus] = useState('');
    const [trackingNumber, setTrackingNumber] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchRedemption = async () => {
            try {
                const res = await fetch(`/api/admin/redemptions/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setRedemption(data);
                    setNewStatus(data.status);
                    setTrackingNumber(data.trackingNumber || '');
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchRedemption();
    }, [id]);

    const handleUpdate = async () => {
        setIsUpdating(true);
        setMessage('');
        try {
            const res = await fetch(`/api/admin/redemptions/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status: newStatus,
                    trackingNumber: trackingNumber
                }),
            });

            if (res.ok) {
                const updated = await res.json();
                setRedemption(updated);
                setMessage('อัปเดตสำเร็จ!');
                setTimeout(() => setMessage(''), 3000);
            } else {
                setMessage('เกิดข้อผิดพลาด');
            }
        } catch (err) {
            console.error(err);
            setMessage('เกิดข้อผิดพลาด');
        } finally {
            setIsUpdating(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'text-yellow-400 bg-yellow-400/10';
            case 'approved': return 'text-blue-400 bg-blue-400/10';
            case 'shipped': return 'text-purple-400 bg-purple-400/10';
            case 'completed': return 'text-green-400 bg-green-400/10';
            case 'rejected': return 'text-red-400 bg-red-400/10';
            default: return 'text-gray-400 bg-gray-400/10';
        }
    };

    if (loading) return <div className="p-8 text-center text-[rgb(var(--text-muted))]">กำลังโหลด...</div>;
    if (!redemption) return <div className="p-8 text-center text-red-400">ไม่พบข้อมูลการแลกรางวัล</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <Link href="/admin/redemptions" className="text-[rgb(var(--text-muted))] hover:text-white mb-2 inline-block">← กลับไปหน้ารายการ</Link>
                    <h1 className="text-3xl font-bold text-white">รายละเอียดการแลกของรางวัล</h1>
                    <p className="text-[rgb(var(--text-muted))]">รหัส: {redemption._id}</p>
                </div>
                <span className={`px-4 py-2 rounded-full font-bold text-sm ${getStatusColor(redemption.status)}`}>
                    {redemption.status.toUpperCase()}
                </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Product Card */}
                    <div className="card-surface p-6 flex gap-6">
                        <div className="w-32 h-32 bg-white/5 rounded-xl overflow-hidden flex-shrink-0">
                            {redemption.productImage ? (
                                <img src={redemption.productImage} alt={redemption.productName} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-4xl">🎁</div>
                            )}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-2">{redemption.productName}</h2>
                            <div className="space-y-1 text-[rgb(var(--text-muted))]">
                                <p>ใช้ตั๋วแลก:</p>
                                <ul className="list-disc list-inside ml-2">
                                    {redemption.ticketsUsed.map((t: any, i: number) => (
                                        <li key={i}>{t.quantity} ใบ ({t.rarity})</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* User Info & Address */}
                    <div className="card-surface p-6 grid md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="font-bold text-lg text-white mb-4">ข้อมูลผู้แลก</h3>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center font-bold text-white">
                                    {redemption.user?.name?.[0] || '?'}
                                </div>
                                <div>
                                    <p className="font-medium text-white">{redemption.user?.name || 'Unknown'}</p>
                                    <p className="text-xs text-[rgb(var(--text-muted))]">{redemption.user?.email}</p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-white mb-4">ที่อยู่จัดส่ง</h3>
                            <div className="text-[rgb(var(--text-muted))] text-sm space-y-1">
                                <p className="text-white font-medium">{redemption.shippingAddress?.name}</p>
                                <p>{redemption.shippingAddress?.address}</p>
                                <p>{redemption.shippingAddress?.subDistrict} {redemption.shippingAddress?.district}</p>
                                <p>{redemption.shippingAddress?.province} {redemption.shippingAddress?.postalCode}</p>
                                <p className="mt-2">📞 {redemption.shippingAddress?.phone}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Panel */}
                <div className="space-y-6">
                    {/* Status Update */}
                    <div className="card-surface p-6">
                        <h3 className="font-bold text-lg text-white mb-4">จัดการสถานะ</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-[rgb(var(--text-muted))] mb-1">สถานะ</label>
                                <select
                                    value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value)}
                                    className="w-full px-4 py-2 bg-white/5 border border-white/[0.08] rounded-lg text-white focus:outline-none focus:border-[rgb(var(--primary))]"
                                >
                                    <option value="pending" className="bg-[#1a1a1a]">รอตรวจสอบ</option>
                                    <option value="approved" className="bg-[#1a1a1a]">อนุมัติแล้ว</option>
                                    <option value="shipped" className="bg-[#1a1a1a]">จัดส่งแล้ว</option>
                                    <option value="completed" className="bg-[#1a1a1a]">สำเร็จ</option>
                                    <option value="rejected" className="bg-[#1a1a1a]">ปฏิเสธ</option>
                                </select>
                            </div>

                            {newStatus === 'shipped' && (
                                <div>
                                    <label className="block text-sm text-[rgb(var(--text-muted))] mb-1">เลขพัสดุ (Tracking No.)</label>
                                    <input
                                        type="text"
                                        value={trackingNumber}
                                        onChange={(e) => setTrackingNumber(e.target.value)}
                                        placeholder="เช่น TH0102..."
                                        className="w-full px-4 py-2 bg-white/5 border border-white/[0.08] rounded-lg text-white focus:outline-none focus:border-[rgb(var(--primary))]"
                                    />
                                </div>
                            )}

                            <button
                                onClick={handleUpdate}
                                disabled={isUpdating}
                                className="w-full py-2 bg-gradient-primary text-white rounded-lg font-bold hover:shadow-lg hover:shadow-[rgb(var(--primary))]/20 transition-all disabled:opacity-50"
                            >
                                {isUpdating ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง'}
                            </button>

                            {message && (
                                <div className={`text-center text-sm ${message.includes('สำเร็จ') ? 'text-green-400' : 'text-red-400'}`}>
                                    {message}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Timeline Text */}
                    <div className="card-surface p-6">
                        <h3 className="font-bold text-lg text-white mb-4">ไทม์ไลน์</h3>
                        <ul className="space-y-4 text-sm">
                            <li className="flex items-start gap-3">
                                <div className={`w-2 h-2 rounded-full mt-1.5 ${redemption.createdAt ? 'bg-green-500' : 'bg-white/20'}`} />
                                <div>
                                    <p className="text-white">ทำรายการแลก</p>
                                    <p className="text-xs text-[rgb(var(--text-muted))]">{new Date(redemption.createdAt).toLocaleString('th-TH')}</p>
                                </div>
                            </li>
                            {redemption.approvedAt && (
                                <li className="flex items-start gap-3">
                                    <div className="w-2 h-2 rounded-full mt-1.5 bg-blue-500" />
                                    <div>
                                        <p className="text-white">อนุมัติแล้ว</p>
                                        <p className="text-xs text-[rgb(var(--text-muted))]">{new Date(redemption.approvedAt).toLocaleString('th-TH')}</p>
                                    </div>
                                </li>
                            )}
                            {redemption.shippedAt && (
                                <li className="flex items-start gap-3">
                                    <div className="w-2 h-2 rounded-full mt-1.5 bg-purple-500" />
                                    <div>
                                        <p className="text-white">จัดส่งแล้ว</p>
                                        <p className="text-xs text-[rgb(var(--text-muted))]">{new Date(redemption.shippedAt).toLocaleString('th-TH')}</p>
                                    </div>
                                </li>
                            )}
                            {redemption.completedAt && (
                                <li className="flex items-start gap-3">
                                    <div className="w-2 h-2 rounded-full mt-1.5 bg-green-500" />
                                    <div>
                                        <p className="text-white">สำเร็จ</p>
                                        <p className="text-xs text-[rgb(var(--text-muted))]">{new Date(redemption.completedAt).toLocaleString('th-TH')}</p>
                                    </div>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
