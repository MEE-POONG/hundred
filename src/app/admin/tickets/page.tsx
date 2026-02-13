'use client';

import { useState, useEffect } from 'react';

// --- Interfaces ---
interface TicketType {
  _id: string;
  name: string;
  rarity: string;
  probability: number;
  icon: string;
  color: string;
  glowColor: string;
  description?: string;
}

interface RewardItem {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  type: string;
  rarity: string;
  probability: number;
  stock: number;
  isRedeemable: boolean;
  ticketCost: Record<string, number>;
  isActive: boolean;
}

export default function AdminTicketsAndRewards() {
  const [activeTab, setActiveTab] = useState<'tickets' | 'rewards'>('tickets');

  // --- Ticket State ---
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [isEditingTicket, setIsEditingTicket] = useState(false);
  const [currentTicket, setCurrentTicket] = useState<TicketType | null>(null);
  const [ticketForm, setTicketForm] = useState({
    name: '', rarity: 'Common', probability: 0, icon: '🎫',
    color: '#CD7F32', glowColor: 'rgba(205, 127, 50, 0.5)', description: '',
  });

  // --- Reward State ---
  const [rewards, setRewards] = useState<RewardItem[]>([]);
  const [loadingRewards, setLoadingRewards] = useState(true);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [selectedReward, setSelectedReward] = useState<RewardItem | null>(null);
  const [savingReward, setSavingReward] = useState(false);
  const [rewardForm, setRewardForm] = useState({
    name: '', description: '', image: '', type: 'physical', rarity: 'common',
    probability: 0, stock: 0, isRedeemable: false,
    ticketCostCommon: 0, ticketCostRare: 0, ticketCostEpic: 0, ticketCostLegendary: 0,
    isActive: true,
  });

  // --- Initial Fetch ---
  useEffect(() => {
    fetchTickets();
    fetchRewards();
  }, []);

  // --- Fetch Functions ---
  const fetchTickets = async () => {
    try {
      const res = await fetch('/api/admin/ticket-types');
      if (res.ok) setTickets(await res.json());
    } catch (e) { console.error(e); } finally { setLoadingTickets(false); }
  };

  const fetchRewards = async () => {
    try {
      const res = await fetch('/api/admin/rewards');
      if (res.ok) setRewards(await res.json());
    } catch (e) { console.error(e); } finally { setLoadingRewards(false); }
  };

  // --- Helpers ---
  const totalTicketProb = tickets.reduce((sum, t) => sum + t.probability, 0);

  // --- Ticket Handlers ---
  const handleTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = isEditingTicket && currentTicket ? `/api/admin/ticket-types/${currentTicket._id}` : '/api/admin/ticket-types';
      const method = isEditingTicket ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(ticketForm),
      });
      if (res.ok) {
        setShowTicketModal(false); fetchTickets();
        setTicketForm({ name: '', rarity: 'Common', probability: 0, icon: '🎫', color: '#CD7F32', glowColor: 'rgba(205, 127, 50, 0.5)', description: '' });
      } else { alert('Failed to save ticket'); }
    } catch (e) { alert('Error saving ticket'); }
  };

  const handleEditTicket = (ticket: TicketType) => {
    setCurrentTicket(ticket);
    setTicketForm({
      name: ticket.name, rarity: ticket.rarity, probability: ticket.probability,
      icon: ticket.icon, color: ticket.color, glowColor: ticket.glowColor, description: ticket.description || ''
    });
    setIsEditingTicket(true); setShowTicketModal(true);
  };

  const handleDeleteTicket = async (id: string) => {
    if (!confirm('Delete this ticket type?')) return;
    await fetch(`/api/admin/ticket-types/${id}`, { method: 'DELETE' });
    fetchTickets();
  };

  // --- Reward Handlers ---
  const handleRewardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingReward(true);
    const payload = {
      ...rewardForm,
      ticketCost: {
        common: Number(rewardForm.ticketCostCommon),
        rare: Number(rewardForm.ticketCostRare),
        epic: Number(rewardForm.ticketCostEpic),
        legendary: Number(rewardForm.ticketCostLegendary),
      },
    };
    try {
      const method = selectedReward ? 'PUT' : 'POST';
      const url = selectedReward ? `/api/admin/rewards/${selectedReward._id}` : '/api/admin/rewards';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (res.ok) { setShowRewardModal(false); fetchRewards(); }
      else { alert('Failed to save reward'); }
    } catch (e) { alert('Error saving reward'); }
    finally { setSavingReward(false); }
  };

  const openRewardModal = (reward?: RewardItem) => {
    if (reward) {
      setSelectedReward(reward);
      setRewardForm({
        name: reward.name, description: reward.description || '', image: reward.image || '',
        type: reward.type, rarity: reward.rarity, probability: reward.probability,
        stock: reward.stock, isRedeemable: reward.isRedeemable, isActive: reward.isActive,
        ticketCostCommon: reward.ticketCost?.common || 0,
        ticketCostRare: reward.ticketCost?.rare || 0,
        ticketCostEpic: reward.ticketCost?.epic || 0,
        ticketCostLegendary: reward.ticketCost?.legendary || 0,
      });
    } else {
      setSelectedReward(null);
      setRewardForm({
        name: '', description: '', image: '', type: 'physical', rarity: 'common',
        probability: 0, stock: 0, isRedeemable: false, isActive: true,
        ticketCostCommon: 0, ticketCostRare: 0, ticketCostEpic: 0, ticketCostLegendary: 0,
      });
    }
    setShowRewardModal(true);
  };

  const handleDeleteReward = async (id: string) => {
    if (!confirm('Delete this reward?')) return;
    await fetch(`/api/admin/rewards/${id}`, { method: 'DELETE' });
    fetchRewards();
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'common': return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
      case 'rare': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'epic': return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
      case 'legendary': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      default: return 'text-white';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Tickets & Rewards Management</h1>
          <p className="text-[rgb(var(--text-muted))]">จัดการระบบตั๋ว (Gacha Rates) และของรางวัล (Shop Items)</p>
        </div>
        <div className="flex bg-white/5 p-1 rounded-lg border border-white/10">
          <button
            onClick={() => setActiveTab('tickets')}
            className={`px-4 py-2 rounded-md transition-all font-medium ${activeTab === 'tickets' ? 'bg-[rgb(var(--primary))] text-white shadow-lg' : 'text-[rgb(var(--text-muted))] hover:text-white'}`}
          >
            🎟️ Ticket Rates
          </button>
          <button
            onClick={() => setActiveTab('rewards')}
            className={`px-4 py-2 rounded-md transition-all font-medium ${activeTab === 'rewards' ? 'bg-[rgb(var(--primary))] text-white shadow-lg' : 'text-[rgb(var(--text-muted))] hover:text-white'}`}
          >
            💎 Rewards Shop
          </button>
        </div>
      </div>

      {/* === TICKETS TAB === */}
      {activeTab === 'tickets' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">Ticket Configurations & Drop Rates</h2>
            <button onClick={() => { setIsEditingTicket(false); setTicketForm({ ...ticketForm, name: '', probability: 0 }); setShowTicketModal(true); }} className="px-4 py-2 bg-gradient-primary text-white rounded-lg hover:brightness-110">
              + Add Ticket Type
            </button>
          </div>

          {/* Probability Alert */}
          <div className={`p-4 rounded-lg flex items-center gap-3 border ${Math.abs(totalTicketProb - 1.0) < 0.001 ? 'bg-green-500/20 border-green-500/30 text-green-200' : 'bg-yellow-500/20 border-yellow-500/30 text-yellow-200'}`}>
            <span className="text-2xl">{Math.abs(totalTicketProb - 1.0) < 0.001 ? '✅' : '⚠️'}</span>
            <div>
              <p className="font-bold">Total Probability: {(totalTicketProb * 100).toFixed(2)}%</p>
              {Math.abs(totalTicketProb - 1.0) >= 0.001 && <p className="text-sm opacity-90">Must equal 100% for proper distribution.</p>}
            </div>
          </div>

          <div className="card-surface overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-white/5 border-b border-white/10 text-[rgb(var(--text-muted))]">
                  <th className="py-3 px-4 text-left">Icon</th>
                  <th className="py-3 px-4 text-left">Name</th>
                  <th className="py-3 px-4 text-center">Rarity</th>
                  <th className="py-3 px-4 text-center">Probability</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map(t => (
                  <tr key={t._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 text-2xl">{t.icon}</td>
                    <td className="py-3 px-4 font-bold text-white">{t.name}</td>
                    <td className="py-3 px-4 text-center"><span className="px-2 py-1 rounded text-xs uppercase bg-white/10" style={{ color: t.color }}>{t.rarity}</span></td>
                    <td className="py-3 px-4 text-center font-mono">{(t.probability * 100).toFixed(2)}%</td>
                    <td className="py-3 px-4 text-center flex justify-center gap-2">
                      <button onClick={() => handleEditTicket(t)} className="p-1.5 text-blue-400 bg-blue-500/10 rounded">✏️</button>
                      <button onClick={() => handleDeleteTicket(t._id)} className="p-1.5 text-red-400 bg-red-500/10 rounded">🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* === REWARDS TAB === */}
      {activeTab === 'rewards' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">Redeemable Rewards & Items</h2>
            <button onClick={() => openRewardModal()} className="px-4 py-2 bg-gradient-primary text-white rounded-lg hover:brightness-110">
              + Add Reward Item
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rewards.map(reward => (
              <div key={reward._id} className="card-surface p-4 relative group">
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <button onClick={() => openRewardModal(reward)} className="p-2 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/40">✏️</button>
                  <button onClick={() => handleDeleteReward(reward._id)} className="p-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500/40">🗑️</button>
                </div>
                <div className="flex gap-4">
                  <img src={reward.image || '/placeholder.png'} className="w-24 h-24 object-cover rounded-lg bg-black/20" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg text-white truncate">{reward.name}</h3>
                    <div className={`text-xs px-2 py-0.5 rounded border inline-block mb-2 ${getRarityColor(reward.rarity)}`}>
                      {reward.rarity.toUpperCase()}
                    </div>
                    <div className="flex justify-between text-sm text-[rgb(var(--text-muted))]">
                      <span>Stock: {reward.stock}</span>
                      {reward.isRedeemable && <span className="text-green-400">Shop Item</span>}
                    </div>
                    {reward.isRedeemable && (
                      <div className="mt-2 text-xs grid grid-cols-2 gap-1 bg-white/5 p-1 rounded">
                        {Object.entries(reward.ticketCost || {}).map(([r, c]) => c > 0 && (
                          <span key={r} className="text-[rgb(var(--text-muted))]">{r}: <span className="text-white">{c}</span></span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* === TICKET MODAL === */}
      {showTicketModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-[rgb(var(--surface))] rounded-xl border border-white/10 w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-white mb-4">{isEditingTicket ? 'Edit Ticket' : 'New Ticket'}</h2>
            <form onSubmit={handleTicketSubmit} className="space-y-4">
              <input value={ticketForm.name} onChange={e => setTicketForm({ ...ticketForm, name: e.target.value })} placeholder="Ticket Name" className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white" required />

              <div className="grid grid-cols-2 gap-4">
                <select value={ticketForm.rarity} onChange={e => setTicketForm({ ...ticketForm, rarity: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white">
                  <option value="Common" className="text-black">Common</option>
                  <option value="Rare" className="text-black">Rare</option>
                  <option value="Epic" className="text-black">Epic</option>
                  <option value="Legendary" className="text-black">Legendary</option>
                </select>
                <input value={ticketForm.icon} onChange={e => setTicketForm({ ...ticketForm, icon: e.target.value })} placeholder="Icon (Emoji)" className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-center" required />
              </div>

              <div>
                <label className="text-xs text-[rgb(var(--text-muted))]">Probability (0.0 - 1.0)</label>
                <div className="flex gap-2">
                  <input type="number" step="0.001" min="0" max="1" value={ticketForm.probability} onChange={e => setTicketForm({ ...ticketForm, probability: parseFloat(e.target.value) })} className="flex-1 bg-white/5 border border-white/10 rounded px-3 py-2 text-white" required />
                  <span className="px-3 py-2 bg-white/5 rounded border border-white/10 text-white min-w-[4rem] text-center">{(ticketForm.probability * 100).toFixed(1)}%</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-[rgb(var(--text-muted))]">Color</label>
                  <input type="color" value={ticketForm.color} onChange={e => setTicketForm({ ...ticketForm, color: e.target.value })} className="w-full h-10 bg-transparent cursor-pointer" />
                </div>
                <div>
                  <label className="text-xs text-[rgb(var(--text-muted))]">Glow (RGBA)</label>
                  <input value={ticketForm.glowColor} onChange={e => setTicketForm({ ...ticketForm, glowColor: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-xs" />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowTicketModal(false)} className="px-4 py-2 hover:bg-white/10 rounded text-white flex-1">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-gradient-primary rounded text-white font-bold flex-1">Save Ticket</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* === REWARD MODAL === */}
      {showRewardModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-[rgb(var(--surface))] rounded-xl border border-white/[0.08] w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <form onSubmit={handleRewardSubmit} className="space-y-4">
              <h2 className="text-xl font-bold text-white mb-4">{selectedReward ? 'Edit Reward' : 'New Reward'}</h2>

              <div className="grid grid-cols-2 gap-4">
                <input value={rewardForm.name} onChange={e => setRewardForm({ ...rewardForm, name: e.target.value })} placeholder="Reward Name" required className="bg-white/5 border border-white/10 rounded px-3 py-2 text-white w-full" />
                <input value={rewardForm.image} onChange={e => setRewardForm({ ...rewardForm, image: e.target.value })} placeholder="Image URL" required className="bg-white/5 border border-white/10 rounded px-3 py-2 text-white w-full" />
              </div>

              <textarea value={rewardForm.description} onChange={e => setRewardForm({ ...rewardForm, description: e.target.value })} placeholder="Description" rows={2} className="bg-white/5 border border-white/10 rounded px-3 py-2 text-white w-full" />

              <div className="grid grid-cols-3 gap-4">
                <select value={rewardForm.type} onChange={e => setRewardForm({ ...rewardForm, type: e.target.value })} className="bg-white/5 border border-white/10 rounded px-3 py-2 text-white w-full">
                  <option value="physical" className="text-black">Physical</option>
                  <option value="digital" className="text-black">Digital</option>
                  <option value="point" className="text-black">Point</option>
                  <option value="coupon" className="text-black">Coupon</option>
                </select>
                <select value={rewardForm.rarity} onChange={e => setRewardForm({ ...rewardForm, rarity: e.target.value })} className="bg-white/5 border border-white/10 rounded px-3 py-2 text-white w-full">
                  <option value="common" className="text-black">Common</option>
                  <option value="rare" className="text-black">Rare</option>
                  <option value="epic" className="text-black">Epic</option>
                  <option value="legendary" className="text-black">Legendary</option>
                </select>
                <input type="number" min="0" value={rewardForm.stock} onChange={e => setRewardForm({ ...rewardForm, stock: Number(e.target.value) })} placeholder="Stock" className="bg-white/5 border border-white/10 rounded px-3 py-2 text-white w-full" />
              </div>

              <div className="pt-4 border-t border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <input type="checkbox" id="isRedeemable" checked={rewardForm.isRedeemable} onChange={e => setRewardForm({ ...rewardForm, isRedeemable: e.target.checked })} className="w-4 h-4" />
                  <label htmlFor="isRedeemable" className="text-white font-medium cursor-pointer">Allow Direct Redemption?</label>
                </div>

                {rewardForm.isRedeemable && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-white/5 rounded-lg border border-white/10">
                    {['Common', 'Rare', 'Epic', 'Legendary'].map(rarity => (
                      <div key={rarity}>
                        <label className="block text-xs text-[rgb(var(--text-muted))] mb-1">{rarity} Cost</label>
                        <input type="number" min="0" value={(rewardForm as any)[`ticketCost${rarity}`]} onChange={e => setRewardForm({ ...rewardForm, [`ticketCost${rarity}`]: Number(e.target.value) })} className="w-full bg-black/20 border border-white/10 rounded px-2 py-1 text-white text-sm" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowRewardModal(false)} className="px-4 py-2 hover:bg-white/10 rounded text-white">Cancel</button>
                <button type="submit" disabled={savingReward} className="px-6 py-2 bg-gradient-primary text-white rounded hover:brightness-110 font-bold">
                  {savingReward ? 'Saving...' : 'Save Reward'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
