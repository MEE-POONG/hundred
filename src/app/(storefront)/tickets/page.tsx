'use client';

import React, { useState, useEffect } from 'react';
import { TicketsProvider, useTickets } from '@/contexts/TicketsContext';
import { ticketTypes, getTicketById } from '@/data/tickets';
import { getProductById } from '@/data/products';
import { TicketType } from '@/data/types';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';

type TabType = 'draw' | 'redeem' | 'vault';

function DrawTabContent() {
  const { drawNewTicket, drawChances } = useTickets();
  const [isSpinning, setIsSpinning] = useState(false);
  const [drawnTicket, setDrawnTicket] = useState<TicketType | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleDraw = async () => {
    if (drawChances <= 0) return;
    setIsSpinning(true);
    // Simulate spin delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const ticket = await drawNewTicket();
    setIsSpinning(false);

    if (ticket) {
      setDrawnTicket(ticket);
      setShowModal(true);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center py-12">
        <div className="mb-8 relative inline-block">
          <div
            className={`inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-[rgb(var(--primary))] to-[rgb(var(--secondary))] ${isSpinning ? 'animate-spin' : ''
              }`}
            style={{
              animationDuration: isSpinning ? '0.8s' : 'unset',
            }}
          >
            <span className="text-6xl">🎫</span>
          </div>
          <div className="absolute -bottom-2 -right-2 bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full">
            <span className="text-sm font-bold text-white">x{drawChances}</span>
          </div>
        </div>
        <h3 className="text-2xl font-bold mb-3">สุ่มตั๋วฟรี</h3>
        <p className="text-[rgb(var(--text-muted))] mb-8 max-w-md mx-auto">
          คุณมีสิทธิ์สุ่ม <strong>{drawChances}</strong> ครั้ง
          <br />
          สุ่มตั๋วไปรังวัลสุ่มทุกวัน ลุ้นตั๋วพิเศษได้รับสินค้าและของรางวัล
        </p>
        <Button
          size="lg"
          onClick={handleDraw}
          disabled={isSpinning || drawChances <= 0}
          className={isSpinning ? 'opacity-70' : ''}
        >
          {isSpinning ? '⏳ กำลังสุ่ม...' : (drawChances > 0 ? '🎲 สุ่มตั๋วเลย' : 'หมดสิทธิ์สุ่ม')}
        </Button>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="lg">
        {drawnTicket && (
          <div className="text-center py-8">
            <div className="mb-6">
              <div
                className="inline-flex items-center justify-center w-24 h-24 rounded-full"
                style={{
                  backgroundColor: drawnTicket.color + '20',
                  border: `3px solid ${drawnTicket.color}`,
                  boxShadow: `0 0 20px ${drawnTicket.glowColor}`,
                }}
              >
                <span className="text-5xl">{drawnTicket.icon}</span>
              </div>
            </div>
            <h3 className="text-3xl font-bold mb-2">{drawnTicket.name}</h3>
            <Badge
              variant="pink"
              className="mb-6 text-lg px-6 py-2"
            >
              {drawnTicket.rarity}
            </Badge>
            <p className="text-[rgb(var(--text-muted))] mb-8">
              ยินดีด้วย! คุณได้รับตั๋ว {drawnTicket.name} แล้ว
            </p>
            <Button onClick={() => setShowModal(false)} fullWidth>
              เก็บไว้ใน Vault
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}

function RedeemTabContent() {
  const { ownedTickets, redeemProduct } = useTickets();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        // Map _id to id and filter redeemable
        const redeemable = data
          .map((p: any) => ({ ...p, id: p._id }))
          .filter((p: any) => p.redeemable && p.redeemable.requiredTickets?.length > 0);
        setProducts(redeemable);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const canRedeemProduct = (product: any) => {
    if (!product.redeemable) return false;
    return product.redeemable.requiredTickets.every((required: { rarity: string; quantity: number }) => {
      const owned = ownedTickets.find(t => t.rarity === required.rarity);
      return owned && owned.quantity >= required.quantity;
    });
  };

  const handleRedeem = async (product: any) => {
    if (!confirm(`ยืนยันการแลกสินค้า ${product.name}?`)) return;

    setProcessingId(product.id);
    const success = await redeemProduct(product.id);
    setProcessingId(null);

    if (success) {
      alert(`แลกสินค้าสำเร็จ! Admin จะทำการตรวจสอบและจัดส่งให้คุณ`);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-[rgb(var(--text-muted))]">กำลังโหลดสินค้าแลกแต้ม...</div>;
  }

  return (
    <div className="space-y-6">
      {products.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="text-4xl mb-3">📭</div>
          <p className="text-[rgb(var(--text-muted))]">ยังไม่มีสินค้าให้แลก</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => {
            const canRedeem = canRedeemProduct(product);
            const isProcessing = processingId === product.id;

            return (
              <Card key={product.id} className="p-6 overflow-hidden">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
                <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                <p className="text-sm text-[rgb(var(--text-muted))] mb-4">
                  {product.shortDescription}
                </p>

                <div className="mb-4 space-y-2">
                  <p className="text-xs text-[rgb(var(--text-muted))] font-semibold">แสดงต้องใช้:</p>
                  {product.redeemable.requiredTickets.map((req: any, idx: number) => {
                    const ticketType = ticketTypes.find(t => t.rarity === req.rarity);
                    const owned = ownedTickets.find(t => t.rarity === req.rarity);
                    const hasEnough = (owned?.quantity || 0) >= req.quantity;

                    return (
                      <div
                        key={idx}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg ${hasEnough
                          ? 'bg-[rgb(var(--success))]/10'
                          : 'bg-[rgb(var(--error))]/10'
                          }`}
                      >
                        <span className="text-lg">{ticketType?.icon}</span>
                        <span className="text-sm">
                          {ticketType?.name}: {owned?.quantity || 0}/{req.quantity}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <Button
                  fullWidth
                  disabled={!canRedeem || isProcessing}
                  onClick={() => handleRedeem(product)}
                >
                  {isProcessing ? 'กำลังดำเนินการ...' : (canRedeem ? '✨ แลกสินค้า' : '🔒 ไม่พอตั๋ว')}
                </Button>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

function VaultTabContent() {
  const { ownedTickets, drawHistory, redemptionHistory } = useTickets();
  const [activeSubTab, setActiveSubTab] = useState<'owned' | 'history'>('owned');

  return (
    <div className="space-y-6">
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveSubTab('owned')}
          className={`px-4 py-2 rounded-full font-semibold transition-all ${activeSubTab === 'owned'
            ? 'bg-gradient-primary text-white glow-pink'
            : 'bg-white/5 text-[rgb(var(--text-muted))] hover:bg-white/10'
            }`}
        >
          ตั๋วของฉัน
        </button>
        <button
          onClick={() => setActiveSubTab('history')}
          className={`px-4 py-2 rounded-full font-semibold transition-all ${activeSubTab === 'history'
            ? 'bg-gradient-primary text-white glow-pink'
            : 'bg-white/5 text-[rgb(var(--text-muted))] hover:bg-white/10'
            }`}
        >
          ประวัติการแลก
        </button>
      </div>

      {activeSubTab === 'owned' ? (
        <div className="space-y-4">
          {ownedTickets.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="text-4xl mb-3">📭</div>
              <p className="text-[rgb(var(--text-muted))]">ยังไม่มีตั๋ว</p>
            </Card>
          ) : (
            ownedTickets.map(ownedTicket => {
              const ticketType = getTicketById(ownedTicket.ticketId);
              if (!ticketType) return null;

              return (
                <div
                  key={ownedTicket.ticketId}
                  style={{
                    borderColor: ticketType.color + '40',
                    borderWidth: '2px',
                  }}
                  className="card-surface rounded-2xl p-6"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
                        style={{
                          backgroundColor: ticketType.color + '20',
                          boxShadow: `0 0 15px ${ticketType.glowColor}`,
                        }}
                      >
                        {ticketType.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{ticketType.name}</h3>
                        <Badge variant="pink">{ticketType.rarity}</Badge>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-[rgb(var(--text-muted))] mb-1">จำนวน</p>
                      <p className="text-3xl font-bold text-[rgb(var(--primary))]">
                        {ownedTicket.quantity}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {drawHistory.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="text-4xl mb-3">📭</div>
              <p className="text-[rgb(var(--text-muted))]">ยังไม่มีประวัติการสุ่ม</p>
            </Card>
          ) : (
            drawHistory.map(entry => {
              const ticketType = ticketTypes.find(t => t.rarity === entry.ticketRarity);
              return (
                <Card key={entry.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{ticketType?.icon}</span>
                      <div>
                        <p className="font-semibold">{entry.ticketName}</p>
                        <p className="text-xs text-[rgb(var(--text-muted))]">
                          {new Date(entry.drawnAt).toLocaleDateString('th-TH', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                    <Badge variant="pink">{entry.ticketRarity}</Badge>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      )}

      {redemptionHistory.length > 0 && activeSubTab === 'owned' && (
        <div className="mt-8 pt-8 border-t border-white/10">
          <h3 className="text-xl font-bold mb-4">ประวัติการแลก</h3>
          <div className="space-y-4">
            {redemptionHistory.map(redemption => (
              <Card key={redemption.id} className="p-4 flex gap-4">
                <img
                  src={redemption.productImage}
                  alt={redemption.productName}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <p className="font-semibold">{redemption.productName}</p>
                  <p className="text-sm text-[rgb(var(--text-muted))]">
                    {new Date(redemption.redeemedAt).toLocaleDateString('th-TH', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <Badge variant={redemption.status === 'completed' ? 'success' : 'info'}>
                    {redemption.status === 'completed' ? 'เสร็จสิ้น' : 'จัดส่งแล้ว'}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TicketsHubContent() {
  const [activeTab, setActiveTab] = useState<TabType>('draw');

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">🎫 Tickets Hub</h1>
        <p className="text-[rgb(var(--text-muted))]">สุ่มตั๋ว แลกสินค้า และจัดการตั๋วของคุณ</p>
      </div>

      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {[
          { id: 'draw', label: '🎲 สุ่มตั๋ว' },
          { id: 'redeem', label: '✨ แลกสินค้า' },
          { id: 'vault', label: '💰 Vault' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`px-6 py-3 rounded-full font-semibold whitespace-nowrap transition-all ${activeTab === tab.id
              ? 'bg-gradient-primary text-white glow-pink'
              : 'bg-white/5 text-[rgb(var(--text-muted))] hover:bg-white/10'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div>
        {activeTab === 'draw' && <DrawTabContent />}
        {activeTab === 'redeem' && <RedeemTabContent />}
        {activeTab === 'vault' && <VaultTabContent />}
      </div>
    </div>
  );
}

export default function TicketsPage() {
  return (
    <TicketsProvider>
      <TicketsHubContent />
    </TicketsProvider>
  );
}
