"use client";

import { useState, useEffect } from "react";
import { useQuery } from '@powersync/react';
import { Period } from "@/lib/powersync/types";
import { AlertTriangle, TrendingUp, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { easings } from "@/lib/motion";

export default function BudgetVariance() {
  // Fetch periods to identify active fiscal period
  const { data: powerSyncPeriods } = useQuery(
    'SELECT id, name, start_date, end_date, is_active FROM periods WHERE deleted_at IS NULL ORDER BY start_date DESC'
  );
  const periods = (powerSyncPeriods || []).map((p: any) => ({
    ...p,
    is_active: p.is_active === 1,
    sync_status: 'SYNCED'
  })) as Period[];

  const getPeriodDurationYears = (p: Period) => {
    const start = new Date(p.start_date);
    const end = new Date(p.end_date);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return 1;
    return (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
  };

  const activeFiscalPeriod = periods.find(p => p.is_active && getPeriodDurationYears(p) <= 2) || periods.filter(p => getPeriodDurationYears(p) <= 2)[0];
  const activePeriod = activeFiscalPeriod || periods[0];

  // 1. Fetch programs with budget lines grouped by program and coa
  const { data: powerSyncPrograms, isLoading: loadingPrograms } = useQuery(
    `SELECT 
      p.id as program_id,
      p.name as program_name,
      ap.coa_id,
      COALESCE(SUM(CASE WHEN ap.jenis_anggaran = 'PENGELUARAN' THEN (ap.volume * ap.harga_satuan * ap.frekuensi_pelaksanaan) ELSE 0 END), 0) as line_budget
     FROM programs p
     LEFT JOIN anggaran_program ap ON p.id = ap.program_id AND ap.deleted_at IS NULL
     WHERE p.period_id = ? AND p.deleted_at IS NULL
     GROUP BY p.id, p.name, ap.coa_id`,
    [activePeriod?.id || '']
  );

  // 2. Fetch actual debits on COA accounts from posted journals
  const { data: powerSyncActuals, isLoading: loadingActuals } = useQuery(
    `SELECT 
      jl.coa_id,
      COALESCE(SUM(jl.debit), 0) as actual_spent
     FROM journal_lines jl
     JOIN journals j ON jl.journal_id = j.id
     WHERE j.status = 'POSTED' 
       AND j.period_id = ? 
       AND jl.deleted_at IS NULL 
       AND j.deleted_at IS NULL
     GROUP BY jl.coa_id`,
    [activePeriod?.id || '']
  );

  const programsData = powerSyncPrograms || [];
  const actualsData = powerSyncActuals || [];

  // Map COA id -> actual spent
  const actualsMap = new Map<string, number>();
  actualsData.forEach((row: any) => {
    actualsMap.set(row.coa_id, row.actual_spent);
  });

  // Group by program ID
  const programMap = new Map<string, { id: string; name: string; budget: number; actual: number }>();
  programsData.forEach((row: any) => {
    const progId = row.program_id;
    if (!programMap.has(progId)) {
      programMap.set(progId, { id: progId, name: row.program_name, budget: 0, actual: 0 });
    }
    const prog = programMap.get(progId)!;
    prog.budget += row.line_budget;
    if (row.coa_id) {
      prog.actual += actualsMap.get(row.coa_id) || 0;
    }
  });

  const reportItems = Array.from(programMap.values());
  const isLoading = loadingPrograms || loadingActuals;

  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setShowLoader(true);
      }, 250); // Delay spinner by 250ms to prevent flash on fast local queries
      return () => clearTimeout(timer);
    } else {
      setShowLoader(false);
    }
  }, [isLoading]);

  if (isLoading) {
    if (!showLoader) {
      // Render stable layout skeleton to maintain stability during fast SQLite reads
      return (
        <div className="bg-surface-elevated border border-border-subtle rounded-3xl p-6 shadow-[var(--shadow-soft)] space-y-6 animate-pulse">
          <div>
            <div className="h-5 w-48 bg-border-subtle rounded" />
            <div className="h-3 w-64 bg-border-subtle rounded mt-1.5" />
          </div>
          <div className="space-y-5">
            {[1, 2].map((i) => (
              <div key={i} className="p-4 border border-border-subtle rounded-2xl bg-surface-sunken flex flex-col gap-3">
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-border-subtle rounded" />
                    <div className="h-3 w-16 bg-border-subtle rounded" />
                  </div>
                  <div className="h-8 w-24 bg-border-subtle rounded" />
                </div>
                <div className="w-full h-2 rounded-full bg-surface-base border border-border-subtle" />
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="flex py-12 items-center justify-center bg-surface-elevated border border-border-subtle rounded-3xl shadow-[var(--shadow-soft)]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-accent-valor border-t-transparent"></div>
          <p className="text-xs font-semibold tracking-wide text-text-muted font-mono animate-pulse">MENGHITUNG VARIANS ANGGARAN...</p>
        </div>
      </div>
    );
  }

  if (reportItems.length === 0) {
    return (
      <div className="bg-surface-elevated border border-border-subtle p-8 rounded-3xl text-center text-text-muted text-sm font-medium">
        Belum ada program anggaran terdaftar untuk periode ini.
      </div>
    );
  }

  return (
    <div className="bg-surface-elevated border border-border-subtle rounded-3xl p-6 shadow-[var(--shadow-soft)] space-y-6">
      <div>
        <h3 className="font-bold text-lg text-text-high flex items-center gap-2">
          <TrendingUp className="text-accent-valor" size={20} /> Laporan Varians Anggaran Program
        </h3>
        <p className="text-xs text-text-muted mt-1">Komparasi pagu anggaran belanja (Pagu) vs Realisasi belanja (Journal).</p>
      </div>

      <div className="space-y-5">
        {reportItems.map((item) => {
          const variance = item.budget - item.actual;
          const isOverBudget = item.actual > item.budget;
          const progressPercent = item.budget > 0 ? Math.min((item.actual / item.budget) * 100, 100) : (item.actual > 0 ? 100 : 0);

          return (
            <motion.div 
              key={item.id}
              whileHover={{ scale: 1.005 }}
              transition={{ duration: 0.15, ease: easings.smooth }}
              className="p-4 border border-border-subtle rounded-2xl bg-surface-sunken flex flex-col gap-3"
            >
              <div className="flex justify-between items-start gap-4 flex-wrap">
                <div>
                  <h4 className="font-bold text-sm text-text-high leading-tight">{item.name}</h4>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    {isOverBudget ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-error bg-error/5 border border-error/10 px-2 py-0.5 rounded-full uppercase tracking-wide">
                        <AlertTriangle size={10} /> Over Budget
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 px-2 py-0.5 rounded-full uppercase tracking-wide">
                        <CheckCircle size={10} /> Under Control
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-4 text-xs">
                  <div className="text-right">
                    <span className="text-[10px] text-text-muted block uppercase">Budget</span>
                    <span className="font-bold text-text-high font-serif tabular-nums">
                      Rp {item.budget.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-text-muted block uppercase">Actual</span>
                    <span className="font-bold text-text-high font-serif tabular-nums">
                      Rp {item.actual.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-text-muted block uppercase">Selisih</span>
                    <span className={`font-bold font-serif tabular-nums ${isOverBudget ? 'text-error' : 'text-emerald-600 dark:text-emerald-400'}`}>
                      {variance < 0 ? '-' : ''}Rp {Math.abs(variance).toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Visual Progress Bar */}
              <div className="space-y-1.5">
                <div className="w-full h-2 rounded-full bg-surface-base overflow-hidden border border-border-subtle relative">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.8, ease: easings.smooth }}
                    className={`h-full rounded-full ${
                      isOverBudget ? 'bg-error' : 'bg-brand-primary'
                    }`}
                  />
                </div>
                <div className="flex justify-between text-[9px] text-text-muted font-bold font-mono">
                  <span>REALISASI: {progressPercent.toFixed(1)}%</span>
                  <span>SISA PAGU: {isOverBudget ? '0%' : `${(100 - progressPercent).toFixed(1)}%`}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
