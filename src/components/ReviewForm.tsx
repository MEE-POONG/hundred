'use client';

import React, { useState } from 'react';
import { useToast } from '@/components/ui/Toast';
import Button from '@/components/ui/Button';

interface ReviewFormProps {
    productId: string;
    orderId: string;
    onSuccess?: () => void;
    onCancel?: () => void;
}

export default function ReviewForm({ productId, orderId, onSuccess, onCancel }: ReviewFormProps) {
    const { showToast } = useToast();
    const [rating, setRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [images, setImages] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Convert File to Base64
    const convertToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        if (images.length + files.length > 5) {
            showToast('อัปโหลดได้สูงสุด 5 รูป', 'error');
            return;
        }

        const newImages: string[] = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            // Limit size to ~2MB to prevent payload too large
            if (file.size > 2 * 1024 * 1024) {
                showToast(`รูป ${file.name} ใหญ่เกินไป (สูงสุด 2MB)`, 'error');
                continue;
            }
            try {
                const base64 = await convertToBase64(file);
                newImages.push(base64);
            } catch (err) {
                console.error("Error converting file", err);
            }
        }

        setImages(prev => [...prev, ...newImages]);
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!comment.trim()) {
            showToast('กรุณาเขียนรีวิว', 'error');
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId,
                    orderId,
                    rating,
                    comment,
                    images,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'ส่งรีวิวไม่สำเร็จ');
            }

            showToast('ส่งรีวิวเรียบร้อยแล้ว!', 'success');
            onSuccess?.();
        } catch (error: any) {
            showToast(error.message, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Star Rating */}
            <div>
                <label className="block text-sm font-medium mb-3">ให้คะแนนสินค้า</label>
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="group focus:outline-none transition-transform active:scale-95"
                        >
                            <svg
                                className={`w-10 h-10 transition-colors duration-200 ${(hoverRating || rating) >= star
                                        ? 'text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]'
                                        : 'text-gray-600 hover:text-gray-500'
                                    }`}
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                            </svg>
                        </button>
                    ))}
                </div>
                <div className="text-sm text-[rgb(var(--text-muted))] mt-2 text-center w-fit min-w-[200px]">
                    {rating === 5 && "⭐ ยอดเยี่ยมมาก!"}
                    {rating === 4 && "⭐ ดีมาก"}
                    {rating === 3 && "⭐ พอใช้"}
                    {rating === 2 && "⭐ ควรปรับปรุง"}
                    {rating === 1 && "⭐ แย่มาก"}
                </div>
            </div>

            {/* Comment */}
            <div>
                <label className="block text-sm font-medium mb-2">เขียนรีวิว</label>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 min-h-[120px] focus:outline-none focus:border-[rgb(var(--primary))] focus:ring-1 focus:ring-[rgb(var(--primary))]"
                    placeholder="บอกเล่าความประทับใจของคุณ..."
                    required
                />
            </div>

            {/* Image Upload */}
            <div>
                <label className="block text-sm font-medium mb-2">รูปภาพประกอบ ({images.length}/5)</label>

                <div className="flex flex-wrap gap-3">
                    {/* Preview Images */}
                    {images.map((img, idx) => (
                        <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border border-white/20 group">
                            <img src={img} alt="preview" className="w-full h-full object-cover" />
                            <button
                                type="button"
                                onClick={() => removeImage(idx)}
                                className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
                            >
                                ✕
                            </button>
                        </div>
                    ))}

                    {/* Upload Button */}
                    {images.length < 5 && (
                        <label className="w-20 h-20 rounded-lg border-2 border-dashed border-white/20 flex flex-col items-center justify-center cursor-pointer hover:border-[rgb(var(--primary))] hover:bg-[rgb(var(--primary))]/5 transition-colors text-[rgb(var(--text-muted))] hover:text-[rgb(var(--primary))]">
                            <span className="text-2xl">+</span>
                            <span className="text-[10px]">เพิ่มรูป</span>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageUpload}
                                className="hidden"
                            />
                        </label>
                    )}
                </div>
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t border-white/10">
                {onCancel && (
                    <Button type="button" variant="ghost" onClick={onCancel} disabled={isSubmitting}>
                        ยกเลิก
                    </Button>
                )}
                <Button type="submit" disabled={isSubmitting} className="min-w-[120px]">
                    {isSubmitting ? 'กำลังส่ง...' : 'ส่งรีวิว'}
                </Button>
            </div>
        </form>
    );
}
