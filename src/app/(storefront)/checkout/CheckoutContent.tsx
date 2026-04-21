'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/components/ui/Toast';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import SearchableSelect from '@/components/ui/SearchableSelect';
import { generatePromptPayPayload, getQRCodeImageUrl } from '@/lib/promptpay';
import { PAYMENT_CONFIG } from '@/config/payment';

type CheckoutStep = 'address' | 'payment' | 'slip' | 'review';
const STEPS: CheckoutStep[] = ['address', 'payment', 'slip', 'review'];
const STEP_LABELS: Record<CheckoutStep, string> = {
  address: 'ที่อยู่ & จัดส่ง',
  payment: 'ชำระเงิน',
  slip: 'อัพโหลดสลิป',
  review: 'ยืนยันคำสั่งซื้อ',
};

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
  default?: boolean;
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

interface UserCoupon {
  _id: string; // UserCoupon ID
  couponId: string;
  code: string;
  description?: string;
  discountType: 'fixed' | 'percent';
  discountValue: number;
  minPurchase: number;
  expirationDate?: string;
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
    description: 'โอนผ่านแอปธนาคาร พร้อมแนบสลิป',
    icon: '🏦',
  },
  {
    id: 'qr-code',
    name: 'จ่ายผ่าน QR Code',
    description: 'สแกน QR PromptPay พร้อมแนบสลิป',
    icon: '📷',
  },
  {
    id: 'cash-on-delivery',
    name: 'เก็บเงินปลายทาง',
    description: 'จ่ายเมื่อรับสินค้า',
    icon: '💰',
  },
];

