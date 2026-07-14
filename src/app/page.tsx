"use client";

import { useAppStore } from "@/store/useAppStore";
import { Briefcase, FileText, ChevronRight, Activity, LogIn, LogOut } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { easings } from "@/lib/motion";
import CashFlowSummary from "@/components/dashboard/CashFlowSummary";
import BudgetVariance from "@/components/dashboard/BudgetVariance";

export default function Dashboard() {
  const { user, currentUserRole, setUser, setCurrentUserRole } = useAppStore();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] py-6 text-center">
        <div className="w-20 h-20 bg-[oklch(0.96_0.005_90)] dark:bg-[oklch(0.20_0.02_260)] rounded-full flex items-center justify-center mb-6 border border-border-subtle shadow-[var(--shadow-soft)]">
          <Activity className="text-accent-valor" size={40} />
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome to CMP v1.1</h1>
        <p className="text-text-muted mb-8 max-w-sm">
          A mobile-first, offline-capable platform for structural and financial church management.
        </p>
        <Link 
          href="/auth/login" 
          className="flex items-center gap-2 bg-brand-primary hover:bg-brand-primary/90 text-[oklch(0.985_0.005_90)] px-8 py-4 rounded-2xl font-semibold transition-all shadow-[var(--shadow-soft)] active:scale-95"
        >
          <LogIn size={20} />
          Sign In to Continue
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 pb-24">
      <header className="mb-8 pt-4 flex justify-between items-center gap-4 bg-surface-elevated border border-border-subtle p-5 rounded-[var(--radius-lg)] shadow-[var(--shadow-soft)]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[oklch(0.96_0.005_90)] dark:bg-[oklch(0.20_0.02_260)] text-accent-valor flex items-center justify-center font-bold text-lg border border-border-subtle shadow-sm shrink-0">
            {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="min-w-0">
            <h1 className="text-base font-bold text-text-high truncate max-w-[160px] sm:max-w-xs">{user.email}</h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[9px] font-bold text-accent-valor font-mono bg-[oklch(0.96_0.005_90)] dark:bg-[oklch(0.20_0.02_260)] px-2 py-0.5 rounded-full border border-border-subtle uppercase">
                {currentUserRole?.replace('_', ' ') || 'No Role'}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={async () => {
            const { supabase } = await import("@/lib/supabase");
            await supabase.auth.signOut();
            setUser(null);
            setCurrentUserRole(null);
          }}
          className="flex items-center gap-2 bg-[oklch(0.96_0.005_90)] dark:bg-[oklch(0.20_0.02_260)] hover:bg-[oklch(0.95_0.02_20)] dark:hover:bg-[oklch(0.25_0.05_20)] hover:text-[oklch(0.6_0.2_20)] text-text-muted px-4 py-2.5 rounded-2xl text-xs font-semibold border border-border-subtle hover:border-[oklch(0.6_0.2_20)]/20 transition-all active:scale-95 shrink-0"
        >
          <LogOut size={14} />
          Keluar
        </button>
      </header>

      <section className="grid grid-cols-2 gap-4 mb-8">
        <motion.div whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.15, ease: easings.smooth }}>
          <Link href="/programs" className="flex flex-col h-full bg-brand-primary text-[oklch(0.985_0.005_90)] p-5 rounded-[var(--radius-lg)] shadow-[var(--shadow-soft)] transition-transform">
            <Briefcase size={28} className="mb-3 text-accent-valor" />
            <h2 className="font-semibold text-lg">Programs</h2>
            <p className="text-[oklch(0.80_0.15_85)] text-sm mt-1">Manage budget</p>
          </Link>
        </motion.div>
        
        <motion.div whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.15, ease: easings.smooth }}>
          <Link href="/ledger" className="bg-surface-elevated p-5 rounded-[var(--radius-lg)] border border-border-subtle shadow-[var(--shadow-soft)] transition-transform flex flex-col justify-between h-full">
            <FileText size={28} className="mb-3 text-[oklch(0.62_0.17_150)]" />
            <div>
              <h2 className="font-semibold text-lg text-text-high">Ledger</h2>
              <p className="text-text-muted text-sm mt-1">Financial journals</p>
            </div>
          </Link>
        </motion.div>
      </section>

      <section className="mb-8 space-y-6">
        <CashFlowSummary />
        <BudgetVariance />
      </section>

      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-lg text-text-high">Recent Activity</h2>
          <button className="text-accent-valor text-sm font-semibold hover:text-accent-valor/80 hover:underline transition-all">View All</button>
        </div>
        <div className="bg-surface-elevated border border-border-subtle rounded-[var(--radius-lg)] overflow-hidden shadow-[var(--shadow-soft)]">
          {[1, 2, 3].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-4 border-b border-border-subtle last:border-0 active:bg-[oklch(0.96_0.005_90)] dark:active:bg-[oklch(0.25_0.02_260)] transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[oklch(0.96_0.005_90)] dark:bg-[oklch(0.20_0.02_260)] flex items-center justify-center text-accent-valor border border-border-subtle">
                  <Activity size={18} />
                </div>
                <div>
                  <h3 className="font-medium text-sm text-text-high">Program Draft Created</h3>
                  <p className="text-xs text-text-muted">2 hours ago</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-text-disabled" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
