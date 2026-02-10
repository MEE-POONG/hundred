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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1.5 sm:gap-2 group shrink-0">
            <span className="text-lg sm:text-xl md:text-2xl font-bold text-gradient group-hover:glow-pink transition-all">
              💊 SupplementShop
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-6">
            <Link href="/products" className="text-sm lg:text-base text-[rgb(var(--text-muted))] hover:text-[rgb(var(--text))] transition-colors whitespace-nowrap">
              สินค้า
            </Link>
            <Link href="/tickets" className="text-sm lg:text-base text-[rgb(var(--text-muted))] hover:text-[rgb(var(--text))] transition-colors whitespace-nowrap">
              🎫 ระบบตั๋ว
            </Link>
            <Link href="/orders" className="text-sm lg:text-base text-[rgb(var(--text-muted))] hover:text-[rgb(var(--text))] transition-colors whitespace-nowrap">
              ออเดอร์
            </Link>
            <Link href="/help" className="text-sm lg:text-base text-[rgb(var(--text-muted))] hover:text-[rgb(var(--text))] transition-colors whitespace-nowrap">
              ช่วยเหลือ
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-1.5 sm:p-2 hover:bg-white/5 rounded-xl transition-colors"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 bg-gradient-primary text-white text-[10px] sm:text-xs font-bold w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center rounded-full glow-pink">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Auth Section - Desktop */}
            {status === 'loading' ? (
              <div className="hidden md:flex items-center gap-2 animate-pulse">
                <div className="w-7 h-7 lg:w-8 lg:h-8 bg-white/10 rounded-full"></div>
                <div className="w-16 lg:w-20 h-4 bg-white/10 rounded hidden lg:block"></div>
              </div>
            ) : session ? (
              <div className="hidden md:flex items-center gap-1 lg:gap-2">
                <Link
                  href="/account"
                  className="flex items-center gap-1.5 lg:gap-2 px-2 lg:px-3 py-1.5 hover:bg-white/5 rounded-xl transition-colors"
                >
                  <div className="w-6 h-6 lg:w-7 lg:h-7 rounded-full bg-gradient-primary flex items-center justify-center text-white text-[10px] lg:text-xs font-bold shrink-0">
                    {session.user?.name?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  <span className="text-sm max-w-[80px] lg:max-w-[100px] truncate hidden lg:inline">{session.user?.name}</span>
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="p-1.5 lg:p-2 text-[rgb(var(--text-muted))] hover:text-[rgb(var(--error))] hover:bg-white/5 rounded-xl transition-colors text-sm"
                  title="ออกจากระบบ"
                >
                  🚪
                </button>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="hidden md:flex items-center gap-1 px-3 lg:px-4 py-1.5 lg:py-2 bg-gradient-primary text-white rounded-xl text-xs lg:text-sm font-semibold hover:opacity-90 transition-opacity whitespace-nowrap"
              >
                เข้าสู่ระบบ
              </Link>
            )}

            {/* Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 sm:p-2 hover:bg-white/5 rounded-xl transition-colors"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <div className="md:hidden py-3 sm:py-4 border-t border-white/[0.08] animate-scale-in">
            <nav className="flex flex-col gap-1">
              <Link href="/products" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2.5 rounded-xl text-sm text-[rgb(var(--text-muted))] hover:text-[rgb(var(--text))] hover:bg-white/5 transition-colors">
                🛍️ สินค้า
              </Link>
              <Link href="/tickets" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2.5 rounded-xl text-sm text-[rgb(var(--text-muted))] hover:text-[rgb(var(--text))] hover:bg-white/5 transition-colors">
                🎫 ระบบตั๋ว
              </Link>
              <Link href="/orders" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2.5 rounded-xl text-sm text-[rgb(var(--text-muted))] hover:text-[rgb(var(--text))] hover:bg-white/5 transition-colors">
                📦 ออเดอร์
              </Link>
              <Link href="/account" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2.5 rounded-xl text-sm text-[rgb(var(--text-muted))] hover:text-[rgb(var(--text))] hover:bg-white/5 transition-colors">
                👤 บัญชี
              </Link>
              <Link href="/help" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2.5 rounded-xl text-sm text-[rgb(var(--text-muted))] hover:text-[rgb(var(--text))] hover:bg-white/5 transition-colors">
                ❓ ช่วยเหลือ
              </Link>

              <div className="border-t border-white/[0.08] mt-2 pt-2">
                {session ? (
                  <button
                    onClick={() => { signOut({ callbackUrl: '/' }); setMobileMenuOpen(false); }}
                    className="w-full text-left px-3 py-2.5 rounded-xl text-sm text-[rgb(var(--error))] hover:bg-white/5 transition-colors"
                  >
                    🚪 ออกจากระบบ ({session.user?.name})
                  </button>
                ) : (
                  <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 rounded-xl text-sm text-[rgb(var(--primary))] font-semibold hover:bg-white/5 transition-colors">
                    🔓 เข้าสู่ระบบ
                  </Link>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
