"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, Briefcase, FileText, Settings, Wifi, WifiOff, RefreshCw } from 'lucide-react';
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
  const isOnline = useAppStore((state) => state.isOnline);
  const syncStatus = useAppStore((state) => state.syncStatus);
  const user = useAppStore((state) => state.user);
  const currentUserRole = useAppStore((state) => state.currentUserRole);

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50 bg-surface-elevated shadow-[var(--shadow-float)] border-t border-border-subtle pb-[var(--spacing-safe-bottom)] md:bottom-4 md:rounded-2xl md:border md:pb-0 transition-all duration-350 ease-in-out">
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
  );
}
