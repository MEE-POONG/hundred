'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import ReviewForm from '@/components/ReviewForm';

interface PendingReview {
    orderId: string;
    productId: string;
    productName: string;
    productImage: string;
    price: number;
    deliveredAt: string;
    deadline: string;
}

export default function PendingReviewsPage() {
    const { status } = useSession();
    const router = useRouter();
    const [items, setItems] = useState<PendingReview[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedReview, setSelectedReview] = useState<PendingReview | null>(null);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/login');
            return;
        }
        fetchPendingReviews();
    }, [status]);

    const fetchPendingReviews = async () => {
        try {
            const res = await fetch('/api/user/reviews/pending');
            if (res.ok) {
                setItems(await res.json());
            }
        } catch (error) {
            console.error('Failed to fetch pending reviews', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReviewSuccess = () => {
        fetchPendingReviews(); // Refresh list
        setSelectedReview(null); // Close modal
    };

    if (isLoading) return <div className="p-8 text-center text-[rgb(var(--text-muted))]">กำลังโหลด...</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-gradient">สินค้าที่รอการรีวิว</h1>

            {items.length === 0 ? (
                <EmptyState
                    icon="⭐"
                    title="ไม่มีสินค้าที่ต้องรีวิว"
                    description="คุณรีวิวครบแล้ว หรือยังไม่มีสินค้าที่เพิ่งได้รับเมื่อเร็วๆ นี้"
                    actionLabel="ไปช้อปปิ้งเลย"
                    onAction={() => router.push('/')}
                />
            ) : (
                <div className="grid gap-4">
                    {items.map((item) => {
                        const deadlineDate = new Date(item.deadline);
                        const now = new Date();
                        const hoursLeft = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60));
                        const daysLeft = Math.ceil(hoursLeft / 24);

                        return (
                            <Card key={`${item.orderId}_${item.productId}`} elevated className="p-4 flex flex-col md:flex-row gap-4 items-center">
                                <div className="w-20 h-20 bg-white/5 rounded-lg overflow-hidden flex-shrink-0">
                                    {item.productImage ? (
                                        <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-xs text-[rgb(var(--text-muted))]">No Image</div>
                                    )}
                                </div>

                                <div className="flex-1 text-center md:text-left">
                                    <h3 className="font-bold text-lg">{item.productName}</h3>
                                    <div className="text-sm text-[rgb(var(--text-muted))] mt-1">
                                        ได้รับเมื่อ: {new Date(item.deliveredAt).toLocaleDateString('th-TH')}
                                    </div>
                                    <div className="text-xs text-yellow-500 mt-1">
                                        หมดเขตในอีก {daysLeft} วัน ({hoursLeft} ชม.)
                                    </div>
                                </div>

                                <Button onClick={() => setSelectedReview(item)}>
                                    เขียนรีวิว
                                </Button>
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* Review Modal */}
            {selectedReview && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl p-6 relative">
                        <button
                            onClick={() => setSelectedReview(null)}
                            className="absolute top-4 right-4 text-[rgb(var(--text-muted))] hover:text-white"
                        >
                            ✕
                        </button>
                        <h2 className="text-2xl font-bold mb-4">รีวิวสินค้า</h2>
                        <div className="flex items-center gap-3 mb-6 p-3 bg-white/5 rounded-lg">
                            <div className="w-12 h-12 bg-black/20 rounded overflow-hidden">
                                {selectedReview.productImage && <img src={selectedReview.productImage} className="w-full h-full object-cover" />}
                            </div>
                            <span className="font-medium text-sm line-clamp-1">{selectedReview.productName}</span>
                        </div>

                        <ReviewForm
                            productId={selectedReview.productId}
                            orderId={selectedReview.orderId}
                            onSuccess={handleReviewSuccess}
                            onCancel={() => setSelectedReview(null)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
