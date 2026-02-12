'use client';

import { useState, useEffect } from 'react';

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

export default function AdminTickets() {
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // To toggle between Add/Edit mode
  const [currentTicket, setCurrentTicket] = useState<TicketType | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    rarity: 'Common',
    probability: 0,
    icon: '🎫',
    color: '#CD7F32',
    glowColor: 'rgba(205, 127, 50, 0.5)',
    description: '',
  });

  const fetchTickets = async () => {
    try {
      const res = await fetch('/api/admin/ticket-types');
      if (res.ok) {
        const data = await res.json();
        setTickets(data);
      }
    } catch (err) {
      console.error('Failed to fetch tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const totalProbability = tickets.reduce((sum, t) => sum + t.probability, 0);

  const handleEdit = (ticket: TicketType) => {
    setCurrentTicket(ticket);
    setFormData({
      name: ticket.name,
      rarity: ticket.rarity,
      probability: ticket.probability,
      icon: ticket.icon,
      color: ticket.color,
      glowColor: ticket.glowColor,
      description: ticket.description || '',
    });
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบตั๋วประเภทนี้?')) return;
    try {
      const res = await fetch(`/api/admin/ticket-types/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchTickets();
      } else {
        alert('Failed to delete ticket type');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting ticket type');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = isEditing && currentTicket ? `/api/admin/ticket-types/${currentTicket._id}` : '/api/admin/ticket-types';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setShowModal(false);
        fetchTickets();
        setFormData({ // Reset form
          name: '',
          rarity: 'Common',
          probability: 0,
          icon: '🎫',
          color: '#CD7F32',
          glowColor: 'rgba(205, 127, 50, 0.5)',
          description: '',
        });
        setIsEditing(false);
        setCurrentTicket(null);
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to save ticket type');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving ticket type');
    }
  };

  const openAddModal = () => {
    setIsEditing(false);
    setCurrentTicket(null);
    setFormData({
      name: '',
      rarity: 'Common',
      probability: 0,
      icon: '🎫',
      color: '#CD7F32',
      glowColor: 'rgba(205, 127, 50, 0.5)',
      description: '',
    });
    setShowModal(true);
  };

  if (loading) return <div className="text-white">Loading tickets...</div>;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Tickets</h1>
          <p className="text-[rgb(var(--text-muted))]">จัดการระบบตั๋วและเรทการออก (Total Prob: {(totalProbability * 100).toFixed(1)}%)</p>
        </div>
        <button
          onClick={openAddModal}
          className="px-6 py-2.5 bg-gradient-primary text-white rounded-lg hover:opacity-90 transition-all font-semibold"
        >
          + เพิ่มประเภทตั๋ว
        </button>
      </div>

      {/* Probability Alert */}
      {Math.abs(totalProbability - 1.0) > 0.001 && (
        <div className="p-4 bg-yellow-500/20 text-yellow-200 border border-yellow-500/30 rounded-lg flex items-center gap-3">
          <span className="text-xl">⚠️</span>
          <div>
            <p className="font-bold">ผลรวมความน่าจะเป็นไม่เท่ากับ 100%</p>
            <p className="text-sm opacity-90">ปัจจุบันรวมได้ {(totalProbability * 100).toFixed(2)}% ซึ่งอาจทำให้การสุ่มผิดพลาด หรือมีโอกาสไม่ออกรางวัลใดเลย</p>
          </div>
        </div>
      )}

      {/* Ticket Types Table */}
      <div className="card-surface overflow-hidden">
        <div className="p-6 border-b border-white/[0.08]">
          <h2 className="text-lg font-bold text-white">ประเภทตั๋วที่มีอยู่</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.08] bg-white/[0.02]">
                <th className="text-left py-4 px-6 text-[rgb(var(--text-muted))] font-semibold">ไอคอน</th>
                <th className="text-left py-4 px-6 text-[rgb(var(--text-muted))] font-semibold">ข้อมูลตั๋ว</th>
                <th className="text-left py-4 px-6 text-[rgb(var(--text-muted))] font-semibold">ความหายาก (Rarity)</th>
                <th className="text-center py-4 px-6 text-[rgb(var(--text-muted))] font-semibold">โอกาส (%)</th>
                <th className="text-center py-4 px-6 text-[rgb(var(--text-muted))] font-semibold">สี (Color)</th>
                <th className="text-center py-4 px-6 text-[rgb(var(--text-muted))] font-semibold">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket._id} className="border-b border-white/[0.08] hover:bg-white/[0.03] transition-colors">
                  <td className="py-4 px-6">
                    <span className="text-3xl">{ticket.icon}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-medium text-white text-base">{ticket.name}</p>
                      <p className="text-xs text-[rgb(var(--text-muted))]">{ticket.description || '-'}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className="text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider"
                      style={{
                        backgroundColor: ticket.color + '20',
                        color: ticket.color,
                        border: `1px solid ${ticket.color}40`
                      }}
                    >
                      {ticket.rarity}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className="font-mono font-bold text-white">{(ticket.probability * 100).toFixed(2)}%</span>
                      <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-white transition-all duration-500"
                          style={{ width: `${Math.min(ticket.probability * 100, 100)}%`, backgroundColor: ticket.color }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-6 h-6 rounded border border-white/20" style={{ background: ticket.color }} title={ticket.color} />
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleEdit(ticket)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
                        title="แก้ไข"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(ticket._id)}
                        className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-red-400"
                        title="ลบ"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {tickets.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[rgb(var(--text-muted))]">ไม่พบข้อมูลตั๋ว</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-[rgb(var(--surface))] rounded-xl max-w-md w-full border border-white/[0.08] shadow-2xl">
            <div className="p-6 border-b border-white/[0.08] flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">{isEditing ? 'แก้ไขตั๋ว' : 'เพิ่มตั๋วใหม่'}</h2>
              <button onClick={() => setShowModal(false)} className="text-[rgb(var(--text-muted))] hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-sm text-[rgb(var(--text-muted))] block mb-2">ชื่อตั๋ว</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/[0.08] rounded-lg text-white focus:outline-none focus:border-[rgb(var(--primary))]"
                  placeholder="เช่น ตั๋วทองแดง"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-[rgb(var(--text-muted))] block mb-2">ความหายาก (Rarity)</label>
                  <select
                    value={formData.rarity}
                    onChange={(e) => setFormData({ ...formData, rarity: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/[0.08] rounded-lg text-white focus:outline-none focus:border-[rgb(var(--primary))]"
                  >
                    <option value="Common" className="bg-gray-800">Common</option>
                    <option value="Rare" className="bg-gray-800">Rare</option>
                    <option value="Epic" className="bg-gray-800">Epic</option>
                    <option value="Legendary" className="bg-gray-800">Legendary</option>
                    <option value="Mythic" className="bg-gray-800">Mythic</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-[rgb(var(--text-muted))] block mb-2">ไอคอน (Emoji)</label>
                  <input
                    type="text"
                    required
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/[0.08] rounded-lg text-white text-center text-xl focus:outline-none focus:border-[rgb(var(--primary))]"
                    placeholder="🎫"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-[rgb(var(--text-muted))] block mb-2">ความน่าจะเป็น (0.0 - 1.0)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    required
                    min="0"
                    max="1"
                    step="0.01"
                    value={formData.probability}
                    onChange={(e) => setFormData({ ...formData, probability: parseFloat(e.target.value) })}
                    className="flex-1 px-4 py-2 bg-white/5 border border-white/[0.08] rounded-lg text-white focus:outline-none focus:border-[rgb(var(--primary))]"
                  />
                  <span className="flex items-center px-3 bg-white/5 rounded-lg border border-white/[0.08] text-white font-mono">
                    = {(formData.probability * 100).toFixed(0)}%
                  </span>
                </div>
                <p className="text-xs text-[rgb(var(--text-muted))] mt-1">ค่า 1.0 = 100%, 0.5 = 50%, 0.01 = 1%</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-[rgb(var(--text-muted))] block mb-2">สี (Hex Color)</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="w-10 h-10 rounded cursor-pointer border-none bg-transparent"
                    />
                    <input
                      type="text"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="flex-1 px-3 py-2 bg-white/5 border border-white/[0.08] rounded-lg text-white text-sm focus:outline-none focus:border-[rgb(var(--primary))]"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-[rgb(var(--text-muted))] block mb-2">Glow Color (RGBA)</label>
                  <input
                    type="text"
                    value={formData.glowColor}
                    onChange={(e) => setFormData({ ...formData, glowColor: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/[0.08] rounded-lg text-white text-xs focus:outline-none focus:border-[rgb(var(--primary))]"
                    placeholder="rgba(255, 0, 0, 0.5)"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-[rgb(var(--text-muted))] block mb-2">คำอธิบาย</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/[0.08] rounded-lg text-white focus:outline-none focus:border-[rgb(var(--primary))] resize-none h-20"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-white/[0.08] rounded-lg text-white hover:bg-white/5 transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-primary text-white rounded-lg hover:opacity-90 transition-all font-bold shadow-lg"
                >
                  {isEditing ? 'บันทึกการแก้ไข' : 'เพิ่มตั๋ว'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
