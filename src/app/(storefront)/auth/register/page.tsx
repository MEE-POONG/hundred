'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [serverError, setServerError] = useState('');

  const validateForm = () => {
    const newErrors: Record<string, boolean> = {};

    if (!formData.name.trim()) {
      newErrors.name = true;
    }

    if (!formData.email.includes('@')) {
      newErrors.email = true;
    }

    if (formData.password.length < 6) {
      newErrors.password = true;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = true;
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = true;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: false,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      // Register
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data.error || 'เกิดข้อผิดพลาด');
        setIsLoading(false);
        return;
      }

      // Auto-login after registration
      const loginResult = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (loginResult?.ok) {
        router.push('/');
        router.refresh();
      } else {
        router.push('/auth/login');
      }
    } catch (err) {
      setServerError('เกิดข้อผิดพลาด กรุณาลองใหม่');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl font-bold text-gradient mb-2">💊 SupplementShop</div>
          <p className="text-[rgb(var(--text-muted))]">สร้างบัญชีใหม่</p>
        </div>

        {/* Register Form Card */}
        <Card className="p-8 mb-6" elevated>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium mb-2">👤 ชื่อ-สกุล</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="สมชาย ใจดี"
                className={`w-full px-4 py-3 bg-white/5 border rounded-xl focus:outline-none transition-colors ${errors.name
                    ? 'border-[rgb(var(--error))] focus:border-[rgb(var(--error))]'
                    : 'border-white/[0.08] focus:border-[rgb(var(--primary))]'
                  }`}
                required
              />
              {errors.name && (
                <p className="text-xs text-[rgb(var(--error))] mt-1">กรุณากรอกชื่อ-สกุล</p>
              )}
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium mb-2">📧 อีเมล</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your@email.com"
                className={`w-full px-4 py-3 bg-white/5 border rounded-xl focus:outline-none transition-colors ${errors.email
                    ? 'border-[rgb(var(--error))] focus:border-[rgb(var(--error))]'
                    : 'border-white/[0.08] focus:border-[rgb(var(--primary))]'
                  }`}
                required
              />
              {errors.email && (
                <p className="text-xs text-[rgb(var(--error))] mt-1">กรุณากรอกอีเมลที่ถูกต้อง</p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium mb-2">🔐 รหัสผ่าน</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="ต้องมีอย่างน้อย 6 ตัวอักษร"
                  className={`w-full px-4 py-3 bg-white/5 border rounded-xl focus:outline-none transition-colors pr-10 ${errors.password
                      ? 'border-[rgb(var(--error))] focus:border-[rgb(var(--error))]'
                      : 'border-white/[0.08] focus:border-[rgb(var(--primary))]'
                    }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgb(var(--text-muted))] hover:text-[rgb(var(--text))]"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-[rgb(var(--error))] mt-1">รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร</p>
              )}
            </div>

            {/* Confirm Password Input */}
            <div>
              <label className="block text-sm font-medium mb-2">🔐 ยืนยันรหัสผ่าน</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 bg-white/5 border rounded-xl focus:outline-none transition-colors pr-10 ${errors.confirmPassword
                      ? 'border-[rgb(var(--error))] focus:border-[rgb(var(--error))]'
                      : 'border-white/[0.08] focus:border-[rgb(var(--primary))]'
                    }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgb(var(--text-muted))] hover:text-[rgb(var(--text))]"
                >
                  {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-[rgb(var(--error))] mt-1">รหัสผ่านไม่ตรงกัน</p>
              )}
            </div>

            {/* Terms Checkbox */}
            <div>
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleInputChange}
                  className="w-4 h-4 rounded mt-1 flex-shrink-0"
                />
                <span className="text-sm">
                  ฉันยอมรับ{' '}
                  <Link href="/policy" className="text-[rgb(var(--primary))] hover:underline">
                    นโยบายความเป็นส่วนตัว
                  </Link>
                  {' '}และ{' '}
                  <Link href="/policy" className="text-[rgb(var(--primary))] hover:underline">
                    เงื่อนไขการใช้งาน
                  </Link>
                </span>
              </label>
              {errors.agreeTerms && (
                <p className="text-xs text-[rgb(var(--error))] mt-1">กรุณายอมรับเงื่อนไข</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? '🔄 กำลังสร้างบัญชี...' : '✓ สร้างบัญชี'}
            </Button>
          </form>
        </Card>

        {/* Login Link */}
        <Card className="p-6 text-center">
          <p className="text-[rgb(var(--text-muted))] mb-2">
            มีบัญชีแล้ว?
          </p>
          <Link href="/auth/login">
            <Button fullWidth variant="outline">
              🔓 เข้าสู่ระบบ
            </Button>
          </Link>
        </Card>

        {/* Info */}
        <div className="mt-8 text-center text-xs text-[rgb(var(--text-muted))]">
          <p>📱 บัญชี SupplementShop ของคุณใช้ได้ทั่วทั้งแพลตฟอร์ม</p>
        </div>
      </div>
    </div>
  );
}
