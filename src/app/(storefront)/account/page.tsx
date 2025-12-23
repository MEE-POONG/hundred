'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { getCurrentUser } from '@/data/users';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';

interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  name: string;
  phone: string;
  address: string;
  district: string;
  province: string;
  postalCode: string;
  default: boolean;
}

const mockAddresses: Address[] = [
  {
    id: 'a1',
    type: 'home',
    name: 'สมชาย ใจดี',
    phone: '081-234-5678',
    address: '123 ซอยสุขุมวิท',
    district: 'วัฒนา',
    province: 'กรุงเทพฯ',
    postalCode: '10110',
    default: true,
  },
  {
    id: 'a2',
    type: 'work',
    name: 'สมชาย ใจดี',
    phone: '082-456-7890',
    address: '456 ถนนพระราม 4',
    district: 'สาทร',
    province: 'กรุงเทพฯ',
    postalCode: '10120',
    default: false,
  },
];

interface FormData {
  name: string;
  phone: string;
  address: string;
  district: string;
  province: string;
  postalCode: string;
  type: 'home' | 'work' | 'other';
}

const initialFormData: FormData = {
  name: '',
  phone: '',
  address: '',
  district: '',
  province: '',
  postalCode: '',
  type: 'home',
};

export default function AccountPage() {
  const user = getCurrentUser();
  const [addresses, setAddresses] = useState<Address[]>(mockAddresses);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const handleOpenModal = (address?: Address) => {
    if (address) {
      setEditingId(address.id);
      setFormData({
        name: address.name,
        phone: address.phone,
        address: address.address,
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
    setAddresses(addresses.filter(addr => addr.id !== id));
  };

  const handleSetDefault = (id: string) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      default: addr.id === id,
    })));
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
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-20 h-20 rounded-full mb-4"
                />
                <h2 className="text-2xl font-bold mb-2">{user.name}</h2>
                <p className="text-[rgb(var(--text-muted))] text-sm mb-4">{user.email}</p>
                <p className="text-[rgb(var(--text-muted))] text-xs mb-4">📱 {user.phone}</p>
                <div className="w-full border-t border-white/[0.08] pt-4 mt-4">
                  <p className="text-[rgb(var(--text-muted))] text-xs">
                    เข้าร่วมเมื่อ {new Date(user.joinedAt).toLocaleDateString('th-TH', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              <div className="mt-6 space-y-2">
                <Button fullWidth variant="outline" size="sm">
                  แก้ไขโปรไฟล์
                </Button>
                <Button fullWidth variant="ghost" size="sm">
                  เปลี่ยนรหัสผ่าน
                </Button>
              </div>
            </Card>

            {/* Stats */}
            <div className="space-y-3">
              <Card className="p-4 text-center">
                <div className="text-3xl font-bold text-[rgb(var(--primary))]">12</div>
                <p className="text-sm text-[rgb(var(--text-muted))] mt-1">ออเดอร์ทั้งหมด</p>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-3xl font-bold text-[rgb(var(--secondary))]">450</div>
                <p className="text-sm text-[rgb(var(--text-muted))] mt-1">คะแนนตั๋ว</p>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-3xl font-bold text-[rgb(var(--accent))]">18</div>
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
                            {address.address}, {address.district}<br />
                            {address.province} {address.postalCode}
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

            {/* Logout */}
            <div className="mt-12">
              <Button fullWidth variant="danger" size="lg">
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
              <label className="block text-sm font-medium mb-2">ประเภท</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-white/5 border border-white/[0.08] rounded-xl focus:outline-none focus:border-[rgb(var(--primary))] transition-colors"
              >
                <option value="home">🏠 บ้าน</option>
                <option value="work">💼 ที่ทำงาน</option>
                <option value="other">📌 อื่นๆ</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">ชื่อผู้รับ</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="ชื่อ-สกุล"
                className="w-full px-4 py-2 bg-white/5 border border-white/[0.08] rounded-xl focus:outline-none focus:border-[rgb(var(--primary))] transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">เบอร์โทรศัพท์</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="081-234-5678"
              className="w-full px-4 py-2 bg-white/5 border border-white/[0.08] rounded-xl focus:outline-none focus:border-[rgb(var(--primary))] transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">ที่อยู่</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="ซอย ตรงทำนายหมายเลขบ้าน"
              className="w-full px-4 py-2 bg-white/5 border border-white/[0.08] rounded-xl focus:outline-none focus:border-[rgb(var(--primary))] transition-colors"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">เขต/อำเภอ</label>
              <input
                type="text"
                name="district"
                value={formData.district}
                onChange={handleInputChange}
                placeholder="เขต"
                className="w-full px-4 py-2 bg-white/5 border border-white/[0.08] rounded-xl focus:outline-none focus:border-[rgb(var(--primary))] transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">จังหวัด</label>
              <input
                type="text"
                name="province"
                value={formData.province}
                onChange={handleInputChange}
                placeholder="จังหวัด"
                className="w-full px-4 py-2 bg-white/5 border border-white/[0.08] rounded-xl focus:outline-none focus:border-[rgb(var(--primary))] transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">รหัสไปรษณีย์</label>
            <input
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleInputChange}
              placeholder="10110"
              className="w-full px-4 py-2 bg-white/5 border border-white/[0.08] rounded-xl focus:outline-none focus:border-[rgb(var(--primary))] transition-colors"
              required
            />
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
    </div>
  );
}
