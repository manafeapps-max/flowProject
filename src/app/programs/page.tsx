"use client";

import { useState, useEffect, useMemo } from "react";
import { useQuery } from '@powersync/react';
import { db as powerSyncDb } from '@/lib/powersync/client';
import { Program, AnggaranProgram, Period, ProgramIndicator, Member, UnitMember, Bidang, OrganizationUnit, TypeProgram, ProgramResponsibilityPP } from '@/lib/powersync/types';
import { useAppStore } from "@/store/useAppStore";
import { 
  Briefcase, Plus, Filter, CircleArrowRight, CheckCircle2, Clock, X, 
  TrendingUp, TrendingDown, Coins, HelpCircle, Trash2, Calendar,
  MapPin, Target, FileText, Award, Layers, User, Edit3, CalendarDays, Building2, Search
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { easings } from "@/lib/motion";

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

const formatNumberWithCommas = (value: string | number) => {
  const clean = String(value).replace(/[^0-9]/g, '');
  if (!clean) return "";
  return parseInt(clean, 10).toLocaleString('en-US');
};

export default function ProgramsPage() {
  const { data: programsData } = useQuery('SELECT * FROM programs WHERE deleted_at IS NULL');
  const { data: unitsData } = useQuery('SELECT * FROM organization_units WHERE deleted_at IS NULL');
  const { data: typeProgramsData } = useQuery('SELECT * FROM type_program WHERE deleted_at IS NULL');
  const { data: bidangsData } = useQuery('SELECT * FROM bidang WHERE deleted_at IS NULL');
  const { data: periodsData } = useQuery('SELECT * FROM periods WHERE deleted_at IS NULL');
  const { data: programPPsData } = useQuery('SELECT * FROM program_responsibility_pp WHERE deleted_at IS NULL');
  const { data: membersData } = useQuery('SELECT * FROM members WHERE deleted_at IS NULL');
  const { data: unitMembersData } = useQuery('SELECT * FROM unit_members WHERE deleted_at IS NULL');

  const programs = (programsData || []) as Program[];
  const units = (unitsData || []) as OrganizationUnit[];
  const typePrograms = (typeProgramsData || []) as TypeProgram[];
  const bidangs = (bidangsData || []) as Bidang[];
  const periods = (periodsData || []) as Period[];
  const programPPs = (programPPsData || []) as ProgramResponsibilityPP[];
  const members = (membersData || []) as Member[];
  const unitMembers = (unitMembersData || []) as UnitMember[];

  const subBidangs = useMemo(() => {
    return units.filter((u: any) => u.parent_id !== null || !!u.bidang_id);
  }, [units]);

  const getPeriodDurationYears = (p: Period) => {
    const start = new Date(p.start_date);
    const end = new Date(p.end_date);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return 1;
    return (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
  };

  const activeFiscalPeriod = (periods || []).find(p => p.is_active && getPeriodDurationYears(p) <= 2) || (periods || []).filter(p => getPeriodDurationYears(p) <= 2)[0];
  const activeMembershipPeriod = (periods || []).find(p => p.is_active && getPeriodDurationYears(p) > 2) || (periods || []).filter(p => getPeriodDurationYears(p) > 2)[0];
  const activePeriod = activeMembershipPeriod || activeFiscalPeriod || (periods || [])[0];

  const currentUser = useAppStore(state => state.user);
  const setCurrentUserRole = useAppStore(state => state.setCurrentUserRole);
  const currentUserRole = useAppStore(state => state.currentUserRole);

  const { data: userRolesData } = useQuery('SELECT * FROM user_role WHERE deleted_at IS NULL');
  const userRolesList = userRolesData || [];
  const userProfilesList: any[] = [];

  const { data: myRolesData } = useQuery(
    'SELECT * FROM user_role WHERE (user_id = ? OR LOWER(user_id) = LOWER(?)) AND period_id = ? AND deleted_at IS NULL',
    [currentUser?.id || '', currentUser?.email || '', activePeriod?.id || '']
  );
  const myRoles = myRolesData || [];

  useEffect(() => {
    if (myRoles && myRoles.length > 0) {
      setCurrentUserRole(myRoles[0].role);
    } else if (currentUser && (currentUser.email === 'benmanafe48@gmail.com' || currentUser.email === 'stolaputih@gmail.com' || userRolesList.length === 0)) {
      setCurrentUserRole('SYSTEM_OWNER');
    } else {
      setCurrentUserRole(null);
    }
  }, [myRoles, currentUser, activePeriod, userRolesList, setCurrentUserRole]);

  // One-off migration: update any program's pjp_bidang_id to PELKES if it's not already
  useEffect(() => {
    const runLocalMigration = async () => {
      try {
        const isMigrated = localStorage.getItem("pjp_migrated_to_pelkes_v1");
        if (isMigrated === "true") return;

        const PELKES_BIDANG_ID = '550e8400-e29b-41d4-a716-446655440010';
        const now = new Date().toISOString();
        
        await powerSyncDb.writeTransaction(async (tx) => {
          await tx.execute(
            'UPDATE programs SET pjp_bidang_id = ?, updated_at = ? WHERE pjp_bidang_id <> ? AND deleted_at IS NULL',
            [PELKES_BIDANG_ID, now, PELKES_BIDANG_ID]
          );
        });

        console.log(`Local PJP to PELKES migration executed.`);
        localStorage.setItem("pjp_migrated_to_pelkes_v1", "true");
      } catch (err) {
        console.error("Local PJP migration failed:", err);
      }
    };

    runLocalMigration();
  }, []);

  const canEditPrograms = currentUserRole === 'SYSTEM_OWNER' || currentUserRole === 'SUPER_ADMIN' || currentUserRole === 'ADMIN' || currentUserRole === 'STAFF' || currentUserRole === 'BENDAHARA';
  const isGlobalAdmin = currentUserRole === 'SYSTEM_OWNER' || currentUserRole === 'SUPER_ADMIN' || currentUserRole === 'ADMIN';

  // Retrieve current user unit assignments
  const memberEmail = currentUser?.email || '';
  const activePeriodId = activeMembershipPeriod?.id || '';
  const { data: userAssignmentsData } = useQuery(
    `SELECT um.* 
     FROM unit_members um
     JOIN members m ON um.member_id = m.id
     WHERE LOWER(m.email) = LOWER(?) AND um.period_id = ? AND um.deleted_at IS NULL AND m.deleted_at IS NULL`,
    [memberEmail, activePeriodId]
  );
  const userAssignments = (userAssignmentsData || []) as any[];

  const myBidangIds = (userAssignments || []).map(a => {
    if (a.unit_type === 'BIDANG') return a.unit_id;
    if (a.unit_type === 'UNIT') {
      const u = (units || []).find(unit => unit.id === a.unit_id);
      return u?.bidang_id;
    }
    return null;
  }).filter(Boolean) as string[];
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [showAddBudgetModal, setShowAddBudgetModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 150);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Program Form
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [pjpBidangId, setPjpBidangId] = useState("");
  const [ppBidangIds, setPpBidangIds] = useState<string[]>([]);
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
  const [picDetails, setPicDetails] = useState<{ name: string; bidang: string } | null>(null);
  const [picMembershipId, setPicMembershipId] = useState("");

  // Indicators Form State
  const [indicatorsList, setIndicatorsList] = useState<{
    id?: string;
    type: 'KUALITATIF' | 'KUANTITATIF';
    indicator_text: string;
    target?: string;
    realization?: string;
    unit?: string;
  }[]>([]);
  const [newIndText, setNewIndText] = useState("");
  const [newIndType, setNewIndType] = useState<'KUALITATIF' | 'KUANTITATIF'>('KUALITATIF');
  const [newIndTarget, setNewIndTarget] = useState("");
  const [newIndRealization, setNewIndRealization] = useState("");
  const [newIndUnit, setNewIndUnit] = useState("");

  // Budget Item Form
  const [editingBudgetItem, setEditingBudgetItem] = useState<AnggaranProgram | null>(null);
  const [budgetItemName, setBudgetItemName] = useState("");
  const [jenisAnggaran, setJenisAnggaran] = useState<'PENERIMAAN' | 'PENGELUARAN'>('PENGELUARAN');
  const [volume, setVolume] = useState("1");
  const [satuan, setSatuan] = useState("Kegiatan");
  const [hargaSatuan, setHargaSatuan] = useState("0");
  const [frekuensi, setFrekuensi] = useState("1");
  const [sumberDana, setSumberDana] = useState("");
  const [catatan, setCatatan] = useState("");

  const filteredPrograms = (programs || []).filter(p => 
    p.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
  );
  const programList = filteredPrograms;
  const unitList = units || [];
  const typeProgramList = typePrograms || [];
  const bidangList = bidangs || [];
  const subBidangList = subBidangs || [];
  const formSubBidangList = subBidangList.filter((s: OrganizationUnit) => 
    (s.bidang_id && s.bidang_id === bidangId) || 
    (s.parent_id && s.parent_id === bidangId)
  );
  const periodList = periods || [];

  // Query budget items dynamically for the selected program
  const { data: budgetLinesData } = useQuery(
    'SELECT * FROM anggaran_program WHERE program_id = ? AND deleted_at IS NULL',
    [selectedProgram?.id || '']
  );
  const budgetLines = (budgetLinesData || []) as AnggaranProgram[];

  // Query success indicators dynamically for the selected program
  const { data: programIndicatorsData } = useQuery(
    'SELECT * FROM program_indicators WHERE program_id = ? AND deleted_at IS NULL',
    [selectedProgram?.id || '']
  );
  const programIndicators = (programIndicatorsData || []) as ProgramIndicator[];

  const revenueItems = budgetLines.filter(item => item.jenis_anggaran === 'PENERIMAAN');
  const expenseItems = budgetLines.filter(item => item.jenis_anggaran === 'PENGELUARAN');

  const totalRevenue = revenueItems.reduce((acc, curr) => acc + (curr.sub_total || 0), 0);

  useEffect(() => {
    const resolvePic = async () => {
      if (!selectedProgram || !selectedProgram.pic_membership_id) {
        setPicDetails(null);
        return;
      }
      
      const picId = selectedProgram.pic_membership_id;
      let member: any = null;
      
      try {
        // 1. Try directly looking up by member ID in members
        member = await powerSyncDb.getOptional('SELECT * FROM members WHERE id = ? AND deleted_at IS NULL', [picId]);
        
        // 2. Fallback: Check if the user is stolaputih or benmanafe to match members
        if (!member) {
          if (picId === 'de641feb-9990-4057-ba23-6c66253e2fa9') {
            member = await powerSyncDb.getOptional('SELECT * FROM members WHERE LOWER(email) = LOWER(?) AND deleted_at IS NULL', ['stolaputih@gmail.com']);
          }
        }

        if (!member) {
          setPicDetails({ name: 'Unknown Member', bidang: 'N/A' });
          return;
        }
        
        // Resolve Bidang
        let bidangName = 'N/A';
        const assignments = await powerSyncDb.getAll('SELECT * FROM unit_members WHERE member_id = ? AND deleted_at IS NULL', [member.id]) as any[];
        if (assignments.length > 0) {
          const primary = assignments[0];
          if (primary.unit_type === 'BIDANG') {
            const bd = await powerSyncDb.getOptional('SELECT name FROM bidang WHERE id = ? AND deleted_at IS NULL', [primary.unit_id]) as any;
            if (bd) bidangName = bd.name;
          } else {
            // It's a Sub-Bidang/Unit
            const unit = await powerSyncDb.getOptional('SELECT name, bidang_id, parent_id FROM organization_units WHERE id = ? AND deleted_at IS NULL', [primary.unit_id]) as any;
            if (unit) {
              const parentBidangId = unit.bidang_id || unit.parent_id;
              if (parentBidangId) {
                const bd = await powerSyncDb.getOptional('SELECT name FROM bidang WHERE id = ? AND deleted_at IS NULL', [parentBidangId]) as any;
                if (bd) {
                  bidangName = `${bd.name} (${unit.name})`;
                } else {
                  bidangName = unit.name;
                }
              } else {
                bidangName = unit.name;
              }
            }
          }
        }
        
        setPicDetails({
          name: member.name,
          bidang: bidangName
        });
      } catch (err) {
        console.error('Error resolving PIC details:', err);
        setPicDetails({ name: 'Unknown Member', bidang: 'N/A' });
      }
    };
    
    resolvePic();
  }, [selectedProgram]);
  const totalExpense = expenseItems.reduce((acc, curr) => acc + (curr.sub_total || 0), 0);

  const getCatatanAnggaran = () => {
    if (budgetLines.length === 0) return selectedProgram?.catatan_anggaran || '';
    
    const revenueSummary = revenueItems.map(item => `${item.nama_anggaran} (Rp ${(item.sub_total || 0).toLocaleString('id-ID')})`).join(', ');
    const expenseSummary = expenseItems.map(item => `${item.nama_anggaran} (Rp ${(item.sub_total || 0).toLocaleString('id-ID')})`).join(', ');
    
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
    const initialBidangId = (!isGlobalAdmin && myBidangIds.length > 0) ? myBidangIds[0] : (bidangList[0]?.id || "");
    setPjpBidangId(initialBidangId);
    setPpBidangIds([]);
    setBidangId(initialBidangId);
    setSubBidangId(subBidangList[0]?.id || "");
    setTypeProgramId(typeProgramList[0]?.id || "");
    setTahunAnggaran(activeFiscalPeriod?.name || "2026");
    setBulan("");
    setProgFrekuensi("1");
    setLokasi("");
    setTujuanProgram("");
    setIkKualitatif("");
    setDeskripsi("");
    setWaktuQuarters({ Q1: false, Q2: false, Q3: false, Q4: false });

    const emailLower = currentUser?.email?.toLowerCase();
    const defaultMember = emailLower
      ? members.find(m => m.email?.toLowerCase() === emailLower)
      : null;
    setPicMembershipId(defaultMember?.id || members[0]?.id || "de641feb-9990-4057-ba23-6c66253e2fa9");
    setIndicatorsList([]);
    setNewIndText("");
    setNewIndType("KUALITATIF");
    setNewIndTarget("");
    setNewIndRealization("");
    setNewIndUnit("");
    
    setIsEditing(false);
    setShowAddModal(true);
  };

  const openEditModal = (prog: Program) => {
    setName(prog.name || "");
    setPjpBidangId(prog.pjp_bidang_id || "");
    powerSyncDb.getAll('SELECT bidang_id FROM program_responsibility_pp WHERE program_id = ? AND deleted_at IS NULL', [prog.id]).then((pps: any[]) => {
      setPpBidangIds(pps.map((pp: any) => pp.bidang_id));
    });
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
    
    powerSyncDb.getAll('SELECT * FROM program_indicators WHERE program_id = ? AND deleted_at IS NULL', [prog.id]).then((inds: any[]) => {
      setIndicatorsList(inds.map((ind: any) => ({
        id: ind.id,
        type: ind.type,
        indicator_text: ind.indicator_text,
        target: ind.target !== null && ind.target !== undefined ? String(ind.target) : "",
        realization: ind.realization !== null && ind.realization !== undefined ? String(ind.realization) : "",
        unit: ind.unit || ""
      })));
    });
    setNewIndText("");
    setNewIndType("KUALITATIF");
    setNewIndTarget("");
    setNewIndRealization("");
    setNewIndUnit("");
    
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
    setPicMembershipId(prog.pic_membership_id || "de641feb-9990-4057-ba23-6c66253e2fa9");
    
    setIsEditing(true);
    setShowAddModal(true);
  };

  const handleAddProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEditPrograms) return;
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

      const nowStr = new Date().toISOString();
      await powerSyncDb.writeTransaction(async (tx) => {
        await tx.execute(
          `INSERT INTO programs (
            id, period_id, name, status, pjp_bidang_id, pic_membership_id, bidang_id, sub_bidang_id, type_program_id,
            program_code, tujuan_program, tahun_anggaran, bulan, frekuensi, lokasi, deskripsi, ik_kualitatif, waktu,
            anggaran_penerimaan, anggaran_pengeluaran, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            progId,
            activeMembershipPeriod?.id || "550e8400-e29b-41d4-a716-446655440000",
            name.trim(),
            'DRAFT',
            pjpBidangId || bidangList[0]?.id || "550e8400-e29b-41d4-a716-446655440010",
            picMembershipId || "de641feb-9990-4057-ba23-6c66253e2fa9",
            bidangId || null,
            subBidangId || null,
            typeProgramId || null,
            code,
            tujuanProgram.trim() || null,
            tahunAnggaran.trim() || null,
            bulan ? parseInt(bulan, 10) : null,
            parseInt(progFrekuensi, 10) || 1,
            lokasi.trim() || null,
            deskripsi.trim() || null,
            ikKualitatif.trim() || null,
            waktuVal || null,
            0,
            0,
            nowStr,
            nowStr
          ]
        );

        for (const bId of ppBidangIds) {
          await tx.execute(
            'INSERT INTO program_responsibility_pp (id, program_id, bidang_id, period_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
            [crypto.randomUUID(), progId, bId, activeMembershipPeriod?.id || "550e8400-e29b-41d4-a716-446655440000", nowStr, nowStr]
          );
        }

        for (const ind of indicatorsList) {
          await tx.execute(
            'INSERT INTO program_indicators (id, program_id, type, indicator_text, target, realization, unit, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
              crypto.randomUUID(),
              progId,
              ind.type,
              ind.indicator_text,
              ind.target ? parseFloat(ind.target) : null,
              ind.realization ? parseFloat(ind.realization) : null,
              ind.unit || null,
              nowStr,
              nowStr
            ]
          );
        }
      });
      setShowAddModal(false);
    } catch (err) {
      console.error("Failed to add program:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEditPrograms) return;
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

      const nowStr = new Date().toISOString();
      await powerSyncDb.writeTransaction(async (tx) => {
        await tx.execute(
          `UPDATE programs SET 
            name = ?, pjp_bidang_id = ?, pic_membership_id = ?, bidang_id = ?, sub_bidang_id = ?, type_program_id = ?,
            program_code = ?, tujuan_program = ?, tahun_anggaran = ?, bulan = ?, frekuensi = ?, lokasi = ?,
            deskripsi = ?, ik_kualitatif = ?, waktu = ?, updated_at = ?
           WHERE id = ?`,
          [
            name.trim(),
            pjpBidangId || bidangList[0]?.id || "550e8400-e29b-41d4-a716-446655440010",
            picMembershipId,
            bidangId || null,
            subBidangId || null,
            typeProgramId || null,
            code,
            tujuanProgram.trim() || null,
            tahunAnggaran.trim() || null,
            bulan ? parseInt(bulan, 10) : null,
            parseInt(progFrekuensi, 10) || 1,
            lokasi.trim() || null,
            deskripsi.trim() || null,
            ikKualitatif.trim() || null,
            waktuVal || null,
            nowStr,
            selectedProgram.id
          ]
        );

        // Soft delete old responsibility entries
        await tx.execute(
          'UPDATE program_responsibility_pp SET deleted_at = ?, updated_at = ? WHERE program_id = ? AND deleted_at IS NULL',
          [nowStr, nowStr, selectedProgram.id]
        );

        for (const bId of ppBidangIds) {
          await tx.execute(
            'INSERT INTO program_responsibility_pp (id, program_id, bidang_id, period_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
            [crypto.randomUUID(), selectedProgram.id, bId, activeMembershipPeriod?.id || "550e8400-e29b-41d4-a716-446655440000", nowStr, nowStr]
          );
        }

        // Soft delete old indicators
        await tx.execute(
          'UPDATE program_indicators SET deleted_at = ?, updated_at = ? WHERE program_id = ? AND deleted_at IS NULL',
          [nowStr, nowStr, selectedProgram.id]
        );

        for (const ind of indicatorsList) {
          await tx.execute(
            'INSERT INTO program_indicators (id, program_id, type, indicator_text, target, realization, unit, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
              ind.id || crypto.randomUUID(),
              selectedProgram.id,
              ind.type,
              ind.indicator_text,
              ind.target ? parseFloat(ind.target) : null,
              ind.realization ? parseFloat(ind.realization) : null,
              ind.unit || null,
              nowStr,
              nowStr
            ]
          );
        }
      });

      const updates = {
        name: name.trim(),
        pjp_bidang_id: pjpBidangId || bidangList[0]?.id || "550e8400-e29b-41d4-a716-446655440010",
        pic_membership_id: picMembershipId,
        bidang_id: bidangId || null,
        sub_bidang_id: subBidangId || null,
        type_program_id: typeProgramId || null,
        program_code: code,
        tujuan_program: tujuanProgram.trim() || null,
        tahun_anggaran: tahunAnggaran.trim() || null,
        bulan: bulan ? parseInt(bulan, 10) : null,
        frekuensi: parseInt(progFrekuensi, 10) || 1,
        lokasi: lokasi.trim() || null,
        deskripsi: deskripsi.trim() || null,
        ik_kualitatif: ikKualitatif.trim() || null,
        waktu: waktuVal || null,
      };
      
      setSelectedProgram(prev => prev ? { ...prev, ...updates } : null);
      setShowAddModal(false);
    } catch (err) {
      console.error("Failed to update program:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProgram = async () => {
    if (!canEditPrograms) return;
    if (!selectedProgram) return;

    try {
      const nowStr = new Date().toISOString();
      await powerSyncDb.writeTransaction(async (tx) => {
        // Soft delete all related tables
        await tx.execute('UPDATE anggaran_program SET deleted_at = ?, updated_at = ? WHERE program_id = ? AND deleted_at IS NULL', [nowStr, nowStr, selectedProgram.id]);
        await tx.execute('UPDATE program_responsibility_pp SET deleted_at = ?, updated_at = ? WHERE program_id = ? AND deleted_at IS NULL', [nowStr, nowStr, selectedProgram.id]);
        await tx.execute('UPDATE program_indicators SET deleted_at = ?, updated_at = ? WHERE program_id = ? AND deleted_at IS NULL', [nowStr, nowStr, selectedProgram.id]);
        await tx.execute('UPDATE programs SET deleted_at = ?, updated_at = ? WHERE id = ?', [nowStr, nowStr, selectedProgram.id]);
      });

      setSelectedProgram(null);
      setShowDeleteConfirm(false);
    } catch (err) {
      console.error("Failed to delete program:", err);
    }
  };

  const recountProgramBudget = async (programId: string) => {
    try {
      const lines = await powerSyncDb.getAll(
        'SELECT * FROM anggaran_program WHERE program_id = ? AND deleted_at IS NULL',
        [programId]
      ) as any[];
      
      const revenueTotal = lines.filter(l => l.jenis_anggaran === 'PENERIMAAN').reduce((acc, curr) => acc + ((curr.sub_total || 0) || (curr.volume * curr.harga_satuan * curr.frekuensi_pelaksanaan)), 0);
      const expenseTotal = lines.filter(l => l.jenis_anggaran === 'PENGELUARAN').reduce((acc, curr) => acc + ((curr.sub_total || 0) || (curr.volume * curr.harga_satuan * curr.frekuensi_pelaksanaan)), 0);
      
      const nowStr = new Date().toISOString();
      await powerSyncDb.writeTransaction(async (tx) => {
        await tx.execute(
          'UPDATE programs SET anggaran_penerimaan = ?, anggaran_pengeluaran = ?, updated_at = ? WHERE id = ?',
          [revenueTotal, expenseTotal, nowStr, programId]
        );
      });
      
      setSelectedProgram(prev => prev && prev.id === programId ? {
        ...prev,
        anggaran_penerimaan: revenueTotal,
        anggaran_pengeluaran: expenseTotal
      } : prev);
    } catch (err) {
      console.error("Failed to recount program budget:", err);
    }
  };

  const openAddBudgetModal = () => {
    setEditingBudgetItem(null);
    setBudgetItemName("");
    setJenisAnggaran("PENGELUARAN");
    setVolume("1");
    setSatuan("Kegiatan");
    setHargaSatuan("0");
    setFrekuensi("1");
    setSumberDana("");
    setCatatan("");
    setShowAddBudgetModal(true);
  };

  const openEditBudgetModal = (item: AnggaranProgram) => {
    setEditingBudgetItem(item);
    setBudgetItemName(item.nama_anggaran);
    setJenisAnggaran(item.jenis_anggaran);
    setVolume(String(item.volume));
    setSatuan(item.satuan || "");
    setHargaSatuan(formatNumberWithCommas(item.harga_satuan));
    setFrekuensi(String(item.frekuensi_pelaksanaan));
    setSumberDana(item.sumber_dana || "");
    setCatatan(item.catatan || "");
    setShowAddBudgetModal(true);
  };

  const handleSaveBudgetItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEditPrograms) return;
    if (!selectedProgram || !budgetItemName.trim()) return;

    setSubmitting(true);
    try {
      const vol = parseFloat(volume) || 0;
      const price = parseFloat(hargaSatuan.replace(/[^0-9]/g, '')) || 0;
      const freq = parseInt(frekuensi, 10) || 1;
      const calculatedSubtotal = vol * price * freq;

      const nowStr = new Date().toISOString();
      await powerSyncDb.writeTransaction(async (tx) => {
        if (editingBudgetItem) {
          await tx.execute(
            `UPDATE anggaran_program SET 
              jenis_anggaran = ?, nama_anggaran = ?, volume = ?, satuan = ?, harga_satuan = ?,
              frekuensi_pelaksanaan = ?, sumber_dana = ?, catatan = ?, sub_total = ?, updated_at = ?
             WHERE id = ?`,
            [
              jenisAnggaran, budgetItemName.trim(), vol, satuan.trim(), price, freq,
              jenisAnggaran === 'PENERIMAAN' ? (sumberDana.trim() || 'Internal') : null,
              catatan.trim() || null, calculatedSubtotal, nowStr, editingBudgetItem.id
            ]
          );
        } else {
          await tx.execute(
            `INSERT INTO anggaran_program (
              id, program_id, jenis_anggaran, nama_anggaran, volume, satuan, harga_satuan,
              sumber_harga, frekuensi_pelaksanaan, sumber_dana, catatan, sub_total, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              crypto.randomUUID(), selectedProgram.id, jenisAnggaran, budgetItemName.trim(),
              vol, satuan.trim(), price, 'MANUAL', freq,
              jenisAnggaran === 'PENERIMAAN' ? (sumberDana.trim() || 'Internal') : null,
              catatan.trim() || null, calculatedSubtotal, nowStr, nowStr
            ]
          );
        }
      });
      await recountProgramBudget(selectedProgram.id);

      setBudgetItemName("");
      setVolume("1");
      setSatuan("Kegiatan");
      setHargaSatuan("0");
      setFrekuensi("1");
      setSumberDana("");
      setCatatan("");
      setEditingBudgetItem(null);
      setShowAddBudgetModal(false);
    } catch (err) {
      console.error("Failed to save budget item:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteBudgetItem = async (id: string) => {
    if (!canEditPrograms) return;
    if (!selectedProgram) return;
    try {
      const nowStr = new Date().toISOString();
      await powerSyncDb.writeTransaction(async (tx) => {
        await tx.execute('UPDATE anggaran_program SET deleted_at = ?, updated_at = ? WHERE id = ?', [nowStr, nowStr, id]);
      });
      await recountProgramBudget(selectedProgram.id);
    } catch (err) {
      console.error("Failed to delete budget item:", err);
    }
  };

  return (
    <div className="py-6 pb-24 max-w-5xl mx-auto">
      <header className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-text-high">
            <Briefcase className="text-accent-valor" /> Programs
          </h1>
          <p className="text-text-muted text-sm mt-1">Budget planning & tracking</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-surface-elevated border border-border-subtle hover:border-border-strong text-text-high p-3 rounded-full shadow-sm active:scale-95 transition-all hover:scale-105 hover:bg-surface-base">
            <Filter size={20} />
          </button>
          {canEditPrograms && (
            <motion.button 
              onClick={openAddModal}
              whileTap={{ scale: 0.96 }}
              transition={{ duration: 0.1, ease: easings.spring }}
              className="bg-brand-primary hover:brightness-110 text-[oklch(0.985_0.005_90)] p-3 rounded-full shadow-lg cursor-pointer"
            >
              <Plus size={20} />
            </motion.button>
          )}
        </div>
      </header>

      <div className="mb-6 relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-text-muted" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="appearance-none block w-full pl-11 pr-4 py-3 border border-border-subtle rounded-2xl bg-surface-elevated placeholder-text-disabled focus:outline-none focus:ring-2 focus:ring-accent-valor focus:border-transparent transition-all sm:text-sm shadow-sm text-text-high"
          placeholder="Cari program berdasarkan nama..."
        />
      </div>

      <section className="space-y-4">
        {programs.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            No programs found. Click the + button to add one.
          </div>
        ) : programList.length === 0 ? (
          <div className="bg-surface-elevated border border-border-subtle p-12 rounded-3xl text-center text-text-muted">
            <HelpCircle className="mx-auto text-text-disabled mb-3" size={40} />
            <p className="text-sm font-medium">Tidak ada hasil pencarian untuk "{searchQuery}".</p>
          </div>
        ) : (
          programList.map(program => (
            <motion.div 
              key={program.id} 
              onClick={() => setSelectedProgram(program)}
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.15, ease: easings.smooth }}
              className="bg-surface-elevated border border-border-subtle rounded-3xl p-5 shadow-[var(--shadow-soft)] flex flex-col gap-4 cursor-pointer hover:border-accent-valor/50 hover:shadow-[var(--shadow-medium)]"
            >
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h2 className="font-semibold text-lg leading-tight text-text-high">{program.name}</h2>
                  <span className="text-xs text-text-muted mt-1 block">
                    Sync Status: SYNCED
                  </span>
                </div>
                <div className={`px-3 py-1 rounded-full border text-xs font-semibold flex items-center gap-1 shrink-0 ${getStatusColor(program.status)}`}>
                  {getStatusIcon(program.status)}
                  {program.status.replace('_', ' ')}
                </div>
              </div>
              
              <div className="flex items-center justify-between gap-4 pt-4 border-t border-dashed border-border-subtle text-xs">
                <div>
                  <span className="text-text-muted block mb-0.5">Penerimaan</span>
                  <span className="font-bold text-[oklch(0.62_0.17_150)] dark:text-[oklch(0.72_0.17_150)] text-sm font-serif tabular-nums">
                    Rp {(program.anggaran_penerimaan || 0).toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-text-muted block mb-0.5">Pengeluaran</span>
                  <span className="font-bold text-text-high text-sm font-serif tabular-nums">
                    Rp {(program.anggaran_pengeluaran || 0).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </section>

      {/* Program Add/Edit Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 bg-slate-950/65 backdrop-blur-md flex justify-end z-[60]">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: easings.smooth }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-slate-950/65 backdrop-blur-md"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.4, ease: easings.smooth }}
              className="bg-surface-elevated border-l border-border-subtle w-full max-w-xl h-full flex flex-col shadow-2xl relative z-10"
            >
              <header className="p-6 border-b border-border-subtle flex justify-between items-center shrink-0">
                <h2 className="text-xl font-bold flex items-center gap-2 text-text-high">
                  <Briefcase className="text-accent-valor" />
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
                        {bidangList
                          .filter(b => isGlobalAdmin || myBidangIds.length === 0 || myBidangIds.includes(b.id))
                          .map(b => (
                            <option key={b.id} value={b.id}>{b.name}</option>
                          ))
                        }
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
                        {formSubBidangList.map((s: any) => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                        PJP (Penanggung Jawab) *
                      </label>
                      <select 
                        required
                        value={pjpBidangId}
                        onChange={(e) => {
                          setPjpBidangId(e.target.value);
                          setPpBidangIds(prev => prev.filter(id => id !== e.target.value));
                        }}
                        className="w-full px-4 py-2 border border-border rounded-2xl bg-background focus:ring-2 focus:ring-primary-500 focus:outline-none text-sm font-medium"
                      >
                        <option value="" disabled>-- Choose Bidang --</option>
                        {bidangList.map(b => (
                          <option key={b.id} value={b.id}>{b.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                        PIC (Person In Charge) *
                      </label>
                      <select 
                        required
                        value={picMembershipId}
                        onChange={(e) => setPicMembershipId(e.target.value)}
                        className="w-full px-4 py-2 border border-border rounded-2xl bg-background focus:ring-2 focus:ring-primary-500 focus:outline-none text-sm font-medium"
                      >
                        <option value="" disabled>-- Choose PIC --</option>
                        {members.map(m => (
                          <option key={m.id} value={m.id}>{m.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">
                        PP (Penopang Program)
                      </label>
                      <details className="group border border-border rounded-2xl bg-background overflow-hidden">
                        <summary className="flex justify-between items-center px-4 py-2 cursor-pointer select-none text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40">
                          <span>Pilih PP ({ppBidangIds.length} terpilih)</span>
                          <svg className="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </summary>
                        <div className="p-3 border-t border-border space-y-2 max-h-36 overflow-y-auto bg-slate-50/30 dark:bg-slate-900/10">
                          {bidangList
                            .filter(b => b.id !== pjpBidangId)
                            .map(b => {
                              const isChecked = ppBidangIds.includes(b.id);
                              return (
                                <label key={b.id} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 font-medium cursor-pointer">
                                  <input 
                                    type="checkbox" 
                                    checked={isChecked}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setPpBidangIds(prev => [...prev, b.id]);
                                      } else {
                                        setPpBidangIds(prev => prev.filter(id => id !== b.id));
                                      }
                                    }}
                                    className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                                  />
                                  <span>{b.name}</span>
                                </label>
                              );
                            })
                          }
                          {bidangList.filter(b => b.id !== pjpBidangId).length === 0 && (
                            <span className="text-xs text-slate-400">Tidak ada bidang penopang lain yang tersedia.</span>
                          )}
                        </div>
                      </details>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                        Tahun Anggaran
                      </label>
                      <input 
                        type="text" 
                        readOnly
                        value={tahunAnggaran}
                        className="w-full px-4 py-2 border border-border rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 cursor-not-allowed focus:outline-none text-sm font-medium"
                        placeholder="2026"
                      />
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
                      <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">
                        Indikator Keberhasilan (IK)
                      </label>
                      
                      {/* Indicators List */}
                      {indicatorsList.length > 0 && (
                        <div className="space-y-2 mb-4 max-h-48 overflow-y-auto p-3 border border-border rounded-2xl bg-slate-50 dark:bg-slate-800/40">
                          {indicatorsList.map((ind, idx) => (
                            <div key={idx} className="flex justify-between items-start gap-2 bg-background border border-border/60 p-2.5 rounded-xl shadow-xs">
                              <div className="text-xs">
                                <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase mr-1.5 ${
                                  ind.type === 'KUALITATIF' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400' : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400'
                                }`}>
                                  {ind.type}
                                </span>
                                <span className="text-slate-700 dark:text-slate-300 font-medium">{ind.indicator_text}</span>
                                {ind.type === 'KUANTITATIF' && ind.target && (
                                  <span className="text-slate-400 ml-1">
                                    (Target: {ind.target} {ind.unit}
                                    {ind.realization ? `, Realisasi: ${ind.realization}` : ''})
                                  </span>
                                )}
                              </div>
                              <button 
                                type="button"
                                onClick={() => setIndicatorsList(prev => prev.filter((_, i) => i !== idx))}
                                className="text-slate-400 hover:text-red-500 transition-colors shrink-0"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Add Indicator Form Widget */}
                      <div className="p-3 border border-border rounded-2xl bg-slate-50 dark:bg-slate-800/20 space-y-3">
                        <div className="flex gap-2">
                          <select 
                            value={newIndType}
                            onChange={(e) => setNewIndType(e.target.value as any)}
                            className="px-3 py-1.5 border border-border rounded-xl bg-background text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary-500"
                          >
                            <option value="KUALITATIF">Kualitatif</option>
                            <option value="KUANTITATIF">Kuantitatif</option>
                          </select>
                          <input 
                            type="text"
                            value={newIndText}
                            onChange={(e) => setNewIndText(e.target.value)}
                            placeholder="Tulis deskripsi indikator..."
                            className="flex-1 px-3 py-1.5 border border-border rounded-xl bg-background text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
                          />
                        </div>
                        
                        {newIndType === 'KUANTITATIF' && (
                          <div className="grid grid-cols-3 gap-2 animate-fade-in">
                            <div>
                              <input 
                                type="number"
                                value={newIndTarget}
                                onChange={(e) => setNewIndTarget(e.target.value)}
                                placeholder="Target (Angka)"
                                className="w-full px-3 py-1.5 border border-border rounded-xl bg-background text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
                              />
                            </div>
                            <div>
                              <input 
                                type="text"
                                value={newIndUnit}
                                onChange={(e) => setNewIndUnit(e.target.value)}
                                placeholder="Satuan (e.g. orang)"
                                className="w-full px-3 py-1.5 border border-border rounded-xl bg-background text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
                              />
                            </div>
                            <div>
                              <input 
                                type="number"
                                value={newIndRealization}
                                onChange={(e) => setNewIndRealization(e.target.value)}
                                placeholder="Realisasi (Angka)"
                                className="w-full px-3 py-1.5 border border-border rounded-xl bg-background text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
                              />
                            </div>
                          </div>
                        )}
                        
                        <button 
                          type="button"
                          onClick={() => {
                            if (!newIndText.trim()) return;
                            setIndicatorsList(prev => [...prev, {
                              type: newIndType,
                              indicator_text: newIndText.trim(),
                              target: newIndType === 'KUANTITATIF' ? newIndTarget : undefined,
                              realization: newIndType === 'KUANTITATIF' ? newIndRealization : undefined,
                              unit: newIndType === 'KUANTITATIF' ? newIndUnit.trim() : undefined
                            }]);
                            setNewIndText("");
                            setNewIndTarget("");
                            setNewIndRealization("");
                            setNewIndUnit("");
                          }}
                          className="w-full py-1.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-300 dark:hover:bg-slate-700/80 active:scale-[0.98] transition-transform"
                        >
                          Tambahkan Indikator
                        </button>
                      </div>
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

              <div className="p-6 border-t border-border-subtle bg-surface-elevated flex justify-end gap-3 shrink-0">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-3 border border-border-subtle rounded-2xl text-sm font-semibold text-text-muted hover:bg-[oklch(0.96_0.005_90)] dark:hover:bg-[oklch(0.20_0.02_260)]"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-3 bg-brand-primary text-[oklch(0.985_0.005_90)] rounded-2xl font-semibold transition-colors disabled:opacity-50 shadow-lg active:scale-95 flex items-center gap-1.5"
                >
                  {submitting ? "Saving..." : (isEditing ? "Save Changes" : "Create Program")}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
      </AnimatePresence>

      {/* Program Details Sheet / Modal */}
      <AnimatePresence>
        {selectedProgram && (
          <div className="fixed inset-0 bg-slate-950/65 backdrop-blur-md flex justify-end z-[55]">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: easings.smooth }}
              onClick={() => setSelectedProgram(null)}
              className="absolute inset-0 bg-slate-950/65 backdrop-blur-md"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.4, ease: easings.smooth }}
              className="bg-surface-elevated border-l border-border-subtle w-full max-w-lg h-full flex flex-col shadow-2xl relative z-10 overflow-hidden"
            >
              <header className="p-6 border-b border-border-subtle flex justify-between items-start shrink-0">
                <div>
                  <span className="text-xs uppercase font-bold text-accent-valor tracking-wide flex items-center gap-1.5 mb-1.5">
                    <Calendar size={14} /> Program Details
                  </span>
                  <h2 className="text-xl font-bold leading-tight text-text-high">{selectedProgram.name}</h2>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {canEditPrograms && (
                    <>
                      <button 
                        onClick={() => openEditModal(selectedProgram)}
                        title="Edit Program"
                        className="p-2 rounded-full hover:bg-[oklch(0.96_0.005_90)] dark:hover:bg-[oklch(0.20_0.02_260)] text-text-muted hover:text-accent-valor transition-colors"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button 
                        onClick={() => setShowDeleteConfirm(true)}
                        title="Delete Program"
                        className="p-2 rounded-full hover:bg-[oklch(0.95_0.02_20)] dark:hover:bg-[oklch(0.25_0.05_20)] text-text-muted hover:text-[oklch(0.6_0.2_20)] transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </>
                  )}
                  <button 
                    onClick={() => setSelectedProgram(null)}
                    className="p-2 rounded-full hover:bg-[oklch(0.96_0.005_90)] dark:hover:bg-[oklch(0.20_0.02_260)] text-text-muted hover:text-text-high transition-colors ml-1"
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
                    <span className="text-slate-400 block mb-1">PJP</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 font-sans">
                      <Layers size={14} className="text-primary-500 shrink-0" />
                      <span className="truncate">{bidangList.find(b => b.id === selectedProgram.pjp_bidang_id)?.name || 'N/A'}</span>
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-1">PP</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 font-sans flex-wrap">
                      <Layers size={14} className="text-primary-500 shrink-0" />
                      <span className="truncate">
                        {programPPs
                          .filter(pp => pp.program_id === selectedProgram.id)
                          .map(pp => bidangList.find(b => b.id === pp.bidang_id)?.name)
                          .filter(Boolean)
                          .join(', ') || 'N/A'}
                      </span>
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
                      <span className="truncate">{subBidangList.find((s: any) => s.id === selectedProgram.sub_bidang_id)?.name || 'N/A'}</span>
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
                    <span className="text-slate-400 block mb-1">PIC</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-200 flex flex-col gap-0.5 leading-tight">
                      <span className="flex items-center gap-1.5">
                        <User size={14} className="text-primary-500 shrink-0" />
                        <span className="truncate" title={picDetails ? picDetails.name : selectedProgram.pic_membership_id}>
                          {picDetails ? picDetails.name : (selectedProgram.pic_membership_id ? selectedProgram.pic_membership_id.substring(0, 8) + '...' : 'N/A')}
                        </span>
                      </span>
                      {picDetails && picDetails.bidang !== 'N/A' && (
                        <span className="text-[10.5px] text-slate-400 font-medium pl-5 truncate" title={picDetails.bidang}>
                          {picDetails.bidang}
                        </span>
                      )}
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

                {/* Success Indicators */}
                <div className="pt-3 border-t border-border border-dashed space-y-3">
                  <div>
                    <span className="text-slate-400 text-xs block mb-1.5 flex items-center gap-1">
                      <Award size={14} className="text-primary-500 shrink-0" /> Indikator Kualitatif
                    </span>
                    {programIndicators.filter(ind => ind.type === 'KUALITATIF').length === 0 ? (
                      <p className="text-xs text-slate-400 italic font-normal">Belum ada indikator kualitatif.</p>
                    ) : (
                      <ul className="list-disc pl-4 space-y-1">
                        {programIndicators.filter(ind => ind.type === 'KUALITATIF').map(ind => (
                          <li key={ind.id} className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                            {ind.indicator_text}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800/40">
                    <span className="text-slate-400 text-xs block mb-1.5 flex items-center gap-1">
                      <TrendingUp size={14} className="text-primary-500 shrink-0" /> Indikator Kuantitatif
                    </span>
                    {programIndicators.filter(ind => ind.type === 'KUANTITATIF').length === 0 ? (
                      <p className="text-xs text-slate-400 italic font-normal">Belum ada indikator kuantitatif.</p>
                    ) : (
                      <ul className="list-disc pl-4 space-y-1.5">
                        {programIndicators.filter(ind => ind.type === 'KUANTITATIF').map(ind => (
                          <li key={ind.id} className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                            <span className="font-semibold text-slate-800 dark:text-slate-200">{ind.indicator_text}</span>
                            {ind.target !== undefined && (
                              <span className="text-slate-400 ml-1">
                                (Target: {ind.target} {ind.unit || ''}
                                {ind.realization !== undefined ? `, Realisasi: ${ind.realization}` : ''})
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
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
                        <div className="flex items-center gap-2">
                          <div className="text-right mr-2">
                            <span className="text-[10px] text-slate-400 block mb-0.5">Sub Total</span>
                            <span className="font-bold text-sm text-emerald-600 block">
                              Rp {(((item.sub_total || 0) !== undefined && (item.sub_total || 0) !== null) ? (item.sub_total || 0) : (item.volume * item.harga_satuan * item.frekuensi_pelaksanaan)).toLocaleString('id-ID')}
                            </span>
                          </div>
                          {canEditPrograms && (
                            <>
                              <button 
                                onClick={() => openEditBudgetModal(item)}
                                title="Edit Budget Line"
                                className="text-slate-300 hover:text-primary-600 transition-colors p-1"
                              >
                                <Edit3 size={16} />
                              </button>
                              <button 
                                onClick={() => handleDeleteBudgetItem(item.id)}
                                title="Delete Budget Line"
                                className="text-slate-300 hover:text-red-500 transition-colors p-1"
                              >
                                <Trash2 size={16} />
                              </button>
                            </>
                          )}
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
                        <div className="flex items-center gap-2">
                          <div className="text-right mr-2">
                            <span className="text-[10px] text-slate-400 block mb-0.5">Sub Total</span>
                            <span className="font-bold text-sm text-slate-800 dark:text-slate-200 block">
                              Rp {(((item.sub_total || 0) !== undefined && (item.sub_total || 0) !== null) ? (item.sub_total || 0) : (item.volume * item.harga_satuan * item.frekuensi_pelaksanaan)).toLocaleString('id-ID')}
                            </span>
                          </div>
                          {canEditPrograms && (
                            <>
                              <button 
                                onClick={() => openEditBudgetModal(item)}
                                title="Edit Budget Line"
                                className="text-slate-300 hover:text-primary-600 transition-colors p-1"
                              >
                                <Edit3 size={16} />
                              </button>
                              <button 
                                onClick={() => handleDeleteBudgetItem(item.id)}
                                title="Delete Budget Line"
                                className="text-slate-300 hover:text-red-500 transition-colors p-1"
                              >
                                <Trash2 size={16} />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions at footer */}
            {canEditPrograms && (
              <div className="p-4 border-t border-border-subtle bg-surface-elevated flex gap-2 shrink-0">
                <button 
                  onClick={openAddBudgetModal}
                  className="flex-1 py-3.5 bg-brand-primary text-[oklch(0.985_0.005_90)] rounded-2xl font-semibold flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-all"
                >
                  <Plus size={18} /> Add Budget Item
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
      </AnimatePresence>

      {/* Add Budget Item Modal */}
      <AnimatePresence>
        {showAddBudgetModal && selectedProgram && (
          <div className="fixed inset-0 bg-slate-950/65 backdrop-blur-md flex items-center justify-center p-4 z-[60]">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: easings.smooth }}
              onClick={() => {
                setShowAddBudgetModal(false);
                setEditingBudgetItem(null);
              }}
              className="absolute inset-0 bg-slate-950/65 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3, ease: easings.spring }}
              className="bg-surface-elevated border border-border-subtle rounded-3xl w-full max-w-md max-h-[75vh] flex flex-col shadow-2xl relative overflow-hidden z-10"
            >
              <header className="p-6 border-b border-border-subtle flex justify-between items-center shrink-0">
                <h2 className="text-xl font-bold text-text-high">
                  {editingBudgetItem ? "Edit Budget Line" : "Add Budget Line"}
                </h2>
                <button 
                  onClick={() => {
                    setShowAddBudgetModal(false);
                    setEditingBudgetItem(null);
                  }}
                  className="p-1.5 rounded-full hover:bg-[oklch(0.96_0.005_90)] dark:hover:bg-[oklch(0.20_0.02_260)] text-text-muted hover:text-text-high transition-colors"
                >
                  <X size={20} />
                </button>
              </header>
              
              <form onSubmit={handleSaveBudgetItem} className="flex-1 flex flex-col min-h-0">
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-muted mb-1">
                      Budget Item Name
                    </label>
                    <input 
                      type="text" 
                      required
                      value={budgetItemName}
                      onChange={(e) => setBudgetItemName(e.target.value)}
                      className="w-full px-4 py-2 border border-border-subtle rounded-2xl bg-surface-base focus:ring-2 focus:ring-accent-valor focus:outline-none text-text-high font-medium text-sm"
                      placeholder="e.g. Uang Rapat, Sewa Mobil"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-text-muted mb-1">
                        Type
                      </label>
                      <select 
                        value={jenisAnggaran}
                        onChange={(e) => setJenisAnggaran(e.target.value as any)}
                        className="w-full px-4 py-2 border border-border-subtle rounded-2xl bg-surface-base focus:ring-2 focus:ring-accent-valor focus:outline-none text-text-high font-medium text-sm"
                      >
                        <option value="PENGELUARAN">Expense</option>
                        <option value="PENERIMAAN">Revenue</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-muted mb-1">
                        Unit / Satuan
                      </label>
                      <input 
                        type="text" 
                        value={satuan}
                        onChange={(e) => setSatuan(e.target.value)}
                        className="w-full px-4 py-2 border border-border-subtle rounded-2xl bg-surface-base focus:ring-2 focus:ring-accent-valor focus:outline-none text-text-high font-medium text-sm"
                        placeholder="e.g. Orang, Unit"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-text-muted mb-1">
                        Volume
                      </label>
                      <input 
                        type="number" 
                        required
                        value={volume}
                        onChange={(e) => setVolume(e.target.value)}
                        className="w-full px-4 py-2 border border-border-subtle rounded-2xl bg-surface-base focus:ring-2 focus:ring-accent-valor focus:outline-none text-text-high font-medium text-sm"
                        placeholder="1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-muted mb-1">
                        Frequency
                      </label>
                      <input 
                        type="number" 
                        required
                        value={frekuensi}
                        onChange={(e) => setFrekuensi(e.target.value)}
                        className="w-full px-4 py-2 border border-border-subtle rounded-2xl bg-surface-base focus:ring-2 focus:ring-accent-valor focus:outline-none text-text-high font-medium text-sm"
                        placeholder="1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-muted mb-1">
                        Price (Rp)
                      </label>
                      <input 
                        type="text" 
                        inputMode="numeric"
                        pattern="[0-9,]*"
                        required
                        value={hargaSatuan}
                        onChange={(e) => setHargaSatuan(formatNumberWithCommas(e.target.value))}
                        className="w-full px-4 py-2 border border-border-subtle rounded-2xl bg-surface-base focus:ring-2 focus:ring-accent-valor focus:outline-none text-text-high font-medium text-sm"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  {jenisAnggaran === 'PENERIMAAN' && (
                    <div>
                      <label className="block text-sm font-medium text-text-muted mb-1">
                        Source of Funds
                      </label>
                      <input 
                        type="text" 
                        value={sumberDana}
                        onChange={(e) => setSumberDana(e.target.value)}
                        className="w-full px-4 py-2 border border-border-subtle rounded-2xl bg-surface-base focus:ring-2 focus:ring-accent-valor focus:outline-none text-text-high font-medium text-sm"
                        placeholder="e.g. Dana MS, Persembahan Khusus"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-text-muted mb-1">
                      Catatan / Notes
                    </label>
                    <textarea 
                      value={catatan}
                      onChange={(e) => setCatatan(e.target.value)}
                      className="w-full px-4 py-2 border border-border-subtle rounded-2xl bg-surface-base focus:ring-2 focus:ring-accent-valor focus:outline-none h-16 resize-none text-text-high font-medium text-sm"
                      placeholder="Additional description..."
                    />
                  </div>

                  {/* Live Preview of Sub Total */}
                  <div className="bg-[oklch(0.96_0.005_90)] dark:bg-[oklch(0.12_0.02_260)] p-4 rounded-2xl border border-border-subtle flex justify-between items-center mt-2 shrink-0">
                    <span className="text-xs font-semibold text-text-muted uppercase">Sub Total Preview</span>
                    <span className="font-bold text-lg text-accent-valor font-serif tabular-nums">
                      Rp {((parseFloat(volume) || 0) * (parseFloat(hargaSatuan.replace(/[^0-9]/g, '')) || 0) * (parseInt(frekuensi, 10) || 1)).toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                <div className="p-6 border-t border-border-subtle bg-surface-elevated shrink-0">
                  <button 
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 bg-brand-primary text-[oklch(0.985_0.005_90)] rounded-2xl font-semibold disabled:opacity-50 shadow-lg active:scale-95 transition-all"
                  >
                    {submitting ? "Saving..." : (editingBudgetItem ? "Save Changes" : "Add Budget Line")}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Delete Program Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && selectedProgram && (
          <div className="fixed inset-0 bg-slate-950/65 backdrop-blur-md flex items-center justify-center p-4 z-[70]">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: easings.smooth }}
              onClick={() => setShowDeleteConfirm(false)}
              className="absolute inset-0 bg-slate-950/65 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3, ease: easings.spring }}
              className="bg-surface-elevated border border-border-subtle rounded-3xl w-full max-w-sm p-6 shadow-2xl relative text-center space-y-4 z-10"
            >
              <div className="mx-auto w-12 h-12 rounded-full bg-red-50 dark:bg-red-950/20 text-[oklch(0.6_0.2_20)] flex items-center justify-center animate-bounce">
                <Trash2 size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-text-high">Delete Program?</h3>
                <p className="text-xs text-text-muted mt-2 leading-relaxed">
                  Are you sure you want to delete <span className="font-semibold text-text-high">"{selectedProgram.name}"</span>?
                  This action is permanent and will cascade-delete all its detailed budget lines.
                </p>
              </div>
              <div className="flex gap-3 pt-2">
                <button 
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-3 border border-border-subtle rounded-2xl text-xs font-semibold text-text-high hover:bg-[oklch(0.96_0.005_90)] dark:hover:bg-[oklch(0.20_0.02_260)] transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="button"
                  onClick={handleDeleteProgram}
                  className="flex-1 py-3 bg-[oklch(0.6_0.2_20)] text-white rounded-2xl text-xs font-semibold shadow-lg active:scale-95 transition-all"
                >
                  Delete Program
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
