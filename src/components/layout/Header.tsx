"use client";

import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";

export default function Header() {
  const { getCartCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-surface border-b border-text-muted/10 sticky top-0 z-40">
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">NV</span>
            </div>
            <div>
              <div className="text-xl font-bold text-text-primary">NOIR VITA</div>
              <div className="text-xs text-text-muted">Professional Daily Supplement Care</div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/products"
              className="text-text-primary hover:text-primary transition-colors"
            >
              Products
            </Link>
            <Link
              href="/certifications"
              className="text-text-primary hover:text-primary transition-colors"
            >
              Certifications
            </Link>
            <Link
              href="/blog"
              className="text-text-primary hover:text-primary transition-colors"
            >
              Health Articles
            </Link>
            <Link
              href="/account/orders"
              className="text-text-primary hover:text-primary transition-colors"
            >
              Orders
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Link
              href="/cart"
              className="relative p-2 text-text-primary hover:text-primary transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getCartCount()}
                </span>
              )}
            </Link>

            <button
              className="md:hidden p-2 text-text-primary"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-text-muted/10">
            <div className="flex flex-col space-y-4">
              <Link
                href="/products"
                className="text-text-primary hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                href="/certifications"
                className="text-text-primary hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Certifications
              </Link>
              <Link
                href="/blog"
                className="text-text-primary hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Health Articles
              </Link>
              <Link
                href="/account/orders"
                className="text-text-primary hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Orders
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
