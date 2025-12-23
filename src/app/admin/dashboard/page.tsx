'use client';

import { mockOrders } from '@/data/orders';
import { products } from '@/data/products';

export default function AdminDashboard() {
  // Calculate stats
  const totalRevenue = mockOrders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = mockOrders.length;
  const lowStockProducts = products.filter(p => p.stock < 10).length;
  const averageOrderValue = Math.round(totalRevenue / totalOrders);

  const stats = [
    {
      label: 'ยอดขายรวม',
      value: `฿${totalRevenue.toLocaleString('th-TH')}`,
      change: 12.5,
      trend: 'up',
      icon: '💰',
      color: 'from-pink-500 to-rose-500',
    },
    {
      label: 'ออเดอร์ทั้งหมด',
      value: totalOrders,
      change: 8.3,
      trend: 'up',
      icon: '📦',
      color: 'from-purple-500 to-pink-500',
    },
    {
      label: 'สต็อกใกล้หมด',
      value: lowStockProducts,
      change: -25,
      trend: 'down',
      icon: '⚠️',
      color: 'from-orange-500 to-red-500',
    },
    {
      label: 'ค่าเฉลี่ยต่อออเดอร์',
      value: `฿${averageOrderValue.toLocaleString('th-TH')}`,
      change: 5.2,
      trend: 'up',
      icon: '📈',
      color: 'from-green-500 to-emerald-500',
    },
  ];

  // Order status distribution
  const ordersByStatus = {
    pending_payment: mockOrders.filter(o => o.status === 'pending_payment').length,
    paid: mockOrders.filter(o => o.status === 'paid').length,
    processing: mockOrders.filter(o => o.status === 'processing').length,
    shipped: mockOrders.filter(o => o.status === 'shipped').length,
    delivered: mockOrders.filter(o => o.status === 'delivered').length,
    cancelled: mockOrders.filter(o => o.status === 'cancelled').length,
  };

  const maxCount = Math.max(...Object.values(ordersByStatus));

  // Recent orders
  const recentOrders = mockOrders.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-[rgb(var(--text-muted))]">ยินดีต้อนรับกลับมา ผู้ดูแลระบบ</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="card-surface p-6 hover:border-white/20 transition-all hover:shadow-lg"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="text-3xl">{stat.icon}</div>
              <span
                className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  stat.trend === 'up'
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-red-500/20 text-red-400'
                }`}
              >
                {stat.trend === 'up' ? '↑' : '↓'} {Math.abs(stat.change)}%
              </span>
            </div>
            <p className="text-[rgb(var(--text-muted))] text-sm mb-2">{stat.label}</p>
            <p className="text-3xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Orders by Status Chart */}
        <div className="lg:col-span-2 card-surface p-6">
          <h2 className="text-xl font-bold text-white mb-6">สถานะออเดอร์</h2>
          <div className="space-y-4">
            {Object.entries(ordersByStatus).map(([status, count]) => {
              const percentage = (count / totalOrders) * 100;
              const statusLabels: Record<string, string> = {
                pending_payment: 'รอการชำระเงิน',
                paid: 'ชำระแล้ว',
                processing: 'กำลังประมวลผล',
                shipped: 'จัดส่งแล้ว',
                delivered: 'ส่งถึงปลายทาง',
                cancelled: 'ยกเลิก',
              };

              const statusColors: Record<string, string> = {
                pending_payment: 'bg-yellow-500',
                paid: 'bg-blue-500',
                processing: 'bg-purple-500',
                shipped: 'bg-cyan-500',
                delivered: 'bg-green-500',
                cancelled: 'bg-red-500',
              };

              return (
                <div key={status}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-[rgb(var(--text-muted))]">
                      {statusLabels[status]}
                    </span>
                    <span className="text-sm font-semibold text-white">{count} ({percentage.toFixed(0)}%)</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${statusColors[status]}`}
                      style={{ width: `${(count / maxCount) * 100}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Products */}
        <div className="card-surface p-6">
          <h2 className="text-xl font-bold text-white mb-6">สินค้าขายดี</h2>
          <div className="space-y-4">
            {products.slice(0, 5).map((product) => (
              <div key={product.id} className="flex items-start gap-3 pb-4 border-b border-white/[0.08] last:pb-0 last:border-0">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-10 h-10 rounded object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{product.name}</p>
                  <p className="text-xs text-[rgb(var(--text-muted))]">
                    ฿{product.salePrice || product.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="card-surface p-6">
        <h2 className="text-xl font-bold text-white mb-6">ออเดอร์ล่าสุด</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.08]">
                <th className="text-left py-3 px-4 text-[rgb(var(--text-muted))] font-semibold">ลำดับการสั่ง</th>
                <th className="text-left py-3 px-4 text-[rgb(var(--text-muted))] font-semibold">ลูกค้า</th>
                <th className="text-left py-3 px-4 text-[rgb(var(--text-muted))] font-semibold">จำนวน</th>
                <th className="text-left py-3 px-4 text-[rgb(var(--text-muted))] font-semibold">สถานะ</th>
                <th className="text-right py-3 px-4 text-[rgb(var(--text-muted))] font-semibold">ยอดรวม</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-white/[0.08] hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 text-white font-mono text-xs">{order.orderNumber}</td>
                  <td className="py-3 px-4">
                    <p className="text-white text-sm">{order.shippingAddress.name}</p>
                    <p className="text-xs text-[rgb(var(--text-muted))]">{order.shippingAddress.phone}</p>
                  </td>
                  <td className="py-3 px-4 text-white">{order.items.length}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        order.status === 'delivered'
                          ? 'bg-green-500/20 text-green-400'
                          : order.status === 'shipped'
                          ? 'bg-blue-500/20 text-blue-400'
                          : order.status === 'processing'
                          ? 'bg-purple-500/20 text-purple-400'
                          : order.status === 'paid'
                          ? 'bg-cyan-500/20 text-cyan-400'
                          : order.status === 'cancelled'
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}
                    >
                      {order.status === 'pending_payment'
                        ? 'รอชำระเงิน'
                        : order.status === 'paid'
                        ? 'ชำระแล้ว'
                        : order.status === 'processing'
                        ? 'กำลังประมวลผล'
                        : order.status === 'shipped'
                        ? 'จัดส่งแล้ว'
                        : order.status === 'delivered'
                        ? 'ส่งถึงแล้ว'
                        : 'ยกเลิก'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right text-white font-semibold">
                    ฿{order.total.toLocaleString('th-TH')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
