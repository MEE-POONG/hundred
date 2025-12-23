'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';

export default function Header() {
  const { totalItems } = useCart();
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

            <Link
              href="/account"
              className="hidden md:block p-2 hover:bg-white/5 rounded-xl transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>

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
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
