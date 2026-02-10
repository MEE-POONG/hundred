'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Order, OrderTimeline } from '@/data/types';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';

const statusConfig = {
  pending_payment: { label: 'รอชำระเงิน', variant: 'warning' as const, color: '#F59E0B' },
  paid: { label: 'ชำระแล้ว', variant: 'info' as const, color: '#3B82F6' },
  processing: { label: 'กำลังเตรียม', variant: 'info' as const, color: '#8B5CF6' },
  shipped: { label: 'จัดส่งแล้ว', variant: 'info' as const, color: '#06B6D4' },
  delivered: { label: 'ส่งถึงแล้ว', variant: 'success' as const, color: '#10B981' },
  cancelled: { label: 'ยกเลิก', variant: 'error' as const, color: '#EF4444' },
};

type OrderStatus = keyof typeof statusConfig;

const getTimelineSteps = (order: Order): OrderTimeline[] => {
  const steps: OrderTimeline[] = [
    {
      status: 'pending_payment',
      label: 'รอชำระเงิน',
      date: order.createdAt,
      completed: ['paid', 'processing', 'shipped', 'delivered'].includes(order.status),
    },
    {
      status: 'paid',
      label: 'ชำระเงินแล้ว',
      date: order.paidAt,
      completed: ['processing', 'shipped', 'delivered'].includes(order.status),
    },
    {
      status: 'processing',
      label: 'กำลังเตรียมสินค้า',
      date: order.createdAt,
      completed: ['shipped', 'delivered'].includes(order.status),
    },
    {
      status: 'shipped',
      label: 'จัดส่งแล้ว',
      date: order.shippedAt,
      completed: ['delivered'].includes(order.status),
    },
    {
      status: 'delivered',
      label: 'ส่งถึงแล้ว',
      date: order.deliveredAt,
      completed: order.status === 'delivered',
    },
  ];

  return steps.filter(step => order.status !== 'cancelled');
};

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>('pending_payment');

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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-[rgb(var(--text-muted))]">กำลังโหลดข้อมูล...</p>
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
  const timelineSteps = getTimelineSteps({ ...order, status: currentStatus });

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
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

  const demoNextStatus = () => {
    const statusOrder: OrderStatus[] = ['pending_payment', 'paid', 'processing', 'shipped', 'delivered'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    if (currentIndex < statusOrder.length - 1) {
      setIsUpdatingStatus(true);
      setTimeout(() => {
        setCurrentStatus(statusOrder[currentIndex + 1]);
        setIsUpdatingStatus(false);
      }, 600);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <Link href="/orders" className="inline-flex items-center gap-2 text-[rgb(var(--primary))] hover:text-[rgb(var(--primary-hover))] mb-4">
          ← กลับไปหน้าประวัติ
        </Link>
        <h1 className="text-4xl font-bold mb-2">รายละเอียดการสั่งซื้อ</h1>
        <p className="text-[rgb(var(--text-muted))]">{order.orderNumber}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-8">สถานะการจัดส่ง</h2>
            <div className="relative">
              <div className="absolute left-6 top-8 bottom-0 w-1 bg-gradient-to-b from-[rgb(var(--primary))] to-[rgb(var(--secondary))]" />

              <div className="space-y-8">
                {timelineSteps.map((step, index) => (
                  <div key={index} className="relative pl-20">
                    <div
                      className={`absolute left-0 w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold transition-all duration-300 ${step.completed
                          ? 'bg-gradient-primary text-white glow-pink scale-100'
                          : currentStatus === step.status
                            ? 'bg-white/10 border-2 border-[rgb(var(--primary))] text-[rgb(var(--primary))] animate-pulse'
                            : 'bg-white/5 border-2 border-white/20 text-[rgb(var(--text-muted))]'
                        }`}
                    >
                      {step.completed ? '✓' : index + 1}
                    </div>

                    <div>
                      <h3 className={`font-semibold text-lg ${step.completed ? 'text-[rgb(var(--text))]' : 'text-[rgb(var(--text-muted))]'}`}>
                        {step.label}
                      </h3>
                      {step.date && (
                        <p className="text-sm text-[rgb(var(--text-muted))] mt-1">
                          {formatDate(step.date)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-white/10">
              <p className="text-sm text-[rgb(var(--text-muted))] mb-4">
                สถานะปัจจุบัน: <span className="text-[rgb(var(--primary))] font-semibold">{statusInfo.label}</span>
              </p>
              <Button
                onClick={demoNextStatus}
                disabled={currentStatus === 'delivered' || isUpdatingStatus}
                className="relative"
              >
                {isUpdatingStatus && (
                  <span className="absolute inset-0 bg-black/20 rounded-2xl animate-pulse" />
                )}
                {isUpdatingStatus ? '⏳ กำลังอัปเดต...' : 'Demo: เปลี่ยนสถานะไปขั้นต่อไป'}
              </Button>
            </div>
          </Card>

          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6">รายการสินค้า</h2>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex gap-4 pb-4 border-b border-white/10 last:border-0">
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.productName}</h3>
                    {item.selectedVariants && Object.entries(item.selectedVariants).length > 0 && (
                      <p className="text-sm text-[rgb(var(--text-muted))] mt-1">
                        {Object.entries(item.selectedVariants)
                          .map(([key, value]) => `${key}: ${value}`)
                          .join(', ')}
                      </p>
                    )}
                    <p className="text-sm text-[rgb(var(--text-muted))] mt-2">
                      จำนวน: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    {item.salePrice && item.salePrice < item.price && (
                      <p className="text-sm text-[rgb(var(--text-muted))] line-through">
                        {formatCurrency(item.price)}
                      </p>
                    )}
                    <p className="font-semibold text-[rgb(var(--primary))]">
                      {formatCurrency((item.salePrice || item.price) * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6">ที่อยู่จัดส่ง</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-[rgb(var(--text-muted))]">ชื่อผู้รับ</p>
                <p className="font-semibold">{order.shippingAddress.name}</p>
              </div>
              <div>
                <p className="text-sm text-[rgb(var(--text-muted))]">เบอร์โทรศัพท์</p>
                <p className="font-semibold">{order.shippingAddress.phone}</p>
              </div>
              <div>
                <p className="text-sm text-[rgb(var(--text-muted))]">ที่อยู่</p>
                <p className="font-semibold">{order.shippingAddress.address}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-[rgb(var(--text-muted))]">อำเภอ</p>
                  <p className="font-semibold">{order.shippingAddress.district}</p>
                </div>
                <div>
                  <p className="text-sm text-[rgb(var(--text-muted))]">จังหวัด</p>
                  <p className="font-semibold">{order.shippingAddress.province}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-[rgb(var(--text-muted))]">รหัสไปรษณีย์</p>
                <p className="font-semibold">{order.shippingAddress.postalCode}</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6 bg-gradient-to-br from-[rgb(var(--primary))]/10 to-[rgb(var(--secondary))]/10">
            <div className="text-center">
              <p className="text-sm text-[rgb(var(--text-muted))] mb-2">สถานะการสั่งซื้อ</p>
              <Badge variant={statusInfo.variant}>
                {statusInfo.label}
              </Badge>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-bold text-lg mb-4">สรุปการชำระเงิน</h3>
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
              <div className="border-t border-white/10 pt-3 flex justify-between">
                <span className="font-bold">ราคารวม</span>
                <span className="font-bold text-lg text-[rgb(var(--primary))]">
                  {formatCurrency(order.total)}
                </span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-bold text-lg mb-4">ข้อมูลการจัดส่ง</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-[rgb(var(--text-muted))]">วิธีการจัดส่ง</p>
                <p className="font-semibold mt-1">{order.shippingMethod}</p>
              </div>
              {order.trackingNumber && (
                <div>
                  <p className="text-[rgb(var(--text-muted))]">เลขติดตามพัสดุ</p>
                  <p className="font-semibold mt-1 font-mono text-xs bg-white/5 p-2 rounded">
                    {order.trackingNumber}
                  </p>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-bold text-lg mb-4">วิธีการชำระเงิน</h3>
            <p className="font-semibold">{order.paymentMethod}</p>
          </Card>
        </div>
      </div>
    </div>
  );
}