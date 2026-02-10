'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Order } from '@/data/types';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';

const statusConfig = {
  pending_payment: { label: 'รอชำระเงิน', variant: 'warning' as const, icon: '⏳' },
  paid: { label: 'ชำระแล้ว', variant: 'info' as const, icon: '✓' },
  processing: { label: 'กำลังเตรียม', variant: 'info' as const, icon: '📦' },
  shipped: { label: 'จัดส่งแล้ว', variant: 'info' as const, icon: '🚚' },
  delivered: { label: 'ส่งถึงแล้ว', variant: 'success' as const, icon: '✓' },
  cancelled: { label: 'ยกเลิก', variant: 'error' as const, icon: '✕' },
};

type OrderStatus = keyof typeof statusConfig;

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | 'all'>('all');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/orders');
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    if (selectedStatus === 'all') {
      return orders;
    }
    return orders.filter(order => order.status === selectedStatus);
  }, [selectedStatus, orders]);

  const statusList: (OrderStatus | 'all')[] = ['all', 'pending_payment', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'];

  const formatDate = (dateString: string) => {
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

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">📦 ประวัติการสั่งซื้อ</h1>
        <p className="text-[rgb(var(--text-muted))]">ดูรายละเอียดการสั่งซื้อของคุณ</p>
      </div>

      {/* Status Filter */}
      <Card className="p-4 mb-8 flex flex-wrap gap-2 overflow-x-auto">
        {statusList.map(status => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition-all ${selectedStatus === status
                ? 'bg-gradient-primary text-white glow-pink'
                : 'bg-white/5 text-[rgb(var(--text-muted))] hover:bg-white/10'
              }`}
          >
            {status === 'all' ? 'ทั้งหมด' : statusConfig[status as OrderStatus].label}
          </button>
        ))}
      </Card>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="text-4xl mb-3">📭</div>
            <p className="text-[rgb(var(--text-muted))]">ไม่พบคำสั่งซื้อ</p>
          </Card>
        ) : (
          filteredOrders.map(order => {
            const status = statusConfig[order.status];
            return (
              <Link key={order.id} href={`/orders/${order.id}`}>
                <Card
                  hover
                  className="p-6 transition-all"
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Order Info */}
                    <div>
                      <div className="text-xs text-[rgb(var(--text-muted))] mb-1">เลขที่การสั่งซื้อ</div>
                      <div className="font-semibold">{order.orderNumber}</div>
                      <div className="text-xs text-[rgb(var(--text-muted))] mt-2">
                        {formatDate(order.createdAt)}
                      </div>
                    </div>

                    {/* Items Summary */}
                    <div>
                      <div className="text-xs text-[rgb(var(--text-muted))] mb-1">รายการสินค้า</div>
                      <div className="font-semibold">{order.items.length} สินค้า</div>
                      <div className="text-xs text-[rgb(var(--text-muted))] mt-2 space-y-1">
                        {order.items.slice(0, 2).map((item, i) => (
                          <div key={i} className="line-clamp-1">{item.productName}</div>
                        ))}
                        {order.items.length > 2 && (
                          <div className="text-[rgb(var(--primary))]">+{order.items.length - 2} รายการ</div>
                        )}
                      </div>
                    </div>

                    {/* Status */}
                    <div>
                      <div className="text-xs text-[rgb(var(--text-muted))] mb-2">สถานะ</div>
                      <Badge variant={status.variant as any}>
                        {status.icon} {status.label}
                      </Badge>
                    </div>

                    {/* Total */}
                    <div className="flex flex-col justify-between">
                      <div>
                        <div className="text-xs text-[rgb(var(--text-muted))] mb-1">ราคารวม</div>
                        <div className="text-lg font-bold text-[rgb(var(--primary))]">
                          {formatCurrency(order.total)}
                        </div>
                      </div>
                      <div className="text-right">
                        <Button variant="ghost" size="sm">
                          ดูรายละเอียด →
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
