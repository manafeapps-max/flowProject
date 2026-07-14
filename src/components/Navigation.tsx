"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, Briefcase, FileText, Settings, LogOut } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

const navItems = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Organization', href: '/organization', icon: Users },
  { name: 'Programs', href: '/programs', icon: Briefcase },
  { name: 'Ledger', href: '/ledger', icon: FileText },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Navigation() {
  const pathname = usePathname();
  const user = useAppStore((state) => state.user);
  const currentUserRole = useAppStore((state) => state.currentUserRole);
  const setUser = useAppStore((state) => state.setUser);
  const setCurrentUserRole = useAppStore((state) => state.setCurrentUserRole);

  if (!user) return null;

  const handleLogout = async () => {
    const { supabase } = await import("@/lib/supabase");
    await supabase.auth.signOut();
    setUser(null);
    setCurrentUserRole(null);
  };

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50 bg-surface-elevated shadow-[var(--shadow-float)] border-t border-border-subtle pb-[var(--spacing-safe-bottom)] md:hidden transition-all duration-350 ease-in-out">
        <div className="grid grid-cols-5 items-center w-full px-2 py-3 justify-items-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={`flex flex-col items-center justify-center w-full min-h-[44px] p-2 rounded-xl transition-all duration-300 hover:bg-surface-base/40 dark:hover:bg-surface-base/10 ${
                  isActive ? 'text-accent-valor scale-105 font-bold' : 'text-text-muted hover:text-text-high'
                }`}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                <span className={`text-[10px] mt-1 font-medium transition-all duration-300 ${
                  isActive ? 'opacity-100 max-h-5' : 'opacity-0 max-h-0 overflow-hidden'
                }`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Desktop Top Header Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 hidden md:flex h-16 bg-surface-elevated shadow-[var(--shadow-soft)] border-b border-border-subtle items-center">
        <div className="w-full max-w-5xl mx-auto flex items-center justify-between px-6">
          {/* Logo / Branding */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-[oklch(0.96_0.005_90)] dark:bg-[oklch(0.20_0.02_260)] border border-border-subtle flex items-center justify-center text-accent-valor shadow-sm group-hover:scale-105 transition-transform duration-300">
              <span className="font-serif font-extrabold text-base">C</span>
            </div>
            <span className="font-serif font-bold text-lg tracking-tight text-text-high">CMP v1.1</span>
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 border ${
                    isActive 
                      ? 'text-accent-valor bg-[oklch(0.96_0.005_90)] dark:bg-[oklch(0.20_0.02_260)] border-border-subtle shadow-sm' 
                      : 'text-text-muted hover:text-text-high border-transparent hover:bg-surface-base/40'
                  }`}
                >
                  <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User profile & Logout */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[oklch(0.96_0.005_90)] dark:bg-[oklch(0.20_0.02_260)] text-accent-valor flex items-center justify-center font-bold text-sm border border-border-subtle shadow-sm">
                {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="text-left hidden lg:block">
                <p className="text-xs font-bold text-text-high max-w-[120px] truncate leading-none">{user.email}</p>
                <p className="text-[9px] font-bold text-accent-valor uppercase tracking-wider mt-0.5 leading-none">{currentUserRole?.replace('_', ' ') || 'No Role'}</p>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-[oklch(0.96_0.005_90)] dark:bg-[oklch(0.20_0.02_260)] hover:bg-[oklch(0.95_0.02_20)] dark:hover:bg-[oklch(0.25_0.05_20)] text-text-muted hover:text-[oklch(0.6_0.2_20)] border border-border-subtle hover:border-[oklch(0.6_0.2_20)]/20 transition-all active:scale-95 cursor-pointer"
              title="Keluar"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
