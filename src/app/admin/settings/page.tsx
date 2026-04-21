'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface StoreSettingsData {
  name: string;
  logo: string;
  description: string;
  phone: string;
  email: string;
  address: string;
  businessHours: string;
  paymentMethods: { name: string; icon: string; enabled: boolean }[];
  shippingMethods: { name: string; icon: string; enabled: boolean }[];
  bankAccounts: { bankName: string; accountName: string; accountNumber: string; enabled: boolean }[];
  promptPayId: string;
}

export default function AdminSettings() {
  const [storeData, setStoreData] = useState<StoreSettingsData>({
    name: '',
    description: '',
    phone: '',
    email: '',
    address: '',
    businessHours: '',
    logo: '',
    paymentMethods: [],
    shippingMethods: [],
    bankAccounts: [],
    promptPayId: '',
  });

  const [theme, setTheme] = useState('dark');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Fetch settings on load
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          setStoreData(data);
        }
      } catch (error) {
        console.error('Failed to load settings', error);
      }
    };
    fetchSettings();
  }, []);

  const handleStoreChange = (field: string, value: string) => {
    setStoreData({ ...storeData, [field]: value });
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');

      const data = await res.json();
      setStoreData((prev) => ({ ...prev, logo: data.url })); // Update logo URL
      setSuccessMessage('อัปโหลดรูปสำเร็จ!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Upload error:', error);
      alert('เกิดข้อผิดพลาดในการอัปโหลดรูป');
    } finally {
      setLoading(false);
    }
  };


  const handleSaveStore = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(storeData),
      });

      if (!res.ok) throw new Error('Failed to save');

      setSuccessMessage('บันทึกข้อมูลร้านเรียบร้อยแล้ว!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Save error:', error);
      alert('บันทึกข้อมูลไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">Settings</h1>
        <p className="text-[rgb(var(--text-muted))]">ตั้งค่าระบบและข้อมูลร้าน</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {successMessage && (
            <div className="p-4 bg-green-500/20 text-green-400 rounded-lg animate-fade-in border border-green-500/30">
              ✅ {successMessage}
            </div>
          )}

          {/* Store Profile */}
          <div className="card-surface p-8">
            <h2 className="text-xl font-bold text-white mb-6">โปรไฟล์ร้าน</h2>

            <div className="space-y-6">
              {/* Logo */}
              <div>
                <label className="text-sm text-[rgb(var(--text-muted))] block mb-3">โลโก้ร้าน</label>
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 relative rounded-lg overflow-hidden border border-white/[0.08]">
                    {storeData.logo ? (
                      <Image
                        src={storeData.logo}
                        alt="Store Logo"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-white/5 flex items-center justify-center text-gray-400">
                        No Logo
                      </div>
                    )}
                  </div>
                  <label className="cursor-pointer px-6 py-2 border border-white/[0.08] rounded-lg text-white hover:bg-white/5 transition-colors font-medium">
                    {loading ? 'กำลังอัปโหลด...' : 'เปลี่ยนรูป'}
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      disabled={loading}
                    />
                  </label>
                </div>
              </div>

              {/* Store Name */}
              <div>
                <label className="text-sm text-[rgb(var(--text-muted))] block mb-2">ชื่อร้าน</label>
                <input
                  type="text"
                  value={storeData.name}
                  onChange={(e) => handleStoreChange('name', e.target.value)}
                  className="w-full px-4 py-2 bg-white/5 border border-white/[0.08] rounded-lg text-white placeholder-[rgb(var(--text-muted))] focus:outline-none focus:border-[rgb(var(--primary))]"
                  suppressHydrationWarning
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-sm text-[rgb(var(--text-muted))] block mb-2">คำอธิบายร้าน</label>
                <textarea
                  value={storeData.description}
                  onChange={(e) => handleStoreChange('description', e.target.value)}
                  className="w-full px-4 py-2 bg-white/5 border border-white/[0.08] rounded-lg text-white placeholder-[rgb(var(--text-muted))] focus:outline-none focus:border-[rgb(var(--primary))] resize-none h-24"
                />
              </div>

              {/* Contact Info */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-[rgb(var(--text-muted))] block mb-2">โทรศัพท์</label>
                  <input
                    type="tel"
                    value={storeData.phone}
                    onChange={(e) => handleStoreChange('phone', e.target.value)}
                    className="w-full px-4 py-2 bg-white/5 border border-white/[0.08] rounded-lg text-white placeholder-[rgb(var(--text-muted))] focus:outline-none focus:border-[rgb(var(--primary))]"
                    suppressHydrationWarning
                  />
                </div>

                <div>
                  <label className="text-sm text-[rgb(var(--text-muted))] block mb-2">อีเมล</label>
                  <input
                    type="email"
                    value={storeData.email}
                    onChange={(e) => handleStoreChange('email', e.target.value)}
                    className="w-full px-4 py-2 bg-white/5 border border-white/[0.08] rounded-lg text-white placeholder-[rgb(var(--text-muted))] focus:outline-none focus:border-[rgb(var(--primary))]"
                    suppressHydrationWarning
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="text-sm text-[rgb(var(--text-muted))] block mb-2">ที่อยู่</label>
                <textarea
                  value={storeData.address}
                  onChange={(e) => handleStoreChange('address', e.target.value)}
                  className="w-full px-4 py-2 bg-white/5 border border-white/[0.08] rounded-lg text-white placeholder-[rgb(var(--text-muted))] focus:outline-none focus:border-[rgb(var(--primary))] resize-none h-20"
                />
              </div>

              {/* Business Hours */}
              <div>
                <label className="text-sm text-[rgb(var(--text-muted))] block mb-2">เวลาเปิดทำการ</label>
                <input
                  type="text"
                  value={storeData.businessHours}
                  onChange={(e) => handleStoreChange('businessHours', e.target.value)}
                  className="w-full px-4 py-2 bg-white/5 border border-white/[0.08] rounded-lg text-white placeholder-[rgb(var(--text-muted))] focus:outline-none focus:border-[rgb(var(--primary))]"
                  placeholder="09:00 - 22:00"
                  suppressHydrationWarning
                />
              </div>

              {/* Save Button */}
              <button
                onClick={handleSaveStore}
                disabled={loading}
                className="w-full px-6 py-3 bg-gradient-primary text-white rounded-lg hover:opacity-90 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'กำลังบันทึก...' : 'บันทึกข้อมูลร้าน'}
              </button>
            </div>
          </div>

          <div className="card-surface p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">วิธีการชำระเงิน</h2>
            </div>

            <div className="space-y-6">
              {/* PromptPay Setting */}
              <div className="p-4 bg-white/5 border border-white/[0.08] rounded-xl">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">💳</span>
                  <h3 className="text-white font-medium">ตั้งค่าพร้อมเพย์ (PromptPay)</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-[rgb(var(--text-muted))] block mb-1">หมายเลขบัตรประชาชน หรือเบอร์โทรศัพท์ (สำหรับสร้าง QR Code)</label>
                    <input
                      type="text"
                      value={storeData.promptPayId}
                      onChange={(e) => handleStoreChange('promptPayId', e.target.value)}
                      placeholder="0812345678"
                      className="w-full px-4 py-2 bg-white/5 border border-white/[0.08] rounded-lg text-white focus:outline-none focus:border-[rgb(var(--primary))]"
                    />
                  </div>
                </div>
              </div>

              {/* Bank Accounts */}
              <div className="p-4 bg-white/5 border border-white/[0.08] rounded-xl">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🏦</span>
                    <h3 className="text-white font-medium">บัญชีธนาคารสำหรับโอนเงิน</h3>
                  </div>
                  <button
                    onClick={() => {
                      const newBankAccounts = [...(storeData.bankAccounts || []), { bankName: '', accountName: '', accountNumber: '', enabled: true }];
                      setStoreData({ ...storeData, bankAccounts: newBankAccounts });
                    }}
                    className="text-sm text-[rgb(var(--primary))] hover:underline"
                  >
                    + เพิ่มบัญชี
                  </button>
                </div>

                <div className="space-y-4">
                  {storeData.bankAccounts?.map((bank, idx) => (
                    <div key={idx} className="p-4 bg-black/20 border border-white/[0.05] rounded-lg space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="text-xs text-[rgb(var(--text-muted))] block mb-1">ชื่อธนาคาร</label>
                          <input
                            type="text"
                            value={bank.bankName}
                            onChange={(e) => {
                              const newBanks = [...storeData.bankAccounts];
                              newBanks[idx].bankName = e.target.value;
                              setStoreData({ ...storeData, bankAccounts: newBanks });
                            }}
                            placeholder="กสิกรไทย, ไทยพาณิชย์..."
                            className="w-full px-3 py-1.5 bg-white/5 border border-white/[0.08] rounded text-sm text-white"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-[rgb(var(--text-muted))] block mb-1">ชื่อบัญชี</label>
                          <input
                            type="text"
                            value={bank.accountName}
                            onChange={(e) => {
                              const newBanks = [...storeData.bankAccounts];
                              newBanks[idx].accountName = e.target.value;
                              setStoreData({ ...storeData, bankAccounts: newBanks });
                            }}
                            placeholder="นายสมชาย มั่งคั่ง"
                            className="w-full px-3 py-1.5 bg-white/5 border border-white/[0.08] rounded text-sm text-white"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-[rgb(var(--text-muted))] block mb-1">เลขบัญชี</label>
                          <input
                            type="text"
                            value={bank.accountNumber}
                            onChange={(e) => {
                              const newBanks = [...storeData.bankAccounts];
                              newBanks[idx].accountNumber = e.target.value;
                              setStoreData({ ...storeData, bankAccounts: newBanks });
                            }}
                            placeholder="012-3-45678-9"
                            className="w-full px-3 py-1.5 bg-white/5 border border-white/[0.08] rounded text-sm text-white"
                          />
                        </div>
                      </div>
                      <div className="flex justify-between items-center pt-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={bank.enabled}
                            onChange={(e) => {
                              const newBanks = [...storeData.bankAccounts];
                              newBanks[idx].enabled = e.target.checked;
                              setStoreData({ ...storeData, bankAccounts: newBanks });
                            }}
                            className="w-4 h-4 accent-[rgb(var(--primary))]"
                          />
                          <span className="text-xs text-white">แสดงในหน้าชำระเงิน</span>
                        </label>
                        <button
                          onClick={() => {
                            const newBanks = storeData.bankAccounts.filter((_, i) => i !== idx);
                            setStoreData({ ...storeData, bankAccounts: newBanks });
                          }}
                          className="text-xs text-red-400 hover:text-red-300"
                        >
                          ลบบัญชี
                        </button>
                      </div>
                    </div>
                  ))}
                  {(!storeData.bankAccounts || storeData.bankAccounts.length === 0) && (
                    <p className="text-center text-sm text-[rgb(var(--text-muted))] py-4 italic">ยังไม่มีบัญชีธนาคาร</p>
                  )}
                </div>
              </div>

              {/* Payment Methods Checkboxes */}
              <div className="p-4 bg-white/5 border border-white/[0.08] rounded-xl">
                <h3 className="text-white font-medium mb-4">เปิด/ปิด ช่องทางการชำระเงิน</h3>
                <div className="space-y-4">
                  {[
                    { id: 'promptpay', name: 'พร้อมเพย์ (PromptPay QR)', icon: '📱' },
                    { id: 'bank_transfer', name: 'โอนผ่านบัญชีธนาคาร', icon: '🏦' },
                    { id: 'credit_card', name: 'บัตรเครดิต/เดบิต', icon: '💳', disabled: true },
                  ].map((payment, idx) => {
                    // This section currently has simplified handling as requested
                    const isEnabled = storeData.paymentMethods?.find(p => p.name === payment.id)?.enabled ?? (payment.id !== 'credit_card');
                    return (
                      <label key={idx} className={`flex items-center gap-3 p-4 bg-white/5 border border-white/[0.08] rounded-lg cursor-pointer hover:bg-white/10 transition-colors ${payment.disabled ? 'opacity-50' : ''}`}>
                        <input
                          type="checkbox"
                          checked={isEnabled}
                          disabled={payment.disabled}
                          onChange={(e) => {
                            const currentMethods = storeData.paymentMethods || [];
                            const exists = currentMethods.find(p => p.name === payment.id);
                            let newMethods;
                            if (exists) {
                              newMethods = currentMethods.map(p => p.name === payment.id ? { ...p, enabled: e.target.checked } : p);
                            } else {
                              newMethods = [...currentMethods, { name: payment.id, icon: payment.icon, enabled: e.target.checked }];
                            }
                            setStoreData({ ...storeData, paymentMethods: newMethods });
                          }}
                          className="w-4 h-4 rounded accent-pink-500"
                        />
                        <span className="text-lg">{payment.icon}</span>
                        <div className="flex-1">
                          <span className="text-white font-medium block">{payment.name}</span>
                          {payment.disabled && <span className="text-[10px] text-yellow-500">ยังไม่เปิดใช้งาน (เร็วๆ นี้)</span>}
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Settings */}
          <div className="card-surface p-8">
            <h2 className="text-xl font-bold text-white mb-6">วิธีการจัดส่ง</h2>

            <div className="space-y-4">
              {[
                { name: 'Kerry Express', icon: '📦' },
                { name: 'Flash Express', icon: '⚡' },
                { name: 'J&T Express', icon: '🚚' },
              ].map((shipping, idx) => (
                <label key={idx} className="flex items-center gap-3 p-4 bg-white/5 border border-white/[0.08] rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded accent-pink-500" suppressHydrationWarning />
                  <span className="text-lg">{shipping.icon}</span>
                  <span className="text-white font-medium">{shipping.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Theme Preview */}
          <div className="card-surface p-6">
            <h2 className="text-lg font-bold text-white mb-4">ธีมตัวอย่าง</h2>

            <div className="space-y-3 mb-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="theme"
                  value="dark"
                  checked={theme === 'dark'}
                  onChange={(e) => setTheme(e.target.value)}
                  className="w-4 h-4 accent-pink-500"
                  suppressHydrationWarning
                />
                <span className="text-white">โหมดมืด (ปัจจุบัน)</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="theme"
                  value="light"
                  onChange={(e) => setTheme(e.target.value)}
                  className="w-4 h-4 accent-pink-500"
                  suppressHydrationWarning
                />
                <span className="text-white">โหมดสว่าง</span>
              </label>
            </div>

            {/* Preview */}
            <div className={`p-4 rounded-lg border-2 border-white/[0.08] ${theme === 'dark' ? 'bg-[rgb(var(--surface))]' : 'bg-gray-100'
              }`}>
              <div className={`text-center space-y-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                <p className="text-sm font-medium">ตัวอย่างธีม</p>
                <div className="flex gap-2 justify-center">
                  <div className={`w-4 h-4 rounded-full ${theme === 'dark' ? 'bg-pink-500' : 'bg-pink-500'}`}></div>
                  <div className={`w-4 h-4 rounded-full ${theme === 'dark' ? 'bg-purple-500' : 'bg-purple-500'}`}></div>
                  <div className={`w-4 h-4 rounded-full ${theme === 'dark' ? 'bg-pink-400' : 'bg-pink-400'}`}></div>
                </div>
              </div>
            </div>
          </div>

          {/* System Info */}
          <div className="card-surface p-6">
            <h2 className="text-lg font-bold text-white mb-4">ข้อมูลระบบ</h2>

            <div className="space-y-3 text-sm">
              <div>
                <p className="text-[rgb(var(--text-muted))] mb-1">เวอร์ชัน</p>
                <p className="text-white font-mono">v1.0.0</p>
              </div>

              <div>
                <p className="text-[rgb(var(--text-muted))] mb-1">สถานะ</p>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <p className="text-white">ใช้งานได้</p>
                </div>
              </div>

              <div>
                <p className="text-[rgb(var(--text-muted))] mb-1">ฐานข้อมูล</p>
                <p className="text-white font-mono text-xs break-all">Connected</p>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="card-surface p-6 border-red-500/30">
            <h2 className="text-lg font-bold text-red-400 mb-4">⚠️ โซนอันตราย</h2>

            <div className="space-y-2">
              <button
                onClick={() => {
                  if (confirm('ยืนยันล้างแคช? หน้าจะถูกรีโหลดใหม่')) {
                    window.location.reload();
                  }
                }}
                className="w-full px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/30 transition-colors font-medium text-sm"
              >
                🗑️ ล้างแคช
              </button>

              <button
                onClick={async () => {
                  if (!confirm('⚠️ ยืนยันรีเซ็ตข้อมูลร้านกลับเป็นค่าเริ่มต้น? ข้อมูลที่ตั้งไว้จะถูกลบ')) return;
                  try {
                    const res = await fetch('/api/settings', {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        name: 'ร้านค้าของฉัน',
                        description: '',
                        phone: '',
                        email: '',
                        address: '',
                        businessHours: '',
                        logo: '',
                      }),
                    });
                    if (res.ok) {
                      setSuccessMessage('รีเซ็ตระบบเรียบร้อยแล้ว!');
                      setTimeout(() => setSuccessMessage(''), 3000);
                      window.location.reload();
                    }
                  } catch (err) {
                    console.error(err);
                    alert('เกิดข้อผิดพลาด');
                  }
                }}
                className="w-full px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/30 transition-colors font-medium text-sm"
              >
                🔄 รีเซ็ตระบบ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
