'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

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
        setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
        setIsLoading(false);
        return;
      }

      // Check if user is admin by trying to access admin page
      router.push('/admin/dashboard');
      router.refresh();
    } catch (err) {
      setError('เกิดข้อผิดพลาด กรุณาลองใหม่');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[rgb(var(--background))] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-primary mb-4">
            <span className="text-2xl font-bold text-white">A</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Panel</h1>
          <p className="text-[rgb(var(--text-muted))]">ระบบจัดการร้าน SupplementShop</p>
        </div>

        {/* Form Card */}
        <div className="card-surface p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm text-red-400">
                ⚠️ {error}
              </div>
            )}

            {/* Email Input */}
            <div>
              <label className="text-sm text-[rgb(var(--text-muted))] block mb-2">อีเมล</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@supplementshop.com"
                className="w-full px-4 py-3 bg-white/5 border border-white/[0.08] rounded-lg text-white placeholder-[rgb(var(--text-muted))] focus:outline-none focus:border-[rgb(var(--primary))] transition-colors"
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="text-sm text-[rgb(var(--text-muted))] block mb-2">รหัสผ่าน</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-white/5 border border-white/[0.08] rounded-lg text-white placeholder-[rgb(var(--text-muted))] focus:outline-none focus:border-[rgb(var(--primary))] transition-colors"
              />
            </div>

            {/* Remember Me */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded accent-pink-500"
              />
              <span className="text-sm text-[rgb(var(--text-muted))]">จำไว้ในอุปกรณ์นี้</span>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-3 bg-gradient-primary text-white rounded-lg hover:opacity-90 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="animate-spin">⟳</span>
                  กำลังเข้าสู่ระบบ...
                </>
              ) : (
                'เข้าสู่ระบบ'
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-[rgb(var(--text-muted))]">
          <p>© 2025 SupplementShop. All rights reserved.</p>
        </div>
      </div>

      {/* Background Decoration */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-20 right-10 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}
