"use client";

import { useState, useEffect } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db, Period, Bidang, OrganizationUnit, Occasion } from "@/lib/db";
import { useTheme } from "next-themes";
import { useAppStore } from "@/store/useAppStore";
import { 
  Settings, Calendar, Layers, Plus, Trash2, Edit3, X, 
  ChevronRight, ChevronLeft, HelpCircle, CheckCircle2, Circle,
  Cloud, CloudOff, AlertCircle, Building2, Sun, Moon, Monitor,
  Shield, Key, UserCheck, RefreshCw, Wifi, WifiOff, Database,
  CalendarDays
} from "lucide-react";

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

const calculateQuarters = (startDateStr: string, endDateStr: string) => {
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return [];
  const addMonths = (date: Date, months: number) => {
    const d = new Date(date);
    d.setMonth(d.getMonth() + months);
    return d;
  };
  const quarters = [];
  for (let i = 0; i < 4; i++) {
    const qStart = addMonths(start, i * 3);
    let qEnd = new Date(addMonths(start, (i + 1) * 3).getTime() - 24 * 60 * 60 * 1000);
    if (i === 3 || qEnd > end) qEnd = end;
    quarters.push({
      name: `Triwulan ${i + 1}`,
      start: qStart.toISOString().split('T')[0],
      end: qEnd.toISOString().split('T')[0]
    });
  }
  return quarters;
};

const MONTH_NAMES = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

const SyncBadge = ({ status }: { status?: string }) => {
  if (status === 'PENDING') return <span className="flex items-center gap-1 text-[10px] bg-amber-50 text-amber-600 border border-amber-200 px-1.5 py-0.5 rounded-full font-bold" title="Pending Sync"><CloudOff size={10} /> PENDING</span>;
  if (status === 'ERROR') return <span className="flex items-center gap-1 text-[10px] bg-red-50 text-red-600 border border-red-200 px-1.5 py-0.5 rounded-full font-bold" title="Sync Error"><AlertCircle size={10} /> ERROR</span>;
  return <span className="flex items-center gap-1 text-[10px] bg-slate-50 text-slate-500 border border-slate-200 px-1.5 py-0.5 rounded-full font-bold" title="Synced"><Cloud size={10} /> SYNCED</span>;
};

