'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/components/ui/Toast';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import { Product, Review } from '@/data/types';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const { showToast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<'details' | 'ingredients' | 'directions' | 'warnings' | 'reviews'>('details');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${params.slug}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (params.slug) fetchProduct();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-[rgb(var(--text-muted))]">กำลังโหลดข้อมูลสินค้า...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">ไม่พบสินค้า</h1>
          <Button onClick={() => router.push('/products')}>กลับไปหน้าสินค้า</Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!product.isInStock) {
      showToast('สินค้าหมด', 'error');
      return;
    }

    // Check if all required variants are selected
    if (product.variants) {
      for (const variant of product.variants) {
        if (!selectedVariants[variant.name]) {
          showToast(`กรุณาเลือก${variant.name}`, 'error');
          return;
        }
      }
    }

    addItem(product, quantity, selectedVariants);
    showToast(`เพิ่ม ${product.name} ลงตะกร้าแล้ว`, 'success');
  };

  const displayPrice = product.salePrice || product.price;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[rgb(var(--text-muted))] mb-8">
        <Link href="/" className="hover:text-[rgb(var(--text))]">หน้าแรก</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-[rgb(var(--text))]">สินค้า</Link>
        <span>/</span>
        <span className="text-[rgb(var(--text))]">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Images */}
        <div>
          <div className="card-surface p-4 mb-4">
            <div className="aspect-square rounded-xl overflow-hidden bg-white/5">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${selectedImage === index
                  ? 'border-[rgb(var(--primary))] glow-pink'
                  : 'border-white/[0.08] hover:border-white/20'
                  }`}
              >
                <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <div className="mb-4">
            <Badge variant="info">{product.categoryName}</Badge>
          </div>

          <h1 className="text-4xl font-bold mb-4">{product.name}</h1>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-600'}>
                    ⭐
                  </span>
                ))}
              </div>
              <span className="font-semibold">{product.rating.toFixed(1)}</span>
            </div>
            <span className="text-[rgb(var(--text-muted))]">({product.reviewCount} รีวิว)</span>
          </div>

          <p className="text-[rgb(var(--text-muted))] mb-6">{product.shortDescription}</p>

          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-4xl font-bold text-[rgb(var(--primary))]">
              ฿{displayPrice.toLocaleString()}
            </span>
            {product.salePrice && (
              <>
                <span className="text-xl text-[rgb(var(--text-muted))] line-through">
                  ฿{product.price.toLocaleString()}
                </span>
                <Badge variant="pink">
                  ประหยัด {Math.round(((product.price - product.salePrice) / product.price) * 100)}%
                </Badge>
              </>
            )}
          </div>

          <div className="mb-6">
            {product.isInStock ? (
              <Badge variant="success">✓ พร้อมส่ง (เหลือ {product.stock} ชิ้น)</Badge>
            ) : (
              <Badge variant="error">สินค้าหมด</Badge>
            )}
          </div>

          {/* Variants */}
          {product.variants && product.variants.map(variant => (
            <div key={variant.id} className="mb-6">
              <h3 className="font-semibold mb-3">{variant.name}</h3>
              <div className="flex flex-wrap gap-2">
                {variant.options.map(option => (
                  <button
                    key={option}
                    onClick={() => setSelectedVariants({ ...selectedVariants, [variant.name]: option })}
                    className={`px-4 py-2 rounded-xl border-2 transition-all ${selectedVariants[variant.name] === option
                      ? 'border-[rgb(var(--primary))] bg-[rgb(var(--primary))]/10 text-[rgb(var(--primary))]'
                      : 'border-white/[0.08] hover:border-white/20'
                      }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Quantity */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3">จำนวน</h3>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-xl border border-white/[0.08] hover:bg-white/5 transition-colors"
              >
                -
              </button>
              <span className="w-16 text-center font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 rounded-xl border border-white/[0.08] hover:bg-white/5 transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mb-6">
            <Button onClick={handleAddToCart} fullWidth size="lg" disabled={!product.isInStock}>
              🛒 เพิ่มลงตะกร้า
            </Button>
          </div>

          {/* Redeem Info */}
          {product.redeemable && (
            <Card className="p-4 bg-[rgb(var(--primary))]/10 border-[rgb(var(--primary))]/30">
              <p className="text-sm mb-2">💎 สินค้านี้แลกได้ด้วยตั๋ว:</p>
              <div className="flex flex-wrap gap-2">
                {product.redeemable.requiredTickets.map((req, idx) => (
                  <Badge key={idx} variant="pink">
                    {req.rarity} x{req.quantity}
                  </Badge>
                ))}
              </div>
              <Link href="/tickets/redeem" className="text-sm text-[rgb(var(--primary))] hover:underline mt-2 inline-block">
                ไปหน้าแลกตั๋ว →
              </Link>
            </Card>
          )}

          <div className="mt-6 text-xs text-[rgb(var(--text-muted))]">
            เลขที่อย.: {product.fda}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="flex gap-4 border-b border-white/[0.08] mb-6">
          {[
            { key: 'details', label: 'รายละเอียด' },
            { key: 'ingredients', label: 'ส่วนประกอบ' },
            { key: 'directions', label: 'วิธีใช้' },
            { key: 'warnings', label: 'คำเตือน' },
            { key: 'reviews', label: `รีวิว (${reviews.length})` },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`pb-3 px-2 border-b-2 transition-colors ${activeTab === tab.key
                ? 'border-[rgb(var(--primary))] text-[rgb(var(--primary))]'
                : 'border-transparent text-[rgb(var(--text-muted))] hover:text-[rgb(var(--text))]'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <Card className="p-6">
          {activeTab === 'details' && (
            <div>
              <p className="text-[rgb(var(--text-muted))] leading-relaxed">{product.description}</p>
            </div>
          )}

          {activeTab === 'ingredients' && (
            <div>
              <h3 className="font-semibold mb-3">ส่วนประกอบสำคัญ</h3>
              <ul className="list-disc list-inside space-y-2 text-[rgb(var(--text-muted))]">
                {product.ingredients.map((ing, idx) => (
                  <li key={idx}>{ing}</li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'directions' && (
            <div>
              <h3 className="font-semibold mb-3">วิธีรับประทาน</h3>
              <p className="text-[rgb(var(--text-muted))]">{product.directions}</p>
            </div>
          )}

          {activeTab === 'warnings' && (
            <div>
              <h3 className="font-semibold mb-3 text-[rgb(var(--warning))]">⚠️ คำเตือน</h3>
              <ul className="list-disc list-inside space-y-2 text-[rgb(var(--text-muted))]">
                {product.warnings.map((warn, idx) => (
                  <li key={idx}>{warn}</li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              {reviews.length === 0 ? (
                <p className="text-center text-[rgb(var(--text-muted))] py-8">ยังไม่มีรีวิว</p>
              ) : (
                reviews.map(review => (
                  <div key={review.id} className="border-b border-white/[0.08] pb-6 last:border-0">
                    <div className="flex items-start gap-4">
                      <img src={review.userAvatar} alt={review.userName} className="w-12 h-12 rounded-full" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold">{review.userName}</span>
                          <div className="flex items-center gap-1 text-yellow-400">
                            {Array.from({ length: review.rating }).map((_, i) => (
                              <span key={i}>⭐</span>
                            ))}
                          </div>
                        </div>
                        <p className="text-[rgb(var(--text-muted))] mb-2">{review.comment}</p>
                        {review.images && (
                          <div className="flex gap-2">
                            {review.images.map((img, idx) => (
                              <img key={idx} src={img} alt="Review" className="w-20 h-20 rounded-lg object-cover" />
                            ))}
                          </div>
                        )}
                        <p className="text-xs text-[rgb(var(--text-muted))] mt-2">
                          {new Date(review.date).toLocaleDateString('th-TH')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
