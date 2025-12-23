'use client';

import { mockOrders } from '@/data/orders';
import { products } from '@/data/products';

export default function AdminReports() {
  const handleExportCSV = (dataType: string) => {
    let csvContent = '';
    let filename = '';

    if (dataType === 'orders') {
      // Generate Orders CSV
      csvContent = 'data:text/csv;charset=utf-8,%EF%BB%BF'; // UTF-8 BOM
      const headers = ['Order Number', 'Customer', 'Items', 'Total', 'Status', 'Date'];
      csvContent += headers.map(h => `"${h}"`).join(',') + '\n';

      mockOrders.forEach(order => {
        const row = [
          order.orderNumber,
          order.shippingAddress.name,
          order.items.length,
          order.total,
          order.status,
          new Date(order.createdAt).toLocaleDateString('th-TH'),
        ];
        csvContent += row.map(cell => `"${cell}"`).join(',') + '\n';
      });

      filename = 'orders_report.csv';
    } else if (dataType === 'products') {
      // Generate Products CSV
      csvContent = 'data:text/csv;charset=utf-8,%EF%BB%BF'; // UTF-8 BOM
      const headers = ['Product Name', 'Category', 'Price', 'Sale Price', 'Stock', 'Rating', 'Reviews'];
      csvContent += headers.map(h => `"${h}"`).join(',') + '\n';

      products.forEach(product => {
        const row = [
          product.name,
          product.categoryName,
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

  // Calculate statistics
  const totalRevenue = mockOrders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = mockOrders.length;
  const averageOrderValue = Math.round(totalRevenue / totalOrders);
  const deliveredOrders = mockOrders.filter(o => o.status === 'delivered').length;
  const cancelledOrders = mockOrders.filter(o => o.status === 'cancelled').length;

  const totalProducts = products.length;
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
  const avgRating = (products.reduce((sum, p) => sum + p.rating, 0) / products.length).toFixed(1);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">Reports</h1>
        <p className="text-[rgb(var(--text-muted))]">รายงานธุรกิจและการจัดการ</p>
      </div>

      {/* Report Cards */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Sales Report */}
        <div className="card-surface p-8">
          <h2 className="text-2xl font-bold text-white mb-6">📊 รายงานการขาย</h2>

          <div className="space-y-4 mb-8">
            <div className="flex justify-between items-center pb-3 border-b border-white/[0.08]">
              <span className="text-[rgb(var(--text-muted))]">ยอดขายรวม</span>
              <span className="text-2xl font-bold text-white">฿{totalRevenue.toLocaleString('th-TH')}</span>
            </div>

            <div className="flex justify-between items-center pb-3 border-b border-white/[0.08]">
              <span className="text-[rgb(var(--text-muted))]">ออเดอร์ทั้งหมด</span>
              <span className="text-2xl font-bold text-white">{totalOrders}</span>
            </div>

            <div className="flex justify-between items-center pb-3 border-b border-white/[0.08]">
              <span className="text-[rgb(var(--text-muted))]">ค่าเฉลี่ยต่อออเดอร์</span>
              <span className="text-2xl font-bold text-white">฿{averageOrderValue.toLocaleString('th-TH')}</span>
            </div>

            <div className="flex justify-between items-center pb-3 border-b border-white/[0.08]">
              <span className="text-[rgb(var(--text-muted))]">ออเดอร์สำเร็จ</span>
              <span className="text-2xl font-bold text-green-400">{deliveredOrders}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[rgb(var(--text-muted))]">ออเดอร์ยกเลิก</span>
              <span className="text-2xl font-bold text-red-400">{cancelledOrders}</span>
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
              <span className="text-2xl font-bold text-white">{totalProducts}</span>
            </div>

            <div className="flex justify-between items-center pb-3 border-b border-white/[0.08]">
              <span className="text-[rgb(var(--text-muted))]">สต็อกรวม</span>
              <span className="text-2xl font-bold text-white">{totalStock.toLocaleString('th-TH')}</span>
            </div>

            <div className="flex justify-between items-center pb-3 border-b border-white/[0.08]">
              <span className="text-[rgb(var(--text-muted))]">คะแนนเฉลี่ย</span>
              <span className="text-2xl font-bold text-yellow-400">⭐ {avgRating}</span>
            </div>

            <div className="flex justify-between items-center pb-3 border-b border-white/[0.08]">
              <span className="text-[rgb(var(--text-muted))]">สินค้าขายดี</span>
              <span className="text-2xl font-bold text-pink-400">{products.filter(p => p.isOnSale).length}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[rgb(var(--text-muted))]">สินค้าโดดเด่น</span>
              <span className="text-2xl font-bold text-purple-400">{products.filter(p => p.isFeatured).length}</span>
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
            {Object.entries({
              'ส่งถึงแล้ว': mockOrders.filter(o => o.status === 'delivered').length,
              'จัดส่งแล้ว': mockOrders.filter(o => o.status === 'shipped').length,
              'กำลังประมวลผล': mockOrders.filter(o => o.status === 'processing').length,
              'ชำระแล้ว': mockOrders.filter(o => o.status === 'paid').length,
              'รอชำระเงิน': mockOrders.filter(o => o.status === 'pending_payment').length,
              'ยกเลิก': mockOrders.filter(o => o.status === 'cancelled').length,
            }).map(([label, count]) => (
              <div key={label}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-[rgb(var(--text-muted))]">{label}</span>
                  <span className="text-sm font-semibold text-white">{count}</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-primary"
                    style={{ width: `${(count / totalOrders) * 100}%` }}
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
            {Object.entries(
              products.reduce((acc, p) => {
                acc[p.categoryName] = (acc[p.categoryName] || 0) + 1;
                return acc;
              }, {} as Record<string, number>)
            ).map(([category, count]) => (
              <div key={category}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-[rgb(var(--text-muted))]">{category}</span>
                  <span className="text-sm font-semibold text-white">{count}</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-primary"
                    style={{ width: `${(count / totalProducts) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="card-surface p-6 text-center">
          <p className="text-[rgb(var(--text-muted))] text-sm mb-2">อัตราส่วน</p>
          <p className="text-3xl font-bold text-white">
            {((deliveredOrders / totalOrders) * 100).toFixed(0)}%
          </p>
          <p className="text-xs text-[rgb(var(--text-muted))] mt-2">ออเดอร์สำเร็จ</p>
        </div>

        <div className="card-surface p-6 text-center">
          <p className="text-[rgb(var(--text-muted))] text-sm mb-2">สต็อกเฉลี่ย</p>
          <p className="text-3xl font-bold text-white">
            {(totalStock / totalProducts).toFixed(0)}
          </p>
          <p className="text-xs text-[rgb(var(--text-muted))] mt-2">ต่อสินค้า</p>
        </div>

        <div className="card-surface p-6 text-center">
          <p className="text-[rgb(var(--text-muted))] text-sm mb-2">ราคาเฉลี่ย</p>
          <p className="text-3xl font-bold text-white">
            ฿{(products.reduce((sum, p) => sum + p.price, 0) / totalProducts).toLocaleString('th-TH', {
              maximumFractionDigits: 0,
            })}
          </p>
          <p className="text-xs text-[rgb(var(--text-muted))] mt-2">ต่อสินค้า</p>
        </div>

        <div className="card-surface p-6 text-center">
          <p className="text-[rgb(var(--text-muted))] text-sm mb-2">ขาดทุน</p>
          <p className="text-3xl font-bold text-white">
            {products.filter(p => p.salePrice && p.salePrice < p.price).length}
          </p>
          <p className="text-xs text-[rgb(var(--text-muted))] mt-2">รายการขาย</p>
        </div>
      </div>
    </div>
  );
}
