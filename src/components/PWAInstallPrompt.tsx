"use client";

import { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { easings } from '@/lib/motion';

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent browser's default prompt
      e.preventDefault();
      // Store event
      setDeferredPrompt(e);
      
      // Check if user has already dismissed it in this session/localStorage
      const isDismissed = localStorage.getItem('pwa_prompt_dismissed') === 'true';
      if (!isDismissed) {
        // Show prompt after 3 seconds
        const timer = setTimeout(() => {
          setShowPrompt(true);
        }, 3000);
        return () => clearTimeout(timer);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // If already installed (standalone mode), don't show
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowPrompt(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    // Show prompt
    deferredPrompt.prompt();
    // Wait for choice
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to install prompt: ${outcome}`);
    // Clear prompt state
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismissClick = () => {
    localStorage.setItem('pwa_prompt_dismissed', 'true');
    setShowPrompt(false);
  };

  return (
    <AnimatePresence>
      {showPrompt && deferredPrompt && (
        <div className="fixed inset-0 z-50 pointer-events-none flex items-end justify-center px-4 pb-20">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleDismissClick}
            className="absolute inset-0 bg-slate-950/40 pointer-events-auto"
          />
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ duration: 0.45, ease: easings.spring }}
            className="bg-surface-elevated border border-border-subtle rounded-3xl p-5 shadow-[var(--shadow-float)] w-full max-w-sm relative z-10 pointer-events-auto flex flex-col gap-4"
          >
            <button 
              onClick={handleDismissClick}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-surface-sunken text-text-muted transition-colors"
            >
              <X size={16} />
            </button>

            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-2xl bg-surface-sunken border border-border-subtle flex items-center justify-center text-accent-valor shrink-0">
                <Download size={22} />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-base text-text-high font-sans">
                  Instal FlowProject
                </h3>
                <p className="text-xs leading-relaxed text-text-muted font-medium">
                  Akses lebih cepat dan gunakan secara offline seperti aplikasi native di perangkat Anda.
                </p>
              </div>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={handleDismissClick}
                className="flex-1 min-h-touch text-xs font-bold text-text-muted hover:bg-surface-sunken rounded-2xl transition-colors border border-border-subtle"
              >
                Nanti Saja
              </button>
              <button
                type="button"
                onClick={handleInstallClick}
                className="flex-1 min-h-touch text-xs font-bold bg-brand-primary text-[oklch(0.985_0.005_90)] rounded-2xl transition-all hover:brightness-110 active:scale-[0.98] shadow-md shadow-brand-primary/10"
              >
                Instal Sekarang
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
