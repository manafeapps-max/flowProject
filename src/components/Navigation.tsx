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
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-surface border-t border-border pb-safe">
      {user && (
        <div className="bg-slate-50 dark:bg-slate-850/80 border-b border-border py-1 px-4 text-[10px] text-slate-500 dark:text-slate-400 flex justify-between items-center max-w-md mx-auto">
          <span className="truncate font-medium">User: {user.email}</span>
          <span className="font-bold text-primary-600 dark:text-primary-400 font-mono text-[9px] bg-primary-50 dark:bg-primary-950/40 px-1.5 py-0.5 rounded border border-primary-100 dark:border-primary-900/60 uppercase">
            {currentUserRole?.replace('_', ' ') || 'No Role'}
          </span>
        </div>
      )}
      <div className="flex justify-between items-center px-6 py-3 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={`flex flex-col items-center p-2 rounded-xl transition-all duration-300 ${
                isActive ? 'text-primary-600 scale-110' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-[10px] mt-1 font-medium ${isActive ? 'opacity-100' : 'opacity-0 h-0'} transition-all`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
      
      {/* Offline Indicator */}
      {!isOnline && (
        <div className="absolute top-0 left-0 right-0 -translate-y-full bg-amber-500 text-white text-xs font-semibold py-1 px-4 flex items-center justify-center gap-2 shadow-md">
          <WifiOff size={14} />
          <span>Offline Mode. Changes will sync when reconnected.</span>
        </div>
      )}

      {/* Syncing Indicator */}
      {isOnline && syncStatus === 'syncing' && (
        <div className="absolute top-0 left-0 right-0 -translate-y-full bg-primary-600 text-white text-xs font-semibold py-1 px-4 flex items-center justify-center gap-2 shadow-md animate-pulse">
          <RefreshCw size={12} className="animate-spin" />
          <span>Mensinkronisasikan data...</span>
        </div>
      )}

      {/* Sync Error Indicator */}
      {isOnline && syncStatus === 'error' && (
        <Link 
          href="/settings?tab=sync" 
          onClick={(e) => {
            // Note: Since activeTab in Settings is initialized by tab state, this works
            // if we query the tab or just let the user open settings.
          }}
          className="absolute top-0 left-0 right-0 -translate-y-full bg-rose-600 text-white text-xs font-semibold py-1 px-4 flex items-center justify-center gap-2 shadow-md"
        >
          <RefreshCw size={12} />
          <span>Sinkronisasi gagal. Klik untuk detail.</span>
        </Link>
      )}
    </nav>
  );
}
