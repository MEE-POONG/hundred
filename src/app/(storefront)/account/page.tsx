'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';
import SearchableSelect from '@/components/ui/SearchableSelect';
import AddressUser from './addressUser';
import SettingNotice from './settingNotice';
import OrderHistory, { getStatusBadge } from './orderHistory';






interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  image?: string;
  role: string;
  createdAt: string;
}

interface UserStats {
  orders: number;
  points: number;
  reviews: number;
}

// Order interfaces moved to orderHistory.tsx

interface Redemption {
  id: string;
  productName: string;
  productImage: string;
  ticketsUsed: { rarity: string; quantity: number }[];
  redeemedAt: string;
  status: string;
  trackingNumber?: string;
  rejectedReason?: string;
}

export default function AccountPage() {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats>({ orders: 0, points: 0, reviews: 0 });
  const [loading, setLoading] = useState(true);


  // Redemptions Data
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);

  // Profile & Password Modals
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const [profileForm, setProfileForm] = useState({ name: '', phone: '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  // Open Edit Profile
  const handleOpenProfileModal = () => {
    if (profile) {
      setProfileForm({
        name: profile.name,
        phone: profile.phone || '',
      });
      setIsProfileModalOpen(true);
    }
  };

  // Update Profile
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileForm),
      });

      if (!res.ok) throw new Error('Failed to update');

      const data = await res.json();
      setProfile(data.user); // Update local state
      setIsProfileModalOpen(false);
      alert('อัปเดตข้อมูลสำเร็จ');
    } catch (err) {
      console.error(err);
      alert('เกิดข้อผิดพลาดในการอัปเดต');
    }
  };

  // Change Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('รหัสผ่านใหม่ไม่ตรงกัน');
      return;
    }

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'เปลี่ยนรหัสผ่านไม่สำเร็จ');
        return;
      }

      setIsPasswordModalOpen(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      alert('เปลี่ยนรหัสผ่านสำเร็จ');
    } catch (err) {
      console.error(err);
      alert('เกิดข้อผิดพลาด');
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/user/profile');
        if (res.ok) {
          const data = await res.json();
          setProfile(data.user);
          setStats(data.stats);
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      }
    };

    // fetchOrders logic moved to orderHistory.tsx

    const fetchRedemptions = async () => {
      try {
        const res = await fetch('/api/user/redemptions');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setRedemptions(data);
          }
        }
      } catch (err) {
        console.error('Failed to fetch redemptions:', err);
      }
    };

    if (status === 'authenticated') {
      // Run parallel
      Promise.all([fetchProfile(), fetchRedemptions()]).finally(() => setLoading(false));
    } else if (status === 'unauthenticated') {
      setLoading(false);
    }
  }, [status]);



  if (status === 'unauthenticated') {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Card className="p-12 max-w-md mx-auto">
          <div className="text-4xl mb-4">🔐</div>
          <h2 className="text-2xl font-bold mb-2">กรุณาเข้าสู่ระบบ</h2>
          <p className="text-[rgb(var(--text-muted))] mb-6">เข้าสู่ระบบเพื่อดูข้อมูลบัญชีของคุณ</p>
          <Link href="/auth/login">
            <Button fullWidth>เข้าสู่ระบบ</Button>
          </Link>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-[rgb(var(--text-muted))]">กำลังโหลดข้อมูล...</p>
      </div>
    );
  }



  // getStatusBadge moved to orderHistory.tsx but kept as import

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">บัญชีของฉัน</h1>
          <p className="text-[rgb(var(--text-muted))]">จัดการข้อมูลส่วนตัว ที่อยู่ และการตั้งค่า</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Profile Card */}
            <Card className="p-6 mb-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full mb-4 bg-gradient-primary flex items-center justify-center text-3xl text-white font-bold">
                  {profile?.name?.charAt(0)?.toUpperCase() || '?'}
                </div>
                <h2 className="text-2xl font-bold mb-2">{profile?.name}</h2>
                <p className="text-[rgb(var(--text-muted))] text-sm mb-4">{profile?.email}</p>
                {profile?.phone && <p className="text-[rgb(var(--text-muted))] text-xs mb-4">📱 {profile.phone}</p>}
                <div className="w-full border-t border-white/[0.08] pt-4 mt-4">
                  <p className="text-[rgb(var(--text-muted))] text-xs">
                    เข้าร่วมเมื่อ {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('th-TH', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : '-'}
                  </p>
                </div>
              </div>
              <div className="mt-6 space-y-2">
                <Button fullWidth variant="outline" size="sm" onClick={handleOpenProfileModal}>
                  แก้ไขโปรไฟล์
                </Button>
                <Button fullWidth variant="ghost" size="sm" onClick={() => setIsPasswordModalOpen(true)}>
                  เปลี่ยนรหัสผ่าน
                </Button>
              </div>
            </Card>

            {/* Stats */}
            <div className="space-y-3">
              <Card className="p-4 text-center">
                <div className="text-3xl font-bold text-[rgb(var(--primary))]">{stats.orders}</div>
                <p className="text-sm text-[rgb(var(--text-muted))] mt-1">ออเดอร์ทั้งหมด</p>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-3xl font-bold text-[rgb(var(--secondary))]">{stats.points}</div>
                <p className="text-sm text-[rgb(var(--text-muted))] mt-1">คะแนนตั๋ว</p>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-3xl font-bold text-[rgb(var(--accent))]">{stats.reviews}</div>
                <p className="text-sm text-[rgb(var(--text-muted))] mt-1">รีวิวที่เขียน</p>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <AddressUser />

            <SettingNotice />

            <OrderHistory />

            {/* Redemptions History Section */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">🎁 ประวัติการแลกของรางวัล</h2>

              {loading ? (
                <div className="text-center py-8">
                  <p className="text-[rgb(var(--text-muted))]">กำลังโหลดข้อมูล...</p>
                </div>
              ) : redemptions.length === 0 ? (
                <Card className="p-8 text-center bg-white/5 border border-white/10">
                  <p className="text-[rgb(var(--text-muted))]">ยังไม่มีประวัติการแลกของรางวัล</p>
                  <Link href="/redemption" className="text-[rgb(var(--secondary))] hover:underline mt-2 inline-block">
                    ไปแลกของรางวัล
                  </Link>
                </Card>
              ) : (
                <div className="space-y-4">
                  {redemptions.map((redemption) => (
                    <Card key={redemption.id} className="p-6 transition-all hover:bg-white/[0.02]">
                      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">

                        {/* Product Info */}
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 rounded-lg bg-[rgb(var(--surface))] overflow-hidden flex-shrink-0">
                            {redemption.productImage ? (
                              <img src={redemption.productImage} alt={redemption.productName} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-2xl">🎁</div>
                            )}
                          </div>
                          <div>
                            <h3 className="font-bold text-lg">{redemption.productName}</h3>
                            <p className="text-[rgb(var(--text-muted))] text-sm">
                              ใช้ตั๋ว: {redemption.ticketsUsed.map(t => `${t.quantity} ${t.rarity}`).join(', ')}
                            </p>
                            <p className="text-[rgb(var(--text-muted))] text-xs mt-1">
                              วันที่แลก: {new Date(redemption.redeemedAt).toLocaleDateString('th-TH', {
                                year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>

                        {/* Status & Tracking */}
                        <div className="flex flex-col items-end gap-2">
                          {getStatusBadge(redemption.status)}
                          {redemption.trackingNumber && (
                            <p className="text-sm">
                              <span className="text-[rgb(var(--text-muted))]">เลขพัสดุ: </span>
                              <span className="font-mono font-medium">{redemption.trackingNumber}</span>
                            </p>
                          )}
                          {redemption.status === 'rejected' && redemption.rejectedReason && (
                            <p className="text-sm text-red-400">
                              เหตุผล: {redemption.rejectedReason}
                            </p>
                          )}
                          <Link href={`/redemptions/${redemption.id}`} className="text-sm text-[rgb(var(--primary))] hover:underline mt-1">
                            ดูรายละเอียด →
                          </Link>
                        </div>

                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Logout */}
            <div className="mt-12">
              <Button fullWidth variant="danger" size="lg" onClick={() => signOut({ callbackUrl: '/' })}>
                🚪 ออกจากระบบ
              </Button>
            </div>
          </div>
        </div>
      </div>



      {/* Edit Profile Modal */}
      <Modal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} title="แก้ไขโปรไฟล์">
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-[rgb(var(--text-muted))]">ชื่อ-สกุล</label>
            <input
              type="text"
              value={profileForm.name}
              onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/[0.08] rounded-xl focus:outline-none focus:border-[rgb(var(--primary))] transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-[rgb(var(--text-muted))]">เบอร์โทรศัพท์</label>
            <input
              type="tel"
              value={profileForm.phone}
              onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/[0.08] rounded-xl focus:outline-none focus:border-[rgb(var(--primary))] transition-colors"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={() => setIsProfileModalOpen(false)} fullWidth>
              ยกเลิก
            </Button>
            <Button type="submit" fullWidth>
              บันทึกการแก้ไข
            </Button>
          </div>
        </form>
      </Modal>

      {/* Change Password Modal */}
      <Modal isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)} title="เปลี่ยนรหัสผ่าน">
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-[rgb(var(--text-muted))]">รหัสผ่านปัจจุบัน</label>
            <input
              type="password"
              value={passwordForm.currentPassword}
              onChange={e => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/[0.08] rounded-xl focus:outline-none focus:border-[rgb(var(--primary))] transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-[rgb(var(--text-muted))]">รหัสผ่านใหม่</label>
            <input
              type="password"
              value={passwordForm.newPassword}
              onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/[0.08] rounded-xl focus:outline-none focus:border-[rgb(var(--primary))] transition-colors"
              required
              minLength={6}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-[rgb(var(--text-muted))]">ยืนยันรหัสผ่านใหม่</label>
            <input
              type="password"
              value={passwordForm.confirmPassword}
              onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/[0.08] rounded-xl focus:outline-none focus:border-[rgb(var(--primary))] transition-colors"
              required
              minLength={6}
            />
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={() => setIsPasswordModalOpen(false)} fullWidth>
              ยกเลิก
            </Button>
            <Button type="submit" fullWidth>
              เปลี่ยนรหัสผ่าน
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
