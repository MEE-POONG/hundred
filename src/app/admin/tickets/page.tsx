'use client';

import { ticketTypes } from '@/data/tickets';

export default function AdminTickets() {
  const totalProbability = ticketTypes.reduce((sum, t) => sum + t.probability, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">Tickets</h1>
        <p className="text-[rgb(var(--text-muted))]">จัดการระบบตั๋วแต่ม</p>
      </div>

      {/* Ticket Types Table */}
      <div className="card-surface overflow-hidden">
        <div className="p-6 border-b border-white/[0.08]">
          <h2 className="text-lg font-bold text-white">ประเภทตั๋ว</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.08] bg-white/[0.02]">
                <th className="text-left py-4 px-6 text-[rgb(var(--text-muted))] font-semibold">ไอคอน</th>
                <th className="text-left py-4 px-6 text-[rgb(var(--text-muted))] font-semibold">ชื่อ</th>
                <th className="text-left py-4 px-6 text-[rgb(var(--text-muted))] font-semibold">ความหายาก</th>
                <th className="text-center py-4 px-6 text-[rgb(var(--text-muted))] font-semibold">ความน่าจะเป็น</th>
                <th className="text-center py-4 px-6 text-[rgb(var(--text-muted))] font-semibold">เปอร์เซ็นต์</th>
              </tr>
            </thead>
            <tbody>
              {ticketTypes.map((ticket) => (
                <tr key={ticket.id} className="border-b border-white/[0.08] hover:bg-white/[0.03] transition-colors">
                  <td className="py-4 px-6">
                    <span className="text-3xl">{ticket.icon}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full border-2"
                        style={{ borderColor: ticket.color, backgroundColor: ticket.color + '20' }}
                      ></div>
                      <p className="font-medium text-white">{ticket.name}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        ticket.rarity === 'Common'
                          ? 'bg-slate-500/20 text-slate-400'
                          : ticket.rarity === 'Rare'
                          ? 'bg-blue-500/20 text-blue-400'
                          : ticket.rarity === 'Epic'
                          ? 'bg-purple-500/20 text-purple-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}
                    >
                      {ticket.rarity}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <p className="font-mono text-white">{(ticket.probability * 100).toFixed(1)}%</p>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden max-w-xs">
                      <div
                        className="h-full bg-gradient-primary"
                        style={{ width: `${(ticket.probability / totalProbability) * 100}%` }}
                      ></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ticket Details */}
      <div className="grid md:grid-cols-2 gap-8">
        {ticketTypes.map((ticket) => (
          <div key={ticket.id} className="card-surface p-6">
            <div className="flex items-start gap-4 mb-4">
              <span className="text-5xl">{ticket.icon}</span>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white">{ticket.name}</h3>
                <p
                  className="text-sm font-medium mt-1"
                  style={{ color: ticket.color }}
                >
                  {ticket.rarity}
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-white/[0.08]">
              <div>
                <p className="text-xs text-[rgb(var(--text-muted))] mb-1">ความน่าจะเป็น</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full"
                      style={{
                        width: `${ticket.probability * 100}%`,
                        background: ticket.color,
                      }}
                    ></div>
                  </div>
                  <p className="font-mono font-bold text-white min-w-fit">
                    {(ticket.probability * 100).toFixed(2)}%
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs text-[rgb(var(--text-muted))] mb-1">สีไอดี</p>
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded border border-white/[0.08]"
                    style={{ backgroundColor: ticket.color }}
                  ></div>
                  <p className="font-mono text-sm text-white">{ticket.color}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-[rgb(var(--text-muted))] mb-1">Glow Color</p>
                <p className="font-mono text-sm text-white">{ticket.glowColor}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Statistics */}
      <div className="card-surface p-6">
        <h2 className="text-lg font-bold text-white mb-6">สถิติ</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <p className="text-[rgb(var(--text-muted))] mb-4">การกระจายความน่าจะเป็น</p>
            <div className="space-y-2">
              {ticketTypes.map((ticket) => (
                <div key={ticket.id} className="flex items-center gap-3">
                  <span className="text-lg w-8">{ticket.icon}</span>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-white">{ticket.name}</span>
                      <span className="text-xs text-[rgb(var(--text-muted))]">
                        {(ticket.probability * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full"
                        style={{
                          width: `${ticket.probability * 100}%`,
                          background: ticket.color,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[rgb(var(--text-muted))] mb-4">ข้อมูลเพิ่มเติม</p>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-[rgb(var(--text-muted))]">ประเภทตั๋วรวม</span>
                <span className="font-bold text-white">{ticketTypes.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[rgb(var(--text-muted))]">ความหายากโดยทั่วไป</span>
                <span className="font-bold text-white">{ticketTypes.filter(t => t.rarity === 'Common').length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[rgb(var(--text-muted))]">ความหายากหายาก</span>
                <span className="font-bold text-white">{ticketTypes.filter(t => t.rarity === 'Rare').length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[rgb(var(--text-muted))]">ความหายากมหัศจรรย์</span>
                <span className="font-bold text-white">{ticketTypes.filter(t => t.rarity === 'Epic').length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[rgb(var(--text-muted))]">ความหายากตำนาน</span>
                <span className="font-bold text-white">{ticketTypes.filter(t => t.rarity === 'Legendary').length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
