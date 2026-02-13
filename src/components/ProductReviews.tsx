'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

interface Review {
    _id: string;
    user: {
        name: string;
        image?: string;
    };
    rating: number;
    comment: string;
    images: string[];
    createdAt: string;
    adminReply?: string;
    adminRepliedAt?: string;
}

export default function ProductReviews({ productId }: { productId: string }) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (productId) {
            fetchReviews();
        }
    }, [productId]);

    const fetchReviews = async () => {
        try {
            const res = await fetch(`/api/reviews?productId=${productId}`);
            if (res.ok) {
                setReviews(await res.json());
            }
        } catch (error) {
            console.error('Failed to fetch reviews', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return <div className="p-4 text-center text-sm text-[rgb(var(--text-muted))]">โหลดรีวิว...</div>;

    if (reviews.length === 0) {
        return (
            <div className="py-8 text-center border-t border-white/[0.08]">
                <p className="text-[rgb(var(--text-muted))]">ยังไม่มีรีวิวสำหรับสินค้านี้</p>
            </div>
        );
    }

    // Calculate Average Rating
    const averageRating = (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1);

    return (
        <div className="mt-12 border-t border-white/[0.08] pt-8">
            <div className="flex items-center gap-4 mb-8">
                <h2 className="text-2xl font-bold">รีวิวจากผู้ซื้อ ({reviews.length})</h2>
                <div className="flex items-center gap-2 bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/20">
                    <span className="text-yellow-400 font-bold text-lg">★ {averageRating}</span>
                    <span className="text-xs text-[rgb(var(--text-muted))]">คะแนนเฉลี่ย</span>
                </div>
            </div>

            <div className="space-y-6">
                {reviews.map((review) => (
                    <div key={review._id} className="bg-white/5 rounded-xl p-6 border border-white/[0.08]">
                        {/* Header: User & Rating */}
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm overflow-hidden">
                                    {review.user.image ? (
                                        <img src={review.user.image} alt={review.user.name} className="w-full h-full object-cover" />
                                    ) : (
                                        review.user.name.charAt(0).toUpperCase()
                                    )}
                                </div>
                                <div>
                                    <p className="font-semibold text-sm">{review.user.name}</p>
                                    <p className="text-xs text-[rgb(var(--text-muted))]">
                                        {new Date(review.createdAt).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}
                                    </p>
                                </div>
                            </div>
                            <div className="flex text-yellow-500 text-sm">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <span key={i} className={i < review.rating ? '' : 'text-white/20'}>★</span>
                                ))}
                            </div>
                        </div>

                        {/* Comment */}
                        <p className="text-[rgb(var(--text-secondary))] mb-4 whitespace-pre-wrap">{review.comment}</p>

                        {/* Images */}
                        {review.images && review.images.length > 0 && (
                            <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
                                {review.images.map((img, idx) => (
                                    <div key={idx} className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border border-white/10 cursor-pointer hover:opacity-80 transition-opacity">
                                        <img src={img} alt={`Review ${idx}`} className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Admin Reply */}
                        {review.adminReply && (
                            <div className="bg-[rgb(var(--background))]/50 border-l-4 border-[rgb(var(--primary))] p-4 rounded-r-lg mt-4">
                                <p className="text-xs font-bold text-[rgb(var(--primary))] mb-1">ตอบกลับจากร้านค้า</p>
                                <p className="text-sm text-[rgb(var(--text-muted))]">{review.adminReply}</p>
                                {review.adminRepliedAt && (
                                    <p className="text-[10px] text-[rgb(var(--text-muted))] mt-2 opacity-60">
                                        {new Date(review.adminRepliedAt).toLocaleDateString('th-TH')}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
