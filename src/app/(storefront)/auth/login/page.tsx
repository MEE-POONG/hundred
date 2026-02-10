'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push('/');
        router.refresh();
      }
    } catch (err) {
      setError('เกิดข้อผิดพลาด กรุณาลองใหม่');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl font-bold text-gradient mb-2">💊 SupplementShop</div>
          <p className="text-[rgb(var(--text-muted))]">ยินดีต้อนรับกลับ</p>
        </div>

        {/* Login Form Card */}
        <Card className="p-8 mb-6" elevated>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-[rgb(var(--error))]/10 border border-[rgb(var(--error))]/30 rounded-xl p-3 text-sm text-[rgb(var(--error))]">
                ⚠️ {error}
              </div>
            )}

            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium mb-2">📧 อีเมล</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 bg-white/5 border border-white/[0.08] rounded-xl focus:outline-none focus:border-[rgb(var(--primary))] transition-colors"
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium mb-2">🔐 รหัสผ่าน</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-white/5 border border-white/[0.08] rounded-xl focus:outline-none focus:border-[rgb(var(--primary))] transition-colors pr-10"
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
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? '🔄 กำลังเข้าสู่ระบบ...' : '✓ เข้าสู่ระบบ'}
            </Button>
          </form>
        </Card>

        {/* Sign Up Link */}
        <Card className="p-6 text-center">
          <p className="text-[rgb(var(--text-muted))] mb-2">
            ยังไม่มีบัญชี?
          </p>
          <Link href="/auth/register">
            <Button fullWidth variant="outline">
              📝 สร้างบัญชีใหม่
            </Button>
          </Link>
        </Card>

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-3 text-center text-xs text-[rgb(var(--text-muted))]">
          <div>
            <div className="text-2xl mb-1">🛍️</div>
            <div>ช้อปได้ทันที</div>
          </div>
          <div>
            <div className="text-2xl mb-1">🎫</div>
            <div>ลุ้นรางวัล</div>
          </div>
          <div>
            <div className="text-2xl mb-1">✨</div>
            <div>สิทธิพิเศษ</div>
          </div>
        </div>
      </div>
    </div>
  );
}
