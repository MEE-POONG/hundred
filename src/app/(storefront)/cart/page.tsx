'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';

// Simple Icons to replace lucide-react
const MinusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>;

export default function CartPage() {
  const router = useRouter();
  // Destructure isLoaded from useCart context
  const { items, removeItem, updateQuantity, subtotal, isLoaded } = useCart();
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  // Initialize selection logic: when cart loads, select all by default if nothing is selected
  useEffect(() => {
    if (isLoaded && items.length > 0 && selectedItems.size === 0) {
      // Create a set of all product IDs
      const allIds = new Set(items.map(item => item.productId));
      setSelectedItems(allIds);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, items.length]);

  // Loading State: While Cart is retrieving from LocalStorage
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-dark flex flex-col items-center justify-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[rgb(var(--primary))]"></div>
        <p className="text-[rgb(var(--text-muted))] animate-pulse">กำลังโหลดตะกร้าสินค้า...</p>
      </div>
    );
  }

  // Handle Empty Cart (Only after loaded)
  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center min-h-[60vh] flex items-center justify-center">
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

  // Calculate totals based on selected items
  const selectedSubtotal = items
    .filter(item => selectedItems.has(item.productId))
    .reduce((sum, item) => sum + (item.salePrice || item.price) * item.quantity, 0);

  const shipping = selectedSubtotal >= 500 ? 0 : 50;
  const total = selectedSubtotal + (selectedSubtotal > 0 ? shipping : 0);

  const handleRecommendSearch = (term: string) => {
    console.log('Search for:', term);
  };

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(id, newQuantity);
  };

  const handleRemoveItem = (id: string) => {
    if (confirm('คุณต้องการลบสินค้านี้ออกจากตะกร้าใช่หรือไม่?')) {
      removeItem(id);
      setSelectedItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const toggleSelectItem = (id: string) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedItems.size === items.length) {
      setSelectedItems(new Set()); // Deselect all
    } else {
      setSelectedItems(new Set(items.map(item => item.productId))); // Select all
    }
  };

  const handleCheckout = async () => {
    if (selectedItems.size === 0) {
      alert('กรุณาเลือกสินค้าอย่างน้อย 1 รายการ');
      return;
    }
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      const selectedIds = Array.from(selectedItems).join(',');
      router.push(`/checkout?selected=${selectedIds}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-dark py-8 md:py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gradient">
          ตะกร้าสินค้าของคุณ ({items.length} รายการ)
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {/* Header / Select All */}
            <Card className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded border-gray-600 focus:ring-[rgb(var(--primary))]"
                  checked={items.length > 0 && selectedItems.size === items.length}
                  onChange={toggleSelectAll}
                />
                <span className="font-medium text-sm md:text-base">เลือกทั้งหมด ({items.length})</span>
              </div>
              <button
                onClick={() => {
                  if (confirm('คุณต้องการลบสินค้าที่เลือกทั้งหมดหรือไม่?')) {
                    Array.from(selectedItems).forEach(id => removeItem(id));
                    setSelectedItems(new Set());
                  }
                }}
                className="text-red-500 hover:text-red-400 text-sm font-medium disabled:opacity-50"
                disabled={selectedItems.size === 0}
              >
                ลบที่เลือก
              </button>
            </Card>

            {items.map((item) => (
              <Card key={item.productId} className="flex flex-col md:flex-row gap-4 p-4 group relative overflow-hidden transition-all hover:border-[rgb(var(--primary))]/30">
                {/* Checkbox */}
                <div className="absolute top-4 left-4 z-10 md:static md:flex md:items-center">
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded border-gray-600 focus:ring-[rgb(var(--primary))]"
                    checked={selectedItems.has(item.productId)}
                    onChange={() => toggleSelectItem(item.productId)}
                  />
                </div>

                {/* Product Image */}
                <div className="relative w-full md:w-32 aspect-square rounded-lg overflow-hidden flex-shrink-0 bg-black/20 self-center md:self-start ml-8 md:ml-0">
                  {item.productImage ? (
                    <Image
                      src={item.productImage}
                      alt={item.productName}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">💊</div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-between py-1 ml-8 md:ml-0">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-lg leading-tight mb-1">
                          <Link href={`/products/${item.productId}`} className="hover:text-[rgb(var(--primary))] transition-colors">
                            {item.productName}
                          </Link>
                        </h3>
                        {item.selectedVariants && (
                          <div className="flex flex-wrap gap-2 mt-1">
                            {Object.entries(item.selectedVariants).map(([key, value]) => (
                              <Badge key={key} variant="info" className="text-xs">
                                {key}: {value}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.productId)}
                        className="text-[rgb(var(--text-muted))] hover:text-red-500 transition-colors p-1"
                        title="ลบออกจากตะกร้า"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center gap-4 mt-4">
                    <div className="flex items-center border border-white/10 rounded-lg overflow-hidden bg-black/20">
                      <button
                        onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                        className="p-2 hover:bg-white/10 transition-colors disabled:opacity-50"
                        disabled={item.quantity <= 1}
                      >
                        <MinusIcon />
                      </button>
                      <span className="w-12 text-center font-bold text-sm">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                        className="p-2 hover:bg-white/10 transition-colors"
                      >
                        <PlusIcon />
                      </button>
                    </div>

                    <div className="text-right">
                      {item.salePrice ? (
                        <>
                          <p className="text-sm text-[rgb(var(--text-muted))] line-through">
                            {(item.price * item.quantity).toLocaleString()} บาท
                          </p>
                          <p className="text-xl font-bold text-[rgb(var(--success))] glow-text">
                            {(item.salePrice * item.quantity).toLocaleString()} บาท
                          </p>
                        </>
                      ) : (
                        <p className="text-xl font-bold text-gradient">
                          {(item.price * item.quantity).toLocaleString()} บาท
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24 space-y-6" elevated={true}>
              <h2 className="text-xl font-bold border-b border-white/10 pb-4">สรุปรายการสั่งซื้อ</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-[rgb(var(--text-muted))]">
                  <span>เลือกแล้ว ({selectedItems.size} รายการ)</span>
                </div>

                <div className="flex justify-between text-base">
                  <span>ยอดรวมสินค้า</span>
                  <span className="font-semibold">{selectedSubtotal.toLocaleString()} บาท</span>
                </div>

                <div className="flex justify-between text-base">
                  <span>ค่าจัดส่ง (ประมาณการ)</span>
                  <span className={`font-semibold ${selectedSubtotal >= 500 ? 'text-[rgb(var(--success))]' : ''}`}>
                    {selectedSubtotal >= 500 ? 'ฟรี' : '50 บาท'}
                  </span>
                </div>
                {selectedSubtotal < 500 && selectedSubtotal > 0 && (
                  <p className="text-xs text-[rgb(var(--text-muted))] text-right">
                    ซื้ออีก {(500 - selectedSubtotal).toLocaleString()} บาท ส่งฟรี!
                  </p>
                )}
              </div>

              <div className="border-t border-white/10 pt-4">
                <div className="flex justify-between items-center mb-6">
                  <span className="font-bold text-lg">ยอดรวมสุทธิ</span>
                  <span className="font-bold text-2xl text-gradient">
                    {total.toLocaleString()} บาท
                  </span>
                </div>

                <Button
                  fullWidth
                  size="lg"
                  className="shadow-lg shadow-[rgb(var(--primary))]/20 hover:shadow-[rgb(var(--primary))]/40 transform transition-all hover:-translate-y-1"
                  onClick={handleCheckout}
                  disabled={selectedItems.size === 0 || isLoading}
                >
                  {isLoading ? 'กำลังไปหน้าชำระเงิน...' : `ชำระเงิน (${selectedItems.size})`}
                </Button>

                <p className="mt-4 text-xs text-center text-[rgb(var(--text-muted))]">
                  ปลอดภัย 100% ด้วยระบบชำระเงินมาตรฐานสากล
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* Similar Items / Recommendations */}
        <div className="mt-16 pt-8 border-t border-white/5">
          <h2 className="text-2xl font-bold mb-6">สินค้าที่คุณอาจสนใจ</h2>
          <div className="text-center py-8 text-[rgb(var(--text-muted))] bg-white/5 rounded-xl border border-white/5 border-dashed">
            <p>ระบบแนะนำสินค้ากำลังมาเร็วๆ นี้...</p>
            <Button variant="outline" className="mt-4" onClick={() => router.push('/products')}>
              ดูสินค้าทั้งหมด
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
