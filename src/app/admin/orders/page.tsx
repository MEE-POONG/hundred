'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface OrderItem {
  _id: string;
  orderNumber: string;
  items: any[];
  total: number;
  status: string;
  shippingAddress: {
    name: string;
    phone: string;
  };
  createdAt: string;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/admin/orders');
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

  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.shippingAddress?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const statuses = [
    { value: 'all', label: 'ทั้งหมด' },
    { value: 'pending_payment', label: 'รอชำระเงิน' },
    { value: 'paid', label: 'ชำระแล้ว' },
    { value: 'processing', label: 'กำลังประมวลผล' },
    { value: 'shipped', label: 'จัดส่งแล้ว' },
    { value: 'delivered', label: 'ส่งถึงแล้ว' },
    { value: 'cancelled', label: 'ยกเลิก' },
  ];

  const getStatusColor = (status: string) => {
    const map: Record<string, string> = {
      pending_payment: 'bg-yellow-500/20 text-yellow-400',
      paid: 'bg-blue-500/20 text-blue-400',
      processing: 'bg-purple-500/20 text-purple-400',
      shipped: 'bg-cyan-500/20 text-cyan-400',
      delivered: 'bg-green-500/20 text-green-400',
      cancelled: 'bg-red-500/20 text-red-400',
    };
    return map[status] || 'bg-white/10 text-white';
  };

  const getStatusLabel = (status: string) => {
    const map: Record<string, string> = {
      pending_payment: 'รอชำระเงิน',
      paid: 'ชำระแล้ว',
      processing: 'กำลังประมวลผล',
      shipped: 'จัดส่งแล้ว',
      delivered: 'ส่งถึงแล้ว',
      cancelled: 'ยกเลิก',
    };
    return map[status] || status;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-white mb-1">Orders</h1>
        <p className="text-[rgb(var(--text-muted))]">กำลังโหลดข้อมูล...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">Orders</h1>
        <p className="text-[rgb(var(--text-muted))]">จัดการออเดอร์ของร้าน ({orders.length} รายการ)</p>
      </div>

      {/* Search and Filters */}
      <div className="card-surface p-4 space-y-4">
        <input
          type="text"
          placeholder="ค้นหาลำดับการสั่ง หรือชื่อลูกค้า..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 bg-white/5 border border-white/[0.08] rounded-lg text-white placeholder-[rgb(var(--text-muted))] focus:outline-none focus:border-[rgb(var(--primary))]"
        />
        <div className="flex gap-2 overflow-x-auto pb-2">
          {statuses.map(status => (
            <button
              key={status.value}
              onClick={() => setStatusFilter(status.value)}
              className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-colors ${statusFilter === status.value
                ? 'bg-gradient-primary text-white'
                : 'bg-white/5 text-[rgb(var(--text-muted))] hover:bg-white/10'
                }`}
            >
              {status.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="card-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.08] bg-white/[0.02]">
                <th className="text-left py-4 px-6 text-[rgb(var(--text-muted))] font-semibold">ลำดับการสั่ง</th>
                <th className="text-left py-4 px-6 text-[rgb(var(--text-muted))] font-semibold">ลูกค้า</th>
                <th className="text-center py-4 px-6 text-[rgb(var(--text-muted))] font-semibold">ของ</th>
                <th className="text-left py-4 px-6 text-[rgb(var(--text-muted))] font-semibold">วันที่</th>
                <th className="text-left py-4 px-6 text-[rgb(var(--text-muted))] font-semibold">สถานะ</th>
                <th className="text-right py-4 px-6 text-[rgb(var(--text-muted))] font-semibold">ยอดรวม</th>
                <th className="text-center py-4 px-6 text-[rgb(var(--text-muted))] font-semibold">ดำเนิน</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order._id} className="border-b border-white/[0.08] hover:bg-white/[0.03] transition-colors">
                    <td className="py-4 px-6">
                      <Link href={`/admin/orders/${order._id}`} className="font-mono text-sm text-[rgb(var(--primary))] font-semibold">
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium text-white">{order.shippingAddress?.name || '-'}</p>
                        <p className="text-xs text-[rgb(var(--text-muted))]">{order.shippingAddress?.phone || ''}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center text-white">{order.items?.length || 0}</td>
                    <td className="py-4 px-6 text-[rgb(var(--text-muted))]">
                      {new Date(order.createdAt).toLocaleDateString('th-TH')}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusColor(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right text-white font-semibold">
                      ฿{(order.total || 0).toLocaleString('th-TH')}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <Link href={`/admin/orders/${order._id}`} className="text-lg hover:opacity-70 transition-opacity">
                        👁️
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 px-6 text-center text-[rgb(var(--text-muted))]">ไม่พบออเดอร์</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
