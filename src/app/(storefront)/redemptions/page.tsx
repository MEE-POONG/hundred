'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface TicketPrice {
    rarity: string;
    quantity: number;
}

interface RewardItem {
    _id: string;
    name: string;
    image?: string;
    description?: string;
    ticketCost: Record<string, number>; // { common: 5, rare: 2 }
    stock: number;
}

export default function RedemptionShop() {
    const [rewards, setRewards] = useState<RewardItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchRewards() {
            try {
                const res = await fetch('/api/rewards');
                if (res.ok) {
                    const data = await res.json();
                    setRewards(data);
                }
            } catch (error) {
                console.error('Failed to fetch rewards', error);
            } finally {
                setLoading(false);
            }
        }
        fetchRewards();
    }, []);

    const getRarityColor = (rarity: string) => {
        switch (rarity) {
            case 'common': return 'text-gray-400 border-gray-500/30 bg-gray-500/10';
            case 'rare': return 'text-blue-400 border-blue-500/30 bg-blue-500/10';
            case 'epic': return 'text-purple-400 border-purple-500/30 bg-purple-500/10';
            case 'legendary': return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10';
            default: return 'text-white border-white/20';
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 text-center text-white">
                <p className="animate-pulse">Loading rewards...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-white mb-2 neon-glow">Redemption Shop</h1>
                <p className="text-[rgb(var(--text-muted))]">ใช้ตั๋วสะสมของคุณ แลกรับของรางวัลสุดพิเศษ</p>
            </div>

            {rewards.length === 0 ? (
                <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10">
                    <p className="text-2xl mb-2">🎁</p>
                    <p className="text-[rgb(var(--text-muted))]">ยังไม่มีสินค้าสำหรับแลกในขณะนี้</p>
                    <p className="text-sm mt-2 text-[rgb(var(--text-muted))]">โปรดติดตามเร็วๆ นี้</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {rewards.map((reward) => (
                        <div key={reward._id} className="card-surface group hover:scale-[1.02] transition-transform duration-300">
                            {/* Product Image */}
                            <div className="aspect-square w-full bg-black/20 rounded-t-xl overflow-hidden relative">
                                <img
                                    src={reward.image || '/placeholder.png'}
                                    alt={reward.name}
                                    className="w-full h-full object-cover group-hover:brightness-110 transition-all"
                                />
                                {reward.stock <= 0 && (
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center font-bold text-white tracking-wider">
                                        OUT OF STOCK
                                    </div>
                                )}
                            </div>

                            {/* Product Info */}
                            <div className="p-4 space-y-3">
                                <h3 className="font-bold text-lg text-white line-clamp-1 group-hover:text-[rgb(var(--primary))] transition-colors">
                                    {reward.name}
                                </h3>

                                {reward.description && (
                                    <p className="text-sm text-[rgb(var(--text-muted))] line-clamp-2 min-h-[2.5rem]">
                                        {reward.description}
                                    </p>
                                )}

                                {/* Ticket Cost */}
                                <div className="flex flex-wrap gap-2 pt-2">
                                    {Object.entries(reward.ticketCost || {}).map(([rarity, cost]) => (
                                        cost > 0 && (
                                            <span key={rarity}
                                                className={`text-xs px-2 py-1 rounded border font-medium uppercase flex items-center gap-1 ${getRarityColor(rarity)}`}
                                            >
                                                <span className="w-2 h-2 rounded-full bg-current opacity-70"></span>
                                                {cost} {rarity}
                                            </span>
                                        )
                                    ))}
                                </div>

                                {/* Redeem Button */}
                                <Link
                                    href={`/rewards/${reward._id}`}
                                    className={`block w-full text-center py-2.5 rounded-lg mt-2 font-bold transition-all
                    ${reward.stock > 0
                                            ? 'bg-gradient-primary text-white hover:brightness-110 hover:shadow-lg hover:shadow-[rgb(var(--primary))]/20'
                                            : 'bg-gray-600 cursor-not-allowed opacity-50'}
                  `}
                                    onClick={(e) => reward.stock <= 0 && e.preventDefault()}
                                >
                                    {reward.stock > 0 ? 'แลกของรางวัล' : 'หมดชั่วคราว'}
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
