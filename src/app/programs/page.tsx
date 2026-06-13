"use client";

import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db, Program, AnggaranProgram, Period } from "@/lib/db";
import { 
  Briefcase, Plus, Filter, CircleArrowRight, CheckCircle2, Clock, X, 
  TrendingUp, TrendingDown, Coins, HelpCircle, Trash2, Calendar,
  MapPin, Target, FileText, Award, Layers, User, Edit3
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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Program Form
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [unitId, setUnitId] = useState("");
  const [bidangId, setBidangId] = useState("");
  const [subBidangId, setSubBidangId] = useState("");
  const [typeProgramId, setTypeProgramId] = useState("");
  const [tahunAnggaran, setTahunAnggaran] = useState("");
  const [bulan, setBulan] = useState("");
  const [waktuQuarters, setWaktuQuarters] = useState({ Q1: false, Q2: false, Q3: false, Q4: false });
  const [progFrekuensi, setProgFrekuensi] = useState("1");
  const [lokasi, setLokasi] = useState("");
  const [tujuanProgram, setTujuanProgram] = useState("");
  const [ikKualitatif, setIkKualitatif] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
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

  const generateProgramCode = (
    programId: string,
    bId?: string,
    sbId?: string,
    tpId?: string
  ) => {
    const bidangName = bidangList.find(b => b.id === bId)?.name || 'GEN';
    const subBidangName = subBidangList.find(s => s.id === sbId)?.name || 'GEN';
    const typeProgramName = typeProgramList.find(t => t.id === tpId)?.name || 'GEN';

    const clean = (str: string) => str.replace(/[^a-zA-Z0-9]+/g, '').toUpperCase();
    const suffix = programId.slice(-8).toUpperCase();

    return `${clean(bidangName)}-${clean(subBidangName)}-${clean(typeProgramName)}-${suffix}`;
  };

  const openAddModal = () => {
    setName("");
    setUnitId(unitList[0]?.id || "");
    setBidangId(bidangList[0]?.id || "");
    setSubBidangId(subBidangList[0]?.id || "");
    setTypeProgramId(typeProgramList[0]?.id || "");
    setTahunAnggaran("2026");
    setBulan("");
    setProgFrekuensi("1");
    setLokasi("");
    setTujuanProgram("");
    setIkKualitatif("");
    setDeskripsi("");
    setWaktuQuarters({ Q1: false, Q2: false, Q3: false, Q4: false });
    
    setIsEditing(false);
    setShowAddModal(true);
  };

  const openEditModal = (prog: Program) => {
    setName(prog.name || "");
    setUnitId(prog.pjp_unit_id || "");
    setBidangId(prog.bidang_id || "");
    setSubBidangId(prog.sub_bidang_id || "");
    setTypeProgramId(prog.type_program_id || "");
    setTahunAnggaran(prog.tahun_anggaran || "");
    setBulan(prog.bulan ? String(prog.bulan) : "");
    setProgFrekuensi(prog.frekuensi ? String(prog.frekuensi) : "1");
    setLokasi(prog.lokasi || "");
    setTujuanProgram(prog.tujuan_program || "");
    setIkKualitatif(prog.ik_kualitatif || "");
    setDeskripsi(prog.deskripsi || "");
    
    const quarters = { Q1: false, Q2: false, Q3: false, Q4: false };
    if (prog.waktu) {
      prog.waktu.split(',').forEach(w => {
        const trimmed = w.trim();
        if (trimmed === '1') quarters.Q1 = true;
        if (trimmed === '2') quarters.Q2 = true;
        if (trimmed === '3') quarters.Q3 = true;
        if (trimmed === '4') quarters.Q4 = true;
      });
    }
    setWaktuQuarters(quarters);
    
    setIsEditing(true);
    setShowAddModal(true);
  };

  const handleAddProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    setSubmitting(true);
    try {
      const progId = crypto.randomUUID();
      const code = generateProgramCode(progId, bidangId, subBidangId, typeProgramId);
      
      const selectedQuarters: string[] = [];
      if (waktuQuarters.Q1) selectedQuarters.push('1');
      if (waktuQuarters.Q2) selectedQuarters.push('2');
      if (waktuQuarters.Q3) selectedQuarters.push('3');
      if (waktuQuarters.Q4) selectedQuarters.push('4');
      const waktuVal = selectedQuarters.length > 0 ? selectedQuarters.join(', ') : undefined;

      const newProgram: Program = {
        id: progId,
        period_id: "550e8400-e29b-41d4-a716-446655440000",
        name: name.trim(),
        status: "DRAFT" as const,
        pjp_unit_id: unitId || unitList[0]?.id || "550e8400-e29b-41d4-a716-446655440020",
        pic_membership_id: "de641feb-9990-4057-ba23-6c66253e2fa9",
        bidang_id: bidangId || undefined,
        sub_bidang_id: subBidangId || undefined,
        type_program_id: typeProgramId || undefined,
        program_code: code,
        tujuan_program: tujuanProgram.trim() || undefined,
        tahun_anggaran: tahunAnggaran.trim() || undefined,
        bulan: bulan ? parseInt(bulan, 10) : undefined,
        frekuensi: parseInt(progFrekuensi, 10) || 1,
        lokasi: lokasi.trim() || undefined,
        deskripsi: deskripsi.trim() || undefined,
        ik_kualitatif: ikKualitatif.trim() || undefined,
        waktu: waktuVal,
        anggaran_penerimaan: 0,
        anggaran_pengeluaran: 0,
        sync_status: "PENDING" as const,
      };

      await db.programs.add(newProgram);
      setShowAddModal(false);
    } catch (err) {
      console.error("Failed to add program:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProgram || !name.trim()) return;

    setSubmitting(true);
    try {
      const code = generateProgramCode(selectedProgram.id, bidangId, subBidangId, typeProgramId);
      
      const selectedQuarters: string[] = [];
      if (waktuQuarters.Q1) selectedQuarters.push('1');
      if (waktuQuarters.Q2) selectedQuarters.push('2');
      if (waktuQuarters.Q3) selectedQuarters.push('3');
      if (waktuQuarters.Q4) selectedQuarters.push('4');
      const waktuVal = selectedQuarters.length > 0 ? selectedQuarters.join(', ') : null;

      const updates: Partial<Program> = {
        name: name.trim(),
        pjp_unit_id: unitId || unitList[0]?.id || "550e8400-e29b-41d4-a716-446655440020",
        bidang_id: bidangId || undefined,
        sub_bidang_id: subBidangId || undefined,
        type_program_id: typeProgramId || undefined,
        program_code: code,
        tujuan_program: tujuanProgram.trim() || undefined,
        tahun_anggaran: tahunAnggaran.trim() || undefined,
        bulan: bulan ? parseInt(bulan, 10) : undefined,
        frekuensi: parseInt(progFrekuensi, 10) || 1,
        lokasi: lokasi.trim() || undefined,
        deskripsi: deskripsi.trim() || undefined,
        ik_kualitatif: ikKualitatif.trim() || undefined,
        waktu: waktuVal || undefined,
        sync_status: "PENDING" as const,
      };

      await db.programs.update(selectedProgram.id, updates);
      
      setSelectedProgram(prev => prev ? { ...prev, ...updates } : null);
      setShowAddModal(false);
    } catch (err) {
      console.error("Failed to update program:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProgram = async () => {
    if (!selectedProgram) return;

    try {
      const programBudgetLines = await db.anggaran_program.where('program_id').equals(selectedProgram.id).toArray();
      for (const line of programBudgetLines) {
        await db.anggaran_program.delete(line.id);
      }

      await db.programs.delete(selectedProgram.id);

      setSelectedProgram(null);
      setShowDeleteConfirm(false);
    } catch (err) {
      console.error("Failed to delete program:", err);
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
            onClick={openAddModal}
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

      {/* Program Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-end z-[60] animate-fade-in">
          <div className="bg-surface border-l border-border w-full max-w-xl h-full flex flex-col shadow-2xl relative animate-slide-left">
            <header className="p-6 border-b border-border flex justify-between items-center shrink-0">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Briefcase className="text-primary-600" />
                {isEditing ? "Edit Program" : "Add Program"}
              </h2>
              <button 
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={20} />
              </button>
            </header>
            
            <form onSubmit={isEditing ? handleUpdateProgram : handleAddProgram} className="flex-1 flex flex-col min-h-0">
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Column 1 */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                        Program Name *
                      </label>
                      <input 
                        type="text" 
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2 border border-border rounded-2xl bg-background focus:ring-2 focus:ring-primary-500 focus:outline-none text-sm font-medium"
                        placeholder="e.g. Retreat Pemuda 2026"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                        Tipe Program
                      </label>
                      <select 
                        value={typeProgramId}
                        onChange={(e) => setTypeProgramId(e.target.value)}
                        className="w-full px-4 py-2 border border-border rounded-2xl bg-background focus:ring-2 focus:ring-primary-500 focus:outline-none text-sm font-medium"
                      >
                        <option value="">-- Choose Type --</option>
                        {typeProgramList.map(t => (
                          <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                        Bidang
                      </label>
                      <select 
                        value={bidangId}
                        onChange={(e) => setBidangId(e.target.value)}
                        className="w-full px-4 py-2 border border-border rounded-2xl bg-background focus:ring-2 focus:ring-primary-500 focus:outline-none text-sm font-medium"
                      >
                        <option value="">-- Choose Bidang --</option>
                        {bidangList.map(b => (
                          <option key={b.id} value={b.id}>{b.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                        Sub-Bidang
                      </label>
                      <select 
                        value={subBidangId}
                        onChange={(e) => setSubBidangId(e.target.value)}
                        className="w-full px-4 py-2 border border-border rounded-2xl bg-background focus:ring-2 focus:ring-primary-500 focus:outline-none text-sm font-medium"
                      >
                        <option value="">-- Choose Sub-Bidang --</option>
                        {subBidangList.map(s => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                        PJP Unit (Penanggung Jawab)
                      </label>
                      <select 
                        value={unitId}
                        onChange={(e) => setUnitId(e.target.value)}
                        className="w-full px-4 py-2 border border-border rounded-2xl bg-background focus:ring-2 focus:ring-primary-500 focus:outline-none text-sm font-medium"
                      >
                        <option value="">-- Choose Unit --</option>
                        {unitList.map(u => (
                          <option key={u.id} value={u.id}>{u.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                          Tahun Anggaran
                        </label>
                        <input 
                          type="text" 
                          value={tahunAnggaran}
                          onChange={(e) => setTahunAnggaran(e.target.value)}
                          className="w-full px-4 py-2 border border-border rounded-2xl bg-background focus:ring-2 focus:ring-primary-500 focus:outline-none text-sm font-medium"
                          placeholder="2026"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                          Bulan
                        </label>
                        <select 
                          value={bulan}
                          onChange={(e) => setBulan(e.target.value)}
                          className="w-full px-4 py-2 border border-border rounded-2xl bg-background focus:ring-2 focus:ring-primary-500 focus:outline-none text-sm font-medium"
                        >
                          <option value="">-- None --</option>
                          {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                            <option key={m} value={m}>{getMonthName(m)}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Column 2 */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                          Frekuensi
                        </label>
                        <input 
                          type="number" 
                          min="1"
                          value={progFrekuensi}
                          onChange={(e) => setProgFrekuensi(e.target.value)}
                          className="w-full px-4 py-2 border border-border rounded-2xl bg-background focus:ring-2 focus:ring-primary-500 focus:outline-none text-sm font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                          Lokasi / Venue
                        </label>
                        <input 
                          type="text" 
                          value={lokasi}
                          onChange={(e) => setLokasi(e.target.value)}
                          className="w-full px-4 py-2 border border-border rounded-2xl bg-background focus:ring-2 focus:ring-primary-500 focus:outline-none text-sm font-medium"
                          placeholder="e.g. Daring, Jakarta"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">
                        Waktu Pelaksanaan (Quarters)
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {(['Q1', 'Q2', 'Q3', 'Q4'] as const).map(q => (
                          <label 
                            key={q}
                            className={`flex flex-col items-center justify-center py-2 px-3 border rounded-2xl cursor-pointer text-xs font-bold transition-all ${
                              waktuQuarters[q] 
                                ? 'bg-primary-600 border-primary-600 text-white dark:bg-primary-500 dark:border-primary-500 dark:text-white' 
                                : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700/80'
                            }`}
                          >
                            <input 
                              type="checkbox"
                              className="sr-only"
                              checked={waktuQuarters[q]}
                              onChange={(e) => setWaktuQuarters(prev => ({ ...prev, [q]: e.target.checked }))}
                            />
                            <span>{q}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                        Tujuan Program
                      </label>
                      <textarea 
                        value={tujuanProgram}
                        onChange={(e) => setTujuanProgram(e.target.value)}
                        className="w-full px-4 py-2 border border-border rounded-2xl bg-background focus:ring-2 focus:ring-primary-500 focus:outline-none h-16 resize-none text-sm font-medium"
                        placeholder="Program goals..."
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                        Indikator Kinerja Kualitatif
                      </label>
                      <textarea 
                        value={ikKualitatif}
                        onChange={(e) => setIkKualitatif(e.target.value)}
                        className="w-full px-4 py-2 border border-border rounded-2xl bg-background focus:ring-2 focus:ring-primary-500 focus:outline-none h-16 resize-none text-sm font-medium"
                        placeholder="Expected quality results..."
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                        Deskripsi
                      </label>
                      <textarea 
                        value={deskripsi}
                        onChange={(e) => setDeskripsi(e.target.value)}
                        className="w-full px-4 py-2 border border-border rounded-2xl bg-background focus:ring-2 focus:ring-primary-500 focus:outline-none h-16 resize-none text-sm font-medium"
                        placeholder="Additional details..."
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-border bg-surface flex justify-end gap-3 shrink-0">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-3 border border-border rounded-2xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-semibold transition-colors disabled:opacity-50 shadow-lg shadow-primary-500/20 active:scale-95 flex items-center gap-1.5"
                >
                  {submitting ? "Saving..." : (isEditing ? "Save Changes" : "Create Program")}
                </button>
              </div>
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
              <div className="flex items-center gap-2 shrink-0">
                <button 
                  onClick={() => openEditModal(selectedProgram)}
                  title="Edit Program"
                  className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-primary-600 transition-colors"
                >
                  <Edit3 size={18} />
                </button>
                <button 
                  onClick={() => setShowDeleteConfirm(true)}
                  title="Delete Program"
                  className="p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-950/30 text-slate-500 hover:text-red-600 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
                <button 
                  onClick={() => setSelectedProgram(null)}
                  className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors ml-1"
                >
                  <X size={20} />
                </button>
              </div>
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
      {/* Delete Program Confirmation Modal */}
      {showDeleteConfirm && selectedProgram && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-surface border border-border rounded-3xl w-full max-w-sm p-6 shadow-2xl relative text-center space-y-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-red-50 dark:bg-red-950/20 text-red-600 flex items-center justify-center animate-bounce">
              <Trash2 size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Delete Program?</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Are you sure you want to delete <span className="font-semibold text-slate-700 dark:text-slate-300">"{selectedProgram.name}"</span>?
                This action is permanent and will cascade-delete all its detailed budget lines.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button 
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-3 border border-border rounded-2xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={handleDeleteProgram}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-2xl text-xs font-semibold shadow-lg shadow-red-500/10 active:scale-95 transition-all"
              >
                Delete Program
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
