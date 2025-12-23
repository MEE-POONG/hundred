'use client';

import { useState } from 'react';

export default function AdminSettings() {
  const [storeData, setStoreData] = useState({
    name: 'SupplementShop',
    description: 'ร้านขายอาหารเสริมคุณภาพพรีเมียม',
    phone: '02-123-4567',
    email: 'support@supplementshop.com',
    address: '123/45 สยามสแควร์ ถนนราชดำเนิน กรุงเทพ',
    businessHours: '09:00 - 22:00',
    logo: 'https://ui-avatars.com/api/?name=Shop&background=FF4D9D&color=fff&size=128',
  });

  const [theme, setTheme] = useState('dark');

  const handleStoreChange = (field: string, value: string) => {
    setStoreData({ ...storeData, [field]: value });
  };

  const handleSaveStore = () => {
    alert('บันทึกข้อมูลร้านเรียบร้อยแล้ว!');
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
          {/* Store Profile */}
          <div className="card-surface p-8">
            <h2 className="text-xl font-bold text-white mb-6">โปรไฟล์ร้าน</h2>

            <div className="space-y-6">
              {/* Logo */}
              <div>
                <label className="text-sm text-[rgb(var(--text-muted))] block mb-3">โลโก้ร้าน</label>
                <div className="flex items-center gap-6">
                  <img
                    src={storeData.logo}
                    alt="Store Logo"
                    className="w-24 h-24 rounded-lg border border-white/[0.08]"
                  />
                  <button className="px-6 py-2 border border-white/[0.08] rounded-lg text-white hover:bg-white/5 transition-colors font-medium">
                    เปลี่ยนรูป
                  </button>
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
                  />
                </div>

                <div>
                  <label className="text-sm text-[rgb(var(--text-muted))] block mb-2">อีเมล</label>
                  <input
                    type="email"
                    value={storeData.email}
                    onChange={(e) => handleStoreChange('email', e.target.value)}
                    className="w-full px-4 py-2 bg-white/5 border border-white/[0.08] rounded-lg text-white placeholder-[rgb(var(--text-muted))] focus:outline-none focus:border-[rgb(var(--primary))]"
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
                />
              </div>

              {/* Save Button */}
              <button
                onClick={handleSaveStore}
                className="w-full px-6 py-3 bg-gradient-primary text-white rounded-lg hover:opacity-90 transition-all font-semibold"
              >
                บันทึกข้อมูลร้าน
              </button>
            </div>
          </div>

          {/* Payment Settings */}
          <div className="card-surface p-8">
            <h2 className="text-xl font-bold text-white mb-6">วิธีการชำระเงิน</h2>

            <div className="space-y-4">
              {[
                { name: 'พร้อมเพย์', icon: '💳' },
                { name: 'บัตรเครดิต', icon: '🏦' },
                { name: 'โอนเงิน', icon: '🔄' },
              ].map((payment, idx) => (
                <label key={idx} className="flex items-center gap-3 p-4 bg-white/5 border border-white/[0.08] rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded accent-pink-500" />
                  <span className="text-lg">{payment.icon}</span>
                  <span className="text-white font-medium">{payment.name}</span>
                </label>
              ))}
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
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded accent-pink-500" />
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
                />
                <span className="text-white">โหมดสว่าง</span>
              </label>
            </div>

            {/* Preview */}
            <div className={`p-4 rounded-lg border-2 border-white/[0.08] ${
              theme === 'dark' ? 'bg-[rgb(var(--surface))]' : 'bg-gray-100'
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
              <button className="w-full px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/30 transition-colors font-medium text-sm">
                ล้างแคช
              </button>

              <button className="w-full px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/30 transition-colors font-medium text-sm">
                รีเซ็ตระบบ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
