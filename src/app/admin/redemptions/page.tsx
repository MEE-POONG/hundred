'use client';

import { useState } from 'react';
import { mockRedemptionHistory } from '@/data/tickets';

export default function AdminRedemptions() {
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredRedemptions =
    statusFilter === 'all'
      ? mockRedemptionHistory
      : mockRedemptionHistory.filter(r => r.status === statusFilter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'completed':
        return 'bg-green-500/20 text-green-400';
      case 'shipped':
        return 'bg-blue-500/20 text-blue-400';
      default:
        return 'bg-white/10 text-white';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'รอดำเนินการ';
      case 'completed':
        return 'เสร็จสิ้น';
      case 'shipped':
        return 'จัดส่งแล้ว';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">Redemptions</h1>
        <p className="text-[rgb(var(--text-muted))]">จัดการการแลกตั๋ว</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-surface p-6">
          <div className="text-3xl mb-2">🎁</div>
          <p className="text-[rgb(var(--text-muted))] text-sm mb-1">แลกทั้งหมด</p>
          <p className="text-3xl font-bold text-white">{mockRedemptionHistory.length}</p>
        </div>

        <div className="card-surface p-6">
          <div className="text-3xl mb-2">⏳</div>
          <p className="text-[rgb(var(--text-muted))] text-sm mb-1">รอดำเนินการ</p>
          <p className="text-3xl font-bold text-yellow-400">
            {mockRedemptionHistory.filter(r => r.status === 'pending').length}
          </p>
        </div>

        <div className="card-surface p-6">
          <div className="text-3xl mb-2">✅</div>
          <p className="text-[rgb(var(--text-muted))] text-sm mb-1">สำเร็จแล้ว</p>
          <p className="text-3xl font-bold text-green-400">
            {mockRedemptionHistory.filter(r => r.status === 'completed' || r.status === 'shipped').length}
          </p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 bg-white/5 p-3 rounded-lg border border-white/[0.08]">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-4 py-2 rounded text-sm font-medium transition-all ${
            statusFilter === 'all'
              ? 'bg-gradient-primary text-white'
              : 'text-[rgb(var(--text-muted))] hover:bg-white/10'
          }`}
        >
          ทั้งหมด
        </button>
        <button
          onClick={() => setStatusFilter('pending')}
          className={`px-4 py-2 rounded text-sm font-medium transition-all ${
            statusFilter === 'pending'
              ? 'bg-yellow-500 text-white'
              : 'text-[rgb(var(--text-muted))] hover:bg-white/10'
          }`}
        >
          รอดำเนินการ
        </button>
        <button
          onClick={() => setStatusFilter('completed')}
          className={`px-4 py-2 rounded text-sm font-medium transition-all ${
            statusFilter === 'completed'
              ? 'bg-green-500 text-white'
              : 'text-[rgb(var(--text-muted))] hover:bg-white/10'
          }`}
        >
          เสร็จสิ้น
        </button>
        <button
          onClick={() => setStatusFilter('shipped')}
          className={`px-4 py-2 rounded text-sm font-medium transition-all ${
            statusFilter === 'shipped'
              ? 'bg-blue-500 text-white'
              : 'text-[rgb(var(--text-muted))] hover:bg-white/10'
          }`}
        >
          จัดส่งแล้ว
        </button>
      </div>

      {/* Redemptions List */}
      <div className="space-y-4">
        {filteredRedemptions.length > 0 ? (
          filteredRedemptions.map((redemption) => (
            <div key={redemption.id} className="card-surface p-6">
              <div className="flex gap-6">
                <img
                  src={redemption.productImage}
                  alt={redemption.productName}
                  className="w-24 h-24 rounded object-cover"
                />

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-white">{redemption.productName}</h3>
                      <p className="text-xs text-[rgb(var(--text-muted))] mt-1">ID: {redemption.id}</p>
                    </div>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusColor(redemption.status)}`}>
                      {getStatusLabel(redemption.status)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-[rgb(var(--text-muted))] mb-1">ตั๋วที่ใช้</p>
                      <div className="space-y-1">
                        {redemption.ticketsUsed.map((ticket, idx) => (
                          <p key={idx} className="text-sm text-white">
                            {ticket.rarity} × {ticket.quantity}
                          </p>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-[rgb(var(--text-muted))] mb-1">วันที่แลก</p>
                      <p className="text-sm text-white font-medium">
                        {new Date(redemption.redeemedAt).toLocaleDateString('th-TH')}
                      </p>
                      <p className="text-xs text-[rgb(var(--text-muted))]">
                        {new Date(redemption.redeemedAt).toLocaleTimeString('th-TH')}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-white/5 border border-white/[0.08] rounded-lg text-white hover:bg-white/10 transition-colors font-medium text-sm">
                      ดู
                    </button>
                    {redemption.status === 'pending' && (
                      <>
                        <button className="px-4 py-2 bg-green-500/20 text-green-400 border border-green-500/20 rounded-lg hover:bg-green-500/30 transition-colors font-medium text-sm">
                          อนุมัติ
                        </button>
                        <button className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/30 transition-colors font-medium text-sm">
                          ปฏิเสธ
                        </button>
                      </>
                    )}
                    {redemption.status === 'completed' && (
                      <button className="px-4 py-2 bg-blue-500/20 text-blue-400 border border-blue-500/20 rounded-lg hover:bg-blue-500/30 transition-colors font-medium text-sm">
                        ทำเครื่องหมายว่าจัดส่ง
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="card-surface p-12 text-center">
            <p className="text-[rgb(var(--text-muted))]">ไม่พบการแลกตั๋ว</p>
          </div>
        )}
      </div>
    </div>
  );
}