export default function SettingsPage() {
  const periods = useLiveQuery(() => db.periods.toArray());
  const bidangs = useLiveQuery(() => db.bidang.toArray());
  const units = useLiveQuery(() => db.organization_units.toArray());

  const periodList = periods || [];
  const bidangList = bidangs || [];
  const unitList = units || [];
  const localOccasions = useLiveQuery(() => db.occasions.toArray()) || [];

  const getPeriodDurationYears = (p: Period) => {
    const start = new Date(p.start_date);
    const end = new Date(p.end_date);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return 1;
    return (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
  };

  const fiscalPeriods = periodList.filter(p => getPeriodDurationYears(p) <= 2);
  const membershipPeriods = periodList.filter(p => getPeriodDurationYears(p) > 2);
  const activeFiscalPeriod = periodList.find(p => p.is_active && getPeriodDurationYears(p) <= 2) || fiscalPeriods[0];
  const activeMembershipPeriod = periodList.find(p => p.is_active && getPeriodDurationYears(p) > 2) || membershipPeriods[0];
  const [activeTab, setActiveTab] = useState<'fiscal' | 'membership' | 'struktur' | 'appearance' | 'iam' | 'sync' | 'calendar'>('fiscal');

  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isOnline = useAppStore(state => state.isOnline);
  const syncStatus = useAppStore(state => state.syncStatus);
  const lastSyncTime = useAppStore(state => state.lastSyncTime);

  const pendingCounts = useLiveQuery(async () => {
    const periods = await db.periods.where('sync_status').equals('PENDING').count();
    const units = await db.organization_units.where('sync_status').equals('PENDING').count();
    const programs = await db.programs.where('sync_status').equals('PENDING').count();
    const typePrograms = await db.type_program.where('sync_status').equals('PENDING').count();
    const bidangs = await db.bidang.where('sync_status').equals('PENDING').count();
    const budgets = await db.anggaran_program.where('sync_status').equals('PENDING').count();
    const members = await db.members.where('sync_status').equals('PENDING').count();
    const unitMembers = await db.unit_members.where('sync_status').equals('PENDING').count();
    const roles = await db.user_roles.where('sync_status').equals('PENDING').count();
    const occasions = await db.occasions.where('sync_status').equals('PENDING').count();
    const deletes = await db.deleted_records.where('sync_status').equals('PENDING').count();
    
    return {
      periods,
      units,
      programs,
      typePrograms,
      bidangs,
      budgets,
      members,
      unitMembers,
      roles,
      occasions,
      deletes,
      total: periods + units + programs + typePrograms + bidangs + budgets + members + unitMembers + roles + occasions + deletes
    };
  });

  const errorRecords = useLiveQuery(async () => {
    const periods = await db.periods.where('sync_status').equals('ERROR').toArray();
    const units = await db.organization_units.where('sync_status').equals('ERROR').toArray();
    const programs = await db.programs.where('sync_status').equals('ERROR').toArray();
    const typePrograms = await db.type_program.where('sync_status').equals('ERROR').toArray();
    const bidangs = await db.bidang.where('sync_status').equals('ERROR').toArray();
    const budgets = await db.anggaran_program.where('sync_status').equals('ERROR').toArray();
    const members = await db.members.where('sync_status').equals('ERROR').toArray();
    const unitMembers = await db.unit_members.where('sync_status').equals('ERROR').toArray();
    const roles = await db.user_roles.where('sync_status').equals('ERROR').toArray();
    const occasions = await db.occasions.where('sync_status').equals('ERROR').toArray();
    
    const list: { id: string; table: string; name: string }[] = [];
    periods.forEach(p => list.push({ id: p.id, table: 'periods', name: p.name }));
    units.forEach(u => list.push({ id: u.id, table: 'organization_units', name: u.name }));
    programs.forEach(p => list.push({ id: p.id, table: 'programs', name: p.name }));
    typePrograms.forEach(t => list.push({ id: t.id, table: 'type_program', name: t.name }));
    bidangs.forEach(b => list.push({ id: b.id, table: 'bidang', name: b.name }));
    budgets.forEach(b => list.push({ id: b.id, table: 'anggaran_program', name: b.nama_anggaran }));
    members.forEach(m => list.push({ id: m.id, table: 'members', name: m.name }));
    unitMembers.forEach(um => list.push({ id: um.id, table: 'unit_members', name: um.role_title || 'Role Assignment' }));
    roles.forEach(r => list.push({ id: r.id, table: 'user_roles', name: `Role: ${r.role}` }));
    occasions.forEach(o => list.push({ id: o.id, table: 'occasions', name: o.title }));
    
    return list;
  });

  const currentUser = useAppStore(state => state.user);
  const setCurrentUserRole = useAppStore(state => state.setCurrentUserRole);
  const currentUserRole = useAppStore(state => state.currentUserRole);
  const canManageSettings = currentUserRole === 'SYSTEM_OWNER' || currentUserRole === 'SUPER_ADMIN' || currentUserRole === 'ADMIN';
  const isCalendarAdmin = currentUserRole === 'SYSTEM_OWNER' || currentUserRole === 'SUPER_ADMIN';

  const userRolesList = useLiveQuery(() => db.user_roles.toArray()) || [];
  const userProfilesList = useLiveQuery(() => db.user_profiles.toArray()) || [];
  const membersList = useLiveQuery(() => db.members.toArray()) || [];

  const myRoles = useLiveQuery(
    () => currentUser && activeMembershipPeriod ? db.user_roles.where({ user_id: currentUser.id, period_id: activeMembershipPeriod.id }).toArray() : Promise.resolve<any[]>([]),
    [currentUser, activeMembershipPeriod]
  );

  useEffect(() => {
    if (myRoles && myRoles.length > 0) {
      setCurrentUserRole(myRoles[0].role);
    } else if (currentUser && (currentUser.email === 'benmanafe48@gmail.com' || currentUser.email === 'stolaputih@gmail.com' || userRolesList.length === 0)) {
      setCurrentUserRole('SYSTEM_OWNER');
    } else {
      setCurrentUserRole(null);
    }
  }, [myRoles, currentUser, activeMembershipPeriod, userRolesList, setCurrentUserRole]);

  const [showIamModal, setShowIamModal] = useState(false);
  const [iamUserEmail, setIamUserEmail] = useState("");
  const [iamRole, setIamRole] = useState<'SYSTEM_OWNER' | 'SUPER_ADMIN' | 'ADMIN' | 'STAFF' | 'BENDAHARA' | 'AUDITOR' | 'USER'>('USER');

  // Modals
  const [showPeriodModal, setShowPeriodModal] = useState(false);
  const [periodType, setPeriodType] = useState<'fiscal' | 'membership'>('fiscal');
  const [editingPeriod, setEditingPeriod] = useState<Period | null>(null);
  const [periodName, setPeriodName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [periodActive, setPeriodActive] = useState(false);

  const [showBidangModal, setShowBidangModal] = useState(false);
  const [editingBidang, setEditingBidang] = useState<Bidang | null>(null);
  const [bidangName, setBidangName] = useState("");
  const [bidangCode, setBidangCode] = useState("");
  const [bidangDesc, setBidangDesc] = useState("");

  const [showUnitModal, setShowUnitModal] = useState(false);
  const [unitName, setUnitName] = useState("");
  const [unitBidangId, setUnitBidangId] = useState<string | null>(null);
  const [unitParentId, setUnitParentId] = useState<string | null>(null);
  const [editingUnit, setEditingUnit] = useState<OrganizationUnit | null>(null);

  // Calendar and Occasion States
  const [currentYear, setCurrentYear] = useState<number>(() => {
    if (activeFiscalPeriod) {
      const year = new Date(activeFiscalPeriod.start_date).getFullYear();
      if (!isNaN(year)) return year;
    }
    return new Date().getFullYear();
  });
  const [currentMonth, setCurrentMonth] = useState<number>(() => new Date().getMonth());
  const [holidays, setHolidays] = useState<any[]>([]);
  const [loadingHolidays, setLoadingHolidays] = useState<boolean>(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  // Occasion modal states
  const [showOccasionModal, setShowOccasionModal] = useState(false);
  const [editingOccasion, setEditingOccasion] = useState<Occasion | null>(null);
  const [occasionTitle, setOccasionTitle] = useState("");
  const [occasionDate, setOccasionDate] = useState("");
  const [occasionDesc, setOccasionDesc] = useState("");

  useEffect(() => {
    if (activeFiscalPeriod) {
      const year = new Date(activeFiscalPeriod.start_date).getFullYear();
      if (!isNaN(year)) {
        setCurrentYear(year);
      }
    }
  }, [activeFiscalPeriod]);

  useEffect(() => {
    let active = true;
    const fetchHolidays = async () => {
      setLoadingHolidays(true);
      try {
        const res = await fetch(`/api/holidays?year=${currentYear}`);
        if (!res.ok) throw new Error("Failed to fetch holidays");
        const json = await res.json();
        if (active && json.status === "success" && Array.isArray(json.data)) {
          setHolidays(json.data);
        }
      } catch (err) {
        console.error("Error fetching holidays:", err);
        if (active) {
          setHolidays([]);
        }
      } finally {
        if (active) {
          setLoadingHolidays(false);
        }
      }
    };
    fetchHolidays();
    return () => {
      active = false;
    };
  }, [currentYear]);

  const handleSaveOccasion = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetPeriod = activeFiscalPeriod || activeMembershipPeriod;
    if (!occasionTitle.trim() || !occasionDate || !targetPeriod) return;
    setSubmitting(true);
    try {
      if (editingOccasion) {
        await db.occasions.update(editingOccasion.id, {
          title: occasionTitle.trim(),
          date: occasionDate,
          description: occasionDesc.trim() || undefined,
          sync_status: 'PENDING'
        });
      } else {
        await db.occasions.add({
          id: crypto.randomUUID(),
          period_id: targetPeriod.id,
          title: occasionTitle.trim(),
          date: occasionDate,
          description: occasionDesc.trim() || undefined,
          sync_status: 'PENDING'
        });
      }
      setShowOccasionModal(false);
      setEditingOccasion(null);
      setOccasionTitle("");
      setOccasionDate("");
      setOccasionDesc("");
      if (isOnline) {
        const { syncAll } = await import('@/lib/sync');
        syncAll().catch(console.error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteOccasion = async (id: string) => {
    if (confirm("Hapus acara/kegiatan ini?")) {
      try {
        await db.transaction('rw', [db.occasions, db.deleted_records], async () => {
          await db.occasions.delete(id);
          await db.deleted_records.add({ id, table_name: 'occasions', sync_status: 'PENDING' });
        });
        if (isOnline) {
          const { syncAll } = await import('@/lib/sync');
          syncAll().catch(console.error);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const [submitting, setSubmitting] = useState(false);

  const handleTogglePeriodActive = async (periodId: string) => {
    try {
      const selected = periodList.find(p => p.id === periodId);
      if (!selected) return;
      const targetIsActive = !selected.is_active;
      await db.transaction('rw', db.periods, async () => {
        if (targetIsActive) {
          const durationType = getPeriodDurationYears(selected) <= 2 ? 'fiscal' : 'membership';
          for (const p of periodList) {
            const pType = getPeriodDurationYears(p) <= 2 ? 'fiscal' : 'membership';
            if (pType === durationType && p.id !== periodId && p.is_active) {
              await db.periods.update(p.id, { is_active: false, sync_status: 'PENDING' });
            }
          }
        }
        await db.periods.update(periodId, { is_active: targetIsActive, sync_status: 'PENDING' });
      });
    } catch (e) { console.error(e); }
  };

  const handleSavePeriod = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!periodName.trim() || !startDate || !endDate) return;
    setSubmitting(true);
    try {
      if (editingPeriod) {
        await db.periods.update(editingPeriod.id, { name: periodName.trim(), start_date: startDate, end_date: endDate, is_active: periodActive, sync_status: 'PENDING' });
        if (periodActive) {
          const durationType = getPeriodDurationYears(editingPeriod) <= 2 ? 'fiscal' : 'membership';
          for (const p of periodList) {
            if ((getPeriodDurationYears(p) <= 2 ? 'fiscal' : 'membership') === durationType && p.id !== editingPeriod.id && p.is_active) {
              await db.periods.update(p.id, { is_active: false, sync_status: 'PENDING' });
            }
          }
        }
      } else {
        const periodId = crypto.randomUUID();
        await db.periods.add({ id: periodId, name: periodName.trim(), start_date: startDate, end_date: endDate, is_active: periodActive, sync_status: 'PENDING' });
        if (periodActive) {
          for (const p of periodList) {
            if ((getPeriodDurationYears(p) <= 2 ? 'fiscal' : 'membership') === periodType && p.is_active) {
              await db.periods.update(p.id, { is_active: false, sync_status: 'PENDING' });
            }
          }
        }
      }
      setShowPeriodModal(false);
    } catch (err) { console.error(err); } finally { setSubmitting(false); }
  };

  const handleDeletePeriod = async (id: string) => {
    if (confirm("Delete this period?")) {
      try {
        await db.transaction('rw', [
          db.periods,
          db.bidang,
          db.organization_units,
          db.user_roles,
          db.unit_members,
          db.program_responsibility_pp,
          db.occasions,
          db.programs,
          db.anggaran_program,
          db.deleted_records
        ], async () => {
          // 1. Bidang
          const bids = await db.bidang.where('period_id').equals(id).toArray();
          for (const b of bids) {
            await db.bidang.delete(b.id);
            await db.deleted_records.add({ id: b.id, table_name: 'bidang', sync_status: 'PENDING' });
          }

          // 2. Organization Units
          const orgs = await db.organization_units.where('period_id').equals(id).toArray();
          for (const u of orgs) {
            await db.organization_units.delete(u.id);
            await db.deleted_records.add({ id: u.id, table_name: 'organization_units', sync_status: 'PENDING' });
          }

          // 3. User Roles
          const roles = await db.user_roles.where('period_id').equals(id).toArray();
          for (const r of roles) {
            await db.user_roles.delete(r.id);
            await db.deleted_records.add({ id: r.id, table_name: 'user_role', sync_status: 'PENDING' });
          }

          // 4. Unit Members
          const ums = await db.unit_members.where('period_id').equals(id).toArray();
          for (const um of ums) {
            await db.unit_members.delete(um.id);
            await db.deleted_records.add({ id: um.id, table_name: 'unit_members', sync_status: 'PENDING' });
          }

          // 5. Program Responsibility PP
          const pps = await db.program_responsibility_pp.where('period_id').equals(id).toArray();
          for (const pp of pps) {
            await db.program_responsibility_pp.delete(pp.id);
            await db.deleted_records.add({ id: pp.id, table_name: 'program_responsibility_pp', sync_status: 'PENDING' });
          }

          // 6. Occasions
          const occs = await db.occasions.where('period_id').equals(id).toArray();
          for (const o of occs) {
            await db.occasions.delete(o.id);
            await db.deleted_records.add({ id: o.id, table_name: 'occasions', sync_status: 'PENDING' });
          }

          // 7. Programs & Anggaran Program
          const progs = await db.programs.where('period_id').equals(id).toArray();
          for (const pr of progs) {
            // Delete associated budgets
            const budgets = await db.anggaran_program.where('program_id').equals(pr.id).toArray();
            for (const b of budgets) {
              await db.anggaran_program.delete(b.id);
              await db.deleted_records.add({ id: b.id, table_name: 'anggaran_program', sync_status: 'PENDING' });
            }
            await db.programs.delete(pr.id);
            await db.deleted_records.add({ id: pr.id, table_name: 'programs', sync_status: 'PENDING' });
          }

          // 8. Finally delete period
          await db.periods.delete(id);
          await db.deleted_records.add({ id, table_name: 'periods', sync_status: 'PENDING' });
        });
      } catch (e) {
        console.error('Delete period failed:', e);
      }
    }
  };

  const handleSaveBidang = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bidangName.trim() || !activeMembershipPeriod) return;
    setSubmitting(true);
    try {
      if (editingBidang) {
        await db.bidang.update(editingBidang.id, { name: bidangName.trim(), code: bidangCode.trim().toUpperCase(), description: bidangDesc.trim() || undefined, sync_status: 'PENDING' });
      } else {
        await db.bidang.add({ id: crypto.randomUUID(), period_id: activeMembershipPeriod.id, name: bidangName.trim(), code: bidangCode.trim().toUpperCase(), description: bidangDesc.trim() || undefined, sync_status: 'PENDING' });
      }
      setShowBidangModal(false);
    } catch (err) { console.error(err); } finally { setSubmitting(false); }
  };

  const handleDeleteBidang = async (id: string) => {
    if (confirm("Delete this Bidang and all its linked units?")) {
      try {
        await db.transaction('rw', [db.bidang, db.organization_units, db.deleted_records], async () => {
          const linkedUnits = unitList.filter(u => u.bidang_id === id);
          for (const u of linkedUnits) {
            await db.organization_units.delete(u.id);
            await db.deleted_records.add({ id: u.id, table_name: 'organization_units', sync_status: 'PENDING' });
          }
          await db.bidang.delete(id);
          await db.deleted_records.add({ id, table_name: 'bidang', sync_status: 'PENDING' });
        });
      } catch (e) { console.error(e); }
    }
  };

  const handleSaveUnit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!unitName.trim() || !activeMembershipPeriod) return;
    setSubmitting(true);
    try {
      if (editingUnit) {
        await db.organization_units.update(editingUnit.id, { name: unitName.trim(), sync_status: 'PENDING' });
      } else {
        await db.organization_units.add({
          id: crypto.randomUUID(),
          period_id: activeMembershipPeriod.id,
          name: unitName.trim(),
          bidang_id: unitBidangId || undefined,
          parent_id: unitParentId,
          sync_status: 'PENDING'
        });
      }
      setShowUnitModal(false);
    } catch (err) { console.error(err); } finally { setSubmitting(false); }
  };

  const handleDeleteUnit = async (id: string) => {
    if (confirm("Delete this unit? All child units will also be deleted.")) {
      try {
        await db.transaction('rw', [db.organization_units, db.deleted_records], async () => {
          const children = unitList.filter(u => u.parent_id === id);
          for (const child of children) {
            await db.organization_units.delete(child.id);
            await db.deleted_records.add({ id: child.id, table_name: 'organization_units', sync_status: 'PENDING' });
          }
          await db.organization_units.delete(id);
          await db.deleted_records.add({ id, table_name: 'organization_units', sync_status: 'PENDING' });
        });
      } catch (e) { console.error(e); }
    }
  };

  const getRoleUserEmail = (userId: string) => {
    const profile = userProfilesList.find(p => p.id === userId);
    return profile?.email || userId;
  };

  const handleSaveUserRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeMembershipPeriod || !iamUserEmail.trim() || !iamRole) return;
    setSubmitting(true);
    try {
      let targetUserId = "";
      const found = userProfilesList.find(p => p.email.toLowerCase() === iamUserEmail.trim().toLowerCase());
      if (found) {
        targetUserId = found.id;
      } else {
        // Fallback: Check if this email was already assigned a role previously in any period
        const existingRole = userRolesList.find(ur => {
          const email = getRoleUserEmail(ur.user_id);
          return email.toLowerCase() === iamUserEmail.trim().toLowerCase();
        });
        if (existingRole) {
          targetUserId = existingRole.user_id;
        } else {
          const memberFound = membersList.find(m => m.email?.toLowerCase() === iamUserEmail.trim().toLowerCase());
          targetUserId = memberFound?.id || crypto.randomUUID();
          await db.user_profiles.put({ id: targetUserId, email: iamUserEmail.trim().toLowerCase(), sync_status: 'PENDING' });
        }
      }

      await db.user_roles.add({
        id: crypto.randomUUID(),
        user_id: targetUserId,
        role: iamRole,
        period_id: activeMembershipPeriod.id,
        sync_status: 'PENDING'
      });
      setShowIamModal(false);
      setIamUserEmail("");
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUserRole = async (id: string) => {
    if (confirm("Hapus hak akses ini?")) {
      try {
        await db.transaction('rw', [db.user_roles, db.deleted_records], async () => {
          await db.user_roles.delete(id);
          await db.deleted_records.add({ id, table_name: 'user_role', sync_status: 'PENDING' });
        });
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div className="p-6 pb-24 max-w-4xl mx-auto">
      <header className="mb-8 pt-4">
        <h1 className="text-3xl font-bold flex items-center gap-2"><Settings className="text-primary-600 animate-spin-slow" size={32} /> Global Settings</h1>
        <p className="text-slate-500 text-sm mt-1">Configure organizational assets, fiscal years, and unified hierarchy.</p>
      </header>

      {!activeFiscalPeriod && activeTab === 'fiscal' && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-3xl mb-6 flex gap-3 items-center text-sm font-medium">
          <HelpCircle className="text-amber-500 shrink-0" />
          <span>No active fiscal period defined. Please add and activate a Fiscal Period in this tab.</span>
        </div>
      )}
      {!activeMembershipPeriod && activeTab === 'struktur' && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-3xl mb-6 flex gap-3 items-center text-sm font-medium">
          <HelpCircle className="text-amber-500 shrink-0" />
          <span>No active 5-Year Membership Period defined. Please create and activate one in the &quot;Keanggotaan (5 Thn)&quot; tab first to configure the organization structure.</span>
        </div>
      )}
      {!activeMembershipPeriod && activeTab === 'iam' && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-3xl mb-6 flex gap-3 items-center text-sm font-medium">
          <HelpCircle className="text-amber-500 shrink-0" />
          <span>No active 5-Year Membership Period defined. Please create and activate one in the &quot;Keanggotaan (5 Thn)&quot; tab first to manage access controls.</span>
        </div>
      )}

      <nav className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800/60 rounded-2xl mb-8 overflow-x-auto">
        <button onClick={() => setActiveTab('fiscal')} className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all active:scale-95 ${activeTab === 'fiscal' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-800 dark:text-white' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}>Tahun Anggaran</button>
        <button onClick={() => setActiveTab('membership')} className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all active:scale-95 ${activeTab === 'membership' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-800 dark:text-white' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}>Keanggotaan (5 Thn)</button>
        <button onClick={() => setActiveTab('struktur')} className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all active:scale-95 ${activeTab === 'struktur' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-800 dark:text-white' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}>Struktur Organisasi</button>
        <button onClick={() => setActiveTab('iam')} className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all active:scale-95 ${activeTab === 'iam' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-800 dark:text-white' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}>Hak Akses (IAM)</button>
        <button onClick={() => setActiveTab('sync')} className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all active:scale-95 ${activeTab === 'sync' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-800 dark:text-white' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}>Sinkronisasi</button>
        <button onClick={() => setActiveTab('calendar')} className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all active:scale-95 ${activeTab === 'calendar' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-800 dark:text-white' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}>Kalender</button>
        <button onClick={() => setActiveTab('appearance')} className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all active:scale-95 ${activeTab === 'appearance' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-800 dark:text-white' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}>Tampilan</button>
      </nav>

      <section className="space-y-6">
        {/* TAB 1: Fiscal Year Periods */}
        {activeTab === 'fiscal' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold flex items-center gap-2"><Calendar className="text-primary-500" /> Daftar Tahun Anggaran</h2>
              {canManageSettings && (
                <button onClick={() => { setPeriodType('fiscal'); setEditingPeriod(null); setPeriodName("Tahun Anggaran "); setStartDate(""); setEndDate(""); setPeriodActive(false); setShowPeriodModal(true); }} className="flex items-center gap-1.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold px-4 py-2.5 rounded-2xl">
                  <Plus size={16} /> Tambah TA
                </button>
              )}
            </div>
            {fiscalPeriods.length === 0 ? (
              <div className="bg-surface border border-border p-8 rounded-3xl text-center text-slate-400">Belum ada Tahun Anggaran yang didefinisikan.</div>
            ) : (
              fiscalPeriods.map(p => (
                <div key={p.id} className="bg-surface border border-border rounded-3xl p-5 shadow-sm space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg flex items-center gap-2 flex-wrap">
                        {p.name} {p.is_active && <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-bold">ACTIVE</span>}
                        <SyncBadge status={p.sync_status} />
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">Durasi: {formatDate(p.start_date)} - {formatDate(p.end_date)}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {canManageSettings && (
                        <>
                          <button onClick={() => handleTogglePeriodActive(p.id)} className={`p-2 rounded-full ${p.is_active ? 'text-emerald-600' : 'text-slate-400'}`}>{p.is_active ? <CheckCircle2 size={18} /> : <Circle size={18} />}</button>
                          <button onClick={() => { setEditingPeriod(p); setPeriodName(p.name); setStartDate(p.start_date); setEndDate(p.end_date); setPeriodActive(p.is_active); setShowPeriodModal(true); }} className="p-2 text-slate-400 hover:text-primary-600 rounded-full"><Edit3 size={18} /></button>
                          <button onClick={() => handleDeletePeriod(p.id)} className="p-2 text-slate-400 hover:text-red-600 rounded-full"><Trash2 size={18} /></button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 2: Membership Periods */}
        {activeTab === 'membership' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold flex items-center gap-2"><Calendar className="text-primary-500" /> Periode Keanggotaan</h2>
              {canManageSettings && (
                <button onClick={() => { setPeriodType('membership'); setEditingPeriod(null); setPeriodName("Periode Keanggotaan "); setStartDate(""); setEndDate(""); setPeriodActive(false); setShowPeriodModal(true); }} className="flex items-center gap-1.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold px-4 py-2.5 rounded-2xl">
                  <Plus size={16} /> Tambah Periode
                </button>
              )}
            </div>
            {membershipPeriods.length === 0 ? (
              <div className="bg-surface border border-border p-8 rounded-3xl text-center text-slate-400">Belum ada Periode Keanggotaan.</div>
            ) : (
              membershipPeriods.map(p => (
                <div key={p.id} className="bg-surface border border-border rounded-3xl p-5 shadow-sm flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-lg flex items-center gap-2 flex-wrap">
                      {p.name} {p.is_active && <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-bold">ACTIVE</span>}
                      <SyncBadge status={p.sync_status} />
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">Durasi: {formatDate(p.start_date)} - {formatDate(p.end_date)}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {canManageSettings && (
                      <>
                        <button onClick={() => handleTogglePeriodActive(p.id)} className={`p-2 rounded-full ${p.is_active ? 'text-emerald-600' : 'text-slate-400'}`}>{p.is_active ? <CheckCircle2 size={18} /> : <Circle size={18} />}</button>
                        <button onClick={() => { setEditingPeriod(p); setPeriodName(p.name); setStartDate(p.start_date); setEndDate(p.end_date); setPeriodActive(p.is_active); setShowPeriodModal(true); }} className="p-2 text-slate-400 hover:text-primary-600 rounded-full"><Edit3 size={18} /></button>
                        <button onClick={() => handleDeletePeriod(p.id)} className="p-2 text-slate-400 hover:text-red-600 rounded-full"><Trash2 size={18} /></button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 3: STRUKTUR ORGANISASI (UNIFIED) */}
        {activeTab === 'struktur' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold flex items-center gap-2"><Layers className="text-primary-500" /> Struktur Organisasi</h2>
              {canManageSettings && (
                <button onClick={() => { setEditingBidang(null); setBidangName(""); setBidangCode(""); setBidangDesc(""); setShowBidangModal(true); }} className="flex items-center gap-1.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold px-4 py-2.5 rounded-2xl">
                  <Plus size={16} /> Tambah Bidang/Yayasan
                </button>
              )}
            </div>

            <div className="space-y-4">
              {bidangList.length === 0 ? (
                <div className="bg-surface border border-border p-8 rounded-3xl text-center text-slate-400">Belum ada Bidang yang terdaftar.</div>
              ) : (
                bidangList.map(b => {
                  const myUnits = unitList.filter(u => u.bidang_id === b.id);
                  return (
                    <div key={b.id} className="bg-surface border border-border rounded-3xl overflow-hidden shadow-sm">
                      {/* Bidang Header */}
                      <div className="p-5 border-b border-border bg-slate-50/50 dark:bg-slate-800/40 flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold text-lg flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-xs px-2 py-0.5 bg-primary-50 text-primary-600 border border-primary-200 rounded font-bold">{b.code}</span>
                            {b.name} <SyncBadge status={b.sync_status} />
                          </h3>
                        </div>
                        <div className="flex items-center gap-1">
                          {canManageSettings && (
                            <>
                              <button onClick={() => { setEditingBidang(b); setBidangName(b.name); setBidangCode(b.code); setBidangDesc(b.description || ""); setShowBidangModal(true); }} className="p-2 text-slate-400 hover:text-primary-600 rounded-full"><Edit3 size={18} /></button>
                              <button onClick={() => handleDeleteBidang(b.id)} className="p-2 text-slate-400 hover:text-red-600 rounded-full"><Trash2 size={18} /></button>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Units under Bidang */}
                      <div className="divide-y divide-border">
                        {myUnits.map(unit => {
                          const childUnits = unitList.filter(u => u.parent_id === unit.id);
                          return (
                            <div key={unit.id} className="flex flex-col">
                              {/* Level 2 Unit */}
                              <div className="p-4 pl-12 flex justify-between items-center hover:bg-slate-50/40">
                                <div className="flex items-center gap-2">
                                  <Building2 size={14} className="text-slate-400" />
                                  <span className="font-semibold text-slate-800 dark:text-slate-200">{unit.name}</span>
                                  <SyncBadge status={unit.sync_status} />
                                </div>
                                <div className="flex items-center gap-1">
                                  {canManageSettings && (
                                    <>
                                      <button onClick={() => { setUnitBidangId(b.id); setUnitParentId(unit.id); setUnitName(""); setEditingUnit(null); setShowUnitModal(true); }} className="text-primary-600 hover:text-primary-700 p-1" title="Tambah Sub-Unit"><Plus size={16}/></button>
                                      <button onClick={() => { setEditingUnit(unit); setUnitName(unit.name); setShowUnitModal(true); }} className="text-slate-400 hover:text-primary-600 p-1"><Edit3 size={16}/></button>
                                      <button onClick={() => handleDeleteUnit(unit.id)} className="text-slate-400 hover:text-red-600 p-1"><Trash2 size={16}/></button>
                                    </>
                                  )}
                                </div>
                              </div>
                              {/* Level 3 Units */}
                              {childUnits.map(child => (
                                <div key={child.id} className="p-3 pl-20 flex justify-between items-center bg-slate-50/30 dark:bg-slate-800/20">
                                  <div className="flex items-center gap-2">
                                    <ChevronRight size={14} className="text-slate-400" />
                                    <span className="text-sm text-slate-600 dark:text-slate-300">{child.name}</span>
                                    <SyncBadge status={child.sync_status} />
                                  </div>
                                  <div className="flex items-center gap-1">
                                    {canManageSettings && (
                                      <>
                                        <button onClick={() => { setEditingUnit(child); setUnitName(child.name); setShowUnitModal(true); }} className="text-slate-400 hover:text-primary-600 p-1"><Edit3 size={14}/></button>
                                        <button onClick={() => handleDeleteUnit(child.id)} className="text-slate-400 hover:text-red-600 p-1"><Trash2 size={14}/></button>
                                      </>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          );
                        })}
                        {canManageSettings && (
                          <div className="p-4 pl-12">
                            <button onClick={() => { setUnitBidangId(b.id); setUnitParentId(null); setUnitName(""); setEditingUnit(null); setShowUnitModal(true); }} className="flex items-center gap-1.5 text-primary-600 hover:text-primary-700 text-xs font-semibold">
                              <Plus size={14} /> Tambah Unit
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* TAB 4: Appearance / Tampilan */}
        {activeTab === 'appearance' && mounted && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-xl font-bold flex items-center gap-2"><Settings className="text-primary-500" /> Pengaturan Tampilan</h2>
            <p className="text-slate-500 text-sm">Sesuaikan tampilan antarmuka aplikasi dengan mode terang, gelap, atau ikuti preferensi sistem perangkat Anda.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {/* Light Mode Card */}
              <button 
                onClick={() => setTheme('light')} 
                className={`flex flex-col items-start p-5 rounded-3xl border text-left transition-all active:scale-[0.97] outline-none ${
                  theme === 'light' 
                    ? 'bg-white dark:bg-slate-700 border-primary-500 shadow-lg shadow-primary-500/5 ring-2 ring-primary-500/10' 
                    : 'bg-surface border-border hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="w-10 h-10 bg-amber-50 dark:bg-amber-950/20 text-amber-600 rounded-full flex items-center justify-center mb-4 font-bold">
                  <Sun size={20} />
                </div>
                <h3 className="font-bold text-slate-800 dark:text-slate-200">Mode Terang</h3>
                <p className="text-xs text-slate-500 mt-1">Menggunakan latar belakang terang untuk kecerahan optimal di siang hari.</p>
              </button>

              {/* Dark Mode Card */}
              <button 
                onClick={() => setTheme('dark')} 
                className={`flex flex-col items-start p-5 rounded-3xl border text-left transition-all active:scale-[0.97] outline-none ${
                  theme === 'dark' 
                    ? 'bg-white dark:bg-slate-700 border-primary-500 shadow-lg shadow-primary-500/5 ring-2 ring-primary-500/10' 
                    : 'bg-surface border-border hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="w-10 h-10 bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-4 font-bold">
                  <Moon size={20} />
                </div>
                <h3 className="font-bold text-slate-800 dark:text-slate-200">Mode Gelap</h3>
                <p className="text-xs text-slate-500 mt-1">Latar belakang hitam obsidian yang nyaman untuk mata dan hemat baterai OLED.</p>
              </button>

              {/* System Preference Card */}
              <button 
                onClick={() => setTheme('system')} 
                className={`flex flex-col items-start p-5 rounded-3xl border text-left transition-all active:scale-[0.97] outline-none ${
                  theme === 'system' 
                    ? 'bg-white dark:bg-slate-700 border-primary-500 shadow-lg shadow-primary-500/5 ring-2 ring-primary-500/10' 
                    : 'bg-surface border-border hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full flex items-center justify-center mb-4 font-bold">
                  <Monitor size={20} />
                </div>
                <h3 className="font-bold text-slate-800 dark:text-slate-200">Ikuti Sistem</h3>
                <p className="text-xs text-slate-500 mt-1">Menyelaraskan tema secara otomatis berdasarkan pengaturan perangkat Anda.</p>
              </button>
            </div>
          </div>
        )}

        {/* TAB 5: Hak Akses (IAM) */}
        {activeTab === 'iam' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold flex items-center gap-2"><Shield className="text-primary-500" /> Pengaturan Hak Akses (IAM)</h2>
              {(currentUserRole === 'SYSTEM_OWNER' || currentUserRole === 'SUPER_ADMIN' || currentUserRole === 'ADMIN') && activeMembershipPeriod && (
                <button 
                  onClick={() => {
                    setIamUserEmail("");
                    setIamRole("USER");
                    setShowIamModal(true);
                  }} 
                  className="flex items-center gap-1.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold px-4 py-2.5 rounded-2xl transition-all active:scale-95 shadow-lg shadow-primary-500/10"
                >
                  <Plus size={16} /> Tambah Hak Akses
                </button>
              )}
            </div>
            <p className="text-slate-500 text-sm">Kelola peran dan hak akses sistem untuk anggota pada periode aktif: <span className="font-semibold text-slate-800 dark:text-slate-200">{activeMembershipPeriod?.name || 'N/A'}</span></p>

            <div className="bg-surface border border-border rounded-3xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 dark:bg-slate-800/40 border-b border-border text-xs font-semibold text-slate-500 uppercase">
                      <th className="p-4 pl-6">User / Email</th>
                      <th className="p-4">Peran Sistem</th>
                      <th className="p-4">Status Sync</th>
                      {(currentUserRole === 'SYSTEM_OWNER' || currentUserRole === 'SUPER_ADMIN' || currentUserRole === 'ADMIN') && <th className="p-4 pr-6 text-right">Aksi</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {userRolesList.filter(ur => ur.period_id === activeMembershipPeriod?.id).length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-slate-400 text-sm">Belum ada hak akses yang ditetapkan untuk periode ini.</td>
                      </tr>
                    ) : (
                      userRolesList.filter(ur => ur.period_id === activeMembershipPeriod?.id).map(ur => (
                        <tr key={ur.id} className="hover:bg-slate-50/20 text-sm">
                          <td className="p-4 pl-6 font-medium text-slate-800 dark:text-slate-200">{getRoleUserEmail(ur.user_id)}</td>
                          <td className="p-4">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary-50 text-primary-600 border border-primary-100 dark:bg-primary-950/20 dark:text-primary-400 dark:border-primary-900/50">
                              <Key size={12} /> {ur.role}
                            </span>
                          </td>
                          <td className="p-4"><SyncBadge status={ur.sync_status} /></td>
                          {(currentUserRole === 'SYSTEM_OWNER' || currentUserRole === 'SUPER_ADMIN' || currentUserRole === 'ADMIN') && (
                            <td className="p-4 pr-6 text-right">
                              <button 
                                onClick={() => handleDeleteUserRole(ur.id)} 
                                className="text-slate-400 hover:text-red-600 p-1.5 rounded-full hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                                title="Cabut Akses"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          )}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: Sinkronisasi */}
        {activeTab === 'sync' && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <RefreshCw className="text-primary-500" size={24} /> Pusat Sinkronisasi Data
            </h2>
            <p className="text-slate-500 text-sm">
              Kelola sinkronisasi data lokal (IndexedDB) dengan server database cloud (Supabase) secara offline-first.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Status Koneksi */}
              <div className={`p-6 rounded-3xl border transition-all ${
                isOnline 
                  ? 'bg-emerald-500/5 dark:bg-emerald-950/10 border-emerald-200 dark:border-emerald-900/50 shadow-emerald-500/5' 
                  : 'bg-amber-500/5 dark:bg-amber-950/10 border-amber-200 dark:border-amber-900/50 shadow-amber-500/5'
              } shadow-lg`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">Status Koneksi</h3>
                    <p className="text-xs text-slate-500 mt-1">Status jaringan perangkat Anda saat ini.</p>
                  </div>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    isOnline 
                      ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400' 
                      : 'bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400'
                  }`}>
                    {isOnline ? <Wifi size={20} /> : <WifiOff size={20} />}
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-6">
                  <span className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {isOnline ? 'Terhubung dengan Internet (Online)' : 'Mode Luring (Offline)'}
                  </span>
                </div>
              </div>

              {/* Status Sinkronisasi */}
              <div className="bg-surface border border-border p-6 rounded-3xl shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">Status Sinkronisasi</h3>
                    <p className="text-xs text-slate-500 mt-1">Riwayat sinkronisasi terakhir dengan cloud.</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full border text-xs font-semibold uppercase ${
                    syncStatus === 'syncing' ? 'text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-950/25 dark:border-blue-950/50' :
                    syncStatus === 'success' ? 'text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/25 dark:border-emerald-950/50' :
                    syncStatus === 'error' ? 'text-red-600 bg-red-50 border-red-200 dark:bg-red-950/25 dark:border-red-950/50' :
                    'text-slate-600 bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700'
                  }`}>
                    {syncStatus}
                  </div>
                </div>

                <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1 mb-6">
                  <p>Sinkronisasi Terakhir: <span className="font-bold text-slate-800 dark:text-slate-200">
                    {lastSyncTime ? new Date(lastSyncTime).toLocaleString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }) : 'Belum pernah'}
                  </span></p>
                </div>

                <button
                  disabled={!isOnline || syncStatus === 'syncing'}
                  onClick={async () => {
                    const { syncAll } = await import('@/lib/sync');
                    await syncAll();
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:bg-slate-100 dark:disabled:bg-slate-800/80 disabled:text-slate-400 text-white rounded-2xl py-3 font-semibold transition-all shadow-md shadow-primary-500/10 active:scale-[0.98]"
                >
                  <RefreshCw size={18} className={syncStatus === 'syncing' ? 'animate-spin' : ''} />
                  {syncStatus === 'syncing' ? 'Mensinkronkan...' : 'Sinkronkan Sekarang'}
                </button>
              </div>
            </div>

            {/* Antrean Perubahan Lokal */}
            <div className="bg-surface border border-border rounded-3xl p-6 shadow-sm">
              <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                <Database size={18} className="text-primary-500" /> Antrean Data Lokal (Unsynced)
              </h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-border text-center">
                  <span className="text-xs text-slate-400 block uppercase">Program</span>
                  <span className="text-2xl font-black text-slate-700 dark:text-slate-300">{(pendingCounts?.programs || 0) + (pendingCounts?.budgets || 0)}</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-border text-center">
                  <span className="text-xs text-slate-400 block uppercase">Struktur</span>
                  <span className="text-2xl font-black text-slate-700 dark:text-slate-300">{(pendingCounts?.units || 0) + (pendingCounts?.bidangs || 0) + (pendingCounts?.periods || 0)}</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-border text-center">
                  <span className="text-xs text-slate-400 block uppercase">Anggota / Akses</span>
                  <span className="text-2xl font-black text-slate-700 dark:text-slate-300">{(pendingCounts?.members || 0) + (pendingCounts?.unitMembers || 0) + (pendingCounts?.roles || 0)}</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-border text-center">
                  <span className="text-xs text-slate-400 block uppercase">Penghapusan</span>
                  <span className="text-2xl font-black text-slate-700 dark:text-slate-300">{pendingCounts?.deletes || 0}</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-dashed border-border flex justify-between items-center text-sm">
                <span className="text-slate-500">Total data belum disinkronkan:</span>
                <span className={`font-bold px-3 py-1 rounded-full text-xs ${
                  (pendingCounts?.total || 0) > 0 ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400'
                }`}>
                  {pendingCounts?.total || 0} data pending
                </span>
              </div>
            </div>

            {/* Pemecahan Masalah Error Sync */}
            {errorRecords && errorRecords.length > 0 && (
              <div className="bg-red-500/5 border border-red-200 dark:border-red-950 rounded-3xl p-6 shadow-sm">
                <h3 className="font-bold text-lg text-red-700 dark:text-red-400 mb-2 flex items-center gap-2">
                  <AlertCircle size={18} /> Baris Data Error Gagal Sinkronisasi
                </h3>
                <p className="text-xs text-red-600/80 dark:text-red-500/80 mb-4">
                  Beberapa data lokal mengalami kegagalan saat diunggah ke server cloud (misalnya akibat pelanggaran aturan validasi database).
                </p>
                <div className="divide-y divide-red-200/50 dark:divide-red-950/50">
                  {errorRecords.map((rec, i) => (
                    <div key={i} className="py-3 flex justify-between items-center text-sm">
                      <div>
                        <span className="font-mono text-xs text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-950/50 px-1.5 py-0.5 rounded mr-2 uppercase">{rec.table}</span>
                        <span className="font-medium text-slate-800 dark:text-slate-200">{rec.name}</span>
                      </div>
                      <button 
                        onClick={async () => {
                          if (confirm('Atur status data ini kembali ke PENDING untuk mencoba sinkronisasi ulang?')) {
                            // Reset sync_status to PENDING
                            await (db as any)[rec.table].update(rec.id, { sync_status: 'PENDING' });
                          }
                        }}
                        className="text-xs font-bold text-primary-600 hover:text-primary-700 bg-white dark:bg-slate-900 border border-slate-200 px-3 py-1 rounded-lg shadow-sm"
                      >
                        Coba Lagi
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 7: Calendar & Church Occasions */}
        {activeTab === 'calendar' && (() => {
          const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
          const startDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();

          const currentMonthOccasions = localOccasions.filter(o => {
            const [yr, mn] = o.date.split('-');
            return parseInt(yr) === currentYear && parseInt(mn) === currentMonth + 1;
          });

          const currentMonthHolidays = holidays.filter(h => {
            const [yr, mn] = h.date.split('-');
            return parseInt(yr) === currentYear && parseInt(mn) === currentMonth + 1;
          });

          const filteredOccasions = selectedDay 
            ? currentMonthOccasions.filter(o => parseInt(o.date.split('-')[2]) === selectedDay)
            : currentMonthOccasions;

          const filteredHolidays = selectedDay
            ? currentMonthHolidays.filter(h => parseInt(h.date.split('-')[2]) === selectedDay)
            : currentMonthHolidays;

          const allEvents = [
            ...filteredHolidays.map(h => ({
              id: `holiday-${h.date}-${h.description}`,
              type: 'HOLIDAY' as const,
              date: h.date,
              title: h.description,
              description: undefined
            })),
            ...filteredOccasions.map(o => ({
              id: o.id,
              type: 'OCCASION' as const,
              date: o.date,
              title: o.title,
              description: o.description,
              sync_status: o.sync_status,
              original: o
            }))
          ].sort((a, b) => a.date.localeCompare(b.date));

          const handleNextMonth = () => {
            if (currentMonth === 11) {
              setCurrentMonth(0);
              setCurrentYear(prev => prev + 1);
            } else {
              setCurrentMonth(prev => prev + 1);
            }
            setSelectedDay(null);
          };

          const handlePrevMonth = () => {
            if (currentMonth === 0) {
              setCurrentMonth(11);
              setCurrentYear(prev => prev - 1);
            } else {
              setCurrentMonth(prev => prev - 1);
            }
            setSelectedDay(null);
          };

          return (
            <div className="space-y-6 animate-fade-in">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <CalendarDays className="text-primary-500" /> Kalender Kegiatan & Libur Nasional
                  </h2>
                  <p className="text-slate-500 text-sm mt-1">
                    Integrasi Hari Libur Nasional Indonesia dan Acara/Kegiatan Gereja.
                  </p>
                </div>
                {isCalendarAdmin && (activeFiscalPeriod || activeMembershipPeriod) && (
                  <button
                    onClick={() => {
                      setEditingOccasion(null);
                      setOccasionTitle("");
                      setOccasionDate("");
                      setOccasionDesc("");
                      setShowOccasionModal(true);
                    }}
                    className="flex items-center gap-1.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold px-4 py-2.5 rounded-2xl transition-all active:scale-95 shadow-lg shadow-primary-500/10"
                  >
                    <Plus size={16} /> Tambah Acara
                  </button>
                )}
              </div>

              {!(activeFiscalPeriod || activeMembershipPeriod) && (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-3xl flex gap-3 items-center text-sm font-medium">
                  <HelpCircle className="text-amber-500 shrink-0" />
                  <span>Harap aktifkan salah satu Periode Tahun Anggaran atau Keanggotaan terlebih dahulu untuk mengelola Kalender Kegiatan.</span>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Calendar Grid Column */}
                <div className="lg:col-span-2 bg-surface border border-border p-6 rounded-3xl shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={handlePrevMonth}
                        className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
                      >
                        <ChevronLeft size={18} />
                      </button>
                      <span className="font-bold text-lg text-slate-800 dark:text-slate-200 min-w-[120px] text-center">
                        {MONTH_NAMES[currentMonth]} {currentYear}
                      </span>
                      <button 
                        onClick={handleNextMonth}
                        className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const now = new Date();
                          setCurrentMonth(now.getMonth());
                          setCurrentYear(now.getFullYear());
                          setSelectedDay(null);
                        }}
                        className="text-xs font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-3 py-2 rounded-xl transition-all"
                      >
                        Bulan Ini
                      </button>
                    </div>
                  </div>

                  {loadingHolidays && (
                    <div className="text-xs text-primary-600 font-semibold mb-2 animate-pulse flex items-center gap-1.5">
                      <RefreshCw size={12} className="animate-spin" /> Memuat data hari libur...
                    </div>
                  )}

                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-slate-500 mb-2">
                    {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((d, idx) => (
                      <div key={idx} className={idx === 0 ? "text-red-500" : ""}>{d}</div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: startDayOfWeek }).map((_, i) => (
                      <div key={`empty-${i}`} className="aspect-square bg-slate-50/20 dark:bg-slate-800/10 rounded-2xl border border-border/30"></div>
                    ))}
                    {Array.from({ length: daysInMonth }).map((_, idx) => {
                      const d = idx + 1;
                      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                      const dayHolidays = holidays.filter(h => h.date === dateStr);
                      const dayOccasions = localOccasions.filter(o => o.date === dateStr);
                      const isSelected = selectedDay === d;
                      const isToday = new Date().getFullYear() === currentYear && new Date().getMonth() === currentMonth && new Date().getDate() === d;
                      
                      return (
                        <button
                          key={`day-${d}`}
                          onClick={() => setSelectedDay(isSelected ? null : d)}
                          className={`aspect-square p-2 rounded-2xl border flex flex-col justify-between items-start transition-all relative ${
                            isSelected 
                              ? 'bg-primary-50 dark:bg-primary-950/30 border-primary-500 ring-2 ring-primary-500/20' 
                              : isToday 
                                ? 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700' 
                                : 'bg-surface border-border hover:border-slate-300 dark:hover:border-slate-700'
                          }`}
                        >
                          <span className={`text-sm font-bold ${
                            new Date(currentYear, currentMonth, d).getDay() === 0 || dayHolidays.length > 0
                              ? 'text-red-500' 
                              : 'text-slate-800 dark:text-slate-200'
                          }`}>
                            {d}
                          </span>
                          <div className="flex gap-1 mt-1 w-full flex-wrap justify-end">
                            {dayHolidays.map((h, i) => (
                              <span key={`h-${i}`} className="w-1.5 h-1.5 bg-red-500 rounded-full" title={h.description}></span>
                            ))}
                            {dayOccasions.map((o, i) => (
                              <span key={`o-${i}`} className="w-1.5 h-1.5 bg-blue-500 rounded-full" title={o.title}></span>
                            ))}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Event Details Feed Column */}
                <div className="bg-surface border border-border p-6 rounded-3xl shadow-sm space-y-4 flex flex-col justify-between min-h-[300px]">
                  <div>
                    <h3 className="font-bold text-base text-slate-800 dark:text-slate-200 flex items-center justify-between">
                      <span>Daftar Kegiatan</span>
                      {selectedDay && (
                        <span className="text-xs bg-primary-100 text-primary-700 dark:bg-primary-950/50 dark:text-primary-400 px-2 py-0.5 rounded-full">
                          Tanggal {selectedDay}
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      {selectedDay 
                        ? `Menampilkan kegiatan untuk tanggal ${selectedDay} ${MONTH_NAMES[currentMonth]} ${currentYear}.`
                        : `Menampilkan semua kegiatan pada bulan ${MONTH_NAMES[currentMonth]} ${currentYear}.`
                      }
                    </p>

                    <div className="mt-4 space-y-3 max-h-[350px] overflow-y-auto pr-1">
                      {allEvents.length === 0 ? (
                        <p className="text-xs text-slate-400 text-center py-8">Tidak ada kegiatan atau hari libur.</p>
                      ) : (
                        allEvents.map((evt, i) => (
                          <div 
                            key={evt.id} 
                            className={`p-3 rounded-2xl border text-xs space-y-1 ${
                              evt.type === 'HOLIDAY'
                                ? 'bg-red-50/20 dark:bg-red-950/10 border-red-100 dark:border-red-900/30'
                                : 'bg-blue-50/20 dark:bg-blue-950/10 border-blue-100 dark:border-blue-900/30'
                            }`}
                          >
                            <div className="flex justify-between items-start gap-2">
                              <div className="flex-1">
                                <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold mb-1 uppercase ${
                                  evt.type === 'HOLIDAY' ? 'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400'
                                }`}>
                                  {evt.type === 'HOLIDAY' ? 'Libur Nasional' : 'Acara Gereja'}
                                </span>
                                <h4 className="font-bold text-slate-800 dark:text-slate-100">{evt.title}</h4>
                              </div>
                              {evt.type === 'OCCASION' && isCalendarAdmin && (
                                <div className="flex gap-1 shrink-0">
                                  <button
                                    onClick={() => {
                                      setEditingOccasion(evt.original);
                                      setOccasionTitle(evt.original.title);
                                      setOccasionDate(evt.original.date);
                                      setOccasionDesc(evt.original.description || "");
                                      setShowOccasionModal(true);
                                    }}
                                    className="p-1 text-slate-400 hover:text-primary-600 rounded-full"
                                    title="Edit Acara"
                                  >
                                    <Edit3 size={13} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteOccasion(evt.id)}
                                    className="p-1 text-slate-400 hover:text-red-600 rounded-full"
                                    title="Hapus Acara"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                              )}
                            </div>
                            
                            {evt.description && (
                              <p className="text-slate-500 dark:text-slate-400 mt-1">{evt.description}</p>
                            )}
                            
                            <div className="flex justify-between items-center text-[10px] text-slate-400 mt-2 pt-1.5 border-t border-slate-100 dark:border-slate-800/40">
                              <span>{formatDate(evt.date)}</span>
                              {evt.type === 'OCCASION' && <SyncBadge status={evt.sync_status} />}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="border-t border-border pt-4 text-[10px] text-slate-400 flex flex-col gap-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      <span>Merah: Hari Libur Nasional (Nager.Date API)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span>Biru: Acara Intern/Ekstern Gereja</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </section>

      {/* Modals for Period, Bidang, Unit omitted for brevity in this snapshot, but they act standardly */}
      {showPeriodModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-surface border border-border rounded-3xl p-6 w-full max-w-md relative shadow-2xl">
            <button onClick={() => setShowPeriodModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X size={20}/></button>
            <h2 className="text-xl font-bold mb-6">{editingPeriod ? "Edit Periode" : "Tambah Periode"}</h2>
            <form onSubmit={handleSavePeriod} className="space-y-4">
              <input required value={periodName} onChange={e=>setPeriodName(e.target.value)} className="w-full px-4 py-2.5 border border-border rounded-2xl bg-background focus:ring-2 focus:ring-primary-500 focus:outline-none text-sm font-medium" placeholder="Nama Periode"/>
              <input type="date" required value={startDate} onChange={e=>setStartDate(e.target.value)} className="w-full px-4 py-2.5 border border-border rounded-2xl bg-background focus:ring-2 focus:ring-primary-500 focus:outline-none text-sm font-medium"/>
              <input type="date" required value={endDate} onChange={e=>setEndDate(e.target.value)} className="w-full px-4 py-2.5 border border-border rounded-2xl bg-background focus:ring-2 focus:ring-primary-500 focus:outline-none text-sm font-medium"/>
              <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 font-medium cursor-pointer"><input type="checkbox" checked={periodActive} onChange={e=>setPeriodActive(e.target.checked)}/> Set as Active</label>
              <button type="submit" className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-semibold transition-all active:scale-[0.97] mt-4 shadow-lg shadow-primary-500/10">Simpan Data</button>
            </form>
          </div>
        </div>
      )}

      {showBidangModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-surface border border-border rounded-3xl p-6 w-full max-w-md relative shadow-2xl">
            <button onClick={() => setShowBidangModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X size={20}/></button>
            <h2 className="text-xl font-bold mb-6">{editingBidang ? "Edit Bidang" : "Tambah Bidang"}</h2>
            <form onSubmit={handleSaveBidang} className="space-y-4">
              <input required value={bidangCode} onChange={e=>setBidangCode(e.target.value)} className="w-full px-4 py-2.5 border border-border rounded-2xl bg-background focus:ring-2 focus:ring-primary-500 focus:outline-none text-sm font-medium" placeholder="Kode (e.g. BD-1)"/>
              <input required value={bidangName} onChange={e=>setBidangName(e.target.value)} className="w-full px-4 py-2.5 border border-border rounded-2xl bg-background focus:ring-2 focus:ring-primary-500 focus:outline-none text-sm font-medium" placeholder="Nama Bidang"/>
              <textarea value={bidangDesc} onChange={e=>setBidangDesc(e.target.value)} className="w-full px-4 py-2.5 border border-border rounded-2xl bg-background focus:ring-2 focus:ring-primary-500 focus:outline-none text-sm font-medium h-24 resize-none" placeholder="Deskripsi Bidang (e.g. Bidang II Pelayanan dan Kesaksian)"/>
              <button type="submit" className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-semibold transition-all active:scale-[0.97] mt-4 shadow-lg shadow-primary-500/10">Simpan Data</button>
            </form>
          </div>
        </div>
      )}

      {showUnitModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-surface border border-border rounded-3xl p-6 w-full max-w-md relative shadow-2xl">
            <button onClick={() => setShowUnitModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X size={20}/></button>
            <h2 className="text-xl font-bold mb-6">{editingUnit ? "Edit Unit" : "Tambah Unit"}</h2>
            <form onSubmit={handleSaveUnit} className="space-y-4">
              <input required value={unitName} onChange={e=>setUnitName(e.target.value)} className="w-full px-4 py-2.5 border border-border rounded-2xl bg-background focus:ring-2 focus:ring-primary-500 focus:outline-none text-sm font-medium" placeholder="Nama Unit"/>
              <button type="submit" className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-semibold transition-all active:scale-[0.97] mt-4 shadow-lg shadow-primary-500/10">Simpan Data</button>
            </form>
          </div>
        </div>
      )}

      {showIamModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-surface border border-border rounded-3xl p-6 w-full max-w-md relative shadow-2xl transition-all">
            <button onClick={() => setShowIamModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X size={20}/></button>
            <h2 className="text-xl font-bold mb-6">Tambah Hak Akses</h2>
            <form onSubmit={handleSaveUserRole} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Email Pengguna</label>
                <input 
                  type="email" 
                  list="members-emails" 
                  required 
                  value={iamUserEmail} 
                  onChange={e=>setIamUserEmail(e.target.value)} 
                  className="w-full px-4 py-2.5 border border-border rounded-2xl bg-background focus:ring-2 focus:ring-primary-500 focus:outline-none text-sm font-medium" 
                  placeholder="nama@email.com"
                />
                <datalist id="members-emails">
                  {membersList.filter(m => m.email).map(m => (
                    <option key={m.id} value={m.email}>{m.name} ({m.email})</option>
                  ))}
                </datalist>
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Peran Sistem</label>
                <select 
                  value={iamRole} 
                  onChange={e=>setIamRole(e.target.value as any)} 
                  className="w-full px-4 py-2.5 border border-border rounded-2xl bg-background focus:ring-2 focus:ring-primary-500 focus:outline-none text-sm font-medium"
                >
                  <option value="USER">USER (Akses Baca / Terbatas)</option>
                  <option value="STAFF">STAFF (Pengelola Kegiatan / Program)</option>
                  <option value="BENDAHARA">BENDAHARA (Pengelola Keuangan / Anggaran)</option>
                  <option value="AUDITOR">AUDITOR (Penilai Program & Anggaran)</option>
                  <option value="ADMIN">ADMIN (Pengelola Struktur & Pengaturan)</option>
                  <option value="SUPER_ADMIN">SUPER_ADMIN (Akses Penuh)</option>
                  <option value="SYSTEM_OWNER">SYSTEM_OWNER (Pemilik Sistem)</option>
                </select>
              </div>

              <button 
                type="submit" 
                disabled={submitting}
                className="w-full py-3 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white rounded-2xl font-semibold transition-all active:scale-[0.97] mt-4 shadow-lg shadow-primary-500/10 flex items-center justify-center gap-2"
              >
                {submitting ? 'Menyimpan...' : 'Simpan Data'}
              </button>
            </form>
          </div>
        </div>
      )}

      {showOccasionModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-surface border border-border rounded-3xl p-6 w-full max-w-md relative shadow-2xl transition-all animate-scale-up">
            <button onClick={() => { setShowOccasionModal(false); setEditingOccasion(null); }} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"><X size={20}/></button>
            <h2 className="text-xl font-bold mb-6">{editingOccasion ? "Edit Acara" : "Tambah Acara"}</h2>
            <form onSubmit={handleSaveOccasion} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Nama Acara / Kegiatan</label>
                <input 
                  type="text" 
                  required 
                  value={occasionTitle} 
                  onChange={e => setOccasionTitle(e.target.value)} 
                  className="w-full px-4 py-2.5 border border-border rounded-2xl bg-background focus:ring-2 focus:ring-primary-500 focus:outline-none text-sm font-medium" 
                  placeholder="Contoh: Rapat Majelis Jemaat"
                />
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Tanggal Acara</label>
                <input 
                  type="date" 
                  required 
                  value={occasionDate} 
                  onChange={e => setOccasionDate(e.target.value)} 
                  className="w-full px-4 py-2.5 border border-border rounded-2xl bg-background focus:ring-2 focus:ring-primary-500 focus:outline-none text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Deskripsi / Catatan (Opsional)</label>
                <textarea 
                  value={occasionDesc} 
                  onChange={e => setOccasionDesc(e.target.value)} 
                  className="w-full px-4 py-2.5 border border-border rounded-2xl bg-background focus:ring-2 focus:ring-primary-500 focus:outline-none text-sm font-medium h-24 resize-none" 
                  placeholder="Keterangan singkat mengenai acara..."
                />
              </div>

              <button 
                type="submit" 
                disabled={submitting}
                className="w-full py-3 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white rounded-2xl font-semibold transition-all active:scale-[0.97] mt-4 shadow-lg shadow-primary-500/10 flex items-center justify-center gap-2"
              >
                {submitting ? 'Menyimpan...' : 'Simpan Data'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
