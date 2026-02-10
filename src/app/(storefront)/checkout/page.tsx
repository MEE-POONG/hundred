'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/components/ui/Toast';
import { mockAddresses } from '@/data/addresses';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';

type CheckoutStep = 'address' | 'payment' | 'review';

// Define Address Interface locally (since mock data might not export it or it's simple)
interface Address {
  id: string;
  name: string;
  address: string;
  district: string;
  province: string;
  postalCode: string;
  phone: string;
  isDefault?: boolean;
}

interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: string;
}

const SHIPPING_METHODS: ShippingMethod[] = [
  {
    id: 'standard',
    name: 'ส่งมาตรฐาน',
    description: '3-5 วันทำการ',
    price: 50,
    icon: '🚚',
  },
  {
    id: 'express',
    name: 'ส่งด่วน',
    description: '1-2 วันทำการ',
    price: 150,
    icon: '⚡',
  },
  {
    id: 'nextday',
    name: 'ส่งวันถัดไป',
    description: '1 วันทำการ',
    price: 250,
    icon: '🔥',
  },
];

const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'credit-card',
    name: 'บัตรเครดิต/เดบิต',
    description: 'ทั้ง Visa, Mastercard, และ บัตรอื่นๆ',
    icon: '💳',
  },
  {
    id: 'bank-transfer',
    name: 'โอนเงินธนาคาร',
    description: 'โอนผ่านแอปธนาคาร',
    icon: '🏦',
  },
  {
    id: 'cash-on-delivery',
    name: 'เก็บเงินปลายทาง',
    description: 'จ่ายเมื่อรับสินค้า',
    icon: '💰',
  },
  {
    id: 'digital-wallet',
    name: 'กระเป๋าดิจิทัล',
    description: 'PromptPay, Line Pay, AirPay',
    icon: '📱',
  },
];

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { items, removeItem } = useCart();
  const { showToast } = useToast();

  const selectedIdsString = searchParams.get('selected');
  const selectedIds = selectedIdsString ? new Set(selectedIdsString.split(',')) : null;

  // Filter items: If selectedIds exists, use it. Otherwise use all items (fallback)
  const checkoutItems = selectedIds
    ? items.filter(item => selectedIds.has(item.productId))
    : items;

  // Calculate totals manually for checkout items
  const checkoutSubtotal = checkoutItems.reduce((sum, item) => {
    return sum + (item.salePrice || item.price) * item.quantity;
  }, 0);

  // States
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('address');

  // Use State for addresses so we can add new ones
  const [addresses, setAddresses] = useState<Address[]>(mockAddresses);
  const [selectedAddressId, setSelectedAddressId] = useState<string>(mockAddresses[0]?.id || '');

  const [selectedShippingId, setSelectedShippingId] = useState<string>('standard');
  const [selectedPaymentId, setSelectedPaymentId] = useState<string>('credit-card');
  const [isProcessing, setIsProcessing] = useState(false);

  // Modal State for adding address
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState<Partial<Address>>({});

  // Calculate totals
  const selectedShipping = SHIPPING_METHODS.find(m => m.id === selectedShippingId);
  const shippingPrice = selectedShipping?.price || 50;
  // Free shipping logic (example: over 500)
  const finalShippingPrice = checkoutSubtotal >= 500 ? 0 : shippingPrice;
  const total = checkoutSubtotal + finalShippingPrice;

  const selectedAddress = addresses.find(addr => addr.id === selectedAddressId);
  const selectedPayment = PAYMENT_METHODS.find(m => m.id === selectedPaymentId);

  // Handlers
  const handleNextStep = () => {
    if (currentStep === 'address') {
      if (!selectedAddressId) {
        showToast('กรุณาเลือกที่อยู่จัดส่ง', 'error');
        return;
      }
      setCurrentStep('payment');
    } else if (currentStep === 'payment') {
      setCurrentStep('review');
    }
  };

  const handlePrevStep = () => {
    if (currentStep === 'payment') {
      setCurrentStep('address');
    } else if (currentStep === 'review') {
      setCurrentStep('payment');
    }
  };

  const handleAddAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.name || !newAddress.address || !newAddress.province || !newAddress.postalCode || !newAddress.phone) {
      showToast('กรุณากรอกข้อมูลให้ครบถ้วน', 'error');
      return;
    }

    const newId = `addr_${Date.now()}`;
    const addressToSave: Address = {
      id: newId,
      name: newAddress.name,
      address: newAddress.address,
      district: newAddress.district || '',
      province: newAddress.province,
      postalCode: newAddress.postalCode,
      phone: newAddress.phone,
      isDefault: false
    };

    setAddresses([...addresses, addressToSave]);
    setSelectedAddressId(newId); // Auto select new address
    setIsAddingAddress(false);
    setNewAddress({}); // Reset form
    showToast('เพิ่มที่อยู่สำเร็จ', 'success');
  };

  const handleConfirmOrder = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: checkoutItems.map(item => ({
            productId: item.productId,
            productName: item.productName,
            productImage: item.productImage,
            price: item.price,
            salePrice: item.salePrice,
            quantity: item.quantity,
            selectedVariants: item.selectedVariants,
          })),
          subtotal: checkoutSubtotal,
          shipping: finalShippingPrice,
          discount: 0,
          total,
          status: 'pending_payment',
          shippingAddress: selectedAddress,
          paymentMethod: selectedPaymentId,
          shippingMethod: selectedShippingId,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        if (res.status === 401) {
          showToast('กรุณาเข้าสู่ระบบก่อนสั่งซื้อ', 'error');
          router.push('/auth/login');
          return;
        }
        throw new Error(data.error || 'เกิดข้อผิดพลาด');
      }

      const order = await res.json();

      // Remove ONLY purchased items from cart
      checkoutItems.forEach(item => {
        removeItem(item.productId);
      });

      showToast('สั่งซื้อสำเร็จ! กำลังไปยังหน้ารายละเอียดคำสั่งซื้อ', 'success');

      setTimeout(() => {
        router.push(`/orders/${order._id}`);
      }, 500);
    } catch (error) {
      showToast('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง', 'error');
      setIsProcessing(false);
    }
  };

  if (checkoutItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <EmptyState
          icon="🛒"
          title="ไม่มีสินค้าที่เลือก"
          description="กรุณาเลือกสินค้าจากตะกร้าก่อนชำระเงิน"
          actionLabel="กลับไปตะกร้า"
          onAction={() => router.push('/cart')}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-dark py-8 md:py-16 relative">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gradient">
          ชำระเงิน ({checkoutItems.length} รายการ)
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Stepper and Form */}
          <div className="lg:col-span-2">
            {/* Progress Stepper */}
            <div className="mb-8">
              <div className="flex justify-between items-center">
                {(['address', 'payment', 'review'] as const).map((step, index) => (
                  <React.Fragment key={step}>
                    <button
                      onClick={() => {
                        if (step === 'address') setCurrentStep('address');
                        else if (step === 'payment' && currentStep !== 'address')
                          setCurrentStep('payment');
                        else if (step === 'review' && currentStep === 'review')
                          setCurrentStep('review');
                      }}
                      className={`flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold text-sm md:text-base transition-all ${currentStep === step
                        ? 'bg-gradient-primary text-white glow-pink'
                        : currentStep > step
                          ? 'bg-[rgb(var(--success))] text-white'
                          : 'bg-[rgb(var(--surface))] text-[rgb(var(--text-muted))]'
                        }`}
                    >
                      {currentStep > step ? '✓' : index + 1}
                    </button>

                    {index < 2 && (
                      <div
                        className={`flex-1 h-1 mx-2 rounded-full transition-all ${currentStep > step
                          ? 'bg-[rgb(var(--success))]'
                          : 'bg-[rgb(var(--surface))]'
                          }`}
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>

              <div className="flex justify-between mt-4 text-xs md:text-sm text-[rgb(var(--text-muted))]">
                <span>ที่อยู่จัดส่ง</span>
                <span>การจัดส่ง & ชำระเงิน</span>
                <span>สรุปคำสั่งซื้อ</span>
              </div>
            </div>

            {/* Step 1: Address Selection */}
            {currentStep === 'address' && (
              <Card elevated={true}>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">เลือกที่อยู่จัดส่ง</h2>
                  </div>

                  <div className="space-y-4">
                    {addresses.map((address) => (
                      <div key={address.id} className="relative">
                        <input
                          type="radio"
                          id={`address-${address.id}`}
                          name="address"
                          value={address.id}
                          checked={selectedAddressId === address.id}
                          onChange={(e) => setSelectedAddressId(e.target.value)}
                          className="sr-only"
                        />

                        <label
                          htmlFor={`address-${address.id}`}
                          className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedAddressId === address.id
                            ? 'border-[rgb(var(--primary))] bg-[rgb(var(--primary))]/10'
                            : 'border-white/[0.08] hover:border-white/[0.16]'
                            }`}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="font-bold text-lg">{address.name}</h3>
                              <p className="text-[rgb(var(--text-muted))] text-sm mt-1">
                                {address.address}
                              </p>
                              <p className="text-[rgb(var(--text-muted))] text-sm">
                                {address.district}, {address.province} {address.postalCode}
                              </p>
                              <p className="text-[rgb(var(--text-muted))] text-sm mt-2">
                                โทรศัพท์: {address.phone}
                              </p>
                            </div>

                            {address.isDefault && (
                              <Badge variant="pink" className="ml-4">
                                ที่อยู่หลัก
                              </Badge>
                            )}
                          </div>
                        </label>
                      </div>
                    ))}

                    {/* Add Address Button */}
                    <button
                      onClick={() => setIsAddingAddress(true)}
                      className="w-full py-4 rounded-xl border-2 border-dashed border-white/20 hover:border-[rgb(var(--primary))] hover:text-[rgb(var(--primary))] hover:bg-[rgb(var(--primary))]/5 transition-all flex items-center justify-center gap-2 text-[rgb(var(--text-muted))]"
                    >
                      <span className="text-2xl">+</span>
                      <span className="font-semibold">เพิ่มที่อยู่ใหม่</span>
                    </button>
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/[0.08] flex gap-3 justify-end">
                    <Button
                      variant="outline"
                      onClick={() => router.push('/cart')}
                    >
                      กลับไปตะกร้า
                    </Button>
                    <Button onClick={handleNextStep}>
                      ต่อไป: การจัดส่ง
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Step 2: Shipping and Payment */}
            {currentStep === 'payment' && (
              <Card elevated={true}>
                <div className="p-6 space-y-8">
                  {/* Shipping Method */}
                  <div>
                    <h2 className="text-2xl font-bold mb-6">วิธีการจัดส่ง</h2>
                    <div className="space-y-3">
                      {SHIPPING_METHODS.map((method) => (
                        <div key={method.id} className="relative">
                          <input
                            type="radio"
                            id={`shipping-${method.id}`}
                            name="shipping"
                            value={method.id}
                            checked={selectedShippingId === method.id}
                            onChange={(e) => setSelectedShippingId(e.target.value)}
                            className="sr-only"
                          />
                          <label
                            htmlFor={`shipping-${method.id}`}
                            className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedShippingId === method.id
                              ? 'border-[rgb(var(--primary))] bg-[rgb(var(--primary))]/10'
                              : 'border-white/[0.08] hover:border-white/[0.16]'
                              }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <span className="text-3xl">{method.icon}</span>
                                <div>
                                  <h3 className="font-bold">{method.name}</h3>
                                  <p className="text-sm text-[rgb(var(--text-muted))]">
                                    {method.description}
                                  </p>
                                </div>
                              </div>
                              <span className="font-bold text-lg">
                                {method.price === 0 ? 'ฟรี' : `${method.price} บาท`}
                              </span>
                            </div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-white/[0.08]" />

                  {/* Payment Method */}
                  <div>
                    <h2 className="text-2xl font-bold mb-6">วิธีชำระเงิน</h2>
                    <div className="space-y-3">
                      {PAYMENT_METHODS.map((method) => (
                        <div key={method.id} className="relative">
                          <input
                            type="radio"
                            id={`payment-${method.id}`}
                            name="payment"
                            value={method.id}
                            checked={selectedPaymentId === method.id}
                            onChange={(e) => setSelectedPaymentId(e.target.value)}
                            className="sr-only"
                          />
                          <label
                            htmlFor={`payment-${method.id}`}
                            className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedPaymentId === method.id
                              ? 'border-[rgb(var(--primary))] bg-[rgb(var(--primary))]/10'
                              : 'border-white/[0.08] hover:border-white/[0.16]'
                              }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-3xl">{method.icon}</span>
                              <div>
                                <h3 className="font-bold">{method.name}</h3>
                                <p className="text-sm text-[rgb(var(--text-muted))]">
                                  {method.description}
                                </p>
                              </div>
                            </div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/[0.08] flex gap-3 justify-between">
                    <Button
                      variant="outline"
                      onClick={handlePrevStep}
                    >
                      ย้อนกลับ
                    </Button>
                    <Button onClick={handleNextStep}>
                      สรุปคำสั่งซื้อ
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Step 3: Review */}
            {currentStep === 'review' && (
              <div className="space-y-4">
                {/* Delivery Address */}
                <Card elevated={true}>
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl">📍</span>
                      <h3 className="text-lg font-bold">ที่อยู่จัดส่ง</h3>
                    </div>

                    {selectedAddress && (
                      <div className="bg-[rgb(var(--background))]/50 rounded-xl p-4">
                        <p className="font-semibold mb-2">{selectedAddress.name}</p>
                        <p className="text-sm text-[rgb(var(--text-muted))]">
                          {selectedAddress.address}
                        </p>
                        <p className="text-sm text-[rgb(var(--text-muted))]">
                          {selectedAddress.district}, {selectedAddress.province} {selectedAddress.postalCode}
                        </p>
                        <p className="text-sm text-[rgb(var(--text-muted))] mt-2">
                          โทรศัพท์: {selectedAddress.phone}
                        </p>
                      </div>
                    )}
                  </div>
                </Card>

                {/* Shipping and Payment Info Cards... */}
                {/* Same as before */}
                <Card elevated={true}>
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl">{selectedShipping?.icon}</span>
                      <div>
                        <h3 className="text-lg font-bold">{selectedShipping?.name}</h3>
                        <p className="text-sm text-[rgb(var(--text-muted))]">
                          {selectedShipping?.description}
                        </p>
                      </div>
                    </div>
                    <p className="font-semibold text-[rgb(var(--primary))]">
                      {selectedShipping?.price === 0 ? 'ฟรี' : `${selectedShipping?.price} บาท`}
                    </p>
                  </div>
                </Card>

                <Card elevated={true}>
                  <div className="p-6">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{selectedPayment?.icon}</span>
                      <div>
                        <h3 className="text-lg font-bold">{selectedPayment?.name}</h3>
                        <p className="text-sm text-[rgb(var(--text-muted))]">
                          {selectedPayment?.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>

                <div className="pt-6 border-t border-white/[0.08] flex gap-3 justify-between">
                  <Button
                    variant="outline"
                    onClick={handlePrevStep}
                    disabled={isProcessing}
                  >
                    ย้อนกลับ
                  </Button>
                  <Button
                    onClick={handleConfirmOrder}
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'กำลังสร้างคำสั่ง...' : 'ยืนยันคำสั่งซื้อ'}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card elevated={true} className="sticky top-20">
              <div className="p-6 space-y-4">
                <h2 className="text-xl font-bold">สรุปคำสั่งซื้อ</h2>
                {/* Same as before */}
                <div className="max-h-64 overflow-y-auto space-y-3 py-4 border-y border-white/[0.08]">
                  {checkoutItems.map((item) => (
                    <div key={item.productId} className="flex justify-between text-sm">
                      <div>
                        <p className="font-medium">{item.productName}</p>
                        <p className="text-xs text-[rgb(var(--text-muted))]">
                          x{item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold">
                        {(item.salePrice || item.price) * item.quantity}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[rgb(var(--text-muted))]">รวมสินค้า</span>
                    <span className="font-semibold">{checkoutSubtotal.toFixed(2)} บาท</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[rgb(var(--text-muted))]">ค่าจัดส่ง</span>
                    <span className="font-semibold">{finalShippingPrice} บาท</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/[0.08]">
                  <div className="flex justify-between items-center">
                    <span className="font-bold">รวมทั้งสิ้น</span>
                    <span className="text-gradient text-2xl font-bold">
                      {total.toFixed(2)} บาท
                    </span>
                  </div>
                </div>

                {currentStep !== 'review' && (
                  <div className="bg-[rgb(var(--primary))]/10 border border-[rgb(var(--primary))]/30 rounded-xl p-3 text-xs text-[rgb(var(--primary))]">
                    ✓ จะชำระเงินเฉพาะรายการที่เลือก ({checkoutItems.length} รายการ)
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Add Address Modal */}
      {isAddingAddress && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl p-6 animate-in fade-in zoom-in duration-200">
            <h2 className="text-2xl font-bold mb-6 text-gradient">เพิ่มที่อยู่จัดส่งใหม่</h2>

            <form onSubmit={handleAddAddressSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-[rgb(var(--text-muted))] mb-1">ชื่อ-นามสกุล</label>
                <input
                  type="text"
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:outline-none focus:border-[rgb(var(--primary))]"
                  placeholder="เช่น สมชาย ใจดี"
                  value={newAddress.name || ''}
                  onChange={e => setNewAddress({ ...newAddress, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm text-[rgb(var(--text-muted))] mb-1">เบอร์โทรศัพท์</label>
                <input
                  type="tel"
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:outline-none focus:border-[rgb(var(--primary))]"
                  placeholder="08X-XXX-XXXX"
                  value={newAddress.phone || ''}
                  onChange={e => setNewAddress({ ...newAddress, phone: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm text-[rgb(var(--text-muted))] mb-1">ที่อยู่ (บ้านเลขที่, ซอย, ถนน)</label>
                <textarea
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:outline-none focus:border-[rgb(var(--primary))]"
                  rows={2}
                  placeholder="บ้านเลขที่..."
                  value={newAddress.address || ''}
                  onChange={e => setNewAddress({ ...newAddress, address: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[rgb(var(--text-muted))] mb-1">จังหวัด</label>
                  <input
                    type="text"
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:outline-none focus:border-[rgb(var(--primary))]"
                    placeholder="กรุงเทพฯ"
                    value={newAddress.province || ''}
                    onChange={e => setNewAddress({ ...newAddress, province: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm text-[rgb(var(--text-muted))] mb-1">รหัสไปรษณีย์</label>
                  <input
                    type="text"
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:outline-none focus:border-[rgb(var(--primary))]"
                    placeholder="10XXX"
                    value={newAddress.postalCode || ''}
                    onChange={e => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  fullWidth
                  onClick={() => setIsAddingAddress(false)}
                >
                  ยกเลิก
                </Button>
                <Button type="submit" fullWidth>
                  บันทึกที่อยู่
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
