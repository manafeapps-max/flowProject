"use client";

import { useState, useEffect } from "react";
import { useQuery } from '@powersync/react';
import { db as powerSyncDb } from '@/lib/powersync/client';
import { Period, Coa } from "@/lib/powersync/types";
import { 
  FileText, Plus, Search, ArrowRightLeft, 
  CheckCircle2, Clock, AlertTriangle, ChevronDown, ChevronUp,
  BookOpen, Calendar, HelpCircle, X, Trash2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { easings } from "@/lib/motion";

interface JournalWithTotals {
  id: string;
  reference_no: string;
  status: string;
  date: string;
  total_debit: number;
  total_credit: number;
}

export default function LedgerPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [expandedJournalId, setExpandedJournalId] = useState<string | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 150);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Form State
  const [showAddModal, setShowAddModal] = useState(false);
  const [referenceNo, setReferenceNo] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState<'DRAFT' | 'POSTED'>("DRAFT");
  const [formLines, setFormLines] = useState<Array<{ id: string; coa_id: string; debit: string; credit: string }>>([
    { id: crypto.randomUUID(), coa_id: "", debit: "0", credit: "0" },
    { id: crypto.randomUUID(), coa_id: "", debit: "0", credit: "0" }
  ]);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Fetch active period
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

  // Fetch COA (Chart of Accounts)
  const { data: coaData } = useQuery(
    'SELECT id, code, name FROM coa WHERE period_id = ? AND deleted_at IS NULL ORDER BY code ASC',
    [activePeriod?.id || '']
  );
  const coaList = (coaData || []) as Coa[];

  // Fetch journals with debit/credit totals JOIN
  const { data: journalsData, isLoading: loadingJournals } = useQuery(
    `SELECT 
      j.id, 
      j.reference_no, 
      j.status, 
      j.date, 
      COALESCE(SUM(jl.debit), 0) as total_debit, 
      COALESCE(SUM(jl.credit), 0) as total_credit 
    FROM journals j 
    LEFT JOIN journal_lines jl ON j.id = jl.journal_id AND jl.deleted_at IS NULL
    WHERE j.period_id = ? AND j.deleted_at IS NULL 
    GROUP BY j.id, j.reference_no, j.status, j.date
    ORDER BY j.date DESC, j.reference_no DESC`,
    [activePeriod?.id || '']
  );
  const journals = (journalsData || []) as JournalWithTotals[];

  // Fetch journal lines for the expanded journal
  const { data: expandedLinesData, isLoading: loadingLines } = useQuery(
    `SELECT 
      jl.id, 
      jl.debit, 
      jl.credit, 
      c.code as coa_code, 
      c.name as coa_name 
     FROM journal_lines jl 
     LEFT JOIN coa c ON jl.coa_id = c.id AND c.deleted_at IS NULL
     WHERE jl.journal_id = ? AND jl.deleted_at IS NULL
     ORDER BY jl.debit DESC, jl.credit DESC`,
    [expandedJournalId || '']
  );
  const expandedLines = expandedLinesData || [];

  const filteredJournals = journals.filter(j => 
    j.reference_no.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
  );

  const toggleExpand = (id: string) => {
    if (expandedJournalId === id) {
      setExpandedJournalId(null);
    } else {
      setExpandedJournalId(id);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
    } catch (e) {
      return dateStr;
    }
  };

  // Generate suggested reference number YYYYMM-XXXX
  useEffect(() => {
    if (showAddModal) {
      const dateObj = new Date();
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const rand = Math.floor(1000 + Math.random() * 9000);
      setReferenceNo(`JV-${year}${month}-${rand}`);
      setDate(dateObj.toISOString().split('T')[0]);
      setFormLines([
        { id: crypto.randomUUID(), coa_id: "", debit: "0", credit: "0" },
        { id: crypto.randomUUID(), coa_id: "", debit: "0", credit: "0" }
      ]);
      setFormError(null);
    }
  }, [showAddModal]);

  // Totals calculations
  const totalDebit = formLines.reduce((acc, l) => acc + (parseFloat(l.debit) || 0), 0);
  const totalCredit = formLines.reduce((acc, l) => acc + (parseFloat(l.credit) || 0), 0);
  const isFormBalanced = Math.abs(totalDebit - totalCredit) < 0.01;

  const handleAddLine = () => {
    setFormLines(prev => [...prev, { id: crypto.randomUUID(), coa_id: "", debit: "0", credit: "0" }]);
  };

  const handleRemoveLine = (id: string) => {
    if (formLines.length <= 2) {
      setFormError("Jurnal harus memiliki minimal 2 baris entri.");
      return;
    }
    setFormLines(prev => prev.filter(line => line.id !== id));
    setFormError(null);
  };

  const handleLineChange = (index: number, field: 'coa_id' | 'debit' | 'credit', value: string) => {
    setFormLines(prev => prev.map((line, i) => {
      if (i !== index) return line;
      if (field === 'debit') {
        const val = value.replace(/[^0-9.]/g, '');
        return { ...line, debit: val, credit: val && parseFloat(val) > 0 ? "0" : line.credit };
      }
      if (field === 'credit') {
        const val = value.replace(/[^0-9.]/g, '');
        return { ...line, credit: val, debit: val && parseFloat(val) > 0 ? "0" : line.debit };
      }
      return { ...line, [field]: value };
    }));
    setFormError(null);
  };

  const handleSaveJournal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePeriod) {
      setFormError("Tidak ada periode fiskal aktif.");
      return;
    }
    if (!referenceNo.trim()) {
      setFormError("Nomor referensi harus diisi.");
      return;
    }
    if (formLines.some(line => !line.coa_id)) {
      setFormError("Semua baris entri harus memilih akun COA.");
      return;
    }

    // 1. Accounting Double-Entry Guard Check
    if (Math.abs(totalDebit - totalCredit) > 0.01) {
      setFormError("Jurnal tidak seimbang. Total Debit harus sama dengan Total Credit.");
      return;
    }

    setSubmitting(true);
    try {
      const journalId = crypto.randomUUID();
      const nowStr = new Date().toISOString();

      // Write within a single transaction
      await powerSyncDb.writeTransaction(async (tx) => {
        // 1. Insert Journal
        await tx.execute(
          `INSERT INTO journals (id, period_id, reference_no, status, date, created_at, updated_at) 
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [journalId, activePeriod.id, referenceNo.trim(), status, date, nowStr, nowStr]
        );

        // 2. Insert Lines
        for (const line of formLines) {
          const debVal = parseFloat(line.debit) || 0;
          const credVal = parseFloat(line.credit) || 0;
          if (debVal === 0 && credVal === 0) continue;

          await tx.execute(
            `INSERT INTO journal_lines (id, journal_id, period_id, coa_id, debit, credit, created_at, updated_at) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [crypto.randomUUID(), journalId, activePeriod.id, line.coa_id, debVal, credVal, nowStr, nowStr]
          );
        }
      });

      setShowAddModal(false);
    } catch (err: any) {
      console.error(err);
      setFormError("Gagal menyimpan jurnal ke database local: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (st: string) => {
    return st === 'POSTED'
      ? 'text-[oklch(0.50_0.15_140)] bg-[oklch(0.96_0.02_140)] border-[oklch(0.9_0.04_140)] dark:bg-[oklch(0.20_0.05_140)] dark:border-[oklch(0.30_0.05_140)]' 
      : 'text-[oklch(0.6_0.12_80)] bg-[oklch(0.97_0.02_80)] border-[oklch(0.92_0.04_80)] dark:bg-[oklch(0.20_0.03_80)] dark:border-[oklch(0.30_0.03_80)]';
  };

  return (
    <div className="py-6 pb-24 max-w-4xl mx-auto">
      <header className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2 text-text-high">
            <FileText className="text-accent-valor" size={32} /> General Ledger
          </h1>
          <p className="text-text-muted text-sm mt-1">Double-entry journals book of accounts.</p>
        </div>
        {activePeriod && (
          <motion.button 
            onClick={() => setShowAddModal(true)}
            whileTap={{ scale: 0.96 }}
            transition={{ duration: 0.1, ease: easings.spring }}
            className="bg-brand-primary text-[oklch(0.985_0.005_90)] p-3.5 rounded-2xl shadow-[var(--shadow-soft)] hover:brightness-110 cursor-pointer" 
            title="Tambah Jurnal"
          >
            <Plus size={20} />
          </motion.button>
        )}
      </header>

      {!activePeriod && (
        <div className="bg-[oklch(0.96_0.02_90)] border border-border-subtle text-[oklch(0.25_0.06_260)] p-4 rounded-3xl mb-6 flex gap-3 items-center text-sm font-medium">
          <HelpCircle className="text-accent-valor shrink-0" />
          <span>No active Fiscal Period defined. Please create and activate one in Settings to view journals.</span>
        </div>
      )}

      <div className="mb-6 relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-text-muted" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="appearance-none block w-full pl-11 pr-4 py-3 border border-border-subtle rounded-2xl bg-surface-elevated placeholder-text-disabled focus:outline-none focus:ring-2 focus:ring-accent-valor focus:border-transparent transition-all sm:text-sm shadow-sm text-text-high"
          placeholder="Search journal reference number..."
        />
      </div>

      {loadingJournals ? (
        <div className="flex min-h-[300px] items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-accent-valor border-t-transparent"></div>
            <p className="text-sm font-semibold tracking-wide text-text-muted font-mono animate-pulse">MEMUAT JURNAL UMUM...</p>
          </div>
        </div>
      ) : journals.length === 0 ? (
        <div className="bg-surface-elevated border border-border-subtle p-12 rounded-3xl text-center text-text-muted">
          <BookOpen className="mx-auto text-text-disabled mb-3" size={40} />
          <p className="text-sm font-medium">Belum ada catatan jurnal untuk periode fiskal ini.</p>
        </div>
      ) : filteredJournals.length === 0 ? (
        <div className="bg-surface-elevated border border-border-subtle p-12 rounded-3xl text-center text-text-muted">
          <HelpCircle className="mx-auto text-text-disabled mb-3" size={40} />
          <p className="text-sm font-medium">Tidak ada hasil pencarian untuk "{searchQuery}".</p>
        </div>
      ) : (
        <section className="space-y-4">
          {filteredJournals.map(journal => {
            const isExpanded = expandedJournalId === journal.id;
            const isBalanced = Math.abs(journal.total_debit - journal.total_credit) < 0.01;
            const discrepancy = Math.abs(journal.total_debit - journal.total_credit);

            return (
              <motion.div 
                key={journal.id} 
                whileHover={{ scale: 1.008 }}
                whileTap={{ scale: 0.995 }}
                transition={{ duration: 0.15, ease: easings.smooth }}
                className={`bg-surface-elevated border rounded-3xl overflow-hidden shadow-[var(--shadow-soft)] transition-all duration-200 ${
                  isExpanded ? 'border-accent-valor ring-1 ring-accent-valor/20' : 'border-border-subtle hover:border-accent-valor/50'
                }`}
              >
                {/* Journal Card Header */}
                <div 
                  onClick={() => toggleExpand(journal.id)}
                  className="p-5 cursor-pointer flex justify-between items-center select-none"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="font-bold text-lg font-mono text-text-high tracking-tight">
                        {journal.reference_no}
                      </h2>
                      <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold tracking-wider ${getStatusColor(journal.status)}`}>
                        {journal.status}
                      </span>
                      {!isBalanced && (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-bold text-error bg-error/5 border-error/20">
                          <AlertTriangle size={10} /> UNBALANCED
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-text-muted flex items-center gap-1">
                      <Calendar size={14} className="text-text-disabled" />
                      {formatDate(journal.date)}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-[10px] text-text-muted block mb-0.5 uppercase tracking-wide font-semibold">Total Amount</span>
                      <span className="font-bold text-base text-accent-valor font-serif tabular-nums">
                        Rp {journal.total_debit.toLocaleString('id-ID')}
                      </span>
                    </div>
                    {isExpanded ? <ChevronUp size={20} className="text-text-muted" /> : <ChevronDown size={20} className="text-text-muted" />}
                  </div>
                </div>

                {/* Journal Expanded Lines Detail */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: easings.smooth }}
                      className="border-t border-dashed border-border-subtle bg-surface-sunken p-5 space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-sm text-text-high flex items-center gap-1.5">
                          <ArrowRightLeft size={16} className="text-text-muted" /> Entri Detail Jurnal
                        </h3>
                        {!isBalanced && (
                          <span className="text-xs text-error font-semibold font-mono">
                            Discrepancy: Rp {discrepancy.toLocaleString('id-ID')}
                          </span>
                        )}
                      </div>

                      {loadingLines ? (
                        <div className="flex py-6 justify-center">
                          <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent-valor border-t-transparent"></div>
                        </div>
                      ) : expandedLines.length === 0 ? (
                        <p className="text-xs text-text-muted italic text-center py-4">Tidak ada detail baris entri.</p>
                      ) : (
                        <div className="overflow-x-auto rounded-2xl border border-border-subtle bg-surface-elevated shadow-sm">
                          <table className="w-full text-xs text-left">
                            <thead className="bg-surface-sunken text-text-muted font-semibold border-b border-border-subtle uppercase tracking-wide">
                              <tr>
                                <th className="py-2.5 px-4">Nama Akun (COA)</th>
                                <th className="py-2.5 px-4 text-right">Debet</th>
                                <th className="py-2.5 px-4 text-right">Kredit</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-border-subtle">
                              {expandedLines.map((line: any) => (
                                <tr key={line.id} className="hover:bg-surface-sunken">
                                  <td className="py-3 px-4">
                                    <div className="font-semibold text-text-high">{line.coa_name}</div>
                                    <div className="text-[10px] text-text-muted font-mono mt-0.5">{line.coa_code}</div>
                                  </td>
                                  <td className="py-3 px-4 text-right font-serif tabular-nums font-medium text-text-high">
                                    {line.debit > 0 ? `Rp ${line.debit.toLocaleString('id-ID')}` : '-'}
                                  </td>
                                  <td className="py-3 px-4 text-right font-serif tabular-nums font-medium text-text-high">
                                    {line.credit > 0 ? `Rp ${line.credit.toLocaleString('id-ID')}` : '-'}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                            <tfoot className="bg-surface-sunken font-bold border-t border-border-subtle">
                              <tr>
                                <th className="py-3 px-4 text-text-high">Total</th>
                                <th className="py-3 px-4 text-right font-serif tabular-nums text-accent-valor">
                                  Rp {journal.total_debit.toLocaleString('id-ID')}
                                </th>
                                <th className="py-3 px-4 text-right font-serif tabular-nums text-accent-valor">
                                  Rp {journal.total_credit.toLocaleString('id-ID')}
                                </th>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </section>
      )}

      {/* Slide-over Form Drawer Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 bg-slate-950/65 backdrop-blur-md flex justify-end z-[60]">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-slate-950/65 backdrop-blur-md"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.4, ease: easings.smooth }}
              className="bg-surface-elevated border-l border-border-subtle w-full max-w-2xl h-full flex flex-col shadow-2xl relative z-10"
            >
              <header className="p-6 border-b border-border-subtle flex justify-between items-center shrink-0">
                <h2 className="text-xl font-bold flex items-center gap-2 text-text-high">
                  <ArrowRightLeft className="text-accent-valor" />
                  Tambah Jurnal Umum
                </h2>
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="p-1.5 rounded-full hover:bg-surface-sunken text-text-muted hover:text-text-high transition-colors"
                >
                  <X size={20} />
                </button>
              </header>

              <form onSubmit={handleSaveJournal} className="flex-1 flex flex-col min-h-0">
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {formError && (
                    <div className="bg-error/5 border border-error/20 text-error p-4 rounded-2xl flex items-start gap-2.5 text-xs font-semibold">
                      <AlertTriangle className="shrink-0" size={16} />
                      <span>{formError}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-text-muted uppercase mb-1">
                        Nomor Referensi *
                      </label>
                      <input 
                        type="text"
                        required
                        value={referenceNo}
                        onChange={(e) => setReferenceNo(e.target.value)}
                        className="w-full px-4 py-2 border border-border-subtle rounded-2xl bg-surface-base focus:ring-2 focus:ring-accent-valor focus:outline-none text-sm font-semibold tracking-wide text-text-high"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-text-muted uppercase mb-1">
                        Tanggal Jurnal *
                      </label>
                      <input 
                        type="date"
                        required
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full px-4 py-2 border border-border-subtle rounded-2xl bg-surface-base focus:ring-2 focus:ring-accent-valor focus:outline-none text-sm font-semibold text-text-high"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-text-muted uppercase mb-1">
                        Status Jurnal *
                      </label>
                      <select 
                        value={status}
                        onChange={(e) => setStatus(e.target.value as any)}
                        className="w-full px-4 py-2 border border-border-subtle rounded-2xl bg-surface-base focus:ring-2 focus:ring-accent-valor focus:outline-none text-sm font-semibold text-text-high"
                      >
                        <option value="DRAFT">DRAFT</option>
                        <option value="POSTED">POSTED</option>
                      </select>
                    </div>
                  </div>

                  {/* Journal Lines Editor */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center border-b border-border-subtle pb-2">
                      <h3 className="text-sm font-bold text-text-high">Baris Entri</h3>
                      <button 
                        type="button"
                        onClick={handleAddLine}
                        className="text-xs font-bold text-brand-primary bg-surface-base border border-border-subtle px-3 py-1.5 rounded-xl hover:bg-surface-sunken transition-colors"
                      >
                        + Tambah Baris
                      </button>
                    </div>

                    <div className="space-y-3">
                      {formLines.map((line, idx) => (
                        <div key={line.id} className="flex gap-2 items-center">
                          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <select
                              value={line.coa_id}
                              onChange={(e) => handleLineChange(idx, 'coa_id', e.target.value)}
                              className="px-3 py-2.5 border border-border-subtle rounded-2xl bg-surface-base text-xs font-semibold text-text-high focus:ring-2 focus:ring-accent-valor focus:outline-none"
                            >
                              <option value="">-- Pilih Akun COA --</option>
                              {coaList.map(coa => (
                                <option key={coa.id} value={coa.id}>
                                  {coa.code} - {coa.name}
                                </option>
                              ))}
                            </select>

                            <div className="grid grid-cols-2 gap-2">
                              <div className="relative">
                                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] text-text-muted font-bold font-serif">Rp</span>
                                <input 
                                  type="text"
                                  placeholder="Debit"
                                  value={line.debit}
                                  onChange={(e) => handleLineChange(idx, 'debit', e.target.value)}
                                  className="w-full pl-7 pr-3 py-2 border border-border-subtle rounded-2xl bg-surface-base text-xs font-serif tabular-nums font-semibold text-text-high focus:ring-2 focus:ring-accent-valor focus:outline-none text-right"
                                />
                              </div>

                              <div className="relative">
                                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] text-text-muted font-bold font-serif">Rp</span>
                                <input 
                                  type="text"
                                  placeholder="Kredit"
                                  value={line.credit}
                                  onChange={(e) => handleLineChange(idx, 'credit', e.target.value)}
                                  className="w-full pl-7 pr-3 py-2 border border-border-subtle rounded-2xl bg-surface-base text-xs font-serif tabular-nums font-semibold text-text-high focus:ring-2 focus:ring-accent-valor focus:outline-none text-right"
                                />
                              </div>
                            </div>
                          </div>

                          <button 
                            type="button"
                            onClick={() => handleRemoveLine(line.id)}
                            className="p-2.5 hover:bg-error/5 text-text-disabled hover:text-error rounded-xl transition-colors shrink-0"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <footer className="p-6 border-t border-border-subtle bg-surface-sunken space-y-4 shrink-0">
                  {/* Totals Visual Guard Display */}
                  <div className="flex justify-between items-center bg-surface-elevated p-4 rounded-2xl border border-border-subtle text-sm">
                    <span className="font-semibold text-text-high">Total Balans</span>
                    <div className="flex gap-6 text-right">
                      <div>
                        <span className="text-[10px] text-text-muted block uppercase tracking-wide">Debit</span>
                        <span className={`font-bold font-serif tabular-nums ${!isFormBalanced ? 'text-error' : 'text-emerald-600 dark:text-emerald-400'}`}>
                          Rp {totalDebit.toLocaleString('id-ID')}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-text-muted block uppercase tracking-wide">Kredit</span>
                        <span className={`font-bold font-serif tabular-nums ${!isFormBalanced ? 'text-error' : 'text-emerald-600 dark:text-emerald-400'}`}>
                          Rp {totalCredit.toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {!isFormBalanced && (
                    <div className="text-xs text-error font-semibold flex items-center gap-1">
                      <AlertTriangle size={14} />
                      <span>Jurnal tidak seimbang. Selisih: Rp {Math.abs(totalDebit - totalCredit).toLocaleString('id-ID')}</span>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <motion.button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      whileTap={{ scale: 0.96 }}
                      transition={{ duration: 0.1, ease: easings.spring }}
                      className="flex-1 py-3 bg-surface-base border border-border-subtle text-text-high rounded-2xl font-bold hover:bg-surface-sunken transition-colors cursor-pointer text-center"
                    >
                      Batal
                    </motion.button>
                    <motion.button
                      type="submit"
                      disabled={submitting || !isFormBalanced}
                      whileTap={{ scale: 0.96 }}
                      transition={{ duration: 0.1, ease: easings.spring }}
                      className="flex-1 py-3 bg-brand-primary text-[oklch(0.985_0.005_90)] rounded-2xl font-bold hover:brightness-110 disabled:opacity-40 disabled:pointer-events-none transition-all shadow-md cursor-pointer text-center"
                    >
                      {submitting ? "Menyimpan..." : "Simpan Jurnal"}
                    </motion.button>
                  </div>
                </footer>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
