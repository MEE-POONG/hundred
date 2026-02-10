'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Order } from '@/data/types';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import { useToast } from '@/components/ui/Toast';

// ============================================================
// Status Config
// ============================================================
const statusConfig = {
  pending_payment: { label: 'รอชำระเงิน', variant: 'warning' as const, icon: '💳', color: '#F59E0B' },
  paid: { label: 'ชำระแล้ว', variant: 'info' as const, icon: '✅', color: '#3B82F6' },
  processing: { label: 'กำลังเตรียม', variant: 'info' as const, icon: '📦', color: '#8B5CF6' },
  shipped: { label: 'กำลังจัดส่ง', variant: 'info' as const, icon: '🚚', color: '#06B6D4' },
  delivered: { label: 'ส่งถึงแล้ว', variant: 'success' as const, icon: '🎉', color: '#10B981' },
  cancelled: { label: 'ยกเลิก', variant: 'error' as const, icon: '❌', color: '#EF4444' },
};

type OrderStatus = keyof typeof statusConfig;

// The actual linear order of statuses
const STATUS_FLOW: OrderStatus[] = ['pending_payment', 'paid', 'processing', 'shipped', 'delivered'];

// ============================================================
// Timeline Step Interface
// ============================================================
interface TimelineStep {
  status: OrderStatus;
  label: string;
  icon: string;
  date?: string;
  isCompleted: boolean;
  isCurrent: boolean;
  isFuture: boolean;
}

const buildTimeline = (order: Order, currentStatus: OrderStatus): TimelineStep[] => {
  if (currentStatus === 'cancelled') {
    return [{
      status: 'cancelled',
      label: 'ยกเลิกแล้ว',
      icon: '❌',
      date: order.updatedAt || order.createdAt,
      isCompleted: true,
      isCurrent: true,
      isFuture: false,
    }];
  }

  const currentIdx = STATUS_FLOW.indexOf(currentStatus);

  return STATUS_FLOW.map((status, idx) => {
    const isCompleted = idx < currentIdx;
    const isCurrent = idx === currentIdx;
    const isFuture = idx > currentIdx;

    // Only show dates for steps that have actually happened
    let date: string | undefined;
    if (isCompleted || isCurrent) {
      switch (status) {
        case 'pending_payment':
          date = order.createdAt;
          break;
        case 'paid':
          date = order.paidAt;
          break;
        case 'processing':
          // Use paidAt as a proxy (processing starts right after payment)
          date = order.paidAt;
          break;
        case 'shipped':
          date = order.shippedAt;
          break;
        case 'delivered':
          date = order.deliveredAt;
          break;
      }
    }

    return {
      status,
      label: statusConfig[status].label,
      icon: statusConfig[status].icon,
      date,
      isCompleted,
      isCurrent,
      isFuture,
    };
  });
};

// ============================================================
// Payment Method Display
// ============================================================
const paymentMethodLabels: Record<string, { label: string; icon: string }> = {
  'credit-card': { label: 'บัตรเครดิต/เดบิต', icon: '💳' },
  'bank-transfer': { label: 'โอนเงินธนาคาร', icon: '🏦' },
  'cash-on-delivery': { label: 'เก็บเงินปลายทาง', icon: '💰' },
  'digital-wallet': { label: 'กระเป๋าดิจิทัล', icon: '📱' },
};

const shippingMethodLabels: Record<string, { label: string; icon: string }> = {
  'standard': { label: 'ส่งมาตรฐาน (3-5 วัน)', icon: '🚚' },
  'express': { label: 'ส่งด่วน (1-2 วัน)', icon: '⚡' },
  'nextday': { label: 'ส่งวันถัดไป', icon: '🔥' },
};

