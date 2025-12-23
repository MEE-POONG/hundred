'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal } = useCart();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Calculate shipping (free for orders above 500)
  const shipping = subtotal >= 500 ? 0 : 50;
  const total = subtotal + shipping;

  const handleQuantityChange = (productId: string, quantity: number) => {
    if (quantity > 0) {
      updateQuantity(productId, quantity);
    }
  };

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      // Small delay to simulate processing
      await new Promise(resolve => setTimeout(resolve, 300));
      router.push('/checkout');
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <EmptyState
          icon="🛒"
          title="ตะกร้าว่างเปล่า"
          description="คุณยังไม่มีสินค้าในตะกร้า ไปที่หน้าสินค้าเพื่อเลือกซื้อสินค้า"
          actionLabel="ไปที่สินค้า"
          onAction={() => router.push('/products')}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-dark py-8 md:py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gradient">
          ตะกร้าของคุณ
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.productId} hover={false} elevated={true}>
                <div className="flex gap-4 p-6">
                  {/* Product Image */}
                  <div className="w-24 h-24 flex-shrink-0">
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div>
                        <Link
                          href={`/products/${item.productId}`}
                          className="text-lg font-semibold hover:text-[rgb(var(--primary))] transition-colors"
                        >
                          {item.productName}
                        </Link>

                        {item.selectedVariants && Object.keys(item.selectedVariants).length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {Object.entries(item.selectedVariants).map(([key, value]) => (
                              <Badge key={key} variant="default" className="text-xs">
                                {key}: {value}
                              </Badge>
                            ))}
                          </div>
                        )}

                        {/* Price */}
                        <div className="mt-3 flex items-center gap-2">
                          <span className="text-xl font-bold text-gradient">
                            {item.salePrice ? item.salePrice : item.price} บาท
                          </span>
                          {item.salePrice && (
                            <span className="text-sm line-through text-[rgb(var(--text-muted))]">
                              {item.price} บาท
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex flex-col items-end gap-3">
                        <div className="flex items-center gap-2 bg-[rgb(var(--background))]/50 rounded-xl p-1">
                          <button
                            onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                            className="px-3 py-1 rounded-lg hover:bg-white/10 transition-colors font-semibold"
                          >
                            −
                          </button>
                          <span className="px-4 py-1 font-semibold min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                            className="px-3 py-1 rounded-lg hover:bg-white/10 transition-colors font-semibold"
                          >
                            +
                          </button>
                        </div>

                        <span className="text-sm text-[rgb(var(--text-muted))]">
                          รวม: {(item.salePrice || item.price) * item.quantity} บาท
                        </span>

                        <button
                          onClick={() => removeItem(item.productId)}
                          className="text-sm text-[rgb(var(--error))] hover:text-[rgb(var(--error))]/80 transition-colors font-medium"
                        >
                          ลบออก
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Summary Card */}
          <div className="lg:col-span-1">
            <Card elevated={true} className="sticky top-20">
              <div className="p-6 space-y-4">
                <h2 className="text-xl font-bold">สรุปคำสั่งซื้อ</h2>

                {/* Summary Items */}
                <div className="space-y-3 py-4 border-y border-white/[0.08]">
                  <div className="flex justify-between items-center">
                    <span className="text-[rgb(var(--text-muted))]">สินค้า ({items.length} รายการ)</span>
                    <span className="font-semibold">{subtotal.toFixed(2)} บาท</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[rgb(var(--text-muted))]">ค่าจัดส่ง</span>
                    <span className="font-semibold">
                      {shipping === 0 ? (
                        <span className="text-[rgb(var(--success))]">ฟรี!</span>
                      ) : (
                        `${shipping} บาท`
                      )}
                    </span>
                  </div>
                </div>

                {/* Free Shipping Info */}
                {shipping > 0 && (
                  <div className="bg-[rgb(var(--success))]/10 border border-[rgb(var(--success))]/30 rounded-xl p-3 text-sm text-[rgb(var(--success))]">
                    ซื้อเพิ่มอีก {(500 - subtotal).toFixed(2)} บาท เพื่อฟรีค่าจัดส่ง
                  </div>
                )}

                {/* Total */}
                <div className="flex justify-between items-center text-lg font-bold pt-2">
                  <span>รวมทั้งสิ้น</span>
                  <span className="text-gradient text-2xl">{total.toFixed(2)} บาท</span>
                </div>

                {/* Checkout Button */}
                <Button
                  fullWidth
                  size="lg"
                  onClick={handleCheckout}
                  disabled={isLoading}
                  className="mt-6"
                >
                  {isLoading ? 'กำลังโหลด...' : 'ไปชำระเงิน'}
                </Button>

                {/* Continue Shopping */}
                <Button
                  fullWidth
                  variant="outline"
                  size="md"
                  onClick={() => router.push('/products')}
                >
                  ซื้อเพิ่มเติม
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
