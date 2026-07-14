"use client";

import { useEffect, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { AnimatePresence, motion } from 'framer-motion';
import { WifiOff, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { easings } from '@/lib/motion';

export default function SyncStatusIndicator() {
  const syncStatus = useAppStore((state) => state.syncStatus);
  const lastSyncTime = useAppStore((state) => state.lastSyncTime);
  const isOnline = useAppStore((state) => state.isOnline);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (syncStatus === 'success') {
      setShowSuccess(true);
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [syncStatus]);

  // Determine active visual state
  // offline or error takes highest priority, then syncing, then showSuccess, and finally idle.
  let state: 'offline' | 'error' | 'syncing' | 'success' | 'idle' = 'idle';

  if (!isOnline) {
    state = 'offline';
  } else if (syncStatus === 'error') {
    state = 'error';
  } else if (syncStatus === 'syncing') {
    state = 'syncing';
  } else if (showSuccess) {
    state = 'success';
  }

  // If idle, render a very subtle gray dot at the top-right
  if (state === 'idle') {
    return (
      <div className="fixed top-4 right-4 z-50 pointer-events-none select-none">
        <div className="w-2 h-2 rounded-full bg-border-strong transition-all duration-300 opacity-40" />
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 z-50 pointer-events-none select-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={state}
          initial={{ opacity: 0, y: -12, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.9 }}
          transition={{ duration: 0.4, ease: easings.spring }}
          className={`flex items-center gap-2 px-4.5 py-2.5 rounded-full border shadow-[var(--shadow-float)] bg-surface-elevated/90 backdrop-blur-md transition-colors duration-300 ${
            state === 'offline' || state === 'error'
              ? 'border-error/35 text-error'
              : state === 'syncing'
              ? 'border-accent-valor/35 text-text-high'
              : 'border-emerald-500/35 text-emerald-600 dark:text-emerald-400'
          }`}
        >
          {state === 'offline' && (
            <>
              <WifiOff size={14} className="animate-pulse" />
              <span className="text-xs font-semibold tracking-wide">Offline - Perubahan diantrikan</span>
            </>
          )}
          {state === 'error' && (
            <>
              <AlertCircle size={14} />
              <span className="text-xs font-semibold tracking-wide font-mono">SYNC ERROR</span>
            </>
          )}
          {state === 'syncing' && (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                className="flex items-center justify-center"
              >
                <RefreshCw size={14} className="text-accent-valor" />
              </motion.div>
              <span className="text-xs font-semibold tracking-wide">Menyinkronkan...</span>
            </>
          )}
          {state === 'success' && (
            <>
              <CheckCircle2 size={14} className="text-emerald-500" />
              <span className="text-xs font-semibold tracking-wide">Tersinkron</span>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
