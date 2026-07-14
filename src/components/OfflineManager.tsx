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

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [setOnlineStatus]);

  return <>{children}</>;
}