export default function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { items, removeItem } = useCart();
  const { showToast } = useToast();
  const { data: session } = useSession();

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

  // Address State
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [selectedShippingId, setSelectedShippingId] = useState<string>('standard');
  const [selectedPaymentId, setSelectedPaymentId] = useState<string>('credit-card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Slip Upload State
  const [slipFile, setSlipFile] = useState<File | null>(null);
  const [slipPreview, setSlipPreview] = useState<string | null>(null);
  const [isVerifyingSlip, setIsVerifyingSlip] = useState(false);
  const [slipVerified, setSlipVerified] = useState(false);
  const [slipError, setSlipError] = useState<string | null>(null);

  // Coupon State
  const [myCoupons, setMyCoupons] = useState<UserCoupon[]>([]);
  const [selectedUserCouponId, setSelectedUserCouponId] = useState<string>('');
  const [couponCode, setCouponCode] = useState('');
  const [manualCoupon, setManualCoupon] = useState<any>(null);
  const [isVerifyingCoupon, setIsVerifyingCoupon] = useState(false);

  // Modal State
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressForm, setAddressForm] = useState<Partial<Address>>({});

  // Thai Address Data State
  const [provincesData, setProvincesData] = useState<ThaiAddressData[]>([]);
  const [loadingAddress, setLoadingAddress] = useState(false);

  // Fetch Coupons
  useEffect(() => {
    if (session) {
      const fetchCoupons = async () => {
        try {
          const res = await fetch('/api/user/coupons/my-coupons');
          if (res.ok) {
            const data = await res.json();
            setMyCoupons(data);
          }
        } catch (err) {
          console.error('Failed to fetch coupons:', err);
        }
      };
      
      const fetchAddresses = async () => {
        try {
          const res = await fetch('/api/user/addresses');
          if (res.ok) {
            const data = await res.json();
            setAddresses(data);
            // Auto-select default address
            const defaultAddress = data.find((addr: Address) => addr.default);
            if (defaultAddress) {
              setSelectedAddressId(defaultAddress.id);
            } else if (data.length > 0) {
              setSelectedAddressId(data[0].id);
            }
          }
        } catch (err) {
          console.error('Failed to fetch addresses:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchCoupons();
      fetchAddresses();
    } else {
      setLoading(false);
    }
  }, [session]);

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
  const selectedAmphureObj = amphures.find(a => a.name_th === addressForm.district);
  const tambons = selectedAmphureObj?.tambon || [];

  // Cleanup preview URL
  useEffect(() => {
    return () => {
      if (slipPreview) URL.revokeObjectURL(slipPreview);
    };
  }, [slipPreview]);

  // Helpers
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Calculations
  const selectedShipping = SHIPPING_METHODS.find(m => m.id === selectedShippingId);
  const baseShippingPrice = selectedShipping?.price || 50;

  const isFreeShippingEligible = checkoutSubtotal >= 500;
  const shippingDiscount = isFreeShippingEligible ? 50 : 0;
  const finalShippingPrice = Math.max(0, baseShippingPrice - shippingDiscount);

  // Calculate Coupon Discount
  let selectedCouponObj: any = myCoupons.find(c => c._id === selectedUserCouponId);
  if (manualCoupon) {
    selectedCouponObj = manualCoupon;
  }

  let couponDiscount = 0;
  if (selectedCouponObj) {
    if (checkoutSubtotal >= selectedCouponObj.minPurchase) {
      if (selectedCouponObj.discountType === 'percent') {
        couponDiscount = (checkoutSubtotal * selectedCouponObj.discountValue) / 100;
      } else {
        couponDiscount = selectedCouponObj.discountValue;
      }
      // Cap at subtotal
      couponDiscount = Math.min(couponDiscount, checkoutSubtotal);
    }
  }

  const total = Math.max(0, checkoutSubtotal + finalShippingPrice - couponDiscount);

  const selectedAddress = addresses.find(addr => addr.id === selectedAddressId);
  const selectedPayment = PAYMENT_METHODS.find(m => m.id === selectedPaymentId);

  // Handlers
  const handleAddNew = () => {
    setEditingAddressId(null);
    setAddressForm({});
    setIsAddressModalOpen(true);
  };

  const handleEdit = (addr: Address, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingAddressId(addr.id);
    setAddressForm({ ...addr });
    setIsAddressModalOpen(true);
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('คุณต้องการลบที่อยู่นี้ใช่หรือไม่?')) {
      try {
        const res = await fetch(`/api/user/addresses?id=${id}`, { method: 'DELETE' });
        if (res.ok) {
          setAddresses(prev => prev.filter(a => a.id !== id));
          if (selectedAddressId === id) setSelectedAddressId('');
          showToast('ลบที่อยู่เรียบร้อยแล้ว', 'success');
        }
      } catch (err) {
        showToast('เกิดข้อผิดพลาดในการลบที่อยู่', 'error');
      }
    }
  };

  const handleSetDefault = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const addressToUpdate = addresses.find(a => a.id === id);
    if (!addressToUpdate) return;

    try {
      const res = await fetch('/api/user/addresses', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...addressToUpdate, default: true }),
      });

      if (res.ok) {
        const updatedAddr = await res.json();
        setAddresses(prev => prev.map(a => ({
          ...a,
          default: a.id === id ? true : false
        })).sort((a, b) => (b.default ? 1 : 0) - (a.default ? 1 : 0)));
        showToast('ตั้งเป็นที่อยู่หลักเรียบร้อยแล้ว', 'success');
      }
    } catch (err) {
      showToast('เกิดข้อผิดพลาด', 'error');
    }
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressForm.name || !addressForm.address || !addressForm.province || !addressForm.postalCode || !addressForm.phone) {
      showToast('กรุณากรอกข้อมูลให้ครบถ้วน', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      const method = editingAddressId ? 'PUT' : 'POST';
      const body = editingAddressId ? { id: editingAddressId, ...addressForm } : addressForm;

      const res = await fetch('/api/user/addresses', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        const savedAddr = await res.json();
        if (editingAddressId) {
          setAddresses(prev => prev.map(a => a.id === editingAddressId ? savedAddr : a));
          showToast('แก้ไขที่อยู่เรียบร้อยแล้ว', 'success');
        } else {
          setAddresses(prev => [...prev, savedAddr].sort((a, b) => (b.default ? 1 : 0) - (a.default ? 1 : 0)));
          setSelectedAddressId(savedAddr.id);
          showToast('เพิ่มที่อยู่เรียบร้อยแล้ว', 'success');
        }
        setIsAddressModalOpen(false);
      } else {
        showToast('เกิดข้อผิดพลาดในการบันทึกที่อยู่', 'error');
      }
    } catch (err) {
      showToast('เกิดข้อผิดพลาด', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const needsSlip = selectedPaymentId === 'bank-transfer' || selectedPaymentId === 'qr-code';

  // Generate QR Code URL for PromptPay (re-generate when total changes)
  const qrCodeUrl = useMemo(() => {
    if (selectedPaymentId !== 'qr-code') return null;
    const payload = generatePromptPayPayload(PAYMENT_CONFIG.promptPayId, total);
    return getQRCodeImageUrl(payload, 280);
  }, [selectedPaymentId, total]);

  const handleNextStep = async () => {
    if (currentStep === 'address') {
      if (!selectedAddressId) {
        showToast('กรุณาเลือกที่อยู่จัดส่ง', 'error');
        return;
      }
      setCurrentStep('payment');
    } else if (currentStep === 'payment') {
      if (needsSlip) {
        setCurrentStep('slip');
      } else {
        setCurrentStep('review');
      }
    } else if (currentStep === 'slip') {
      if (!slipFile) {
        showToast('กรุณาอัพโหลดสลิปการชำระเงิน', 'error');
        return;
      }
      // If already verified, skip re-verification
      if (slipVerified) {
        setCurrentStep('review');
        return;
      }
      // Verify slip with AI
      setIsVerifyingSlip(true);
      setSlipError(null);
      try {
        const formData = new FormData();
        formData.append('file', slipFile);
        const res = await fetch('/api/verify-slip', {
          method: 'POST',
          body: formData,
        });
        const result = await res.json();
        if (!result.valid) {
          setSlipError(result.reason || 'รูปภาพไม่ใช่สลิปการโอนเงิน');
          showToast('ไม่ใช่สลิปที่ถูกต้อง กรุณาอัพโหลดสลิปการโอนเงินจริง', 'error');
          return;
        }
        setSlipVerified(true);
        setSlipError(null);
        setCurrentStep('review');
      } catch (err) {
        console.error('Slip verification error:', err);
        // On network error, allow to proceed
        setSlipVerified(true);
        setCurrentStep('review');
      } finally {
        setIsVerifyingSlip(false);
      }
    }
  };

  const handlePrevStep = () => {
    if (currentStep === 'payment') {
      setCurrentStep('address');
    } else if (currentStep === 'slip') {
      setCurrentStep('payment');
    } else if (currentStep === 'review') {
      if (needsSlip) {
        setCurrentStep('slip');
      } else {
        setCurrentStep('payment');
      }
    }
  };

  const handleSelectCoupon = (coupon: UserCoupon) => {
    if (checkoutSubtotal < coupon.minPurchase) {
      showToast(`ยอดสั่งซื้อขั้นต่ำสำหรับการใช้คูปองนี้คือ ${coupon.minPurchase} บาท`, 'error');
      return;
    }
    setSelectedUserCouponId(coupon._id);
    setManualCoupon(null); // Clear manual coupon if any
    setIsCouponModalOpen(false);
    showToast('ใช้คูปองเรียบร้อยแล้ว!', 'success');
  };

  const handleRemoveCoupon = () => {
    setManualCoupon(null);
    setSelectedUserCouponId('');
    setCouponCode('');
  };

  const handleConfirmOrder = async () => {
    if (needsSlip && !slipFile) {
      showToast('กรุณาอัปโหลดสลิปการชำระเงิน', 'error');
      setCurrentStep('slip');
      return;
    }

    setIsProcessing(true);
    try {
      let paymentSlipUrl = '';

      // Upload slip if exists
      if (slipFile) {
        const formData = new FormData();
        formData.append('file', slipFile);
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          paymentSlipUrl = uploadData.url;
        } else {
          throw new Error('Failed to upload slip');
        }
      }

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
          discount: shippingDiscount + couponDiscount, // Total discount
          couponCode: selectedCouponObj?.code,
          couponId: selectedCouponObj?._id, // Add used coupon ID
          total,
          status: 'processing',
          shippingAddress: selectedAddress,
          paymentMethod: selectedPaymentId,
          shippingMethod: selectedShippingId,
          paymentSlip: paymentSlipUrl,
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
      showToast(error instanceof Error ? error.message : 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง', 'error');
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
                {STEPS.filter(s => needsSlip || s !== 'slip').map((step, index, arr) => (
                  <React.Fragment key={step}>
                    <button
                      onClick={() => {
                        const stepOrder = STEPS.indexOf(currentStep);
                        const targetOrder = STEPS.indexOf(step);
                        if (targetOrder < stepOrder) setCurrentStep(step);
                      }}
                      className={`flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold text-sm md:text-base transition-all ${
                        currentStep === step
                          ? 'bg-gradient-primary text-white glow-pink'
                          : STEPS.indexOf(currentStep) > STEPS.indexOf(step)
                            ? 'bg-[rgb(var(--success))] text-white'
                            : 'bg-[rgb(var(--surface))] text-[rgb(var(--text-muted))]'
                      }`}
                    >
                      {STEPS.indexOf(currentStep) > STEPS.indexOf(step) ? '✓' : index + 1}
                    </button>
                    {index < arr.length - 1 && (
                      <div className={`flex-1 h-1 mx-2 rounded-full transition-all ${
                        STEPS.indexOf(currentStep) > STEPS.indexOf(step)
                          ? 'bg-[rgb(var(--success))]'
                          : 'bg-[rgb(var(--surface))]'
                      }`} />
                    )}
                  </React.Fragment>
                ))}
              </div>
              <div className={`grid mt-4 text-xs md:text-sm text-[rgb(var(--text-muted))] text-center`} style={{gridTemplateColumns: `repeat(${needsSlip ? 4 : 3}, 1fr)`}}>
                <span>ที่อยู่ & จัดส่ง</span>
                <span>ชำระเงิน</span>
                {needsSlip && <span>อัพโหลดสลิป</span>}
                <span>ยืนยันคำสั่งซื้อ</span>
              </div>
            </div>

            {/* Step 1: Address + Shipping Selection */}
            {currentStep === 'address' && (
              <Card elevated={true}>
                <div className="p-6 space-y-8">
                  {/* Address */}
                  <div>
                    <h2 className="text-2xl font-bold mb-6">เลือกที่อยู่จัดส่ง</h2>
                    <div className="space-y-4">
                      {addresses.map((address) => (
                        <div key={address.id} className="relative group">
                          <input type="radio" id={`address-${address.id}`} name="address" value={address.id} checked={selectedAddressId === address.id} onChange={(e) => setSelectedAddressId(e.target.value)} className="sr-only" />
                          <label htmlFor={`address-${address.id}`} className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedAddressId === address.id ? 'border-[rgb(var(--primary))] bg-[rgb(var(--primary))]/5' : 'border-white/[0.08] hover:border-white/[0.16]'}`}>
                            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-bold text-lg">{address.name}</h3>
                                  {address.default && <Badge variant="pink" className="text-xs">ที่อยู่หลัก</Badge>}
                                </div>
                                <p className="text-[rgb(var(--text-muted))] text-sm">{address.address}</p>
                                <p className="text-[rgb(var(--text-muted))] text-sm">{address.subDistrict} {address.district} {address.province} {address.postalCode}</p>
                                <p className="text-[rgb(var(--text-muted))] text-sm mt-2">📞 {address.phone}</p>
                              </div>
                              <div className="flex gap-2 opacity-50 group-hover:opacity-100 transition-opacity self-end sm:self-start">
                                {!address.default && (
                                  <button onClick={(e) => handleSetDefault(address.id, e)} title="ตั้งเป็นที่อยู่หลัก" className="p-2 hover:bg-white/10 rounded-lg text-yellow-500 transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                                  </button>
                                )}
                                <button onClick={(e) => handleEdit(address, e)} title="แก้ไข" className="p-2 hover:bg-white/10 rounded-lg text-blue-400 transition-colors">
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                </button>
                                <button onClick={(e) => handleDelete(address.id, e)} title="ลบ" className="p-2 hover:bg-white/10 rounded-lg text-red-500 transition-colors">
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                              </div>
                            </div>
                          </label>
                        </div>
                      ))}
                      <button onClick={handleAddNew} className="w-full py-4 rounded-xl border-2 border-dashed border-white/20 hover:border-[rgb(var(--primary))] hover:text-[rgb(var(--primary))] hover:bg-[rgb(var(--primary))]/5 transition-all flex items-center justify-center gap-2 text-[rgb(var(--text-muted))]">
                        <span className="text-2xl">+</span>
                        <span className="font-semibold">เพิ่มที่อยู่ใหม่</span>
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-white/[0.08]" />

                  {/* Shipping Method */}
                  <div>
                    <h2 className="text-2xl font-bold mb-6">รูปแบบการจัดส่ง</h2>
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

                  <div className="pt-6 border-t border-white/[0.08] flex gap-3 justify-between">
                    <Button variant="outline" onClick={() => router.push('/cart')}>กลับไปตะกร้า</Button>
                    <Button onClick={handleNextStep}>ต่อไป: ชำระเงิน</Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Step 2: Payment + Coupon */}
            {currentStep === 'payment' && (
              <Card elevated={true}>
                <div className="p-6 space-y-8">

                  {/* === COUPON SELECTION === */}
                  <div>
                    <h2 className="text-2xl font-bold mb-6">คูปองส่วนลด</h2>
                    {myCoupons.length === 0 ? (
                      <p className="text-[rgb(var(--text-muted))]">คุณไม่มีคูปองที่ใช้ได้</p>
                    ) : (
                      <div className="space-y-3">
                        {myCoupons.map(coupon => {
                          const isEligible = checkoutSubtotal >= coupon.minPurchase;
                          return (
                            <div key={coupon._id} className={`relative ${!isEligible ? 'opacity-50 grayscale' : ''}`}>
                              <input
                                type="radio"
                                id={`coupon-${coupon._id}`}
                                name="coupon"
                                value={coupon._id}
                                checked={selectedUserCouponId === coupon._id}
                                onChange={() => isEligible && setSelectedUserCouponId(coupon._id)}
                                onClick={(e) => {
                                  if (selectedUserCouponId === coupon._id) {
                                    e.preventDefault();
                                    setSelectedUserCouponId('');
                                  }
                                }}
                                className="sr-only"
                                disabled={!isEligible}
                              />
                              <label htmlFor={`coupon-${coupon._id}`} className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedUserCouponId === coupon._id ? 'border-pink-500 bg-pink-500/10' : 'border-white/[0.08] hover:border-white/[0.16]'}`}>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <span className="text-2xl">🎟️</span>
                                    <div>
                                      <h3 className="font-bold font-mono text-lg">{coupon.code}</h3>
                                      <p className="text-sm text-[rgb(var(--text-muted))]">{coupon.description || `ลด ${coupon.discountValue}${coupon.discountType === 'percent' ? '%' : ' บาท'}`}</p>
                                      {!isEligible && <p className="text-xs text-red-400 mt-1">ยอดซื้อขั้นต่ำ {coupon.minPurchase} บาท</p>}
                                    </div>
                                  </div>
                                  <span className="font-bold text-pink-400">
                                    -{coupon.discountType === 'percent' ? `${coupon.discountValue}%` : `${coupon.discountValue}฿`}
                                  </span>
                                </div>
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="border-t border-white/[0.08]" />

                  {/* Payment Method */}
                  <div>
                    <h2 className="text-2xl font-bold mb-6">รูปแบบการชำระเงิน</h2>
                    <div className="space-y-3">
                      {PAYMENT_METHODS.map((method) => (
                        <div key={method.id} className="relative">
                          <input type="radio" id={`payment-${method.id}`} name="payment" value={method.id} checked={selectedPaymentId === method.id} onChange={(e) => setSelectedPaymentId(e.target.value)} className="sr-only" />
                          <label htmlFor={`payment-${method.id}`} className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedPaymentId === method.id ? 'border-[rgb(var(--primary))] bg-[rgb(var(--primary))]/10' : 'border-white/[0.08] hover:border-white/[0.16]'}`}>
                            <div className="flex items-center gap-3">
                              <span className="text-3xl">{method.icon}</span>
                              <div>
                                <h3 className="font-bold">{method.name}</h3>
                                <p className="text-sm text-[rgb(var(--text-muted))]">{method.description}</p>
                              </div>
                            </div>
                          </label>
                        </div>
                      ))}
                    </div>
                    {needsSlip && (
                      <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl flex items-center gap-3">
                        <span className="text-2xl">📋</span>
                        <p className="text-sm text-yellow-300">ขั้นตอนถัดไปคุณจะต้องอัพโหลดสลิปการชำระเงิน</p>
                      </div>
                    )}
                  </div>

                  <div className="pt-6 border-t border-white/[0.08] flex gap-3 justify-between">
                    <Button variant="outline" onClick={handlePrevStep}>ย้อนกลับ</Button>
                    <Button onClick={handleNextStep}>
                      {needsSlip ? 'ต่อไป: อัพโหลดสลิป' : 'ต่อไป: ยืนยันคำสั่งซื้อ'}
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Step 3: Slip Upload */}
            {currentStep === 'slip' && (
              <Card elevated={true}>
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-1">
                    {selectedPaymentId === 'qr-code' ? 'สแกน QR Code ชำระเงิน' : 'โอนเงินและอัพโหลดสลิป'}
                  </h2>
                  <p className="text-[rgb(var(--text-muted))] mb-6">
                    {selectedPaymentId === 'qr-code'
                      ? 'สแกน QR ด้านล่าง แล้วอัพโหลดสลิปยืนยันการชำระเงิน'
                      : 'โอนเงินตามข้อมูลด้านล่าง แล้วอัพโหลดสลิปเพื่อยืนยัน'}
                  </p>

                  {/* QR Code Section (qr-code payment) */}
                  {selectedPaymentId === 'qr-code' && qrCodeUrl && (
                    <div className="flex flex-col items-center mb-6">
                      <div className="bg-white rounded-2xl p-4 shadow-2xl shadow-[rgb(var(--primary))]/20 border border-white/20 relative">
                        {/* PromptPay Logo Badge */}
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#00529b] text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 whitespace-nowrap shadow-lg">
                          <span>📷</span> PromptPay
                        </div>
                        {/* QR Image */}
                        <img
                          src={qrCodeUrl}
                          alt="PromptPay QR Code"
                          width={240}
                          height={240}
                          className="rounded-xl"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                      {/* Amount Badge */}
                      <div className="mt-4 px-6 py-3 bg-[rgb(var(--primary))]/10 border border-[rgb(var(--primary))]/20 rounded-2xl text-center">
                        <p className="text-xs text-[rgb(var(--text-muted))] mb-1">ยอดที่ต้องชำระ</p>
                        <p className="text-gradient text-2xl font-bold">{formatCurrency(total)}</p>
                      </div>
                      {/* Account Info below QR */}
                      <div className="mt-4 w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm space-y-1.5">
                        <div className="flex justify-between">
                          <span className="text-[rgb(var(--text-muted))]">บัญชีรับเงิน</span>
                          <span className="font-semibold">{PAYMENT_CONFIG.accountName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[rgb(var(--text-muted))]">ธนาคาร</span>
                          <span className="font-semibold">{PAYMENT_CONFIG.bankName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[rgb(var(--text-muted))]">เลขที่บัญชี</span>
                          <span className="font-mono font-bold tracking-wider">{PAYMENT_CONFIG.bankAccount}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Bank Transfer Info (bank-transfer payment) */}
                  {selectedPaymentId === 'bank-transfer' && (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6">
                      <h3 className="font-bold mb-3 flex items-center gap-2"><span>🏦</span> ข้อมูลบัญชีโอนเงิน</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-[rgb(var(--text-muted))]">ธนาคาร</span>
                          <span className="font-semibold">{PAYMENT_CONFIG.bankName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[rgb(var(--text-muted))]">เลขที่บัญชี</span>
                          <span className="font-mono font-bold tracking-wider">{PAYMENT_CONFIG.bankAccount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[rgb(var(--text-muted))]">ชื่อบัญชี</span>
                          <span className="font-semibold">{PAYMENT_CONFIG.accountName}</span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-white/10">
                          <span className="text-[rgb(var(--text-muted))]">ยอดที่ต้องโอน</span>
                          <span className="text-gradient text-xl font-bold">{formatCurrency(total)}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Upload Area */}
                  <div className="flex flex-col items-center justify-center space-y-4">
                    {slipPreview ? (
                      <div className="relative group w-full max-w-xs">
                        <img src={slipPreview} alt="Slip Preview" className={`w-full h-64 object-cover rounded-xl border shadow-xl transition-all ${slipError ? 'border-red-500/50' : slipVerified ? 'border-green-500/50' : 'border-white/10'}`} />
                        
                        {/* Status badge */}
                        {slipVerified && !slipError && (
                          <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1 shadow-lg">
                            <span>✓</span> ตรวจสอบแล้ว
                          </div>
                        )}
                        {slipError && (
                          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1 shadow-lg">
                            <span>✕</span> ไม่ผ่าน
                          </div>
                        )}

                        <button
                          onClick={() => { setSlipFile(null); setSlipPreview(null); setSlipVerified(false); setSlipError(null); }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center shadow-lg hover:scale-110 transition-transform text-sm"
                        >✕</button>
                        <div className="mt-3 text-center">
                          <label className="text-[rgb(var(--primary))] text-sm font-medium cursor-pointer hover:underline">
                            เปลี่ยนรูปภาพ
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) {
                                setSlipFile(f);
                                setSlipPreview(URL.createObjectURL(f));
                                setSlipVerified(false);
                                setSlipError(null);
                              }
                            }} />
                          </label>
                        </div>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-white/20 rounded-2xl cursor-pointer hover:border-[rgb(var(--primary))]/60 hover:bg-[rgb(var(--primary))]/5 transition-all group">
                        <div className="flex flex-col items-center justify-center">
                          <svg className="w-12 h-12 mb-4 text-[rgb(var(--text-muted))] group-hover:text-[rgb(var(--primary))] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                          <p className="mb-1 text-base font-semibold text-[rgb(var(--text-muted))] group-hover:text-white transition-colors">คลิกเพื่อเลือกสลิป</p>
                          <p className="text-xs text-[rgb(var(--text-muted))]/60">PNG, JPG (สูงสุด 5MB)</p>
                        </div>
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) {
                            setSlipFile(f);
                            setSlipPreview(URL.createObjectURL(f));
                            setSlipVerified(false);
                            setSlipError(null);
                          }
                        }} />
                      </label>
                    )}

                    {/* Error Message */}
                    {slipError && (
                      <div className="w-full p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3">
                        <span className="text-xl mt-0.5">⚠️</span>
                        <div>
                          <p className="font-semibold text-red-300 text-sm">รูปภาพไม่ผ่านการตรวจสอบ</p>
                          <p className="text-xs text-red-300/70 mt-0.5">{slipError}</p>
                          <p className="text-xs text-red-300/50 mt-1">กรุณาอัพโหลดสลิปการโอนเงินจริงเท่านั้น</p>
                        </div>
                      </div>
                    )}

                    {/* AI Verification Notice */}
                    <div className="w-full p-3 bg-white/5 border border-white/10 rounded-xl flex items-center gap-2">
                      <span className="text-lg">🤖</span>
                      <p className="text-xs text-[rgb(var(--text-muted))]">ระบบจะตรวจสอบด้วย AI ว่าเป็นสลิปโอนเงินจริงก่อนดำเนินการต่อ</p>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/[0.08] flex gap-3 justify-between">
                    <Button variant="outline" onClick={handlePrevStep} disabled={isVerifyingSlip}>ย้อนกลับ</Button>
                    <Button onClick={handleNextStep} disabled={!slipFile || isVerifyingSlip}>
                      {isVerifyingSlip ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                          กำลังตรวจสอบสลิป...
                        </span>
                      ) : (
                        'ต่อไป: ยืนยันคำสั่งซื้อ'
                      )}
                    </Button>
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

                {/* Coupon Review */}
                {selectedCouponObj && (
                  <Card elevated={true}>
                    <div className="p-6 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🎟️</span>
                        <div>
                          <h3 className="font-bold">คูปองส่วนลด</h3>
                          <p className="text-sm text-[rgb(var(--text-muted))]">{selectedCouponObj.code}</p>
                        </div>
                      </div>
                      <span className="font-bold text-red-400">-{couponDiscount.toFixed(2)} บาท</span>
                    </div>
                  </Card>
                )}

                <Card elevated={true}>
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4"><span className="text-2xl">💳</span><h3 className="text-lg font-bold">การชำระเงิน และ จัดส่ง</h3></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-[rgb(var(--background))]/50 rounded-xl p-4">
                        <p className="text-xs text-[rgb(var(--text-muted))] mb-1 uppercase tracking-wider font-bold">ช่องทางชำระเงิน</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{selectedPayment?.icon}</span>
                          <p className="font-semibold">{selectedPayment?.name}</p>
                        </div>
                        {needsSlip && slipPreview && (
                          <div className="mt-3">
                            <p className="text-[10px] text-[rgb(var(--text-muted))] mb-1">สลิปการชำระเงิน:</p>
                            <img src={slipPreview} alt="Slip" className="w-20 h-28 object-cover rounded-lg border border-white/10" />
                          </div>
                        )}
                      </div>
                      <div className="bg-[rgb(var(--background))]/50 rounded-xl p-4">
                        <p className="text-xs text-[rgb(var(--text-muted))] mb-1 uppercase tracking-wider font-bold">วิธีจัดส่ง</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{selectedShipping?.icon}</span>
                          <p className="font-semibold">{selectedShipping?.name}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Confirm Notice */}
                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-2xl flex items-start gap-3">
                  <span className="text-2xl mt-0.5">✅</span>
                  <div>
                    <p className="font-semibold text-green-300">พร้อมยืนยันคำสั่งซื้อ</p>
                    <p className="text-sm text-green-300/70 mt-0.5">เมื่อยืนยันแล้ว ออเดอร์จะถูกส่งไปยัง <span className="font-bold">รอการจัดส่ง</span> ทันที</p>
                  </div>
                </div>

                <div className="pt-2 flex gap-3 justify-between">
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
                      <div className="flex-1 pr-4">
                        <p className="font-medium line-clamp-1">{item.productName}</p>
                        <p className="text-xs text-[rgb(var(--text-muted))]">x{item.quantity}</p>
                      </div>
                      <p className="font-semibold whitespace-nowrap">{(item.salePrice || item.price) * item.quantity} บาท</p>
                    </div>
                  ))}
                </div>
                {/* Shipping Address Summary */}
                {selectedAddress && (
                  <div className="py-3 border-b border-white/[0.08] text-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[rgb(var(--text-muted))] font-medium flex items-center gap-2">
                        <span>📍</span> ที่อยู่จัดส่ง
                      </span>
                      <button 
                        onClick={() => setCurrentStep('address')}
                        className="text-[rgb(var(--primary))] text-xs hover:underline transition-all"
                      >
                        เปลี่ยน
                      </button>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                      <p className="font-bold text-[rgb(var(--text-main))] mb-0.5 line-clamp-1">{selectedAddress.name}</p>
                      <p className="text-xs text-[rgb(var(--text-muted))] line-clamp-2 leading-relaxed">
                        {selectedAddress.address}, {selectedAddress.subDistrict}, {selectedAddress.district}, {selectedAddress.province} {selectedAddress.postalCode}
                      </p>
                      <p className="text-[10px] text-[rgb(var(--text-muted))] mt-2 font-medium">📞 {selectedAddress.phone}</p>
                    </div>
                  </div>
                )}

                {/* Coupon Selection */}
                <div className="py-2">
                  <label className="block text-xs font-medium mb-1.5 text-[rgb(var(--text-muted))]">คูปองส่วนลด</label>
                  
                  {selectedUserCouponId ? (
                    <div className="flex items-center justify-between p-3 bg-[rgb(var(--primary))]/10 border border-[rgb(var(--primary))]/20 rounded-xl">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🎟️</span>
                        <div>
                          <p className="text-xs font-bold text-[rgb(var(--primary))]">{selectedCouponObj.code}</p>
                          <p className="text-[10px] text-[rgb(var(--primary))]/70">ส่วนลด {formatCurrency(couponDiscount)}</p>
                        </div>
                      </div>
                      <button 
                        onClick={handleRemoveCoupon}
                        className="p-1 hover:bg-[rgb(var(--primary))]/20 rounded-lg text-[rgb(var(--primary))] transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setIsCouponModalOpen(true)}
                      className="w-full flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-xl hover:border-[rgb(var(--primary))]/50 hover:bg-[rgb(var(--primary))]/5 transition-all text-sm group"
                    >
                      <div className="flex items-center gap-2 text-[rgb(var(--text-muted))] group-hover:text-[rgb(var(--text-main))] transition-colors">
                        <span>🎟️</span>
                        <span>เลือกคูปองส่วนลด</span>
                      </div>
                      <span className="text-[rgb(var(--primary))]">→</span>
                    </button>
                  )}
                </div>

                {/* Order Details */}
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-sm text-[rgb(var(--text-main))] font-medium">
                    <span className="text-[rgb(var(--text-muted))]">รวมสินค้า</span>
                    <span>{formatCurrency(checkoutSubtotal)}</span>
                  </div>

                  <div className="flex justify-between text-sm text-[rgb(var(--text-main))] font-medium">
                    <span className="text-[rgb(var(--text-muted))]">ค่าจัดส่ง ({selectedShipping?.name})</span>
                    <span>{formatCurrency(baseShippingPrice)}</span>
                  </div>

                  {isFreeShippingEligible && (
                    <div className="flex justify-between text-sm text-[rgb(var(--success))] font-bold">
                      <span>โปรโมชั่นส่งฟรี (500+)</span>
                      <span>-{formatCurrency(50)}</span>
                    </div>
                  )}

                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-sm text-pink-400 font-bold">
                      <span className="flex items-center gap-2">
                        ส่วนลดคูปอง
                        <span className="text-[10px] bg-pink-500/20 text-pink-300 px-1.5 py-0.5 rounded border border-pink-500/30">
                          {selectedCouponObj?.code}
                        </span>
                      </span>
                      <span>-{formatCurrency(couponDiscount)}</span>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-white/[0.08]">
                  <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl">
                    <span className="font-bold">รวมทั้งสิ้น</span>
                    <span className="text-gradient text-2xl font-bold">{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

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

                <div>
                  <label className="block text-sm text-[rgb(var(--text-muted))] mb-1">รหัสไปรษณีย์</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:outline-none focus:border-[rgb(var(--primary))]"
                    placeholder="XXXXX"
                    value={addressForm.postalCode || ''}
                    onChange={e => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                    readOnly
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
      {/* Coupon Modal */}
      {isCouponModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsCouponModalOpen(false)} />
          <Card elevated className="w-full max-w-md relative animate-in zoom-in-95 duration-200 overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold">เลือกคูปองส่วนลด</h2>
                  <p className="text-xs text-[rgb(var(--text-muted))] mt-1">ยอดสั่งซื้อของคุณ: {formatCurrency(checkoutSubtotal)}</p>
                </div>
                <button onClick={() => setIsCouponModalOpen(false)} className="text-[rgb(var(--text-muted))] hover:text-white transition-colors bg-white/5 w-8 h-8 rounded-full flex items-center justify-center">✕</button>
              </div>

              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar pb-2">
                {myCoupons.length === 0 ? (
                  <div className="text-center py-12 bg-white/[0.02] rounded-3xl border border-white/5">
                    <div className="text-5xl mb-4">🎫</div>
                    <p className="text-[rgb(var(--text-muted))] font-medium">ยังไม่มีคูปองส่วนลดที่เก็บไว้</p>
                    <p className="text-[10px] text-[rgb(var(--text-muted))]/60 mt-1">รีบท่องเว็บเพื่อเก็บคูปองสุดคุ้ม!</p>
                  </div>
                ) : (
                  myCoupons.map((coupon) => {
                    const isEligible = checkoutSubtotal >= coupon.minPurchase;
                    return (
                      <div 
                        key={coupon._id}
                        onClick={() => isEligible && handleSelectCoupon(coupon)}
                        className={`relative group p-4 rounded-2xl border-2 transition-all cursor-pointer overflow-hidden ${
                          isEligible 
                            ? 'border-white/10 hover:border-[rgb(var(--primary))] bg-white/5 active:scale-[0.98]' 
                            : 'border-white/5 bg-white/[0.01] grayscale cursor-not-allowed'
                        }`}
                      >
                        {/* Ticket Edge Effect */}
                        <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[rgb(var(--background))] rounded-full border-r border-white/10" />
                        <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[rgb(var(--background))] rounded-full border-l border-white/10" />

                        <div className="flex items-center gap-4 pl-2 pr-2">
                          <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center flex-shrink-0 ${isEligible ? 'bg-gradient-to-br from-[rgb(var(--primary))] to-[rgb(var(--secondary))] text-white shadow-lg shadow-[rgb(var(--primary))]/20' : 'bg-white/10 text-[rgb(var(--text-muted))]'}`}>
                            <span className="text-xs font-bold leading-none">
                              {coupon.discountType === 'percent' ? `${coupon.discountValue}%` : '฿'}
                            </span>
                            <span className="text-[10px] mt-0.5 opacity-80 uppercase font-black">OFF</span>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className={`font-black text-sm uppercase tracking-tight ${isEligible ? 'text-white' : 'text-[rgb(var(--text-muted))]'}`}>
                                {coupon.code}
                              </h3>
                              {isEligible && (
                                <span className="bg-[rgb(var(--success))]/20 text-[rgb(var(--success))] text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-widest">ใช้ได้</span>
                              )}
                            </div>
                            <p className="text-[11px] text-[rgb(var(--text-muted))] mt-1 font-medium leading-tight">
                              {coupon.description || `ส่วนลดมูลค่า ${coupon.discountValue}${coupon.discountType === 'percent' ? '%' : ' บาท'}`}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-[9px] text-[rgb(var(--text-muted))]/60 bg-white/5 px-2 py-0.5 rounded-full">
                                {coupon.minPurchase > 0 ? `ขั้นต่ำ ${formatCurrency(coupon.minPurchase)}` : 'ไม่มีขั้นต่ำ'}
                              </span>
                              {coupon.expirationDate && (
                                <span className="text-[9px] text-red-400/70">
                                  หมดวันที่ {new Date(coupon.expirationDate).toLocaleDateString('th-TH')}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {!isEligible && (
                          <div className="mt-3 pt-3 border-t border-dashed border-white/5 flex items-center gap-2 justify-center">
                            <span className="text-[9px] text-red-400/80 font-bold uppercase tracking-widest">ยอดซื้อไม่พอ</span>
                            <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                              <div className="h-full bg-red-400/30 transition-all" style={{ width: `${(checkoutSubtotal / coupon.minPurchase) * 100}%` }} />
                            </div>
                            <span className="text-[9px] text-red-100/40">ขาดอีก {formatCurrency(coupon.minPurchase - checkoutSubtotal)}</span>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              <div className="mt-6">
                <Button 
                  variant="outline" 
                  className="w-full rounded-2xl border-white/10 hover:bg-white/5 text-[rgb(var(--text-muted))]"
                  onClick={() => setIsCouponModalOpen(false)}
                >
                  ไว้ภายหลัง
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  </div>
  );
}
