'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function AdminOrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [newStatus, setNewStatus] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        if (res.ok) {
          const data = await res.json();
          setOrder(data);
          setNewStatus(data.status);
        }
      } catch (err) {
        console.error('Failed to fetch order:', err);
      } finally {
        setLoading(false);
      }
    };
    if (orderId) fetchOrder();
  }, [orderId]);

  const handleStatusChange = async () => {
    setIsUpdating(true);
    setUpdateMessage('');
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        const updated = await res.json();
        setOrder(updated);
        setUpdateMessage('อัปเดตสถานะสำเร็จ!');
        setTimeout(() => setUpdateMessage(''), 3000);
      } else {
        setUpdateMessage('เกิดข้อผิดพลาดในการอัปเดต');
      }
    } catch (err) {
      setUpdateMessage('เกิดข้อผิดพลาดในการอัปเดต');
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-[rgb(var(--text-muted))]">กำลังโหลดข้อมูล...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold text-white mb-2">ไม่พบออเดอร์</h1>
        <Link href="/admin/orders" className="text-[rgb(var(--primary))] hover:text-[rgb(var(--accent))]">
          ← ย้อนกลับไปยังรายการออเดอร์
        </Link>
      </div>
    );
  }

  const orderTimeline = [
    { status: 'pending_payment', label: 'ออเดอร์สร้าง', date: order.createdAt, completed: true },
    { status: 'paid', label: 'ชำระเงินแล้ว', date: order.paidAt, completed: !!order.paidAt },
    { status: 'processing', label: 'กำลังประมวลผล', date: undefined, completed: ['processing', 'shipped', 'delivered'].includes(order.status) },
    { status: 'shipped', label: 'จัดส่งแล้ว', date: order.shippedAt, completed: ['shipped', 'delivered'].includes(order.status) },
    { status: 'delivered', label: 'ส่งถึงแล้ว', date: order.deliveredAt, completed: order.status === 'delivered' },
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

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <Link href="/admin/orders" className="text-[rgb(var(--text-muted))] hover:text-white mb-4 inline-block">
          ← ย้อนกลับ
        </Link>
        <div className="flex items-center justify-between mt-4">
          <div>
            <h1 className="text-3xl font-bold text-white">ออเดอร์ {order.orderNumber}</h1>
            <p className="text-[rgb(var(--text-muted))] mt-2">
              สร้างเมื่อ {new Date(order.createdAt).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <span className={`text-sm font-semibold px-4 py-2 rounded-full ${getStatusColor(order.status)}`}>
            {getStatusLabel(order.status)}
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="card-surface p-6">
            <h2 className="text-lg font-bold text-white mb-4">สินค้า</h2>
            <div className="space-y-4">
              {order.items?.map((item: any, idx: number) => (
                <div key={idx} className="flex gap-4 pb-4 border-b border-white/[0.08] last:border-0 last:pb-0">
                  <img src={item.productImage} alt={item.productName} className="w-20 h-20 rounded object-cover" />
                  <div className="flex-1">
                    <h3 className="font-medium text-white">{item.productName}</h3>
                    <p className="text-sm text-[rgb(var(--text-muted))] mt-2">
                      ฿{item.salePrice || item.price} × {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-white">
                      ฿{((item.salePrice || item.price) * item.quantity).toLocaleString('th-TH')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="card-surface p-6">
            <h2 className="text-lg font-bold text-white mb-6">ระยะเวลา</h2>
            <div className="space-y-4">
              {orderTimeline.map((step, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-4 h-4 rounded-full border-2 ${step.completed ? 'bg-green-500 border-green-500' : step.status === order.status ? 'bg-yellow-500 border-yellow-500' : 'border-white/20'
                      }`}></div>
                    {idx < orderTimeline.length - 1 && (
                      <div className={`w-0.5 h-12 ${step.completed ? 'bg-green-500' : 'bg-white/10'}`}></div>
                    )}
                  </div>
                  <div className="pb-4 flex-1">
                    <p className="font-medium text-white">{step.label}</p>
                    {step.date && (
                      <p className="text-xs text-[rgb(var(--text-muted))]">
                        {new Date(step.date).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Info */}
          <div className="card-surface p-6">
            <h2 className="text-lg font-bold text-white mb-4">ที่อยู่จัดส่ง</h2>
            <div className="space-y-2 text-[rgb(var(--text-muted))]">
              <p className="font-medium text-white">{order.shippingAddress?.name}</p>
              <p>{order.shippingAddress?.address}</p>
              <p>{order.shippingAddress?.district}, {order.shippingAddress?.province} {order.shippingAddress?.postalCode}</p>
              <p className="font-medium text-white mt-4">โทรศัพท์: {order.shippingAddress?.phone}</p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Summary */}
          <div className="card-surface p-6">
            <h2 className="text-lg font-bold text-white mb-4">สรุปออเดอร์</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-[rgb(var(--text-muted))]">
                <span>ราคาสินค้า</span>
                <span>฿{(order.subtotal || 0).toLocaleString('th-TH')}</span>
              </div>
              <div className="flex justify-between text-[rgb(var(--text-muted))]">
                <span>ค่าจัดส่ง</span>
                <span>฿{(order.shipping || 0).toLocaleString('th-TH')}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-400">
                  <span>ส่วนลด</span>
                  <span>-฿{order.discount.toLocaleString('th-TH')}</span>
                </div>
              )}
              <div className="border-t border-white/[0.08] pt-3 flex justify-between font-bold text-white">
                <span>รวมทั้งสิ้น</span>
                <span>฿{(order.total || 0).toLocaleString('th-TH')}</span>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="card-surface p-6">
            <h2 className="text-lg font-bold text-white mb-4">ชำระเงิน</h2>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-[rgb(var(--text-muted))] mb-1">วิธี</p>
                <p className="font-medium text-white">{order.paymentMethod || '-'}</p>
              </div>
              <div>
                <p className="text-[rgb(var(--text-muted))] mb-1">วิธีจัดส่ง</p>
                <p className="font-medium text-white">{order.shippingMethod || '-'}</p>
              </div>
              {order.trackingNumber && (
                <div>
                  <p className="text-[rgb(var(--text-muted))] mb-1">เลขติดตาม</p>
                  <p className="font-mono font-medium text-white">{order.trackingNumber}</p>
                </div>
              )}
            </div>
          </div>

          {/* Status Change */}
          <div className="card-surface p-6">
            <h2 className="text-lg font-bold text-white mb-4">เปลี่ยนสถานะ</h2>
            <div className="space-y-3">
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-4 py-2 bg-white/5 border border-white/[0.08] rounded-lg text-white focus:outline-none focus:border-[rgb(var(--primary))]"
              >
                <option value="pending_payment" className="bg-[rgb(var(--surface))]">รอชำระเงิน</option>
                <option value="paid" className="bg-[rgb(var(--surface))]">ชำระแล้ว</option>
                <option value="processing" className="bg-[rgb(var(--surface))]">กำลังประมวลผล</option>
                <option value="shipped" className="bg-[rgb(var(--surface))]">จัดส่งแล้ว</option>
                <option value="delivered" className="bg-[rgb(var(--surface))]">ส่งถึงแล้ว</option>
                <option value="cancelled" className="bg-[rgb(var(--surface))]">ยกเลิก</option>
              </select>
              <button
                onClick={handleStatusChange}
                disabled={isUpdating || newStatus === order.status}
                className="w-full px-4 py-2 bg-gradient-primary text-white rounded-lg hover:opacity-90 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdating ? 'กำลังอัปเดต...' : 'อัปเดตสถานะ'}
              </button>
              {updateMessage && (
                <p className={`text-sm text-center ${updateMessage.includes('สำเร็จ') ? 'text-green-400' : 'text-red-400'}`}>
                  {updateMessage}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
