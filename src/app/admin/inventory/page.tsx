'use client';

import { useState } from 'react';
import { products } from '@/data/products';
import { StockMovement } from '@/data/types';

// Mock stock movements
const mockStockMovements: StockMovement[] = [
  {
    id: 'sm1',
    productId: 'p1',
    productName: 'Fat Burn Extreme 3000',
    type: 'in',
    quantity: 50,
    reason: 'Stock In',
    date: '2025-12-22T10:00:00Z',
  },
  {
    id: 'sm2',
    productId: 'p2',
    productName: 'Collagen Plus+ Premium',
    type: 'out',
    quantity: 10,
    reason: 'Sold',
    date: '2025-12-22T14:30:00Z',
  },
  {
    id: 'sm3',
    productId: 'p3',
    productName: 'Mega Multivitamin Complex',
    type: 'out',
    quantity: 5,
    reason: 'Sold',
    date: '2025-12-21T09:15:00Z',
  },
  {
    id: 'sm4',
    productId: 'p5',
    productName: 'Detox Fiber Plus',
    type: 'in',
    quantity: 30,
    reason: 'Stock In',
    date: '2025-12-20T16:00:00Z',
  },
];

export default function AdminInventory() {
  const [filterStock, setFilterStock] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null);
  const [movementType, setMovementType] = useState<'in' | 'out'>('in');
  const [movementQty, setMovementQty] = useState('');
  const [movementReason, setMovementReason] = useState('');

  // Filter products by stock level
  const lowStockProducts = products.filter(p => p.stock < 10);
  const outOfStockProducts = products.filter(p => p.stock === 0);

  const filteredProducts = products.filter(p => {
    if (filterStock === 'low') return p.stock < 10;
    if (filterStock === 'out') return p.stock === 0;
    return true;
  });

  const handleMovement = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProduct && movementQty && movementReason) {
      alert(`บันทึกการเคลื่อนสต็อก: ${selectedProduct.name} - ${movementType === 'in' ? 'นำเข้า' : 'นำออก'} ${movementQty} ชิ้น`);
      setSelectedProduct(null);
      setMovementQty('');
      setMovementReason('');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">Inventory</h1>
        <p className="text-[rgb(var(--text-muted))]">จัดการสต็อกสินค้า</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-surface p-6">
          <div className="text-3xl mb-2">📦</div>
          <p className="text-[rgb(var(--text-muted))] text-sm mb-1">สินค้ารวม</p>
          <p className="text-3xl font-bold text-white">{products.length}</p>
        </div>

        <div className="card-surface p-6 border-yellow-500/30">
          <div className="text-3xl mb-2">⚠️</div>
          <p className="text-[rgb(var(--text-muted))] text-sm mb-1">สต็อกใกล้หมด (&lt;10)</p>
          <p className="text-3xl font-bold text-yellow-400">{lowStockProducts.length}</p>
        </div>

        <div className="card-surface p-6 border-red-500/30">
          <div className="text-3xl mb-2">🔴</div>
          <p className="text-[rgb(var(--text-muted))] text-sm mb-1">หมดสต็อก</p>
          <p className="text-3xl font-bold text-red-400">{outOfStockProducts.length}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Stock List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filter */}
          <div className="flex gap-2 bg-white/5 p-3 rounded-lg border border-white/[0.08]">
            <button
              onClick={() => setFilterStock('all')}
              className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                filterStock === 'all'
                  ? 'bg-gradient-primary text-white'
                  : 'text-[rgb(var(--text-muted))] hover:bg-white/10'
              }`}
            >
              ทั้งหมด
            </button>
            <button
              onClick={() => setFilterStock('low')}
              className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                filterStock === 'low'
                  ? 'bg-yellow-500 text-white'
                  : 'text-[rgb(var(--text-muted))] hover:bg-white/10'
              }`}
            >
              ใกล้หมด
            </button>
            <button
              onClick={() => setFilterStock('out')}
              className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                filterStock === 'out'
                  ? 'bg-red-500 text-white'
                  : 'text-[rgb(var(--text-muted))] hover:bg-white/10'
              }`}
            >
              หมดสต็อก
            </button>
          </div>

          {/* Stock Items */}
          <div className="space-y-3">
            {filteredProducts.map(product => {
              const isLowStock = product.stock < 10;
              const isOutOfStock = product.stock === 0;

              return (
                <div
                  key={product.id}
                  className={`card-surface p-4 flex items-center justify-between hover:border-white/20 transition-all ${
                    isOutOfStock ? 'border-red-500/30' : isLowStock ? 'border-yellow-500/30' : ''
                  }`}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-12 h-12 rounded object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white truncate">{product.name}</p>
                      <p className="text-xs text-[rgb(var(--text-muted))]">{product.id}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-[rgb(var(--text-muted))] text-xs mb-1">สต็อก</p>
                      <p
                        className={`text-2xl font-bold ${
                          isOutOfStock
                            ? 'text-red-400'
                            : isLowStock
                            ? 'text-yellow-400'
                            : 'text-green-400'
                        }`}
                      >
                        {product.stock}
                      </p>
                    </div>

                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="px-4 py-2 bg-white/5 border border-white/[0.08] rounded-lg text-white hover:bg-white/10 transition-colors font-medium text-sm"
                    >
                      เคลื่อนสต็อก
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Movements */}
        <div className="card-surface p-6">
          <h2 className="text-lg font-bold text-white mb-4">การเคลื่อนสต็อกล่าสุด</h2>
          <div className="space-y-3">
            {mockStockMovements.slice(0, 8).map(movement => (
              <div key={movement.id} className="pb-3 border-b border-white/[0.08] last:border-0 last:pb-0">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                      movement.type === 'in' ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  ></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {movement.productName}
                    </p>
                    <p className="text-xs text-[rgb(var(--text-muted))]">
                      {movement.type === 'in' ? 'นำเข้า' : 'นำออก'} {movement.quantity} ชิ้น
                    </p>
                    <p className="text-xs text-[rgb(var(--text-muted))]">
                      {new Date(movement.date).toLocaleDateString('th-TH')}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded whitespace-nowrap ${
                      movement.type === 'in'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {movement.type === 'in' ? '+' : '-'}{movement.quantity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stock Movement Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[rgb(var(--surface))] rounded-xl max-w-md w-full border border-white/[0.08]">
            <div className="p-6 border-b border-white/[0.08] flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">เคลื่อนสต็อก</h2>
              <button
                onClick={() => setSelectedProduct(null)}
                className="p-1 hover:bg-white/10 rounded text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleMovement} className="p-6 space-y-4">
              <div className="text-center mb-4">
                <img
                  src={selectedProduct.images[0]}
                  alt={selectedProduct.name}
                  className="w-20 h-20 rounded mx-auto mb-3 object-cover"
                />
                <p className="font-medium text-white">{selectedProduct.name}</p>
                <p className="text-sm text-[rgb(var(--text-muted))]">สต็อกปัจจุบัน: {selectedProduct.stock}</p>
              </div>

              <div>
                <label className="text-sm text-[rgb(var(--text-muted))] block mb-2">ประเภท</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setMovementType('in')}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      movementType === 'in'
                        ? 'bg-green-500 text-white'
                        : 'bg-white/5 text-[rgb(var(--text-muted))] hover:bg-white/10'
                    }`}
                  >
                    นำเข้า
                  </button>
                  <button
                    type="button"
                    onClick={() => setMovementType('out')}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      movementType === 'out'
                        ? 'bg-red-500 text-white'
                        : 'bg-white/5 text-[rgb(var(--text-muted))] hover:bg-white/10'
                    }`}
                  >
                    นำออก
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm text-[rgb(var(--text-muted))] block mb-2">จำนวน *</label>
                <input
                  type="number"
                  required
                  value={movementQty}
                  onChange={(e) => setMovementQty(e.target.value)}
                  className="w-full px-4 py-2 bg-white/5 border border-white/[0.08] rounded-lg text-white placeholder-[rgb(var(--text-muted))] focus:outline-none focus:border-[rgb(var(--primary))]"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="text-sm text-[rgb(var(--text-muted))] block mb-2">เหตุผล *</label>
                <select
                  required
                  value={movementReason}
                  onChange={(e) => setMovementReason(e.target.value)}
                  className="w-full px-4 py-2 bg-white/5 border border-white/[0.08] rounded-lg text-white focus:outline-none focus:border-[rgb(var(--primary))]"
                >
                  <option value="" className="bg-[rgb(var(--surface))]">เลือกเหตุผล</option>
                  <option value="Stock In" className="bg-[rgb(var(--surface))]">สินค้าเข้า</option>
                  <option value="Sold" className="bg-[rgb(var(--surface))]">ขายออก</option>
                  <option value="Adjustment" className="bg-[rgb(var(--surface))]">ปรับแก้</option>
                  <option value="Damaged" className="bg-[rgb(var(--surface))]">เสียหาย</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="flex-1 px-4 py-2 border border-white/[0.08] rounded-lg text-white hover:bg-white/5 transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-primary text-white rounded-lg hover:opacity-90 transition-all font-semibold"
                >
                  บันทึก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
