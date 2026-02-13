'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/components/ui/Toast';
import { mockAddresses } from '@/data/addresses';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import SearchableSelect from '@/components/ui/SearchableSelect';

type CheckoutStep = 'address' | 'payment' | 'review';

// Define Address Interface
interface Address {
  id: string;
  name: string;
  address: string;
  subDistrict: string;
  district: string;
  province: string;
  postalCode: string;
  phone: string;
  isDefault?: boolean;
}

interface ThaiAddressData {
  id: number;
  name_th: string;
  name_en: string;
  geography_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: null;
  amphure: Amphure[];
}

interface Amphure {
  id: number;
  name_th: string;
  name_en: string;
  province_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: null;
  tambon: Tambon[];
}

interface Tambon {
  id: number;
  name_th: string;
  name_en: string;
  amphure_id: number;
  zip_code: number;
  created_at: string;
  updated_at: string;
  deleted_at: null;
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

  // Filter items logic
  const checkoutItems = selectedIds
    ? items.filter(item => selectedIds.has(item.productId))
    : items;

  const checkoutSubtotal = checkoutItems.reduce((sum, item) => {
    return sum + (item.salePrice || item.price) * item.quantity;
  }, 0);

  // States
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('address');

  // Address State: Initialize empty
  const [addresses, setAddresses] = useState<Address[]>([]);

  const [selectedAddressId, setSelectedAddressId] = useState<string>('');

  const [selectedShippingId, setSelectedShippingId] = useState<string>('standard');
  const [selectedPaymentId, setSelectedPaymentId] = useState<string>('credit-card');
  const [isProcessing, setIsProcessing] = useState(false);

