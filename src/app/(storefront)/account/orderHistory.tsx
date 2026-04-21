'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  selectedVariants?: Record<string, string>;
}

export interface Order {
  _id: string;
  orderNumber: string;
  total: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

export const getStatusBadge = (status: string) => {
  switch (status) {
    case 'pending_payment':
      return <span className="px-2 py-1 rounded text-xs font-medium bg-yellow-500/20 text-yellow-500">รอชำระเงิน</span>;
    case 'paid':
      return <span className="px-2 py-1 rounded text-xs font-medium bg-blue-500/20 text-blue-500">ชำระแล้ว</span>;
    case 'processing':
      return <span className="px-2 py-1 rounded text-xs font-medium bg-purple-500/20 text-purple-500">กำลังเตรียมพัสดุ</span>;
    case 'shipped':
      return <span className="px-2 py-1 rounded text-xs font-medium bg-orange-500/20 text-orange-500">กำลังจัดส่ง</span>;
    case 'delivered':
      return <span className="px-2 py-1 rounded text-xs font-medium bg-green-500/20 text-green-500">จัดส่งสำเร็จ</span>;
    case 'cancelled':
      return <span className="px-2 py-1 rounded text-xs font-medium bg-red-500/20 text-red-500">ยกเลิกแล้ว</span>;
    default:
      return <span className="px-2 py-1 rounded text-xs font-medium bg-gray-500/20 text-gray-500">{status}</span>;
  }
};

export default function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/orders');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setOrders(data);
          }
        }
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-6">📦 ประวัติการสั่งซื้อ</h2>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-[rgb(var(--text-muted))]">กำลังโหลดข้อมูล...</p>
        </div>
      ) : orders.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-[rgb(var(--text-muted))]">ยังไม่มีประวัติการสั่งซื้อ</p>
          <Link href="/products" className="text-[rgb(var(--primary))] hover:underline mt-2 inline-block">
            ไปเลือกซื้อสินค้า
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order._id} className="p-6 transition-all hover:bg-white/[0.02]">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                {/* Order Info */}
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-bold text-lg">{order.orderNumber}</span>
                    {getStatusBadge(order.status)}
                  </div>
                  <p className="text-[rgb(var(--text-muted))] text-sm">
                    วันที่: {new Date(order.createdAt).toLocaleDateString('th-TH', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                  <p className="text-[rgb(var(--text-muted))] text-sm">
                    สินค้า: {order.items.length} รายการ
                  </p>
                </div>

                {/* Total & Action */}
                <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-4">
                  <div className="text-right">
                    <p className="text-[rgb(var(--text-muted))] text-xs mb-1">ยอดรวมสุทธิ</p>
                    <p className="text-xl font-bold text-gradient">{order.total.toLocaleString()} บาท</p>
                  </div>
                  <Link href={`/orders/${order._id}`}>
                    <Button size="sm" variant="outline">
                      ดูรายละเอียด
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
