'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useCart } from '@/contexts/CartContext';

export default function Header() {
  const { totalItems } = useCart();
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[rgb(var(--background))]/95 backdrop-blur-lg border-b border-white/[0.08]">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="text-2xl font-bold text-gradient group-hover:glow-pink transition-all">
              💊 SupplementShop
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/products" className="text-[rgb(var(--text-muted))] hover:text-[rgb(var(--text))] transition-colors">
              สินค้า
            </Link>
            <Link href="/tickets" className="text-[rgb(var(--text-muted))] hover:text-[rgb(var(--text))] transition-colors">
              🎫 ระบบตั๋ว
            </Link>
            <Link href="/orders" className="text-[rgb(var(--text-muted))] hover:text-[rgb(var(--text))] transition-colors">
              ออเดอร์
            </Link>
            <Link href="/help" className="text-[rgb(var(--text-muted))] hover:text-[rgb(var(--text))] transition-colors">
              ช่วยเหลือ
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/cart"
              className="relative p-2 hover:bg-white/5 rounded-xl transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-primary text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full glow-pink">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Auth Section - Desktop */}
            {status === 'loading' ? (
              <div className="hidden md:flex items-center gap-2 animate-pulse">
                <div className="w-8 h-8 bg-white/10 rounded-full"></div>
                <div className="w-20 h-4 bg-white/10 rounded"></div>
              </div>
            ) : session ? (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  href="/account"
                  className="flex items-center gap-2 px-3 py-1.5 hover:bg-white/5 rounded-xl transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-primary flex items-center justify-center text-white text-xs font-bold">
                    {session.user?.name?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  <span className="text-sm max-w-[100px] truncate">{session.user?.name}</span>
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="p-2 text-[rgb(var(--text-muted))] hover:text-[rgb(var(--error))] hover:bg-white/5 rounded-xl transition-colors text-sm"
                  title="ออกจากระบบ"
                >
                  🚪
                </button>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="hidden md:flex items-center gap-1 px-4 py-2 bg-gradient-primary text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                เข้าสู่ระบบ
              </Link>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-white/5 rounded-xl transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/[0.08]">
            <nav className="flex flex-col gap-4">
              <Link href="/products" className="text-[rgb(var(--text-muted))] hover:text-[rgb(var(--text))]">
                สินค้า
              </Link>
              <Link href="/tickets" className="text-[rgb(var(--text-muted))] hover:text-[rgb(var(--text))]">
                🎫 ระบบตั๋ว
              </Link>
              <Link href="/orders" className="text-[rgb(var(--text-muted))] hover:text-[rgb(var(--text))]">
                ออเดอร์
              </Link>
              <Link href="/account" className="text-[rgb(var(--text-muted))] hover:text-[rgb(var(--text))]">
                บัญชี
              </Link>
              <Link href="/help" className="text-[rgb(var(--text-muted))] hover:text-[rgb(var(--text))]">
                ช่วยเหลือ
              </Link>
              {session ? (
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="text-left text-[rgb(var(--error))] hover:opacity-80"
                >
                  🚪 ออกจากระบบ ({session.user?.name})
                </button>
              ) : (
                <Link href="/auth/login" className="text-[rgb(var(--primary))] font-semibold">
                  🔓 เข้าสู่ระบบ
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

