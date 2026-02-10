'use client';

import { useState, useEffect } from 'react';

interface UserItem {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  image?: string;
  role: string;
  provider?: string;
  createdAt: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = roleFilter === 'all' ? users : users.filter(u => u.role === roleFilter);

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-white mb-1">Users</h1>
        <p className="text-[rgb(var(--text-muted))]">กำลังโหลดข้อมูล...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">Users</h1>
        <p className="text-[rgb(var(--text-muted))]">จัดการผู้ใช้ระบบ</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-surface p-6">
          <div className="text-3xl mb-2">👥</div>
          <p className="text-[rgb(var(--text-muted))] text-sm mb-1">ผู้ใช้ทั้งหมด</p>
          <p className="text-3xl font-bold text-white">{users.length}</p>
        </div>
        <div className="card-surface p-6">
          <div className="text-3xl mb-2">👤</div>
          <p className="text-[rgb(var(--text-muted))] text-sm mb-1">ผู้ใช้ทั่วไป</p>
          <p className="text-3xl font-bold text-white">{users.filter(u => u.role === 'user').length}</p>
        </div>
        <div className="card-surface p-6">
          <div className="text-3xl mb-2">🔑</div>
          <p className="text-[rgb(var(--text-muted))] text-sm mb-1">ผู้ดูแลระบบ</p>
          <p className="text-3xl font-bold text-purple-400">{users.filter(u => u.role === 'admin').length}</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 bg-white/5 p-3 rounded-lg border border-white/[0.08]">
        <button
          onClick={() => setRoleFilter('all')}
          className={`px-4 py-2 rounded text-sm font-medium transition-all ${roleFilter === 'all' ? 'bg-gradient-primary text-white' : 'text-[rgb(var(--text-muted))] hover:bg-white/10'}`}
        >
          ทั้งหมด
        </button>
        <button
          onClick={() => setRoleFilter('user')}
          className={`px-4 py-2 rounded text-sm font-medium transition-all ${roleFilter === 'user' ? 'bg-blue-500 text-white' : 'text-[rgb(var(--text-muted))] hover:bg-white/10'}`}
        >
          ผู้ใช้ทั่วไป
        </button>
        <button
          onClick={() => setRoleFilter('admin')}
          className={`px-4 py-2 rounded text-sm font-medium transition-all ${roleFilter === 'admin' ? 'bg-purple-500 text-white' : 'text-[rgb(var(--text-muted))] hover:bg-white/10'}`}
        >
          ผู้ดูแลระบบ
        </button>
      </div>

      {/* Users Table */}
      <div className="card-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.08] bg-white/[0.02]">
                <th className="text-left py-4 px-6 text-[rgb(var(--text-muted))] font-semibold">ผู้ใช้</th>
                <th className="text-left py-4 px-6 text-[rgb(var(--text-muted))] font-semibold">อีเมล</th>
                <th className="text-left py-4 px-6 text-[rgb(var(--text-muted))] font-semibold">บทบาท</th>
                <th className="text-left py-4 px-6 text-[rgb(var(--text-muted))] font-semibold">เข้าร่วม</th>
                <th className="text-center py-4 px-6 text-[rgb(var(--text-muted))] font-semibold">ดำเนิน</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id} className="border-b border-white/[0.08] hover:bg-white/[0.03] transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white text-sm font-bold">
                        {user.name?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                      <p className="font-medium text-white">{user.name}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-[rgb(var(--text-muted))]">{user.email}</td>
                  <td className="py-4 px-6">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${user.role === 'admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>
                      {user.role === 'admin' ? 'ผู้ดูแลระบบ' : 'ผู้ใช้ทั่วไป'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-[rgb(var(--text-muted))]">
                    {new Date(user.createdAt).toLocaleDateString('th-TH')}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <button onClick={() => setSelectedUser(user)} className="p-2 hover:bg-white/10 rounded transition-colors text-lg">
                      👁️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Detail Drawer */}
      {selectedUser && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setSelectedUser(null)}></div>
          <div className="fixed right-0 top-0 h-full w-full md:w-96 bg-[rgb(var(--surface))] border-l border-white/[0.08] z-50 flex flex-col">
            <div className="p-6 border-b border-white/[0.08] flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">รายละเอียดผู้ใช้</h2>
              <button onClick={() => setSelectedUser(null)} className="p-1 hover:bg-white/10 rounded text-lg">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="text-center">
                <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-gradient-primary flex items-center justify-center text-4xl text-white font-bold">
                  {selectedUser.name?.charAt(0)?.toUpperCase() || '?'}
                </div>
                <h3 className="text-xl font-bold text-white">{selectedUser.name}</h3>
                <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mt-2 ${selectedUser.role === 'admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>
                  {selectedUser.role === 'admin' ? 'ผู้ดูแลระบบ' : 'ผู้ใช้ทั่วไป'}
                </span>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-[rgb(var(--text-muted))] mb-1">อีเมล</p>
                  <p className="text-white break-all">{selectedUser.email}</p>
                </div>
                {selectedUser.phone && (
                  <div>
                    <p className="text-xs text-[rgb(var(--text-muted))] mb-1">โทรศัพท์</p>
                    <p className="text-white">{selectedUser.phone}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-[rgb(var(--text-muted))] mb-1">เข้าร่วมเมื่อ</p>
                  <p className="text-white">
                    {new Date(selectedUser.createdAt).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[rgb(var(--text-muted))] mb-1">ไอดี</p>
                  <p className="text-white font-mono text-xs">{selectedUser._id}</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
