"use client";

import { useQuery } from '@powersync/react';
import { Period } from "@/lib/powersync/types";
import { ArrowUpRight, ArrowDownRight, Wallet } from "lucide-react";
import { motion } from "framer-motion";
import { easings } from "@/lib/motion";

export default function CashFlowSummary() {
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

  // Aggregate posted journal lines by COA types: 
  // Pemasukan = credit sum of INCOME/REVENUE/PENERIMAAN COAs
  // Pengeluaran = debit sum of EXPENSE/PENGELUARAN COAs
  const { data: cashFlowData } = useQuery(
    `SELECT 
      COALESCE(SUM(CASE WHEN LOWER(c.type) IN ('income', 'revenue', 'penerimaan') THEN jl.credit ELSE 0 END), 0) as total_pemasukan,
      COALESCE(SUM(CASE WHEN LOWER(c.type) IN ('expense', 'pengeluaran') THEN jl.debit ELSE 0 END), 0) as total_pengeluaran
     FROM journal_lines jl
     JOIN journals j ON jl.journal_id = j.id
     JOIN coa c ON jl.coa_id = c.id
     WHERE j.status = 'POSTED' 
       AND j.period_id = ? 
       AND jl.deleted_at IS NULL 
       AND j.deleted_at IS NULL 
       AND c.deleted_at IS NULL`,
    [activePeriod?.id || '']
  );

  const stats = cashFlowData?.[0] || { total_pemasukan: 0, total_pengeluaran: 0 };
  const netBalance = stats.total_pemasukan - stats.total_pengeluaran;

  const cardItems = [
    {
      title: "Total Pemasukan",
      amount: stats.total_pemasukan,
      icon: ArrowUpRight,
      iconColor: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30",
      desc: "Pendapatan terposting periode ini"
    },
    {
      title: "Total Pengeluaran",
      amount: stats.total_pengeluaran,
      icon: ArrowDownRight,
      iconColor: "text-error bg-error/5",
      desc: "Belanja terposting periode ini"
    },
    {
      title: "Saldo Bersih",
      amount: netBalance,
      icon: Wallet,
      iconColor: "text-accent-valor bg-accent-valor/5",
      desc: "Surplus / defisit berjalan"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {cardItems.map((item, index) => {
        const Icon = item.icon;
        const isNegative = item.title === "Saldo Bersih" && item.amount < 0;

        return (
          <motion.div
            key={item.title}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.25, ease: easings.smooth }}
            className="bg-surface-elevated border border-border-subtle rounded-3xl p-5 shadow-[var(--shadow-soft)] flex flex-col gap-4 relative overflow-hidden group hover:shadow-[var(--shadow-medium)] hover:border-brand-primary/20"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">{item.title}</span>
                <h3 className={`text-2xl font-bold font-serif tabular-nums tracking-tight ${
                  isNegative ? 'text-error' : 'text-text-high'
                }`}>
                  Rp {Math.abs(item.amount).toLocaleString('id-ID')}
                  {isNegative && <span className="text-sm font-semibold ml-1 font-sans">Defisit</span>}
                </h3>
              </div>
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${item.iconColor} border border-border-subtle`}>
                <Icon size={20} />
              </div>
            </div>
            <p className="text-[10px] text-text-muted font-medium mt-auto border-t border-dashed border-border-subtle pt-3">
              {item.desc}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}
