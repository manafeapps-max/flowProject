"use client";

import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';

export default function OfflineManager({ children }: { children: React.ReactNode }) {
  const setOnlineStatus = useAppStore((state) => state.setOnlineStatus);

  useEffect(() => {
    const handleOnline = () => {
      setOnlineStatus(true);
    };
    const handleOffline = () => setOnlineStatus(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check
    const online = navigator.onLine;
    setOnlineStatus(online);

    // Register Service Worker for offline capabilities
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker.register('/sw.js')
        .then((reg) => console.log('Service Worker registered with scope:', reg.scope))
        .catch((err) => console.error('Service Worker registration failed:', err));
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [setOnlineStatus]);

  return <>{children}</>;
}
