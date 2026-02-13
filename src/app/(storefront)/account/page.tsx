'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';
import SearchableSelect from '@/components/ui/SearchableSelect';

interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  name: string;
  phone: string;
  address: string;
  subDistrict: string;
  district: string;
  province: string;
  postalCode: string;
  default: boolean;
}

interface FormData {
  name: string;
  phone: string;
  address: string;
  subDistrict: string;
  district: string;
  province: string;
  postalCode: string;
  type: 'home' | 'work' | 'other';
}

const initialFormData: FormData = {
  name: '',
  phone: '',
  address: '',
  subDistrict: '',
  district: '',
  province: '',
  postalCode: '',
  type: 'home',
};

// Thai Address Types
interface ThaiAddressData {
  id: number;
  name_th: string;
  amphure: Amphure[];
}

interface Amphure {
  id: number;
  name_th: string;
  province_id: number;
  tambon: Tambon[];
}

interface Tambon {
  id: number;
  name_th: string;
  zip_code: number;
}


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

interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  selectedVariants?: Record<string, string>;
}

interface Order {
  _id: string;
  orderNumber: string;
  total: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

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
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);

  // Thai Address Data
  const [provincesData, setProvincesData] = useState<ThaiAddressData[]>([]);
  const [loadingAddress, setLoadingAddress] = useState(false);

  // Orders & Redemptions Data
  const [orders, setOrders] = useState<Order[]>([]);
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

    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/orders');
        if (res.ok) {
          const data = await res.json();
          // Ensure data is array
          if (Array.isArray(data)) {
            setOrders(data);
          }
        }
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      }
    };

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
      Promise.all([fetchProfile(), fetchOrders(), fetchRedemptions()]).finally(() => setLoading(false));
    } else if (status === 'unauthenticated') {
      setLoading(false);
    }
  }, [status]);

  // Load Thai Address Data
  useEffect(() => {
    const fetchAddressData = async () => {
      setLoadingAddress(true);
      try {
        const res = await fetch('/data/thai_address.json');
        if (res.ok) {
          const data = await res.json();
          setProvincesData(data);
        }
      } catch (error) {
        console.error('Failed to fetch Thai address:', error);
      } finally {
        setLoadingAddress(false);
      }
    };
    fetchAddressData();
  }, []);

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

  const handleOpenModal = (address?: Address) => {
    if (address) {
      setEditingId(address.id);
      setFormData({
        name: address.name,
        phone: address.phone,
        address: address.address,
        subDistrict: address.subDistrict || '',
        district: address.district,
        province: address.province,
        postalCode: address.postalCode,
        type: address.type,
      });
    } else {
      setEditingId(null);
      setFormData(initialFormData);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData(initialFormData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.district || !formData.province || !formData.subDistrict) {
      alert('กรุณากรอกข้อมูลที่อยู่ให้ครบถ้วน');
      return;
    }

    if (editingId) {
      setAddresses(addresses.map(addr =>
        addr.id === editingId
          ? { ...addr, ...formData }
          : addr
      ));
    } else {
      setAddresses([...addresses, {
        id: `a${Date.now()}`,
        ...formData,
        default: addresses.length === 0,
      }]);
    }
    handleCloseModal();
  };

  const handleDeleteAddress = (id: string) => {
    if (confirm('ยืนยันการลบที่อยู่?')) {
      setAddresses(addresses.filter(addr => addr.id !== id));
    }
  };

  const handleSetDefault = (id: string) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      default: addr.id === id,
    })));
  };

  // Helper variables for cascading dropdowns
  const selectedProvinceObj = provincesData.find(p => p.name_th === formData.province);
  const amphures = selectedProvinceObj?.amphure || [];
  const selectedAmphureObj = amphures.find(a => a.name_th === formData.district);
  const tambons = selectedAmphureObj?.tambon || [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending_payment':
        return <span className="px-2 py-1 rounded text-xs font-medium bg-yellow-500/20 text-yellow-500">รอชำระเงิน</span>;
      case 'paid':
        return <span className="px-2 py-1 rounded text-xs font-medium bg-blue-500/20 text-blue-500">ชำระแล้ว</span>;
      case 'processing':
        return <span className="px-2 py-1 rounded text-xs font-medium bg-purple-500/20 text-purple-500">กำลังเตรียมพัสดุ</span>;
      case 'shipped':
        return <span className="px-2 py-1 rounded text-xs font-medium bg-orange-500/20 text-orange-500">กำลังจัดส่ง</span>;
      case 'delivered':
        return <span className="px-2 py-1 rounded text-xs font-medium bg-green-500/20 text-green-500">จัดส่งสำเร็จ</span>;
      case 'cancelled':
        return <span className="px-2 py-1 rounded text-xs font-medium bg-red-500/20 text-red-500">ยกเลิกแล้ว</span>;
      default:
        return <span className="px-2 py-1 rounded text-xs font-medium bg-gray-500/20 text-gray-500">{status}</span>;
    }
  };

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
            {/* Addresses Section */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">📍 ที่อยู่ของฉัน</h2>
                <Button size="sm" onClick={() => handleOpenModal()}>
                  + เพิ่มที่อยู่
                </Button>
              </div>

              <div className="space-y-4">
                {addresses.length === 0 ? (
                  <Card className="p-8 text-center">
                    <p className="text-[rgb(var(--text-muted))]">ยังไม่มีที่อยู่ที่บันทึก</p>
                  </Card>
                ) : (
                  addresses.map(address => (
                    <Card key={address.id} className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[rgb(var(--primary))]/10 text-[rgb(var(--primary))]">
                              {address.type === 'home' ? '🏠 บ้าน' : address.type === 'work' ? '💼 ที่ทำงาน' : '📌 อื่นๆ'}
                            </span>
                            {address.default && (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[rgb(var(--secondary))]/10 text-[rgb(var(--secondary))]">
                                ✓ ที่อยู่หลัก
                              </span>
                            )}
                          </div>
                          <h3 className="font-semibold text-lg mb-1">{address.name}</h3>
                          <p className="text-[rgb(var(--text-muted))] text-sm mb-2">
                            📱 {address.phone}
                          </p>
                          <p className="text-[rgb(var(--text-muted))] text-sm">
                            {address.address}
                          </p>
                          <p className="text-[rgb(var(--text-muted))] text-sm">
                            {address.subDistrict} {address.district} {address.province} {address.postalCode}
                          </p>
                        </div>
                        <div className="ml-4 flex gap-2 flex-shrink-0">
                          <button
                            onClick={() => handleOpenModal(address)}
                            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                            title="แก้ไข"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDeleteAddress(address.id)}
                            className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-red-400"
                            title="ลบ"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                      {!address.default && (
                        <div className="mt-4 pt-4 border-t border-white/[0.08]">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleSetDefault(address.id)}
                          >
                            ตั้งเป็นที่อยู่หลัก
                          </Button>
                        </div>
                      )}
                    </Card>
                  ))
                )}
              </div>
            </div>

            {/* Preferences Section */}
            <div>
              <h2 className="text-2xl font-bold mb-6">⚙️ การตั้งค่า</h2>

              <div className="space-y-4">
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold mb-1">📧 การแจ้งเตือนทางอีเมล</h3>
                      <p className="text-[rgb(var(--text-muted))] text-sm">รับอัพเดตเกี่ยวกับออเดอร์และโปรโมชั่น</p>
                    </div>
                    <label className="flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-4 h-4" />
                      <span className="ml-2 text-sm">เปิด</span>
                    </label>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold mb-1">💬 แจ้งเตือน SMS</h3>
                      <p className="text-[rgb(var(--text-muted))] text-sm">รับข้อความเกี่ยวกับการจัดส่ง</p>
                    </div>
                    <label className="flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-4 h-4" />
                      <span className="ml-2 text-sm">เปิด</span>
                    </label>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold mb-1">🎁 ข้อเสนอแนะทางการตลาด</h3>
                      <p className="text-[rgb(var(--text-muted))] text-sm">รับข้อเสนอพิเศษและส่วนลด</p>
                    </div>
                    <label className="flex items-center cursor-pointer">
                      <input type="checkbox" className="w-4 h-4" />
                      <span className="ml-2 text-sm">เปิด</span>
                    </label>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold mb-1">🌙 โหมดมืด</h3>
                      <p className="text-[rgb(var(--text-muted))] text-sm">เปิดแล้ว - ปิดหากต้องการ</p>
                    </div>
                    <label className="flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-4 h-4" />
                      <span className="ml-2 text-sm">เปิด</span>
                    </label>
                  </div>
                </Card>
              </div>
            </div>

            {/* Orders History Section */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">📦 ประวัติการสั่งซื้อ</h2>

              {loading ? (
                <div className="text-center py-8">
                  <p className="text-[rgb(var(--text-muted))]">กำลังโหลดข้อมูล...</p>
                </div>
              ) : orders.length === 0 ? (
                <Card className="p-8 text-center">
                  <p className="text-[rgb(var(--text-muted))]">ยังไม่มีประวัติการสั่งซื้อ</p>
                  <Link href="/products" className="text-[rgb(var(--primary))] hover:underline mt-2 inline-block">
                    ไปเลือกซื้อสินค้า
                  </Link>
                </Card>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <Card key={order._id} className="p-6 transition-all hover:bg-white/[0.02]">
                      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                        {/* Order Info */}
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-bold text-lg">{order.orderNumber}</span>
                            {getStatusBadge(order.status)}
                          </div>
                          <p className="text-[rgb(var(--text-muted))] text-sm">
                            วันที่: {new Date(order.createdAt).toLocaleDateString('th-TH', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                          <p className="text-[rgb(var(--text-muted))] text-sm">
                            สินค้า: {order.items.length} รายการ
                          </p>
                        </div>

                        {/* Total & Action */}
                        <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-4">
                          <div className="text-right">
                            <p className="text-[rgb(var(--text-muted))] text-xs mb-1">ยอดรวมสุทธิ</p>
                            <p className="text-xl font-bold text-gradient">{order.total.toLocaleString()} บาท</p>
                          </div>
                          <Link href={`/orders/${order._id}`}>
                            <Button size="sm" variant="outline">
                              ดูรายละเอียด
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>

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

      {/* Address Modal */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingId ? 'แก้ไขที่อยู่' : 'เพิ่มที่อยู่ใหม่'} size="lg">
        <form onSubmit={handleSaveAddress} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-[rgb(var(--text-muted))]">ประเภท</label>
              <div className="relative">
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/[0.08] rounded-xl focus:outline-none focus:border-[rgb(var(--primary))] transition-colors appearance-none"
                >
                  <option value="home" className="bg-[#1a1a1a]">🏠 บ้าน</option>
                  <option value="work" className="bg-[#1a1a1a]">💼 ที่ทำงาน</option>
                  <option value="other" className="bg-[#1a1a1a]">📌 อื่นๆ</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[rgb(var(--text-muted))]">
                  ▼
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-[rgb(var(--text-muted))]">ชื่อผู้รับ</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="ชื่อ-สกุล"
                className="w-full px-4 py-3 bg-white/5 border border-white/[0.08] rounded-xl focus:outline-none focus:border-[rgb(var(--primary))] transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-[rgb(var(--text-muted))]">เบอร์โทรศัพท์</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="081-234-5678"
              className="w-full px-4 py-3 bg-white/5 border border-white/[0.08] rounded-xl focus:outline-none focus:border-[rgb(var(--primary))] transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-[rgb(var(--text-muted))]">ที่อยู่</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="บ้านเลขที่, ซอย, ถนน..."
              className="w-full px-4 py-3 bg-white/5 border border-white/[0.08] rounded-xl focus:outline-none focus:border-[rgb(var(--primary))] transition-colors"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Province */}
            <div>
              <label className="block text-sm font-medium mb-1 text-[rgb(var(--text-muted))]">จังหวัด</label>
              <div className="relative z-30">
                <SearchableSelect
                  options={provincesData.map(p => ({ label: p.name_th, value: p.name_th }))}
                  value={formData.province}
                  onChange={(val) => {
                    setFormData(prev => ({
                      ...prev,
                      province: val as string,
                      district: '',
                      subDistrict: '',
                      postalCode: ''
                    }));
                  }}
                  placeholder="เลือกจังหวัด"
                  disabled={loadingAddress}
                />
              </div>
            </div>

            {/* District (Amphure) */}
            <div>
              <label className="block text-sm font-medium mb-1 text-[rgb(var(--text-muted))]">เขต/อำเภอ</label>
              <div className="relative z-20">
                <SearchableSelect
                  options={amphures.map(a => ({ label: a.name_th, value: a.name_th }))}
                  value={formData.district}
                  onChange={(val) => {
                    setFormData(prev => ({
                      ...prev,
                      district: val as string,
                      subDistrict: '',
                      postalCode: ''
                    }));
                  }}
                  placeholder="เลือกเขต/อำเภอ"
                  disabled={!formData.province}
                />
              </div>
            </div>

            {/* Sub-District (Tambon) */}
            <div>
              <label className="block text-sm font-medium mb-1 text-[rgb(var(--text-muted))]">ตำบล/แขวง</label>
              <div className="relative z-10">
                <SearchableSelect
                  options={tambons.map(t => ({ label: t.name_th, value: t.name_th }))}
                  value={formData.subDistrict}
                  onChange={(val) => {
                    const tambonName = val as string;
                    const tambonObj = tambons.find(t => t.name_th === tambonName);
                    setFormData(prev => ({
                      ...prev,
                      subDistrict: tambonName,
                      postalCode: tambonObj ? String(tambonObj.zip_code) : ''
                    }));
                  }}
                  placeholder="เลือกตำบล/แขวง"
                  disabled={!formData.district}
                />
              </div>
            </div>

            {/* Zipcode */}
            <div>
              <label className="block text-sm font-medium mb-1 text-[rgb(var(--text-muted))]">รหัสไปรษณีย์</label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                placeholder="10110"
                className="w-full px-4 py-3 bg-white/5 border border-white/[0.08] rounded-xl focus:outline-none focus:border-[rgb(var(--primary))] transition-colors"
                required
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={handleCloseModal} fullWidth>
              ยกเลิก
            </Button>
            <Button type="submit" fullWidth>
              บันทึก
            </Button>
          </div>
        </form>
      </Modal>

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
