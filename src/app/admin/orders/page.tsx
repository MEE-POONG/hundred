'use client';

import { useState } from 'react';
import { mockOrders } from '@/data/orders';
import Link from 'next/link';

export default function AdminOrders() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOrders = mockOrders.filter(order => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.shippingAddress.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const statuses = [
    { value: 'all', label: 'ทั้งหมด', color: 'bg-white/10' },
    { value: 'pending_payment', label: 'รอชำระเงิน', color: 'bg-yellow-500/20' },
    { value: 'paid', label: 'ชำระแล้ว', color: 'bg-blue-500/20' },
    { value: 'processing', label: 'กำลังประมวลผล', color: 'bg-purple-500/20' },
    { value: 'shipped', label: 'จัดส่งแล้ว', color: 'bg-cyan-500/20' },
    { value: 'delivered', label: 'ส่งถึงแล้ว', color: 'bg-green-500/20' },
    { value: 'cancelled', label: 'ยกเลิก', color: 'bg-red-500/20' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending_payment':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'paid':
        return 'bg-blue-500/20 text-blue-400';
      case 'processing':
        return 'bg-purple-500/20 text-purple-400';
      case 'shipped':
        return 'bg-cyan-500/20 text-cyan-400';
      case 'delivered':
        return 'bg-green-500/20 text-green-400';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-white/10 text-white';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending_payment':
        return 'รอชำระเงิน';
      case 'paid':
        return 'ชำระแล้ว';
      case 'processing':
        return 'กำลังประมวลผล';
      case 'shipped':
        return 'จัดส่งแล้ว';
      case 'delivered':
        return 'ส่งถึงแล้ว';
      case 'cancelled':
        return 'ยกเลิก';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">Orders</h1>
        <p className="text-[rgb(var(--text-muted))]">จัดการออเดอร์ของร้าน</p>
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
              className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === status.value
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
                  <tr key={order.id} className="border-b border-white/[0.08] hover:bg-white/[0.03] transition-colors">
                    <td className="py-4 px-6">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="font-mono text-sm text-[rgb(var(--primary))] hover:text-[rgb(var(--primary))] font-semibold"
                      >
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium text-white">{order.shippingAddress.name}</p>
                        <p className="text-xs text-[rgb(var(--text-muted))]">{order.shippingAddress.phone}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center text-white">{order.items.length}</td>
                    <td className="py-4 px-6 text-[rgb(var(--text-muted))]">
                      {new Date(order.createdAt).toLocaleDateString('th-TH')}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusColor(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right text-white font-semibold">
                      ฿{order.total.toLocaleString('th-TH')}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-lg hover:opacity-70 transition-opacity"
                      >
                        👁️
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 px-6 text-center text-[rgb(var(--text-muted))]">
                    ไม่พบออเดอร์
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
