'use client';

import React, { useState } from 'react';
import Card from '@/components/ui/Card';

export default function SettingNotice() {
  const [settings, setSettings] = useState({
    emailNotify: true,
    smsNotify: true,
    marketing: false,
    darkMode: true
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
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
              <input 
                type="checkbox" 
                checked={settings.emailNotify} 
                onChange={() => handleToggle('emailNotify')}
                className="w-4 h-4" 
              />
              <span className="ml-2 text-sm">{settings.emailNotify ? 'เปิด' : 'ปิด'}</span>
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
              <input 
                type="checkbox" 
                checked={settings.smsNotify} 
                onChange={() => handleToggle('smsNotify')}
                className="w-4 h-4" 
              />
              <span className="ml-2 text-sm">{settings.smsNotify ? 'เปิด' : 'ปิด'}</span>
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
              <input 
                type="checkbox" 
                checked={settings.marketing}
                onChange={() => handleToggle('marketing')}
                className="w-4 h-4" 
              />
              <span className="ml-2 text-sm">{settings.marketing ? 'เปิด' : 'ปิด'}</span>
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
              <input 
                type="checkbox" 
                checked={settings.darkMode}
                onChange={() => handleToggle('darkMode')}
                className="w-4 h-4" 
              />
              <span className="ml-2 text-sm">{settings.darkMode ? 'เปิด' : 'ปิด'}</span>
            </label>
          </div>
        </Card>
      </div>
    </div>
  );
}