  // Modal State
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null); // If null, adding new
  const [addressForm, setAddressForm] = useState<Partial<Address>>({});

  // Thai Address Data State
  const [provincesData, setProvincesData] = useState<ThaiAddressData[]>([]);
  const [loadingAddress, setLoadingAddress] = useState(false);

  useEffect(() => {
    const fetchThaiAddress = async () => {
      setLoadingAddress(true);
      try {
        const res = await fetch('/data/thai_address.json');
        if (res.ok) {
          const data = await res.json();
          setProvincesData(data);
        }
      } catch (error) {
        console.error('Failed to fetch Thai address data', error);
      } finally {
        setLoadingAddress(false);
      }
    };
    fetchThaiAddress();
  }, []);

  // Helper to find selected object from form value
  const selectedProvinceObj = provincesData.find(p => p.name_th === addressForm.province);
  const amphures = selectedProvinceObj?.amphure || [];
  const selectedAmphureObj = amphures.find(a => a.name_th === addressForm.district); // district = amphure
  const tambons = selectedAmphureObj?.tambon || [];
  // subDistrict derived from form value logic or handled directly in onChange

  // Calculations
  const selectedShipping = SHIPPING_METHODS.find(m => m.id === selectedShippingId);
  const baseShippingPrice = selectedShipping?.price || 50;

  // Shipping Logic: Discount 50 baht if order > 500
  const isFreeShippingEligible = checkoutSubtotal >= 500;
  // If eligible, discount up to 50 baht (so standard becomes free, express gets discount)
  // Use Math.min so discount doesn't exceed shipping cost (e.g. if shipping is 30, discount is 30)
  // But our shipping starts at 50, so discount is always 50.
  const shippingDiscount = isFreeShippingEligible ? 50 : 0;
  const finalShippingPrice = Math.max(0, baseShippingPrice - shippingDiscount);

  const total = checkoutSubtotal + finalShippingPrice;

  const selectedAddress = addresses.find(addr => addr.id === selectedAddressId);
  const selectedPayment = PAYMENT_METHODS.find(m => m.id === selectedPaymentId);

  // Handlers
  const handleAddNew = () => {
    setEditingAddressId(null);
    setAddressForm({});
    setIsAddressModalOpen(true);
  };

  const handleEdit = (addr: Address, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent selecting the radio
    setEditingAddressId(addr.id);
    setAddressForm({ ...addr });
    setIsAddressModalOpen(true);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('คุณต้องการลบที่อยู่นี้ใช่หรือไม่?')) {
      setAddresses(prev => prev.filter(a => a.id !== id));
      if (selectedAddressId === id) {
        setSelectedAddressId(''); // Deselect if deleted
      }
      showToast('ลบที่อยู่เรียบร้อยแล้ว', 'success');
    }
  };

  const handleSetDefault = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setAddresses(prev => {
      const updated = prev.map(a => ({
        ...a,
        isDefault: a.id === id
      }));
      // Sort default to top
      return updated.sort((a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0));
    });
    showToast('ตั้งเป็นที่อยู่หลักเรียบร้อยแล้ว', 'success');
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressForm.name || !addressForm.address || !addressForm.province || !addressForm.postalCode || !addressForm.phone) {
      showToast('กรุณากรอกข้อมูลให้ครบถ้วน', 'error');
      return;
    }

    if (editingAddressId) {
      // Edit existing
      setAddresses(prev => prev.map(a =>
        a.id === editingAddressId
          ? { ...a, ...addressForm } as Address
          : a
      ));
      showToast('แก้ไขที่อยู่เรียบร้อยแล้ว', 'success');
    } else {
      // Add new
      const newId = `addr_${Date.now()}`;
      const newAddr: Address = {
        id: newId,
        name: addressForm.name!,
        address: addressForm.address!,
        subDistrict: addressForm.subDistrict || '',
        district: addressForm.district || '',
        province: addressForm.province!,
        postalCode: addressForm.postalCode!,
        phone: addressForm.phone!,
        isDefault: addresses.length === 0 // If it's the first address, make it default
      };

      // Add and Sort (if defaulted)
      setAddresses(prev => {
        const updated = [...prev, newAddr];
        return updated.sort((a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0));
      });
      setSelectedAddressId(newId);
      showToast('เพิ่มที่อยู่เรียบร้อยแล้ว', 'success');
    }

    setIsAddressModalOpen(false);
  };

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
          discount: shippingDiscount, // Record discount too
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

      checkoutItems.forEach(item => {
        removeItem(item.productId);
      });

      showToast('สั่งซื้อสำเร็จ!', 'success');
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
              {/* Stepper logic same as before... */}
              <div className="flex justify-between items-center">
                {(['address', 'payment', 'review'] as const).map((step, index) => (
                  <React.Fragment key={step}>
                    <button
                      onClick={() => {
                        if (step === 'address') setCurrentStep('address');
                        else if (step === 'payment' && currentStep !== 'address') setCurrentStep('payment');
                        else if (step === 'review' && currentStep === 'review') setCurrentStep('review');
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
                      <div className={`flex-1 h-1 mx-2 rounded-full transition-all ${currentStep > step ? 'bg-[rgb(var(--success))]' : 'bg-[rgb(var(--surface))]'}`} />
                    )}
                  </React.Fragment>
                ))}
              </div>
              <div className="flex justify-between mt-4 text-xs md:text-sm text-[rgb(var(--text-muted))]">
                <span>ที่อยู่จัดส่ง</span><span>การจัดส่ง & ชำระเงิน</span><span>สรุปคำสั่งซื้อ</span>
              </div>
            </div>

            {/* Step 1: Address Selection */}
            {currentStep === 'address' && (
              <Card elevated={true}>
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-6">เลือกที่อยู่จัดส่ง</h2>
                  <div className="space-y-4">
                    {addresses.map((address) => (
                      <div key={address.id} className="relative group">
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
                            ? 'border-[rgb(var(--primary))] bg-[rgb(var(--primary))]/5'
                            : 'border-white/[0.08] hover:border-white/[0.16]'
                            }`}
                        >
                          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-bold text-lg">{address.name}</h3>
                                {address.isDefault && (
                                  <Badge variant="pink" className="text-xs">
                                    ที่อยู่หลัก
                                  </Badge>
                                )}
                              </div>
                              <p className="text-[rgb(var(--text-muted))] text-sm">
                                {address.address}
                              </p>
                              <p className="text-[rgb(var(--text-muted))] text-sm">
                                {address.subDistrict} {address.district} {address.province} {address.postalCode}
                              </p>
                              <p className="text-[rgb(var(--text-muted))] text-sm mt-2 flex items-center gap-2">
                                📞 {address.phone}
                              </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2 opacity-50 group-hover:opacity-100 transition-opacity self-end sm:self-start">
                              {/* Set Default */}
                              {!address.isDefault && (
                                <button
                                  onClick={(e) => handleSetDefault(address.id, e)}
                                  title="ตั้งเป็นที่อยู่หลัก"
                                  className="p-2 hover:bg-white/10 rounded-lg text-yellow-500 transition-colors"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                                </button>
                              )}
                              {/* Edit */}
                              <button
                                onClick={(e) => handleEdit(address, e)}
                                title="แก้ไข"
                                className="p-2 hover:bg-white/10 rounded-lg text-blue-400 transition-colors"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                              </button>
                              {/* Delete */}
                              <button
                                onClick={(e) => handleDelete(address.id, e)}
                                title="ลบ"
                                className="p-2 hover:bg-white/10 rounded-lg text-red-500 transition-colors"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                              </button>
                            </div>
                          </div>
                        </label>
                      </div>
                    ))}

                    <button
                      onClick={handleAddNew}
                      className="w-full py-4 rounded-xl border-2 border-dashed border-white/20 hover:border-[rgb(var(--primary))] hover:text-[rgb(var(--primary))] hover:bg-[rgb(var(--primary))]/5 transition-all flex items-center justify-center gap-2 text-[rgb(var(--text-muted))]"
                    >
                      <span className="text-2xl">+</span>
                      <span className="font-semibold">เพิ่มที่อยู่ใหม่</span>
                    </button>
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/[0.08] flex gap-3 justify-end">
                    <Button variant="outline" onClick={() => router.push('/cart')}>กลับไปตะกร้า</Button>
                    <Button onClick={handleNextStep}>ต่อไป: การจัดส่ง</Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Other steps (payment/review) same as previous ... */}
            {currentStep === 'payment' && (
              <Card elevated={true}>
                <div className="p-6 space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold mb-6">วิธีการจัดส่ง</h2>
                    <div className="space-y-3">
                      {SHIPPING_METHODS.map((method) => (
                        <div key={method.id} className="relative">
                          <input type="radio" id={`shipping-${method.id}`} name="shipping" value={method.id} checked={selectedShippingId === method.id} onChange={(e) => setSelectedShippingId(e.target.value)} className="sr-only" />
                          <label htmlFor={`shipping-${method.id}`} className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedShippingId === method.id ? 'border-[rgb(var(--primary))] bg-[rgb(var(--primary))]/10' : 'border-white/[0.08] hover:border-white/[0.16]'}`}>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <span className="text-3xl">{method.icon}</span>
                                <div><h3 className="font-bold">{method.name}</h3><p className="text-sm text-[rgb(var(--text-muted))]">{method.description}</p></div>
                              </div>
                              <span className="font-bold text-lg">{method.price === 0 ? 'ฟรี' : `${method.price} บาท`}</span>
                            </div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="border-t border-white/[0.08]" />
                  <div>
                    <h2 className="text-2xl font-bold mb-6">วิธีชำระเงิน</h2>
                    <div className="space-y-3">
                      {PAYMENT_METHODS.map((method) => (
                        <div key={method.id} className="relative">
                          <input type="radio" id={`payment-${method.id}`} name="payment" value={method.id} checked={selectedPaymentId === method.id} onChange={(e) => setSelectedPaymentId(e.target.value)} className="sr-only" />
                          <label htmlFor={`payment-${method.id}`} className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedPaymentId === method.id ? 'border-[rgb(var(--primary))] bg-[rgb(var(--primary))]/10' : 'border-white/[0.08] hover:border-white/[0.16]'}`}>
                            <div className="flex items-center gap-3">
                              <span className="text-3xl">{method.icon}</span>
                              <div><h3 className="font-bold">{method.name}</h3><p className="text-sm text-[rgb(var(--text-muted))]">{method.description}</p></div>
                            </div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="pt-6 border-t border-white/[0.08] flex gap-3 justify-between">
                    <Button variant="outline" onClick={handlePrevStep}>ย้อนกลับ</Button>
                    <Button onClick={handleNextStep}>สรุปคำสั่งซื้อ</Button>
                  </div>
                </div>
              </Card>
            )}

            {currentStep === 'review' && (
              <div className="space-y-4">
                <Card elevated={true}>
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4"><span className="text-2xl">📍</span><h3 className="text-lg font-bold">ที่อยู่จัดส่ง</h3></div>
                    {selectedAddress && (
                      <div className="bg-[rgb(var(--background))]/50 rounded-xl p-4">
                        <p className="font-semibold mb-2">{selectedAddress.name}</p>
                        <p className="text-sm text-[rgb(var(--text-muted))]">{selectedAddress.address}</p>
                        <p className="text-sm text-[rgb(var(--text-muted))]">{selectedAddress.subDistrict} {selectedAddress.district} {selectedAddress.province} {selectedAddress.postalCode}</p>
                        <p className="text-sm text-[rgb(var(--text-muted))] mt-2">📞 {selectedAddress.phone}</p>
                      </div>
                    )}
                  </div>
                </Card>
                {/* Shipping & Payment Cards (Brief) */}
                <Card elevated={true}><div className="p-6"><div className="flex items-center gap-3"><span className="text-2xl">{selectedShipping?.icon}</span><div><h3 className="text-lg font-bold">{selectedShipping?.name}</h3></div></div></div></Card>
                <div className="pt-6 border-t border-white/[0.08] flex gap-3 justify-between">
                  <Button variant="outline" onClick={handlePrevStep} disabled={isProcessing}>ย้อนกลับ</Button>
                  <Button onClick={handleConfirmOrder} disabled={isProcessing}>{isProcessing ? 'กำลังสร้างคำสั่ง...' : 'ยืนยันคำสั่งซื้อ'}</Button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-1">
            <Card elevated={true} className="sticky top-20">
              <div className="p-6 space-y-4">
                <h2 className="text-xl font-bold">สรุปคำสั่งซื้อ</h2>
                <div className="max-h-64 overflow-y-auto space-y-3 py-4 border-y border-white/[0.08]">
                  {checkoutItems.map((item) => (
                    <div key={item.productId} className="flex justify-between text-sm">
                      <div><p className="font-medium">{item.productName}</p><p className="text-xs text-[rgb(var(--text-muted))]">x{item.quantity}</p></div>
                      <p className="font-semibold">{(item.salePrice || item.price) * item.quantity}</p>
                    </div>
                  ))}
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-[rgb(var(--text-muted))]">รวมสินค้า</span><span className="font-semibold">{checkoutSubtotal.toFixed(2)} บาท</span></div>

                  {isFreeShippingEligible && (
                    <div className="flex justify-between text-[rgb(var(--success))]">
                      <span>โปรโมชั่นส่งฟรี</span>
                      <span>-50.00 บาท</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-[rgb(var(--text-muted))]">ค่าจัดส่ง ({selectedShipping?.name})</span>
                    <span className="font-semibold">{baseShippingPrice} บาท</span>
                  </div>

                  {finalShippingPrice === 0 && (
                    <div className="flex justify-between text-[rgb(var(--success))] font-bold py-2 border-t border-white/10 mt-2">
                      <span>ราคารวมค่าส่ง</span>
                      <span>ฟรี</span>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-white/[0.08]">
                  <div className="flex justify-between items-center">
                    <span className="font-bold">รวมทั้งสิ้น</span>
                    <span className="text-gradient text-2xl font-bold">{total.toFixed(2)} บาท</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Address Modal */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl p-6">
            <h2 className="text-2xl font-bold mb-6 text-gradient">
              {editingAddressId ? 'แก้ไขที่อยู่' : 'เพิ่มที่อยู่ใหม่'}
            </h2>

            <form onSubmit={handleAddressSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-[rgb(var(--text-muted))] mb-1">ชื่อ-นามสกุล</label>
                <input type="text" required className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:outline-none focus:border-[rgb(var(--primary))]" placeholder="เช่น สมชาย ใจดี"
                  value={addressForm.name || ''} onChange={e => setAddressForm({ ...addressForm, name: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm text-[rgb(var(--text-muted))] mb-1">เบอร์โทรศัพท์</label>
                <input type="tel" required className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:outline-none focus:border-[rgb(var(--primary))]" placeholder="08X-XXX-XXXX"
                  value={addressForm.phone || ''} onChange={e => setAddressForm({ ...addressForm, phone: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm text-[rgb(var(--text-muted))] mb-1">ที่อยู่</label>
                <textarea required className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:outline-none focus:border-[rgb(var(--primary))]" rows={2} placeholder="บ้านเลขที่..."
                  value={addressForm.address || ''} onChange={e => setAddressForm({ ...addressForm, address: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {/* Province */}
                <div className="relative">
                  <label className="block text-sm text-[rgb(var(--text-muted))] mb-1">จังหวัด</label>
                  <SearchableSelect
                    options={provincesData.map(p => ({ label: p.name_th, value: p.name_th }))}
                    value={addressForm.province || ''}
                    onChange={(val) => {
                      const provinceName = val as string;
                      setAddressForm(prev => ({
                        ...prev,
                        province: provinceName,
                        district: '',
                        subDistrict: '',
                        postalCode: ''
                      }));
                    }}
                    placeholder="ค้นหาจังหวัด..."
                    disabled={loadingAddress}
                    className="z-30"
                  />
                </div>

                {/* Amphure (District) */}
                <div className="relative">
                  <label className="block text-sm text-[rgb(var(--text-muted))] mb-1">อำเภอ/เขต</label>
                  <SearchableSelect
                    options={amphures.map(a => ({ label: a.name_th, value: a.name_th }))}
                    value={addressForm.district || ''}
                    onChange={(val) => {
                      const districtName = val as string;
                      setAddressForm(prev => ({
                        ...prev,
                        district: districtName,
                        subDistrict: '',
                        postalCode: ''
                      }));
                    }}
                    placeholder="ค้นหาอำเภอ/เขต..."
                    disabled={!addressForm.province}
                    className="z-20"
                  />
                </div>

                {/* Tambon (Sub-district) */}
                <div className="relative">
                  <label className="block text-sm text-[rgb(var(--text-muted))] mb-1">ตำบล/แขวง</label>
                  <SearchableSelect
                    options={tambons.map(t => ({ label: t.name_th, value: t.name_th }))}
                    value={addressForm.subDistrict || ''}
                    onChange={(val) => {
                      const tambonName = val as string;
                      const tambonObj = tambons.find(t => t.name_th === tambonName);
                      setAddressForm(prev => ({
                        ...prev,
                        subDistrict: tambonName,
                        postalCode: tambonObj ? String(tambonObj.zip_code) : ''
                      }));
                    }}
                    placeholder="ค้นหาตำบล/แขวง..."
                    disabled={!addressForm.district}
                    className="z-10"
                  />
                </div>

                {/* Zipcode */}
                <div>
                  <label className="block text-sm text-[rgb(var(--text-muted))] mb-1">รหัสไปรษณีย์</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:outline-none focus:border-[rgb(var(--primary))]"
                    placeholder="XXXXX"
                    value={addressForm.postalCode || ''}
                    onChange={e => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                    readOnly // User can still edit if needed? Usually readOnly if selected by Tambon, but allow manual edit for edge cases
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <Button type="button" variant="outline" fullWidth onClick={() => setIsAddressModalOpen(false)}>ยกเลิก</Button>
                <Button type="submit" fullWidth>บันทึก</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
