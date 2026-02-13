'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface RedemptionItem {
  _id: string;
  user?: { name: string; email: string; image?: string };
  productName: string;
  productImage: string;
  ticketsUsed: { rarity: string; quantity: number }[];
  status: 'pending' | 'approved' | 'rejected' | 'shipped' | 'completed';
  shippingAddress?: { name: string; phone: string; address: string };
  trackingNumber?: string;
  rejectedReason?: string;
  createdAt: string;
}

export default function AdminRedemptions() {
  const [redemptions, setRedemptions] = useState<RedemptionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchRedemptions = async () => {
    try {
      const res = await fetch('/api/admin/redemptions', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setRedemptions(data);
      }
    } catch (err) {
      console.error('Error fetching redemptions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRedemptions();
  }, []);

  const handleStatusUpdate = async (id: string, status: string, extra?: any) => {
    console.log('Attemping to update ID:', id); // Debug log
    if (!id) {
      alert('Error: ID is missing');
      return;
    }
    setActionLoading(id);
    try {
      const res = await fetch(`/api/admin/redemptions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, ...extra }),
      });
      if (res.ok) {
        setSuccessMsg(`อัปเดตสถานะเป็น "${getStatusLabel(status)}" สำเร็จ!`);
        setTimeout(() => setSuccessMsg(''), 3000);
        fetchRedemptions();
      } else {
        const err = await res.json();
        alert(err.error || 'เกิดข้อผิดพลาด');
      }
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการอัปเดต');
    } finally {
      setActionLoading(null);
    }
  };

  const filteredRedemptions = statusFilter === 'all'
    ? redemptions
    : redemptions.filter(r => r.status === statusFilter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400';
      case 'approved': return 'bg-blue-500/20 text-blue-400';
      case 'rejected': return 'bg-red-500/20 text-red-400';
      case 'shipped': return 'bg-cyan-500/20 text-cyan-400';
      case 'completed': return 'bg-green-500/20 text-green-400';
      default: return 'bg-white/10 text-white';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'รอดำเนินการ';
      case 'approved': return 'อนุมัติแล้ว';
      case 'rejected': return 'ปฏิเสธ';
      case 'shipped': return 'จัดส่งแล้ว';
      case 'completed': return 'เสร็จสิ้น';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-white mb-1">Redemptions</h1>
        <p className="text-[rgb(var(--text-muted))]">กำลังโหลดข้อมูล...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">Redemptions</h1>
        <p className="text-[rgb(var(--text-muted))]">จัดการการแลกตั๋ว</p>
      </div>

      {successMsg && (
        <div className="p-4 bg-green-500/20 text-green-400 rounded-lg border border-green-500/30">
          ✅ {successMsg}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card-surface p-6">
          <div className="text-3xl mb-2">🎁</div>
          <p className="text-[rgb(var(--text-muted))] text-sm mb-1">แลกทั้งหมด</p>
          <p className="text-3xl font-bold text-white">{redemptions.length}</p>
        </div>
        <div className="card-surface p-6">
          <div className="text-3xl mb-2">⏳</div>
          <p className="text-[rgb(var(--text-muted))] text-sm mb-1">รอดำเนินการ</p>
          <p className="text-3xl font-bold text-yellow-400">{redemptions.filter(r => r.status === 'pending').length}</p>
        </div>
        <div className="card-surface p-6">
          <div className="text-3xl mb-2">🚚</div>
          <p className="text-[rgb(var(--text-muted))] text-sm mb-1">กำลังจัดส่ง</p>
          <p className="text-3xl font-bold text-cyan-400">{redemptions.filter(r => r.status === 'shipped').length}</p>
        </div>
        <div className="card-surface p-6">
          <div className="text-3xl mb-2">✅</div>
          <p className="text-[rgb(var(--text-muted))] text-sm mb-1">สำเร็จแล้ว</p>
          <p className="text-3xl font-bold text-green-400">{redemptions.filter(r => r.status === 'completed').length}</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 bg-white/5 p-3 rounded-lg border border-white/[0.08] flex-wrap">
        {[
          { key: 'all', label: 'ทั้งหมด' },
          { key: 'pending', label: 'รอดำเนินการ' },
          { key: 'approved', label: 'อนุมัติแล้ว' },
          { key: 'shipped', label: 'จัดส่งแล้ว' },
          { key: 'completed', label: 'เสร็จสิ้น' },
          { key: 'rejected', label: 'ปฏิเสธ' },
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setStatusFilter(f.key)}
            className={`px-4 py-2 rounded text-sm font-medium transition-all ${statusFilter === f.key
              ? 'bg-gradient-primary text-white'
              : 'text-[rgb(var(--text-muted))] hover:bg-white/10'
              }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Redemptions List */}
      <div className="space-y-4">
        {filteredRedemptions.length > 0 ? (
          filteredRedemptions.map((redemption) => (
            <div key={redemption._id} className="card-surface p-6">
              <div className="flex gap-6">
                <img
                  src={redemption.productImage || '/placeholder.png'}
                  alt={redemption.productName}
                  className="w-24 h-24 rounded object-cover flex-shrink-0"
                />

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-white">{redemption.productName}</h3>
                      <p className="text-xs text-[rgb(var(--text-muted))] mt-1">
                        โดย: {redemption.user?.name || redemption.user?.email || 'N/A'}
                      </p>
                    </div>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusColor(redemption.status)}`}>
                      {getStatusLabel(redemption.status)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-[rgb(var(--text-muted))] mb-1">ตั๋วที่ใช้</p>
                      <div className="space-y-1">
                        {redemption.ticketsUsed?.map((ticket, idx) => (
                          <p key={idx} className="text-sm text-white">
                            {ticket.rarity} × {ticket.quantity}
                          </p>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-[rgb(var(--text-muted))] mb-1">วันที่แลก</p>
                      <p className="text-sm text-white font-medium">
                        {new Date(redemption.createdAt).toLocaleDateString('th-TH')}
                      </p>
                      <p className="text-xs text-[rgb(var(--text-muted))]">
                        {new Date(redemption.createdAt).toLocaleTimeString('th-TH')}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 flex-wrap">
                    <Link
                      href={`/admin/redemptions/${redemption._id}`}
                      className="px-4 py-2 bg-white/5 border border-white/[0.08] rounded-lg text-white hover:bg-white/10 transition-colors font-medium text-sm inline-flex items-center"
                    >
                      👁️ ดูรายละเอียด
                    </Link>

                    {redemption.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleStatusUpdate(redemption._id, 'approved')}
                          disabled={actionLoading === redemption._id}
                          className="px-4 py-2 bg-green-500/20 text-green-400 border border-green-500/20 rounded-lg hover:bg-green-500/30 transition-colors font-medium text-sm disabled:opacity-50"
                        >
                          {actionLoading === redemption._id ? '...' : '✅ อนุมัติ'}
                        </button>
                        <button
                          onClick={() => {
                            const reason = prompt('เหตุผลที่ปฏิเสธ:');
                            if (reason !== null) {
                              handleStatusUpdate(redemption._id, 'rejected', { rejectedReason: reason });
                            }
                          }}
                          disabled={actionLoading === redemption._id}
                          className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/30 transition-colors font-medium text-sm disabled:opacity-50"
                        >
                          ❌ ปฏิเสธ
                        </button>
                      </>
                    )}

                    {redemption.status === 'approved' && (
                      <Link
                        href={`/admin/redemptions/${redemption._id}`}
                        className="px-4 py-2 bg-blue-500/20 text-blue-400 border border-blue-500/20 rounded-lg hover:bg-blue-500/30 transition-colors font-medium text-sm inline-flex items-center"
                      >
                        🚚 ไปจัดส่ง
                      </Link>
                    )}

                    {redemption.status === 'shipped' && (
                      <button
                        onClick={() => handleStatusUpdate(redemption._id, 'completed')}
                        disabled={actionLoading === redemption._id}
                        className="px-4 py-2 bg-green-500/20 text-green-400 border border-green-500/20 rounded-lg hover:bg-green-500/30 transition-colors font-medium text-sm disabled:opacity-50"
                      >
                        🎉 เสร็จสิ้น
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="card-surface p-12 text-center">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-[rgb(var(--text-muted))]">ไม่พบการแลกตั๋ว</p>
          </div>
        )}
      </div>
    </div>
  );
}
