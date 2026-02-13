'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';

const adminMenuItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/admin/products', label: 'Products', icon: '📦' },
  { href: '/admin/coupons', label: 'Coupons', icon: '🏷️' },
  { href: '/admin/orders', label: 'Orders', icon: '🛒' },
  { href: '/admin/inventory', label: 'Inventory', icon: '📦' },
  { href: '/admin/tickets', label: 'Tickets & Rewards', icon: '🎫' },
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
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false); // New state for mobile
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close notification dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (q.includes('order') || q.includes('ออเดอร์') || q.includes('คำสั่ง')) router.push('/admin/orders');
      else if (q.includes('product') || q.includes('สินค้า')) router.push('/admin/products');
      else if (q.includes('user') || q.includes('ผู้ใช้')) router.push('/admin/users');
      else if (q.includes('ticket') || q.includes('ตั๋ว')) router.push('/admin/tickets');
      else if (q.includes('report') || q.includes('รายงาน')) router.push('/admin/reports');
      else if (q.includes('setting') || q.includes('ตั้งค่า')) router.push('/admin/settings');
      else if (q.includes('inventory') || q.includes('สต็อก')) router.push('/admin/inventory');
      else if (q.includes('redemption') || q.includes('แลก')) router.push('/admin/redemptions');
      else router.push('/admin/dashboard');
      setSearchQuery('');
      setMobileSidebarOpen(false); // Close mobile sidebar after navigation
    }
  };

  // If on login page, render only children without sidebar/header
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[rgb(var(--background))]">
      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-[rgb(var(--surface))] border-r border-white/[0.08] transition-transform duration-300 z-50
          ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          lg:translate-x-0 lg:transition-all
          ${sidebarOpen ? 'lg:w-64' : 'lg:w-20'}
          w-64
        `}
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/[0.08] flex items-center justify-between">
          <div className={`flex items-center gap-2 ${!sidebarOpen && 'lg:hidden'}`}>
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center text-white font-bold">
              A
            </div>
            <span className="text-lg font-bold text-white">Admin</span>
          </div>

          {/* Desktop Toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden lg:block p-1.5 hover:bg-white/10 rounded-lg transition-colors"
          >
            {sidebarOpen ? '←' : '→'}
          </button>

          {/* Mobile Close */}
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="lg:hidden p-1.5 hover:bg-white/10 rounded-lg transition-colors"
          >
            ✕
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
                onClick={() => setMobileSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                  ? 'bg-gradient-primary text-white'
                  : 'text-[rgb(var(--text-muted))] hover:bg-white/5'
                  }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className={`text-sm font-medium ${!sidebarOpen ? 'lg:hidden' : ''}`}>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
        {/* Topbar */}
        <header className="sticky top-0 h-16 bg-[rgb(var(--surface))] border-b border-white/[0.08] flex items-center justify-between px-4 sm:px-8 z-40 gap-4">
          <div className="flex items-center gap-4 flex-1">
            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-white/10 rounded-lg"
            >
              ☰
            </button>

            {/* Search */}
            <input
              type="text"
              placeholder="ค้นหา..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              className="w-full sm:w-64 px-4 py-2 bg-white/5 border border-white/[0.08] rounded-lg text-[rgb(var(--text))] placeholder-[rgb(var(--text-muted))] focus:outline-none focus:border-[rgb(var(--primary))]"
            />
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors relative"
              >
                <span className="text-xl">🔔</span>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {showNotifications && (
                <div className="absolute right-0 top-12 w-80 max-w-[90vw] bg-[rgb(var(--surface))] border border-white/[0.08] rounded-xl shadow-xl z-50 overflow-hidden">
                  <div className="p-4 border-b border-white/[0.08]">
                    <h3 className="font-bold text-white text-sm">การแจ้งเตือน</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    <div className="p-4 hover:bg-white/5 transition-colors border-b border-white/[0.05] cursor-pointer" onClick={() => { router.push('/admin/orders'); setShowNotifications(false); }}>
                      <p className="text-sm text-white">🛒 มีออเดอร์ใหม่เข้ามา</p>
                      <p className="text-xs text-[rgb(var(--text-muted))] mt-1">ตรวจสอบออเดอร์ล่าสุดได้ที่หน้า Orders</p>
                    </div>
                    {/* ... other notifications ... */}
                  </div>
                </div>
              )}
            </div>

            {/* User Chip */}
            <div className="flex items-center gap-3 pl-4 border-l border-white/[0.08]">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-medium text-white">ผู้ดูแลระบบ</div>
              </div>
              <img
                src="https://ui-avatars.com/api/?name=Admin&background=FF4D9D&color=fff&size=40"
                alt="Admin"
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
              />
              <button
                onClick={() => signOut({ callbackUrl: '/admin/login' })}
                className="ml-2 p-2 hover:bg-red-500/10 text-red-400 rounded-lg transition-colors hidden sm:block"
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
        <main className="p-4 sm:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
