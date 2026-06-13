"use client";

import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db, Program, AnggaranProgram, Period } from "@/lib/db";
import { 
  Briefcase, Plus, Filter, CircleArrowRight, CheckCircle2, Clock, X, 
  TrendingUp, TrendingDown, Coins, HelpCircle, Trash2, Calendar,
  MapPin, Target, FileText, Award, Layers, User
} from "lucide-react";

const getStatusColor = (status: string) => {
  switch (status) {
    case 'APPROVED': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    case 'UNDER_REVIEW': return 'text-amber-600 bg-amber-50 border-amber-200';
    case 'PROPOSED': return 'text-blue-600 bg-blue-50 border-blue-200';
    case 'REJECTED': return 'text-red-600 bg-red-50 border-red-200';
    default: return 'text-slate-600 bg-slate-50 border-slate-200';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'APPROVED': return <CheckCircle2 size={16} />;
    case 'UNDER_REVIEW': return <Clock size={16} />;
    default: return <CircleArrowRight size={16} />;
  }
};

const getMonthName = (m?: number) => {
  if (!m) return 'N/A';
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  return months[m - 1] || 'N/A';
};

const getQuarterDateRange = (quarterNum: number, period: Period) => {
  const startDate = new Date(period.start_date);
  if (isNaN(startDate.getTime())) return `Q${quarterNum}`;

  const addMonths = (date: Date, months: number) => {
    const d = new Date(date);
    d.setMonth(d.getMonth() + months);
    return d;
  };

  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const qStart = addMonths(startDate, (quarterNum - 1) * 3);
  const nextQStart = addMonths(startDate, quarterNum * 3);
  const qEnd = new Date(nextQStart.getTime() - 24 * 60 * 60 * 1000);

  return `Q${quarterNum} (${formatDate(qStart)} - ${formatDate(qEnd)})`;
};