// ============================================================
// Component
// ============================================================
export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>('pending_payment');
  const { showToast } = useToast();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        if (res.ok) {
          const data = await res.json();
          setOrder(data);
          setCurrentStatus(data.status as OrderStatus);
        }
      } catch (err) {
        console.error('Failed to fetch order:', err);
      } finally {
        setLoading(false);
      }
    };
    if (orderId) fetchOrder();
  }, [orderId]);

  const handlePaymentConfirm = async () => {
    if (!confirm('ยืนยันการแจ้งชำระเงิน?')) return;
    setIsUpdatingStatus(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'paid' }),
      });
      if (res.ok) {
        showToast('แจ้งชำระเงินสำเร็จ!', 'success');
        const updatedOrder = await res.json();
        setOrder(updatedOrder);
        setCurrentStatus('paid');
      } else {
        const err = await res.json();
        showToast(err.error || 'Failed to update', 'error');
      }
    } catch (error) {
      console.error(error);
      showToast('Error updating status', 'error');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // === Helpers ===
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
    }).format(amount);
  };

  // === Loading / Error States ===
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-dark flex flex-col items-center justify-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[rgb(var(--primary))]"></div>
        <p className="text-[rgb(var(--text-muted))] animate-pulse">กำลังโหลดข้อมูลออเดอร์...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="p-12 text-center">
          <div className="text-4xl mb-3">📭</div>
          <p className="text-lg font-semibold mb-4">ไม่พบข้อมูลการสั่งซื้อ</p>
          <Link href="/orders">
            <Button>กลับไปหน้าประวัติการสั่งซื้อ</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const statusInfo = statusConfig[currentStatus];
  const timelineSteps = buildTimeline({ ...order, status: currentStatus } as Order, currentStatus);
  const currentStepIdx = STATUS_FLOW.indexOf(currentStatus);
  const progressPercent = currentStatus === 'cancelled' ? 0 : (currentStepIdx / (STATUS_FLOW.length - 1)) * 100;

  // QR Code URL (Mock PromptPay)
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=PromptPay-0851234567-Amount-${order?.total}`;

  const paymentInfo = paymentMethodLabels[order.paymentMethod] || { label: order.paymentMethod, icon: '💳' };
  const shippingInfo = shippingMethodLabels[order.shippingMethod] || { label: order.shippingMethod, icon: '🚚' };

  return (
    <div className="min-h-screen bg-gradient-dark py-8 md:py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link href="/orders" className="inline-flex items-center gap-2 text-[rgb(var(--text-muted))] hover:text-[rgb(var(--primary))] transition-colors mb-4 text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            กลับไปหน้าประวัติ
          </Link>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gradient">รายละเอียดคำสั่งซื้อ</h1>
              <p className="text-[rgb(var(--text-muted))] mt-1 font-mono text-sm">{order.orderNumber}</p>
            </div>
            <Badge variant={statusInfo.variant} className="self-start md:self-auto text-base px-4 py-2">
              {statusInfo.icon} {statusInfo.label}
            </Badge>
          </div>
        </div>

        {/* ============================================================ */}
        {/* HERO: Horizontal Tracking Bar (Shopee-style) */}
        {/* ============================================================ */}
        {currentStatus !== 'cancelled' && (
          <Card className="p-6 md:p-8 mb-8 overflow-hidden relative" elevated>
            <h2 className="text-xl font-bold mb-8 text-center">สถานะการจัดส่ง</h2>

            {/* Desktop: Horizontal Timeline */}
            <div className="hidden md:block">
              {/* Progress Line */}
              <div className="relative mx-8 mb-2">
                {/* Background Line */}
                <div className="absolute top-6 left-0 right-0 h-1 bg-white/10 rounded-full" />
                {/* Active Line */}
                <div
                  className="absolute top-6 left-0 h-1 bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--secondary))] rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />

                {/* Steps */}
                <div className="relative flex justify-between">
                  {timelineSteps.map((step, idx) => (
                    <div key={step.status} className="flex flex-col items-center" style={{ width: `${100 / timelineSteps.length}%` }}>
                      {/* Circle */}
                      <div
                        className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all duration-500
                          ${step.isCompleted
                            ? 'bg-gradient-to-br from-[rgb(var(--primary))] to-[rgb(var(--secondary))] text-white shadow-lg shadow-[rgb(var(--primary))]/30'
                            : step.isCurrent
                              ? 'bg-[rgb(var(--primary))]/20 border-2 border-[rgb(var(--primary))] text-[rgb(var(--primary))] shadow-lg shadow-[rgb(var(--primary))]/20'
                              : 'bg-white/5 border-2 border-white/10 text-[rgb(var(--text-muted))]'
                          }`}
                      >
                        {step.isCompleted ? (
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        ) : (
                          <span className="text-lg">{step.icon}</span>
                        )}
                        {/* Pulse effect for current step */}
                        {step.isCurrent && (
                          <span className="absolute inset-0 rounded-full border-2 border-[rgb(var(--primary))] animate-ping opacity-30" />
                        )}
                      </div>

                      {/* Label */}
                      <p className={`mt-3 text-sm font-semibold text-center transition-colors ${step.isCompleted || step.isCurrent ? 'text-white' : 'text-[rgb(var(--text-muted))]'
                        }`}>
                        {step.label}
                      </p>

                      {/* Date */}
                      {step.date ? (
                        <p className="text-xs text-[rgb(var(--text-muted))] mt-1 text-center">
                          {formatDate(step.date)}
                        </p>
                      ) : (
                        <p className="text-xs text-transparent mt-1 select-none">-</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile: Vertical Timeline */}
            <div className="md:hidden">
              <div className="relative pl-8">
                {/* Background Line */}
                <div className="absolute left-[15px] top-0 bottom-0 w-0.5 bg-white/10" />
                {/* Active Line */}
                <div
                  className="absolute left-[15px] top-0 w-0.5 bg-gradient-to-b from-[rgb(var(--primary))] to-[rgb(var(--secondary))] transition-all duration-1000 ease-out rounded-full"
                  style={{ height: `${progressPercent}%` }}
                />

                <div className="space-y-6">
                  {timelineSteps.map((step, idx) => (
                    <div key={step.status} className="relative flex items-start gap-4">
                      {/* Circle */}
                      <div
                        className={`absolute -left-8 z-10 w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 transition-all duration-500
                          ${step.isCompleted
                            ? 'bg-gradient-to-br from-[rgb(var(--primary))] to-[rgb(var(--secondary))] text-white shadow-md shadow-[rgb(var(--primary))]/30'
                            : step.isCurrent
                              ? 'bg-[rgb(var(--primary))]/20 border-2 border-[rgb(var(--primary))] text-[rgb(var(--primary))]'
                              : 'bg-white/5 border-2 border-white/10 text-[rgb(var(--text-muted))]'
                          }`}
                      >
                        {step.isCompleted ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        ) : (
                          <span className="text-xs">{step.icon}</span>
                        )}
                        {step.isCurrent && (
                          <span className="absolute inset-0 rounded-full border-2 border-[rgb(var(--primary))] animate-ping opacity-30" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="pt-1">
                        <p className={`font-semibold text-sm ${step.isCompleted || step.isCurrent ? 'text-white' : 'text-[rgb(var(--text-muted))]'
                          }`}>
                          {step.label}
                        </p>
                        {step.date && (
                          <p className="text-xs text-[rgb(var(--text-muted))] mt-0.5">
                            {formatDate(step.date)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Subtle Glow Background */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-[rgb(var(--primary))]/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[rgb(var(--secondary))]/5 rounded-full blur-3xl pointer-events-none" />
          </Card>
        )}

        {/* Cancelled Banner */}
        {currentStatus === 'cancelled' && (
          <Card className="p-6 mb-8 border-2 border-red-500/30 bg-red-500/5">
            <div className="flex items-center gap-4">
              <span className="text-4xl">❌</span>
              <div>
                <h2 className="text-xl font-bold text-red-400">คำสั่งซื้อนี้ถูกยกเลิก</h2>
                <p className="text-sm text-[rgb(var(--text-muted))] mt-1">
                  เมื่อ {formatDate(order.updatedAt || order.createdAt)}
                </p>
              </div>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">

            {/* Payment Section (Display if pending_payment) */}
            {currentStatus === 'pending_payment' && (
              <Card className="p-8 border-2 border-[rgb(var(--primary))]/30 bg-gradient-to-br from-[rgb(var(--primary))]/10 to-[rgb(var(--secondary))]/5" elevated>
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-4 text-white">ชำระเงินผ่าน QR Code</h2>
                  <p className="text-[rgb(var(--text-muted))] mb-6">สแกน QR Code เพื่อชำระเงิน (PromptPay)</p>

                  <div className="bg-white p-4 inline-block rounded-xl mb-6 shadow-lg">
                    <img src={qrCodeUrl} alt="PromptPay QR" className="w-48 h-48 md:w-64 md:h-64 object-contain" />
                  </div>

                  <div className="text-3xl font-bold text-[rgb(var(--primary))] mb-2">
                    {formatCurrency(order.total)}
                  </div>
                  <p className="text-sm text-[rgb(var(--text-muted))] mb-8 max-w-md mx-auto">
                    เมื่อโอนเงินเรียบร้อยแล้ว กรุณากดปุ่มด้านล่างเพื่อแจ้งชำระเงิน
                  </p>

                  <Button
                    size="lg"
                    onClick={handlePaymentConfirm}
                    disabled={isUpdatingStatus}
                    className="w-full md:w-auto px-12 font-bold text-lg shadow-xl shadow-[rgb(var(--primary))]/20 hover:shadow-[rgb(var(--primary))]/40"
                  >
                    {isUpdatingStatus ? '⏳ กำลังแจ้ง...' : '✅ แจ้งโอนเงิน'}
                  </Button>
                </div>
              </Card>
            )}

            {/* Items List */}
            <Card className="p-6 md:p-8" elevated>
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span>🛍️</span> รายการสินค้า
                <span className="text-sm font-normal text-[rgb(var(--text-muted))]">({order.items.length} รายการ)</span>
              </h2>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-white/10 transition-colors">
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{item.productName}</h3>
                      {item.selectedVariants && Object.entries(item.selectedVariants).length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          {Object.entries(item.selectedVariants).map(([key, value]) => (
                            <span key={key} className="text-xs px-2 py-0.5 bg-white/5 border border-white/10 rounded-full text-[rgb(var(--text-muted))]">
                              {key}: {value}
                            </span>
                          ))}
                        </div>
                      )}
                      <p className="text-sm text-[rgb(var(--text-muted))] mt-2">
                        จำนวน: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      {item.salePrice && item.salePrice < item.price && (
                        <p className="text-xs text-[rgb(var(--text-muted))] line-through">
                          {formatCurrency(item.price * item.quantity)}
                        </p>
                      )}
                      <p className="font-bold text-[rgb(var(--primary))]">
                        {formatCurrency((item.salePrice || item.price) * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Shipping Address */}
            <Card className="p-6 md:p-8" elevated>
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span>📍</span> ที่อยู่จัดส่ง
              </h2>
              <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-5 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-lg">{order.shippingAddress.name}</span>
                  <span className="text-[rgb(var(--text-muted))]">|</span>
                  <span className="text-[rgb(var(--text-muted))]">📞 {order.shippingAddress.phone}</span>
                </div>
                <p className="text-[rgb(var(--text-muted))] text-sm leading-relaxed">
                  {order.shippingAddress.address}
                  {order.shippingAddress.district && `, ${order.shippingAddress.district}`}
                  {order.shippingAddress.province && `, ${order.shippingAddress.province}`}
                  {order.shippingAddress.postalCode && ` ${order.shippingAddress.postalCode}`}
                </p>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Summary */}
            <Card className="p-6 sticky top-24" elevated>
              <h3 className="font-bold text-lg mb-5 flex items-center gap-2">
                <span>🧾</span> สรุปการชำระเงิน
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[rgb(var(--text-muted))]">ราคาสินค้า</span>
                  <span className="font-semibold">{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[rgb(var(--text-muted))]">ค่าจัดส่ง</span>
                  <span className="font-semibold">{formatCurrency(order.shipping)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-[rgb(var(--success))]">
                    <span>ส่วนลด</span>
                    <span className="font-semibold">-{formatCurrency(order.discount)}</span>
                  </div>
                )}
                <div className="border-t border-white/10 pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-base">ยอดรวมทั้งสิ้น</span>
                    <span className="font-bold text-xl text-gradient">
                      {formatCurrency(order.total)}
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Payment Method */}
            <Card className="p-6" elevated>
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <span>{paymentInfo.icon}</span> วิธีการชำระเงิน
              </h3>
              <p className="text-[rgb(var(--text-muted))]">{paymentInfo.label}</p>
            </Card>

            {/* Shipping Method */}
            <Card className="p-6" elevated>
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <span>{shippingInfo.icon}</span> วิธีการจัดส่ง
              </h3>
              <p className="text-[rgb(var(--text-muted))]">{shippingInfo.label}</p>
              {order.trackingNumber && (
                <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10">
                  <p className="text-xs text-[rgb(var(--text-muted))] mb-1">เลขพัสดุ</p>
                  <p className="font-mono text-sm font-bold text-white">{order.trackingNumber}</p>
                </div>
              )}
            </Card>

            {/* Order Info */}
            <Card className="p-6" elevated>
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <span>📋</span> ข้อมูลคำสั่งซื้อ
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-[rgb(var(--text-muted))]">หมายเลขคำสั่งซื้อ</p>
                  <p className="font-mono text-xs mt-0.5">{order.orderNumber}</p>
                </div>
                <div>
                  <p className="text-[rgb(var(--text-muted))]">วันที่สั่งซื้อ</p>
                  <p className="mt-0.5">{formatDate(order.createdAt)}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}