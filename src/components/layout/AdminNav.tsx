"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminNav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: "📊" },
    { href: "/admin/products", label: "Products", icon: "📦" },
    { href: "/admin/orders", label: "Orders", icon: "🛒" },
    { href: "/admin/customers", label: "Customers", icon: "👥" },
    { href: "/admin/payments", label: "Payments", icon: "💳" },
  ];

  return (
    <nav className="bg-surface border-b border-text-muted/10">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          <Link href="/admin/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
              <span className="text-white font-bold">NV</span>
            </div>
            <span className="font-bold text-text-primary">Admin Panel</span>
          </Link>

          <div className="hidden md:flex space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  pathname === item.href
                    ? "bg-primary text-white"
                    : "text-text-muted hover:text-text-primary hover:bg-surface"
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>

          <Link href="/" className="text-sm text-text-muted hover:text-primary transition-colors">
            ← Back to Store
          </Link>
        </div>
      </div>
    </nav>
  );
}