export default function ProgramsPage() {
  const programs = useLiveQuery(() => db.programs.toArray());
  const units = useLiveQuery(() => db.organization_units.toArray());
  const typePrograms = useLiveQuery(() => db.type_program.toArray());
  const bidangs = useLiveQuery(() => db.bidang.toArray());
  const subBidangs = useLiveQuery(() => db.sub_bidang.toArray());
  const periods = useLiveQuery(() => db.periods.toArray());
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [showAddBudgetModal, setShowAddBudgetModal] = useState(false);

  // Program Form
  const [name, setName] = useState("");
  const [unitId, setUnitId] = useState("");
  const [budgetVal, setBudgetVal] = useState("0");
  const [submitting, setSubmitting] = useState(false);

  // Budget Item Form
  const [budgetItemName, setBudgetItemName] = useState("");
  const [jenisAnggaran, setJenisAnggaran] = useState<'PENERIMAAN' | 'PENGELUARAN'>('PENGELUARAN');
  const [volume, setVolume] = useState("1");
  const [satuan, setSatuan] = useState("Kegiatan");
  const [hargaSatuan, setHargaSatuan] = useState("0");
  const [frekuensi, setFrekuensi] = useState("1");
  const [sumberDana, setSumberDana] = useState("");
  const [catatan, setCatatan] = useState("");

  const programList = programs || [];
  const unitList = units || [];
  const typeProgramList = typePrograms || [];
  const bidangList = bidangs || [];
  const subBidangList = subBidangs || [];
  const periodList = periods || [];

  // Query budget items dynamically for the selected program
  const budgetLines = useLiveQuery(
    () => selectedProgram ? db.anggaran_program.where('program_id').equals(selectedProgram.id).toArray() : Promise.resolve<AnggaranProgram[]>([]),
    [selectedProgram]
  ) || [];

  const revenueItems = budgetLines.filter(item => item.jenis_anggaran === 'PENERIMAAN');
  const expenseItems = budgetLines.filter(item => item.jenis_anggaran === 'PENGELUARAN');

  const totalRevenue = revenueItems.reduce((acc, curr) => acc + curr.sub_total, 0);
  const totalExpense = expenseItems.reduce((acc, curr) => acc + curr.sub_total, 0);

  const getCatatanAnggaran = () => {
    if (budgetLines.length === 0) return selectedProgram?.catatan_anggaran || '';
    
    const revenueSummary = revenueItems.map(item => `${item.nama_anggaran} (Rp ${item.sub_total.toLocaleString('id-ID')})`).join(', ');
    const expenseSummary = expenseItems.map(item => `${item.nama_anggaran} (Rp ${item.sub_total.toLocaleString('id-ID')})`).join(', ');
    
    return [
      revenueSummary ? `PENERIMAAN: ${revenueSummary}` : '',
      expenseSummary ? `PENGELUARAN: ${expenseSummary}` : ''
    ].filter(Boolean).join('\n');
  };

  const handleAddProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    setSubmitting(true);
    try {
      const defaultUnit = unitList[0]?.id || "550e8400-e29b-41d4-a716-446655440020";
      const selectedUnit = unitId || defaultUnit;
      
      const newProgram = {
        id: crypto.randomUUID(),
        period_id: "550e8400-e29b-41d4-a716-446655440000",
        name: name.trim(),
        status: "DRAFT" as const,
        pjp_unit_id: selectedUnit,
        pic_membership_id: "de641feb-9990-4057-ba23-6c66253e2fa9",
        budget: parseFloat(budgetVal) || 0,
        sync_status: "PENDING" as const,
      };

      await db.programs.add(newProgram);
      
      setName("");
      setUnitId("");
      setBudgetVal("0");
      setShowAddModal(false);
    } catch (err) {
      console.error("Failed to add program:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddBudgetItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProgram || !budgetItemName.trim()) return;

    setSubmitting(true);
    try {
      const vol = parseFloat(volume) || 0;
      const price = parseFloat(hargaSatuan) || 0;
      const freq = parseInt(frekuensi, 10) || 1;
      const calculatedSubtotal = vol * price * freq;

      const newBudgetItem: AnggaranProgram = {
        id: crypto.randomUUID(),
        program_id: selectedProgram.id,
        jenis_anggaran: jenisAnggaran,
        nama_anggaran: budgetItemName.trim(),
        volume: vol,
        satuan: satuan.trim(),
        harga_satuan: price,
        sumber_harga: 'MANUAL',
        frekuensi_pelaksanaan: freq,
        sumber_dana: jenisAnggaran === 'PENERIMAAN' ? (sumberDana.trim() || 'Internal') : undefined,
        catatan: catatan.trim() || undefined,
        sub_total: calculatedSubtotal,
        sync_status: "PENDING" as const,
      };

      await db.anggaran_program.add(newBudgetItem);

      // Recalculate budget sums and update programs table
      const updatedExpenseTotal = totalExpense + (jenisAnggaran === 'PENGELUARAN' ? calculatedSubtotal : 0);
      const updatedRevenueTotal = totalRevenue + (jenisAnggaran === 'PENERIMAAN' ? calculatedSubtotal : 0);
      await db.programs.update(selectedProgram.id, {
        anggaran_penerimaan: updatedRevenueTotal,
        anggaran_pengeluaran: updatedExpenseTotal,
        sync_status: "PENDING" as const
      });

      // Update local state to reflect program budget update
      setSelectedProgram(prev => prev ? { 
        ...prev, 
        anggaran_penerimaan: updatedRevenueTotal,
        anggaran_pengeluaran: updatedExpenseTotal
      } : null);

      // Reset Form
      setBudgetItemName("");
      setVolume("1");
      setSatuan("Kegiatan");
      setHargaSatuan("0");
      setFrekuensi("1");
      setSumberDana("");
      setCatatan("");
      setShowAddBudgetModal(false);
    } catch (err) {
      console.error("Failed to add budget item:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteBudgetItem = async (id: string, itemTotal: number, type: 'PENERIMAAN' | 'PENGELUARAN') => {
    if (!selectedProgram) return;
    try {
      await db.anggaran_program.delete(id);
      
      if (type === 'PENGELUARAN') {
        const updatedExpenseTotal = Math.max(0, totalExpense - itemTotal);
        await db.programs.update(selectedProgram.id, {
          anggaran_pengeluaran: updatedExpenseTotal,
          sync_status: "PENDING" as const
        });
        setSelectedProgram(prev => prev ? { 
          ...prev, 
          anggaran_pengeluaran: updatedExpenseTotal 
        } : null);
      } else {
        const updatedRevenueTotal = Math.max(0, totalRevenue - itemTotal);
        await db.programs.update(selectedProgram.id, {
          anggaran_penerimaan: updatedRevenueTotal,
          sync_status: "PENDING" as const
        });
        setSelectedProgram(prev => prev ? { 
          ...prev, 
          anggaran_penerimaan: updatedRevenueTotal 
        } : null);
      }
    } catch (err) {
      console.error("Failed to delete budget item:", err);
    }
  };

  return (
    <div className="p-6 pb-24">
      <header className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Briefcase className="text-primary-600" /> Programs
          </h1>
          <p className="text-slate-500 text-sm mt-1">Budget planning & tracking</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-surface border border-border text-slate-700 p-3 rounded-full shadow-sm active:scale-95 transition-transform">
            <Filter size={20} />
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-primary-600 text-white p-3 rounded-full shadow-lg shadow-primary-500/30 active:scale-95 transition-transform"
          >
            <Plus size={20} />
          </button>
        </div>
      </header>

      <section className="space-y-4">
        {programList.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            No programs found. Click the + button to add one.
          </div>
        ) : (
          programList.map(program => (
            <div 
              key={program.id} 
              onClick={() => setSelectedProgram(program)}
              className="bg-surface border border-border rounded-3xl p-5 shadow-sm active:scale-[0.99] transition-transform flex flex-col gap-4 cursor-pointer hover:border-primary-300"
            >
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h2 className="font-semibold text-lg leading-tight">{program.name}</h2>
                  <span className="text-xs text-slate-400 mt-1 block">
                    Sync Status: {program.sync_status}
                  </span>
                </div>
                <div className={`px-3 py-1 rounded-full border text-xs font-semibold flex items-center gap-1 shrink-0 ${getStatusColor(program.status)}`}>
                  {getStatusIcon(program.status)}
                  {program.status.replace('_', ' ')}
                </div>
              </div>
              
              <div className="flex items-center justify-between gap-4 pt-4 border-t border-dashed border-border text-xs">
                <div>
                  <span className="text-slate-400 block mb-0.5">Penerimaan</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                    Rp {(program.anggaran_penerimaan || 0).toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block mb-0.5">Pengeluaran</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                    Rp {(program.anggaran_pengeluaran || 0).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </section>

      {/* Program Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-surface border border-border rounded-3xl w-full max-w-md p-6 shadow-2xl relative">
            <button 
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold mb-4">Add Program</h2>
            
            <form onSubmit={handleAddProgram} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Program Name
                </label>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-2xl bg-background focus:ring-2 focus:ring-primary-500 focus:outline-none animate-all"
                  placeholder="e.g. Retreat Pemuda 2026"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Responsible Sub-Bidang
                </label>
                <select 
                  value={unitId}
                  onChange={(e) => setUnitId(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-2xl bg-background focus:ring-2 focus:ring-primary-500 focus:outline-none"
                >
                  <option value="">-- Choose Unit --</option>
                  {unitList.map(unit => (
                    <option key={unit.id} value={unit.id}>{unit.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Est. Budget (Rp)
                </label>
                <input 
                  type="number" 
                  required
                  value={budgetVal}
                  onChange={(e) => setBudgetVal(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-2xl bg-background focus:ring-2 focus:ring-primary-500 focus:outline-none"
                  placeholder="0"
                />
              </div>

              <button 
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-semibold transition-colors disabled:opacity-50 mt-2 shadow-lg shadow-primary-500/20 active:scale-95"
              >
                {submitting ? "Adding..." : "Add Program"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Program Details Sheet / Modal */}
      {selectedProgram && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-end z-40 animate-fade-in">
          <div className="bg-surface border-l border-border w-full max-w-lg h-full flex flex-col shadow-2xl relative animate-slide-left overflow-y-auto pb-24">
            <header className="p-6 border-b border-border flex justify-between items-start">
              <div>
                <span className="text-xs uppercase font-bold text-primary-600 tracking-wide flex items-center gap-1.5 mb-1.5">
                  <Calendar size={14} /> Program Details
                </span>
                <h2 className="text-xl font-bold leading-tight text-slate-800 dark:text-slate-100">{selectedProgram.name}</h2>
              </div>
              <button 
                onClick={() => setSelectedProgram(null)}
                className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={24} />
              </button>
            </header>

            <div className="flex-1 p-6 space-y-6 overflow-y-auto">
              {/* Program Metadata Section */}
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-5 border border-border space-y-4">
                {/* 2-Column Grid for Key Metadata */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block mb-1">PJP Unit</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 font-sans">
                      <Layers size={14} className="text-primary-500 shrink-0" />
                      <span className="truncate">{unitList.find(u => u.id === selectedProgram.pjp_unit_id)?.name || 'N/A'}</span>
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-1">Tipe Program</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                      <Briefcase size={14} className="text-primary-500 shrink-0" />
                      <span className="truncate">{typeProgramList.find(t => t.id === selectedProgram.type_program_id)?.name || 'N/A'}</span>
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-1">Bidang</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 font-sans">
                      <Layers size={14} className="text-primary-500 shrink-0" />
                      <span className="truncate">{bidangList.find(b => b.id === selectedProgram.bidang_id)?.name || 'N/A'}</span>
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-1">Sub-Bidang</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 font-sans">
                      <Layers size={14} className="text-primary-500 shrink-0" />
                      <span className="truncate">{subBidangList.find(s => s.id === selectedProgram.sub_bidang_id)?.name || 'N/A'}</span>
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-1">Tahun Anggaran</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                      <Calendar size={14} className="text-primary-500 shrink-0" />
                      <span className="truncate">{selectedProgram.tahun_anggaran || 'N/A'}</span>
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-1">Bulan</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                      <Calendar size={14} className="text-primary-500 shrink-0" />
                      <span>{getMonthName(selectedProgram.bulan)}</span>
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-1">Frekuensi</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                      <Clock size={14} className="text-primary-500 shrink-0" />
                      <span>{selectedProgram.frekuensi ? `${selectedProgram.frekuensi}x` : 'N/A'}</span>
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-1">Location / Lokasi</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                      <MapPin size={14} className="text-primary-500 shrink-0" />
                      <span className="truncate" title={selectedProgram.lokasi || undefined}>
                        {selectedProgram.lokasi || 'N/A'}
                      </span>
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-1">Program Code</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-200 block truncate font-mono">
                      {selectedProgram.program_code || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-1">PIC ID</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 font-mono" title={selectedProgram.pic_membership_id}>
                      <User size={14} className="text-primary-500 shrink-0" />
                      <span className="truncate">{selectedProgram.pic_membership_id ? selectedProgram.pic_membership_id.substring(0, 8) + '...' : 'N/A'}</span>
                    </span>
                  </div>
                </div>

                {/* Tujuan Program */}
                <div className="pt-3 border-t border-border border-dashed">
                  <span className="text-slate-400 text-xs block mb-1 flex items-center gap-1">
                    <Target size={14} className="text-primary-500 shrink-0" /> Tujuan Program
                  </span>
                  <p className="text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    {selectedProgram.tujuan_program || <span className="text-slate-400 italic font-normal">N/A</span>}
                  </p>
                </div>

                {/* Waktu Pelaksanaan */}
                <div className="pt-3 border-t border-border border-dashed">
                  <span className="text-slate-400 text-xs block mb-1 flex items-center gap-1">
                    <Clock size={14} className="text-primary-500 shrink-0" /> Waktu Pelaksanaan
                  </span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {selectedProgram.waktu ? (
                      selectedProgram.waktu.split(',').map((w: string) => {
                        const trimmed = w.trim();
                        const isQuarter = /^[1-4]$/.test(trimmed);
                        const displayStr = isQuarter ? `Q${trimmed}` : trimmed;
                        return (
                          <div key={trimmed} className="text-xs text-slate-700 dark:text-slate-300 font-semibold bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 w-fit">
                            {displayStr}
                          </div>
                        );
                      })
                    ) : (
                      <span className="text-slate-400 italic font-normal">N/A</span>
                    )}
                  </div>
                </div>

                {/* Catatan Anggaran */}
                <div className="pt-3 border-t border-border border-dashed">
                  <span className="text-slate-400 text-xs block mb-1 flex items-center gap-1">
                    <FileText size={14} className="text-primary-500 shrink-0" /> Catatan Anggaran
                  </span>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap font-sans">
                    {getCatatanAnggaran() || <span className="text-slate-400 italic font-normal">N/A</span>}
                  </p>
                </div>

                {/* Success Indicator */}
                <div className="pt-3 border-t border-border border-dashed">
                  <span className="text-slate-400 text-xs block mb-1 flex items-center gap-1">
                    <Award size={14} className="text-primary-500 shrink-0" /> Indikator Kualitatif
                  </span>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal italic">
                    {selectedProgram.ik_kualitatif ? `"${selectedProgram.ik_kualitatif}"` : <span className="text-slate-400 italic not-italic">N/A</span>}
                  </p>
                </div>

                {/* Description */}
                <div className="pt-3 border-t border-border border-dashed">
                  <span className="text-slate-400 text-xs block mb-1 flex items-center gap-1">
                    <FileText size={14} className="text-primary-500 shrink-0" /> Deskripsi
                  </span>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {selectedProgram.deskripsi || <span className="text-slate-400 italic font-normal">N/A</span>}
                  </p>
                </div>
              </div>

              {/* Overall Budget Summary Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 p-4 rounded-3xl flex flex-col justify-between">
                  <div className="flex items-center justify-between text-emerald-600 mb-2">
                    <span className="text-xs font-semibold uppercase">Penerimaan</span>
                    <TrendingUp size={16} />
                  </div>
                  <div className="text-lg font-bold text-emerald-700 dark:text-emerald-400">
                    Rp {totalRevenue.toLocaleString('id-ID')}
                  </div>
                </div>

                <div className="bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40 p-4 rounded-3xl flex flex-col justify-between">
                  <div className="flex items-center justify-between text-amber-600 mb-2">
                    <span className="text-xs font-semibold uppercase">Pengeluaran</span>
                    <TrendingDown size={16} />
                  </div>
                  <div className="text-lg font-bold text-amber-700 dark:text-amber-400">
                    Rp {totalExpense.toLocaleString('id-ID')}
                  </div>
                </div>
              </div>

              {/* Detailed Revenue List */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <TrendingUp size={18} className="text-emerald-500" /> Revenue Lines
                  </h3>
                </div>

                <div className="space-y-3">
                  {revenueItems.length === 0 ? (
                    <div className="text-xs text-slate-400 bg-slate-50 dark:bg-slate-800/40 border border-border p-4 rounded-2xl text-center">
                      No revenue entries found for this program.
                    </div>
                  ) : (
                    revenueItems.map(item => (
                      <div key={item.id} className="bg-surface border border-border p-4 rounded-2xl shadow-sm flex justify-between items-center group relative hover:border-emerald-300">
                        <div>
                          <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-200">{item.nama_anggaran}</h4>
                          <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                            {item.volume} {item.satuan} × Rp {item.harga_satuan.toLocaleString('id-ID')} × {item.frekuensi_pelaksanaan}x
                          </p>
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 mt-1.5 inline-block">
                            Fund Source: {item.sumber_dana || 'Internal'}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="font-bold text-sm text-emerald-600">
                            Rp {item.sub_total.toLocaleString('id-ID')}
                          </div>
                          <button 
                            onClick={() => handleDeleteBudgetItem(item.id, item.sub_total, 'PENERIMAAN')}
                            className="text-slate-300 hover:text-red-500 transition-colors p-1"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Detailed Expense List */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <TrendingDown size={18} className="text-amber-500" /> Expense Lines
                  </h3>
                </div>

                <div className="space-y-3">
                  {expenseItems.length === 0 ? (
                    <div className="text-xs text-slate-400 bg-slate-50 dark:bg-slate-800/40 border border-border p-4 rounded-2xl text-center">
                      No expense entries found for this program.
                    </div>
                  ) : (
                    expenseItems.map(item => (
                      <div key={item.id} className="bg-surface border border-border p-4 rounded-2xl shadow-sm flex justify-between items-center group relative hover:border-amber-300">
                        <div>
                          <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-200">{item.nama_anggaran}</h4>
                          <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                            {item.volume} {item.satuan} × Rp {item.harga_satuan.toLocaleString('id-ID')} × {item.frekuensi_pelaksanaan}x
                          </p>
                          {item.catatan && (
                            <p className="text-[9px] text-slate-400 italic mt-1">{item.catatan}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="font-bold text-sm text-slate-800 dark:text-slate-200">
                            Rp {item.sub_total.toLocaleString('id-ID')}
                          </div>
                          <button 
                            onClick={() => handleDeleteBudgetItem(item.id, item.sub_total, 'PENGELUARAN')}
                            className="text-slate-300 hover:text-red-500 transition-colors p-1"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions at footer */}
            <div className="absolute bottom-0 inset-x-0 p-4 border-t border-border bg-surface flex gap-2">
              <button 
                onClick={() => setShowAddBudgetModal(true)}
                className="flex-1 py-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-primary-500/15 active:scale-[0.98] transition-all"
              >
                <Plus size={18} /> Add Budget Item
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Budget Item Modal */}
      {showAddBudgetModal && selectedProgram && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-surface border border-border rounded-3xl w-full max-w-md p-6 shadow-2xl relative">
            <button 
              onClick={() => setShowAddBudgetModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold mb-4">Add Budget Line</h2>
            
            <form onSubmit={handleAddBudgetItem} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Budget Item Name
                </label>
                <input 
                  type="text" 
                  required
                  value={budgetItemName}
                  onChange={(e) => setBudgetItemName(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-2xl bg-background focus:ring-2 focus:ring-primary-500 focus:outline-none"
                  placeholder="e.g. Uang Rapat, Sewa Mobil"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Type
                  </label>
                  <select 
                    value={jenisAnggaran}
                    onChange={(e) => setJenisAnggaran(e.target.value as any)}
                    className="w-full px-4 py-2 border border-border rounded-2xl bg-background focus:ring-2 focus:ring-primary-500 focus:outline-none"
                  >
                    <option value="PENGELUARAN">Expense</option>
                    <option value="PENERIMAAN">Revenue</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Unit / Satuan
                  </label>
                  <input 
                    type="text" 
                    required
                    value={satuan}
                    onChange={(e) => setSatuan(e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-2xl bg-background focus:ring-2 focus:ring-primary-500 focus:outline-none"
                    placeholder="e.g. Orang, Unit"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Volume
                  </label>
                  <input 
                    type="number" 
                    required
                    value={volume}
                    onChange={(e) => setVolume(e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-2xl bg-background focus:ring-2 focus:ring-primary-500 focus:outline-none"
                    placeholder="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Frequency
                  </label>
                  <input 
                    type="number" 
                    required
                    value={frekuensi}
                    onChange={(e) => setFrekuensi(e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-2xl bg-background focus:ring-2 focus:ring-primary-500 focus:outline-none"
                    placeholder="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Price (Rp)
                  </label>
                  <input 
                    type="number" 
                    required
                    value={hargaSatuan}
                    onChange={(e) => setHargaSatuan(e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-2xl bg-background focus:ring-2 focus:ring-primary-500 focus:outline-none"
                    placeholder="0"
                  />
                </div>
              </div>

              {jenisAnggaran === 'PENERIMAAN' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Source of Funds
                  </label>
                  <input 
                    type="text" 
                    value={sumberDana}
                    onChange={(e) => setSumberDana(e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-2xl bg-background focus:ring-2 focus:ring-primary-500 focus:outline-none"
                    placeholder="e.g. Dana MS, Persembahan Khusus"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Catatan / Notes
                </label>
                <textarea 
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-2xl bg-background focus:ring-2 focus:ring-primary-500 focus:outline-none h-16 resize-none"
                  placeholder="Additional description..."
                />
              </div>

              <button 
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-semibold transition-colors disabled:opacity-50 mt-2 shadow-lg shadow-primary-500/10 active:scale-95"
              >
                {submitting ? "Adding..." : "Add Budget Line"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
