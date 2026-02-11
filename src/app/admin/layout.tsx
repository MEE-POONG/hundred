'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';

const adminMenuItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/admin/products', label: 'Products', icon: '📦' },
  { href: '/admin/orders', label: 'Orders', icon: '🛒' },
  { href: '/admin/inventory', label: 'Inventory', icon: '📦' },
  { href: '/admin/tickets', label: 'Tickets', icon: '🎫' },
  { href: '/admin/redemptions', label: 'Redemptions', icon: '🎁' },
  { href: '/admin/users', label: 'Users', icon: '👥' },
  { href: '/admin/reports', label: 'Reports', icon: '📈' },
  { href: '/admin/settings', label: 'Settings', icon: '⚙️' },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-[rgb(var(--background))]">
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-[rgb(var(--surface))] border-r border-white/[0.08] transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'
          } overflow-y-auto`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/[0.08] flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center text-white font-bold">
                A
              </div>
              <span className="text-lg font-bold text-white">Admin</span>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
          >
            {sidebarOpen ? '←' : '→'}
          </button>
        </div>

        {/* Menu */}
        <nav className="p-4 space-y-2">
          {adminMenuItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                  ? 'bg-gradient-primary text-white'
                  : 'text-[rgb(var(--text-muted))] hover:bg-white/5'
                  }`}
              >
                <span className="text-xl">{item.icon}</span>
                {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Topbar */}
        <header className="sticky top-0 h-16 bg-[rgb(var(--surface))] border-b border-white/[0.08] flex items-center justify-between px-8 z-40">
          <div className="flex-1 flex items-center gap-4">
            <input
              type="text"
              placeholder="ค้นหา..."
              className="w-64 px-4 py-2 bg-white/5 border border-white/[0.08] rounded-lg text-[rgb(var(--text))] placeholder-[rgb(var(--text-muted))] focus:outline-none focus:border-[rgb(var(--primary))]"
            />
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button className="p-2 hover:bg-white/5 rounded-lg transition-colors relative">
              <span className="text-xl">🔔</span>
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User Chip */}
            <div className="flex items-center gap-3 pl-4 border-l border-white/[0.08]">
              <div className="text-right">
                <div className="text-sm font-medium text-white">ผู้ดูแลระบบ</div>
                <div className="text-xs text-[rgb(var(--text-muted))]">admin@shop.com</div>
              </div>
              <img
                src="https://ui-avatars.com/api/?name=Admin&background=FF4D9D&color=fff&size=40"
                alt="Admin"
                className="w-10 h-10 rounded-full"
              />
              <button
                onClick={() => signOut({ callbackUrl: '/admin/login' })}
                className="ml-2 p-2 hover:bg-red-500/10 text-red-400 rounded-lg transition-colors"
                title="ออกจากระบบ"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
