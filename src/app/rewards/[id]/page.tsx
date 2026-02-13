'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface RewardDetail {
    _id: string;
    name: string;
    description?: string;
    image?: string;
    stock: number;
    ticketCost: Record<string, number>;
}

interface TicketSummary {
    common: number;
    rare: number;
    epic: number;
    legendary: number;
}

export default function RewardDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const [reward, setReward] = useState<RewardDetail | null>(null);
    const [tickets, setTickets] = useState<TicketSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [redeeming, setRedeeming] = useState(false);

    const [shippingInfo, setShippingInfo] = useState({
        name: '',
        phone: '',
        address: '',
    });

    const [id, setId] = useState<string | null>(null);

    useEffect(() => {
        async function init() {
            const { id } = await params;
            setId(id);
            fetchData(id);
        }
        init();
    }, [params]);

    const fetchData = async (rewardId: string) => {
        try {
            const [resReward, resTickets, resProfile] = await Promise.all([
                fetch(`/api/rewards/${rewardId}`), // We need a public API for single reward detail
                fetch('/api/user/tickets/summary'),
                fetch('/api/user/profile') // Get profile for default address
            ]);

            if (resReward.ok) {
                setReward(await resReward.json());
            }

            if (resTickets.ok) {
                setTickets(await resTickets.json());
            }

            if (resProfile.ok) {
                const profile = await resProfile.json();
                if (profile.address) {
                    setShippingInfo({
                        name: profile.name || '',
                        phone: profile.phone || '',
                        address: `${profile.address.address} ${profile.address.subDistrict} ${profile.address.district} ${profile.address.province} ${profile.address.postalCode}`
                    });
                }
            }

        } catch (error) {
            console.error('Failed to load data', error);
        } finally {
            setLoading(false);
        }
    };

    const checkSufficientTickets = () => {
        if (!reward || !tickets) return false;
        for (const [rarity, cost] of Object.entries(reward.ticketCost || {})) {
            if ((tickets as any)[rarity] < cost) return false;
        }
        return true;
    };

    const handleRedeem = async () => {
        if (!confirm('ยืนยันการแลกของรางวัล?')) return;
        setRedeeming(true);

        try {
            const res = await fetch('/api/redemption/redeem', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    rewardId: id,
                    shippingAddress: shippingInfo
                }),
            });

            if (res.ok) {
                alert('🎉 แลกของรางวัลสำเร็จ!');
                router.push('/account'); // Go to account to see redemption history
            } else {
                const err = await res.json();
                alert(err.error || 'แลกของรางวัลไม่สำเร็จ');
            }
        } catch (error) {
            alert('เกิดข้อผิดพลาดในการเชื่อมต่อ');
        } finally {
            setRedeeming(false);
        }
    };

    if (loading) return <div className="text-center py-20 text-white">Loading...</div>;
    if (!reward) return <div className="text-center py-20 text-white">Reward not found</div>;

    const canRedeem = checkSufficientTickets() && reward.stock > 0;

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <Link href="/redemptions" className="text-[rgb(var(--text-muted))] hover:text-white mb-6 inline-block">
                ← กลับหน้าร้านค้า
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Image */}
                <div className="card-surface p-2 rounded-xl">
                    <img
                        src={reward.image || '/placeholder.png'}
                        alt={reward.name}
                        className="w-full h-auto object-cover rounded-lg"
                    />
                </div>

                {/* Info */}
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">{reward.name}</h1>
                        <p className="text-[rgb(var(--text-muted))]">{reward.description}</p>
                    </div>

                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                        <h3 className="font-bold text-white mb-3">ราคาตั๋วที่ต้องใช้</h3>
                        <div className="space-y-2">
                            {Object.entries(reward.ticketCost || {}).map(([rarity, cost]) => (
                                <div key={rarity} className="flex justify-between items-center">
                                    <span className="capitalize text-[rgb(var(--text-muted))]">{rarity} Ticket</span>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-white">{cost} ใบ</span>
                                        {tickets && (
                                            <span className={`text-xs px-2 py-0.5 rounded ${(tickets as any)[rarity] >= cost ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                                                }`}>
                                                (มี {(tickets as any)[rarity]})
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                        <h3 className="font-bold text-white mb-3">ที่อยู่จัดส่ง</h3>
                        <div className="space-y-3">
                            <input
                                type="text" placeholder="ชื่อผู้รับ"
                                value={shippingInfo.name}
                                onChange={e => setShippingInfo({ ...shippingInfo, name: e.target.value })}
                                className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded text-white"
                            />
                            <input
                                type="text" placeholder="เบอร์โทรศัพท์"
                                value={shippingInfo.phone}
                                onChange={e => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                                className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded text-white"
                            />
                            <textarea
                                placeholder="ที่อยู่จัดส่ง"
                                value={shippingInfo.address}
                                onChange={e => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                                className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded text-white"
                                rows={3}
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleRedeem}
                        disabled={!canRedeem || redeeming}
                        className={`w-full py-4 text-lg font-bold rounded-xl transition-all shadow-lg
                ${canRedeem
                                ? 'bg-gradient-primary text-white hover:brightness-110 hover:shadow-[rgb(var(--primary))]/30'
                                : 'bg-gray-600 text-gray-300 cursor-not-allowed grayscale'
                            }
            `}
                    >
                        {redeeming ? 'กำลังดำเนินการ...' :
                            reward.stock <= 0 ? 'สินค้าหมด' :
                                !canRedeem ? 'ตั๋วไม่พอ' : 'ยืนยันการแลกของรางวัล'}
                    </button>
                </div>
            </div>
        </div>
    );
}
