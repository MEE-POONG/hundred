'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

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
  const { data: session } = useSession();
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [roleFilter, setRoleFilter] = useState('all');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

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

  const handleRoleChange = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    const action = newRole === 'admin' ? 'เลื่อนขั้นเป็นผู้ดูแลระบบ' : 'ลดขั้นเป็นผู้ใช้ทั่วไป';

    if (!confirm(`ยืนยันการ${action}?`)) return;

    setActionLoading(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });

      if (res.ok) {
        setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
        if (selectedUser && selectedUser._id === userId) {
          setSelectedUser({ ...selectedUser, role: newRole });
        }
      } else {
        const error = await res.json();
        alert(error.error || 'เกิดข้อผิดพลาด');
      }
    } catch (err) {
      console.error(err);
      alert('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('⚠️ ยืนยันการลบผู้ใช้นี้ถาวร? การกระทำนี้ไม่สามารถย้อนกลับได้')) return;

    setActionLoading(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setUsers(users.filter(u => u._id !== userId));
        setSelectedUser(null);
      } else {
        const error = await res.json();
        alert(error.error || 'เกิดข้อผิดพลาด');
      }
    } catch (err) {
      console.error(err);
      alert('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    } finally {
      setActionLoading(null);
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
        <p className="text-[rgb(var(--text-muted))]">จัดการผู้ใช้ระบบ ({users.length} คน)</p>
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
      <div className="flex gap-2 bg-white/5 p-3 rounded-lg border border-white/[0.08] overflow-x-auto">
        <button
          onClick={() => setRoleFilter('all')}
          className={`whitespace-nowrap px-4 py-2 rounded text-sm font-medium transition-all ${roleFilter === 'all' ? 'bg-gradient-primary text-white' : 'text-[rgb(var(--text-muted))] hover:bg-white/10'}`}
        >
          ทั้งหมด
        </button>
        <button
          onClick={() => setRoleFilter('user')}
          className={`whitespace-nowrap px-4 py-2 rounded text-sm font-medium transition-all ${roleFilter === 'user' ? 'bg-blue-500 text-white' : 'text-[rgb(var(--text-muted))] hover:bg-white/10'}`}
        >
          ผู้ใช้ทั่วไป
        </button>
        <button
          onClick={() => setRoleFilter('admin')}
          className={`whitespace-nowrap px-4 py-2 rounded text-sm font-medium transition-all ${roleFilter === 'admin' ? 'bg-purple-500 text-white' : 'text-[rgb(var(--text-muted))] hover:bg-white/10'}`}
        >
          ผู้ดูแลระบบ
        </button>
      </div>

      {/* Users List */}
      <div className="card-surface overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
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
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="border-b border-white/[0.08] hover:bg-white/[0.03] transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                          {user.name?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <p className="font-medium text-white line-clamp-1">{user.name}</p>
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
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-[rgb(var(--text-muted))]">ไม่พบข้อมูลผู้ใช้</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4 p-4">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div key={user._id} onClick={() => setSelectedUser(user)} className="bg-white/5 border border-white/[0.08] rounded-xl p-4 active:bg-white/10 transition-colors cursor-pointer">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
                    {user.name?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg line-clamp-1">{user.name}</h3>
                    <p className="text-xs text-[rgb(var(--text-muted))]">{user.email}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${user.role === 'admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>
                    {user.role === 'admin' ? 'ผู้ดูแลระบบ' : 'ผู้ใช้ทั่วไป'}
                  </span>
                  <p className="text-xs text-[rgb(var(--text-muted))]">
                    เมื่อ: {new Date(user.createdAt).toLocaleDateString('th-TH')}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-[rgb(var(--text-muted))]">ไม่พบข้อมูลผู้ใช้</div>
          )}
        </div>
      </div>

      {/* User Detail Drawer (Also Responsive) */}
      {selectedUser && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm" onClick={() => setSelectedUser(null)}></div>
          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-[rgb(var(--surface))] border-l border-white/[0.08] z-50 flex flex-col shadow-2xl animate-slide-in-right">
            <div className="p-6 border-b border-white/[0.08] flex items-center justify-between bg-white/[0.02]">
              <h2 className="text-xl font-bold text-white">รายละเอียดผู้ใช้</h2>
              <button onClick={() => setSelectedUser(null)} className="p-2 hover:bg-white/10 rounded-full text-lg transition-colors">✕</button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Profile Header */}
              <div className="text-center">
                <div className="w-28 h-28 rounded-full mx-auto mb-4 bg-gradient-primary flex items-center justify-center text-5xl text-white font-bold shadow-lg ring-4 ring-white/10">
                  {selectedUser.name?.charAt(0)?.toUpperCase() || '?'}
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{selectedUser.name}</h3>
                <span className={`inline-block text-sm font-semibold px-4 py-1.5 rounded-full ${selectedUser.role === 'admin' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'}`}>
                  {selectedUser.role === 'admin' ? '✨ ผู้ดูแลระบบ' : '👤 ผู้ใช้ทั่วไป'}
                </span>
              </div>

              {/* Info Grid */}
              <div className="space-y-4 bg-white/5 p-4 rounded-xl border border-white/[0.05]">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <p className="text-xs text-[rgb(var(--text-muted))] mb-1 uppercase tracking-wider">อีเมล</p>
                    <p className="text-white font-medium break-all">{selectedUser.email}</p>
                  </div>
                  {selectedUser.phone && (
                    <div>
                      <p className="text-xs text-[rgb(var(--text-muted))] mb-1 uppercase tracking-wider">เบอร์โทรศัพท์</p>
                      <p className="text-white font-medium">{selectedUser.phone}</p>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-[rgb(var(--text-muted))] mb-1 uppercase tracking-wider">วันที่เข้าร่วม</p>
                      <p className="text-white font-medium">
                        {new Date(selectedUser.createdAt).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[rgb(var(--text-muted))] mb-1 uppercase tracking-wider">ผู้ให้บริการ</p>
                      <p className="text-white font-medium capitalize">{selectedUser.provider || 'Credential'}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-[rgb(var(--text-muted))] mb-1 uppercase tracking-wider">User ID</p>
                    <p className="text-[rgb(var(--text-muted))] font-mono text-xs break-all bg-black/20 p-2 rounded select-all">
                      {selectedUser._id}
                    </p>
                  </div>
                </div>
              </div>

              {/* Secure Actions - Only show if not self */}
              {(session?.user as any)?.id !== selectedUser._id && (
                <div className="space-y-3 pt-4 border-t border-white/[0.08]">
                  <h4 className="text-sm font-bold text-[rgb(var(--text-muted))] mb-2 uppercase tracking-wider">จัดการสิทธิ์</h4>

                  <button
                    onClick={() => handleRoleChange(selectedUser._id, selectedUser.role)}
                    disabled={actionLoading === selectedUser._id}
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${selectedUser.role === 'admin'
                        ? 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20'
                        : 'bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 border border-purple-500/20'
                      }`}
                  >
                    {actionLoading === selectedUser._id ? 'กำลังดำเนินการ...' : (
                      selectedUser.role === 'admin' ? '⬇️ ลดเป็นผู้ใช้ทั่วไป' : '⬆️ เลื่อนขั้นเป็น Admin'
                    )}
                  </button>

                  <button
                    onClick={() => handleDeleteUser(selectedUser._id)}
                    disabled={actionLoading === selectedUser._id}
                    className="w-full py-3 px-4 bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 mt-2"
                  >
                    {actionLoading === selectedUser._id ? 'กำลังลบ...' : '🗑️ ลบผู้ใช้นี้ถาวร'}
                  </button>

                  <p className="text-xs text-center text-red-400/60 mt-2">
                    ⚠️ การลบผู้ใช้ไม่สามารถกู้คืนได้ โปรดระวัง
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
