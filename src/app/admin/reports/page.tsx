'use client';

import { useState, useEffect } from 'react';

interface ReportData {
  orderStats: {
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
    deliveredOrders: number;
    cancelledOrders: number;
    paidOrders: number;
    shippedOrders: number;
    processingOrders: number;
    pendingOrders: number;
  };
  productStats: {
    totalProducts: number;
    totalStock: number;
    avgRating: string;
    onSaleProducts: number;
    featuredProducts: number;
    avgPrice: number;
    saleProducts: number;
  };
  categories: Record<string, number>;
  ordersForExport: any[];
  productsForExport: any[];
}

export default function AdminReports() {
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/admin/reports');
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error('Failed to fetch report data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleExportCSV = (dataType: string) => {
    if (!data) return;

    let csvContent = 'data:text/csv;charset=utf-8,%EF%BB%BF'; // UTF-8 BOM
    let filename = '';

    if (dataType === 'orders') {
      const headers = ['Order Number', 'Customer', 'Items', 'Total', 'Status', 'Date'];
      csvContent += headers.map(h => `"${h}"`).join(',') + '\n';

      data.ordersForExport.forEach((order) => {
        const row = [
          order.orderNumber,
          order.customer,
          order.items,
          order.total,
          order.status,
          new Date(order.date).toLocaleDateString('th-TH'),
        ];
        csvContent += row.map(cell => `"${cell}"`).join(',') + '\n';
      });
      filename = 'orders_report.csv';
    } else if (dataType === 'products') {
      const headers = ['Product Name', 'Category', 'Price', 'Sale Price', 'Stock', 'Rating', 'Reviews'];
      csvContent += headers.map(h => `"${h}"`).join(',') + '\n';

      data.productsForExport.forEach((product) => {
        const row = [
          product.name,
          product.category,
          product.price,
          product.salePrice || '',
          product.stock,
          product.rating,
          product.reviewCount,
        ];
        csvContent += row.map(cell => `"${cell}"`).join(',') + '\n';
      });
      filename = 'products_report.csv';
    }

    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', filename);
    link.click();
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Reports</h1>
          <p className="text-[rgb(var(--text-muted))]">กำลังโหลดข้อมูล...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2].map(i => (
            <div key={i} className="card-surface p-8 animate-pulse">
              <div className="h-8 bg-white/10 rounded w-1/3 mb-6"></div>
              <div className="space-y-4">
                {[1, 2, 3, 4].map(j => (
                  <div key={j} className="h-6 bg-white/5 rounded"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold text-white">Reports</h1>
        <div className="card-surface p-12 text-center">
          <p className="text-[rgb(var(--text-muted))]">ไม่สามารถโหลดข้อมูลได้</p>
        </div>
      </div>
    );
  }

  const { orderStats, productStats, categories } = data;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">Reports</h1>
        <p className="text-[rgb(var(--text-muted))]">รายงานธุรกิจและการจัดการ (ข้อมูลจริงจากฐานข้อมูล)</p>
      </div>

      {/* Report Cards */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Sales Report */}
        <div className="card-surface p-8">
          <h2 className="text-2xl font-bold text-white mb-6">📊 รายงานการขาย</h2>

          <div className="space-y-4 mb-8">
            <div className="flex justify-between items-center pb-3 border-b border-white/[0.08]">
              <span className="text-[rgb(var(--text-muted))]">ยอดขายรวม</span>
              <span className="text-2xl font-bold text-white">฿{orderStats.totalRevenue.toLocaleString('th-TH')}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-white/[0.08]">
              <span className="text-[rgb(var(--text-muted))]">ออเดอร์ทั้งหมด</span>
              <span className="text-2xl font-bold text-white">{orderStats.totalOrders}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-white/[0.08]">
              <span className="text-[rgb(var(--text-muted))]">ค่าเฉลี่ยต่อออเดอร์</span>
              <span className="text-2xl font-bold text-white">฿{orderStats.averageOrderValue.toLocaleString('th-TH')}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-white/[0.08]">
              <span className="text-[rgb(var(--text-muted))]">ออเดอร์สำเร็จ</span>
              <span className="text-2xl font-bold text-green-400">{orderStats.deliveredOrders}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[rgb(var(--text-muted))]">ออเดอร์ยกเลิก</span>
              <span className="text-2xl font-bold text-red-400">{orderStats.cancelledOrders}</span>
            </div>
          </div>

          <button
            onClick={() => handleExportCSV('orders')}
            className="w-full px-6 py-3 bg-gradient-primary text-white rounded-lg hover:opacity-90 transition-all font-semibold flex items-center justify-center gap-2"
          >
            📥 ดาวน์โหลด Orders CSV
          </button>
        </div>

        {/* Inventory Report */}
        <div className="card-surface p-8">
          <h2 className="text-2xl font-bold text-white mb-6">📦 รายงานสินค้า</h2>

          <div className="space-y-4 mb-8">
            <div className="flex justify-between items-center pb-3 border-b border-white/[0.08]">
              <span className="text-[rgb(var(--text-muted))]">สินค้าทั้งหมด</span>
              <span className="text-2xl font-bold text-white">{productStats.totalProducts}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-white/[0.08]">
              <span className="text-[rgb(var(--text-muted))]">สต็อกรวม</span>
              <span className="text-2xl font-bold text-white">{productStats.totalStock.toLocaleString('th-TH')}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-white/[0.08]">
              <span className="text-[rgb(var(--text-muted))]">คะแนนเฉลี่ย</span>
              <span className="text-2xl font-bold text-yellow-400">⭐ {productStats.avgRating}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-white/[0.08]">
              <span className="text-[rgb(var(--text-muted))]">สินค้าลดราคา</span>
              <span className="text-2xl font-bold text-pink-400">{productStats.onSaleProducts}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[rgb(var(--text-muted))]">สินค้าโดดเด่น</span>
              <span className="text-2xl font-bold text-purple-400">{productStats.featuredProducts}</span>
            </div>
          </div>

          <button
            onClick={() => handleExportCSV('products')}
            className="w-full px-6 py-3 bg-gradient-primary text-white rounded-lg hover:opacity-90 transition-all font-semibold flex items-center justify-center gap-2"
          >
            📥 ดาวน์โหลด Products CSV
          </button>
        </div>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Order Status Distribution */}
        <div className="card-surface p-8">
          <h2 className="text-lg font-bold text-white mb-6">การแจกแจงสถานะออเดอร์</h2>
          <div className="space-y-4">
            {[
              { label: 'ส่งถึงแล้ว', count: orderStats.deliveredOrders, color: 'from-green-500 to-green-600' },
              { label: 'จัดส่งแล้ว', count: orderStats.shippedOrders, color: 'from-cyan-500 to-cyan-600' },
              { label: 'กำลังประมวลผล', count: orderStats.processingOrders, color: 'from-purple-500 to-purple-600' },
              { label: 'ชำระแล้ว', count: orderStats.paidOrders, color: 'from-blue-500 to-blue-600' },
              { label: 'รอชำระเงิน', count: orderStats.pendingOrders, color: 'from-yellow-500 to-yellow-600' },
              { label: 'ยกเลิก', count: orderStats.cancelledOrders, color: 'from-red-500 to-red-600' },
            ].map(({ label, count, color }) => (
              <div key={label}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-[rgb(var(--text-muted))]">{label}</span>
                  <span className="text-sm font-semibold text-white">{count}</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-500`}
                    style={{ width: orderStats.totalOrders > 0 ? `${(count / orderStats.totalOrders) * 100}%` : '0%' }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Categories */}
        <div className="card-surface p-8">
          <h2 className="text-lg font-bold text-white mb-6">สินค้าตามหมวดหมู่</h2>
          <div className="space-y-4">
            {Object.entries(categories).map(([category, count]) => (
              <div key={category}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-[rgb(var(--text-muted))]">{category}</span>
                  <span className="text-sm font-semibold text-white">{count}</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-primary rounded-full transition-all duration-500"
                    style={{ width: productStats.totalProducts > 0 ? `${(count / productStats.totalProducts) * 100}%` : '0%' }}
                  ></div>
                </div>
              </div>
            ))}
            {Object.keys(categories).length === 0 && (
              <p className="text-[rgb(var(--text-muted))] text-sm">ยังไม่มีข้อมูลหมวดหมู่</p>
            )}
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="card-surface p-6 text-center">
          <p className="text-[rgb(var(--text-muted))] text-sm mb-2">อัตราส่วน</p>
          <p className="text-3xl font-bold text-white">
            {orderStats.totalOrders > 0
              ? ((orderStats.deliveredOrders / orderStats.totalOrders) * 100).toFixed(0)
              : 0}%
          </p>
          <p className="text-xs text-[rgb(var(--text-muted))] mt-2">ออเดอร์สำเร็จ</p>
        </div>
        <div className="card-surface p-6 text-center">
          <p className="text-[rgb(var(--text-muted))] text-sm mb-2">สต็อกเฉลี่ย</p>
          <p className="text-3xl font-bold text-white">
            {productStats.totalProducts > 0
              ? (productStats.totalStock / productStats.totalProducts).toFixed(0)
              : 0}
          </p>
          <p className="text-xs text-[rgb(var(--text-muted))] mt-2">ต่อสินค้า</p>
        </div>
        <div className="card-surface p-6 text-center">
          <p className="text-[rgb(var(--text-muted))] text-sm mb-2">ราคาเฉลี่ย</p>
          <p className="text-3xl font-bold text-white">
            ฿{productStats.avgPrice.toLocaleString('th-TH')}
          </p>
          <p className="text-xs text-[rgb(var(--text-muted))] mt-2">ต่อสินค้า</p>
        </div>
        <div className="card-surface p-6 text-center">
          <p className="text-[rgb(var(--text-muted))] text-sm mb-2">ลดราคา</p>
          <p className="text-3xl font-bold text-white">{productStats.saleProducts}</p>
          <p className="text-xs text-[rgb(var(--text-muted))] mt-2">รายการขาย</p>
        </div>
      </div>
    </div>
  );
}
