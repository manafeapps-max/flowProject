"use client";

import { useEffect, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { CloudOff, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { easings } from '@/lib/motion';

export default function OfflineFallback() {
  const isOnline = useAppStore((state) => state.isOnline);
  const [dismissed, setDismissed] = useState(false);

  // Reset dismissal state on network transitions
  useEffect(() => {
    setDismissed(false);
  }, [isOnline]);

  const showBanner = !isOnline && !dismissed;

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ opacity: 0, y: -20, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: -20, x: "-50%" }}
          transition={{ duration: 0.35, ease: easings.smooth }}
          className="fixed top-18 left-1/2 z-40 w-[calc(100%-2rem)] max-w-sm p-3.5 bg-surface-elevated/95 backdrop-blur-md border border-border-subtle rounded-2xl shadow-[var(--shadow-soft)] flex items-start gap-3 pointer-events-auto"
        >
          <div className="w-8 h-8 rounded-xl bg-surface-sunken flex items-center justify-center text-text-muted shrink-0">
            <CloudOff size={16} />
          </div>
          
          <div className="flex-1 space-y-0.5 pr-6">
            <h4 className="font-bold text-xs text-text-high font-sans">Mode Offline</h4>
            <p className="text-[10px] leading-relaxed text-text-muted font-medium">
              Anda tetap dapat melihat data & membuat perubahan. Perubahan otomatis tersinkron saat terhubung kembali.
            </p>
          </div>

          <button
            onClick={() => setDismissed(true)}
            className="absolute top-3.5 right-3.5 p-1 rounded-full hover:bg-surface-sunken text-text-disabled hover:text-text-muted transition-colors"
          >
            <X size={12} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
