"use client";

import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { syncAll } from '@/lib/sync';

export default function OfflineManager({ children }: { children: React.ReactNode }) {
  const setOnlineStatus = useAppStore((state) => state.setOnlineStatus);
  const isOnline = useAppStore((state) => state.isOnline);

  useEffect(() => {
    const handleOnline = () => {
      setOnlineStatus(true);
      // Run sync when going online
      syncAll();
    };
    const handleOffline = () => setOnlineStatus(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check
    const online = navigator.onLine;
    setOnlineStatus(online);
    if (online) {
      syncAll();
    }

    // Periodic synchronization (every 30 seconds if online)
    const interval = setInterval(() => {
      if (navigator.onLine) {
        syncAll();
      }
    }, 30000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, [setOnlineStatus]);

  return <>{children}</>;
}
