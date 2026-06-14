"use client";

import { useAppStore } from "@/store/useAppStore";
import { Briefcase, FileText, ChevronRight, Activity, LogIn, LogOut } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  const { user, currentUserRole, setUser, setCurrentUserRole } = useAppStore();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-6 text-center">
        <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mb-6">
          <Activity className="text-primary-600" size={40} />
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome to CMP v1.1</h1>
        <p className="text-slate-500 mb-8 max-w-sm">
          A mobile-first, offline-capable platform for structural and financial church management.
        </p>
        <Link 
          href="/auth/login" 
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-2xl font-semibold transition-all shadow-lg shadow-primary-500/30 active:scale-95"
        >
          <LogIn size={20} />
          Sign In to Continue
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 pb-24">
      <header className="mb-8 pt-4 flex justify-between items-center gap-4 bg-surface border border-border p-5 rounded-3xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400 flex items-center justify-center font-bold text-lg border border-primary-100 dark:border-primary-900/40 shadow-sm shrink-0">
            {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="min-w-0">
            <h1 className="text-base font-bold text-slate-800 dark:text-slate-100 truncate max-w-[160px] sm:max-w-xs">{user.email}</h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[9px] font-bold text-primary-600 dark:text-primary-400 font-mono bg-primary-50 dark:bg-primary-950/40 px-2 py-0.5 rounded-full border border-primary-100 dark:border-primary-900/60 uppercase">
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
          className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/60 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 text-slate-600 dark:text-slate-400 px-4 py-2.5 rounded-2xl text-xs font-semibold border border-border hover:border-red-200 dark:hover:border-red-900/50 transition-all active:scale-95 shrink-0"
        >
          <LogOut size={14} />
          Keluar
        </button>
      </header>

      <section className="grid grid-cols-2 gap-4 mb-8">
        <Link href="/programs" className="bg-gradient-to-br from-primary-500 to-primary-600 text-white p-5 rounded-3xl shadow-lg shadow-primary-500/20 active:scale-[0.98] transition-transform">
          <Briefcase size={28} className="mb-3 opacity-80" />
          <h2 className="font-semibold text-lg">Programs</h2>
          <p className="text-primary-100 text-sm mt-1">Manage budget</p>
        </Link>
        <Link href="/ledger" className="bg-surface p-5 rounded-3xl border border-border shadow-sm active:scale-[0.98] transition-transform flex flex-col justify-between">
          <FileText size={28} className="mb-3 text-emerald-500" />
          <div>
            <h2 className="font-semibold text-lg text-slate-800 dark:text-slate-100">Ledger</h2>
            <p className="text-slate-500 text-sm mt-1">Financial journals</p>
          </div>
        </Link>
      </section>

      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-lg">Recent Activity</h2>
          <button className="text-primary-600 text-sm font-medium">View All</button>
        </div>
        <div className="bg-surface border border-border rounded-3xl overflow-hidden shadow-sm">
          {[1, 2, 3].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-4 border-b border-border last:border-0 active:bg-surface-hover transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-primary-600">
                  <Activity size={18} />
                </div>
                <div>
                  <h3 className="font-medium text-sm">Program Draft Created</h3>
                  <p className="text-xs text-slate-500">2 hours ago</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-slate-300" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
