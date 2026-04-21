'use client';

import React, { useState, useEffect } from 'react';
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

export default function AddressUser() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [provincesData, setProvincesData] = useState<ThaiAddressData[]>([]);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch addresses from database
  const fetchAddresses = async () => {
    try {
      const res = await fetch('/api/user/addresses');
      if (res.ok) {
        const data = await res.json();
        setAddresses(data);
      }
    } catch (error) {
      console.error('Failed to fetch addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

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

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.district || !formData.province || !formData.subDistrict) {
      alert('กรุณากรอกข้อมูลที่อยู่ให้ครบถ้วน');
      return;
    }

    setIsSaving(true);
    try {
      const method = editingId ? 'PUT' : 'POST';
      const body = editingId ? { id: editingId, ...formData } : formData;

      const res = await fetch('/api/user/addresses', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        const savedAddress = await res.json();
        if (editingId) {
          setAddresses(addresses.map(addr => addr.id === editingId ? savedAddress : addr));
        } else {
          setAddresses([...addresses, savedAddress]);
        }
        handleCloseModal();
      } else {
        const data = await res.json();
        alert(data.error || 'เกิดข้อผิดพลาดในการบันทึกที่อยู่');
      }
    } catch (error) {
      console.error('Failed to save address:', error);
      alert('เกิดข้อผิดพลาดในการบันทึกที่อยู่');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!confirm('ยืนยันการลบที่อยู่?')) return;

    try {
      const res = await fetch(`/api/user/addresses?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setAddresses(addresses.filter(addr => addr.id !== id));
      } else {
        const data = await res.json();
        alert(data.error || 'เกิดข้อผิดพลาดในการลบที่อยู่');
      }
    } catch (error) {
      console.error('Failed to delete address:', error);
      alert('เกิดข้อผิดพลาดในการลบที่อยู่');
    }
  };

  const handleSetDefault = async (id: string) => {
    const addressToSet = addresses.find(addr => addr.id === id);
    if (!addressToSet) return;

    try {
      const res = await fetch('/api/user/addresses', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...addressToSet, id, default: true }),
      });

      if (res.ok) {
        // Fetch fresh list to ensure defaults are correct
        fetchAddresses();
      } else {
        const data = await res.json();
        alert(data.error || 'เกิดข้อผิดพลาดในการตั้งที่อยู่หลัก');
      }
    } catch (error) {
      console.error('Failed to set default address:', error);
      alert('เกิดข้อผิดพลาดในการตั้งที่อยู่หลัก');
    }
  };

  const selectedProvinceObj = provincesData.find(p => p.name_th === formData.province);
  const amphures = selectedProvinceObj?.amphure || [];
  const selectedAmphureObj = amphures.find(a => a.name_th === formData.district);
  const tambons = selectedAmphureObj?.tambon || [];

  return (
    <>
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">📍 ที่อยู่ของฉัน</h2>
          <Button size="sm" onClick={() => handleOpenModal()}>
            + เพิ่มที่อยู่
          </Button>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <p className="text-[rgb(var(--text-muted))]">กำลังโหลดข้อมูลที่อยู่...</p>
            </div>
          ) : addresses.length === 0 ? (
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
            <Button type="button" variant="ghost" onClick={handleCloseModal} fullWidth disabled={isSaving}>
              ยกเลิก
            </Button>
            <Button type="submit" fullWidth disabled={isSaving}>
              {isSaving ? 'กำลังบันทึก...' : 'บันทึก'}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
