"use client";

import { useState, useEffect } from "react";
import { Period, Member, UnitMember, Bidang, OrganizationUnit } from "@/lib/powersync/types";
import { useQuery } from '@powersync/react';
import { db as powerSyncDb } from '@/lib/powersync/client';
import { useAppStore } from "@/store/useAppStore";
import { 
  Users, UserPlus, Plus, Trash2, Edit3, X, 
  Building2, Layers, ChevronRight, CheckCircle2,
  Phone, Mail, Search, HelpCircle, UserCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { easings } from "@/lib/motion";

export default function OrganizationPage() {
  const { data: powerSyncPeriods } = useQuery(
    'SELECT id, name, start_date, end_date, is_active FROM periods WHERE deleted_at IS NULL ORDER BY start_date DESC'
  );
  const periods = (powerSyncPeriods || []).map((p: any) => ({
    ...p,
    is_active: p.is_active === 1,
    sync_status: 'SYNCED'
  })) as Period[];

  const { data: bidangsData, isLoading: loadingBidangs } = useQuery(
    'SELECT id, name, created_at, updated_at FROM bidang WHERE deleted_at IS NULL ORDER BY name ASC'
  );
  const { data: unitsData, isLoading: loadingUnits } = useQuery(
    'SELECT id, name, bidang_id, parent_id, created_at FROM organization_units WHERE deleted_at IS NULL ORDER BY name ASC'
  );
  const { data: membersData, isLoading: loadingMembers } = useQuery(
    'SELECT id, name, email, phone, status, created_at FROM members WHERE deleted_at IS NULL ORDER BY name ASC'
  );
  const { data: unitMembersData, isLoading: loadingUnitMembers } = useQuery(
    'SELECT id, member_id, unit_id, unit_type, role_title, period_id, created_at FROM unit_members WHERE deleted_at IS NULL'
  );

  const bidangs = bidangsData || [];
  const units = unitsData || [];
  const members = membersData || [];
  const unitMembers = unitMembersData || [];

  const periodList = periods || [];
  const activePeriod = periodList.find(p => p.is_active && (new Date(p.end_date).getTime() - new Date(p.start_date).getTime()) > 2 * 365.25 * 24 * 60 * 60 * 1000); // Active Membership Period (5-Year)

  const currentUser = useAppStore(state => state.user);
  const setCurrentUserRole = useAppStore(state => state.setCurrentUserRole);
  const currentUserRole = useAppStore(state => state.currentUserRole);

  const { data: userRoleData, isLoading: loadingUserRoles } = useQuery(
    'SELECT id, user_id, role, period_id FROM user_role WHERE deleted_at IS NULL'
  );
  const userRolesList = userRoleData || [];

  const { data: myRolesData, isLoading: loadingMyRoles } = useQuery(
    'SELECT id, role FROM user_role WHERE (user_id = ? OR LOWER(user_id) = LOWER(?)) AND period_id = ? AND deleted_at IS NULL',
    [currentUser?.id || '', currentUser?.email || '', activePeriod?.id || '']
  );
  const myRoles = myRolesData || [];

  const isLoading = loadingBidangs || loadingUnits || loadingMembers || loadingUnitMembers || loadingUserRoles || loadingMyRoles;

  useEffect(() => {
    if (myRoles && myRoles.length > 0) {
      setCurrentUserRole(myRoles[0].role);
    } else if (currentUser && (currentUser.email === 'benmanafe48@gmail.com' || currentUser.email === 'stolaputih@gmail.com' || userRolesList.length === 0)) {
      setCurrentUserRole('SYSTEM_OWNER');
    } else {
      setCurrentUserRole(null);
    }
  }, [myRoles, currentUser, activePeriod, userRolesList, setCurrentUserRole]);

  const canManageOrg = currentUserRole === 'SYSTEM_OWNER' || currentUserRole === 'SUPER_ADMIN' || currentUserRole === 'ADMIN';

  const [activeTab, setActiveTab] = useState<'struktur' | 'members'>('struktur');

  // Member form state
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [mName, setMName] = useState("");
  const [mPhone, setMPhone] = useState("");
  const [mEmail, setMEmail] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Assignment modal state
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignUnitId, setAssignUnitId] = useState("");
  const [assignUnitType, setAssignUnitType] = useState<'BIDANG' | 'UNIT'>('BIDANG');
  const [assignUnitName, setAssignUnitName] = useState("");
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [roleTitle, setRoleTitle] = useState("");

  const [submitting, setSubmitting] = useState(false);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950/20 text-slate-800 dark:text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
          <p className="text-sm font-semibold tracking-wide text-slate-400 font-mono">MEMUAT DATA ORGANISASI...</p>
        </div>
      </div>
    );
  }

  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mName.trim()) return;

    try {
      const nowStr = new Date().toISOString();
      await powerSyncDb.writeTransaction(async (tx) => {
        if (editingMember) {
          await tx.execute(
            'UPDATE members SET name = ?, phone = ?, email = ?, updated_at = ? WHERE id = ?',
            [mName.trim(), mPhone.trim(), mEmail.trim(), nowStr, editingMember.id]
          );
        } else {
          await tx.execute(
            'INSERT INTO members (id, name, phone, email, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [crypto.randomUUID(), mName.trim(), mPhone.trim(), mEmail.trim(), 'ACTIVE', nowStr, nowStr]
          );
        }
      });
      setShowMemberModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteMember = async (id: string) => {
    if (confirm("Delete this member? This will remove them from all assigned roles.")) {
      try {
        const nowStr = new Date().toISOString();
        await powerSyncDb.writeTransaction(async (tx) => {
          // Soft delete all unit assignments
          await tx.execute(
            'UPDATE unit_members SET deleted_at = ?, updated_at = ? WHERE member_id = ? AND deleted_at IS NULL',
            [nowStr, nowStr, id]
          );
          // Soft delete the member
          await tx.execute(
            'UPDATE members SET deleted_at = ?, updated_at = ? WHERE id = ?',
            [nowStr, nowStr, id]
          );
        });
      } catch (err) {
        console.error(err);
      }
    }
  };

  const openAssignModal = (unitId: string, unitType: 'BIDANG' | 'UNIT', name: string) => {
    setAssignUnitId(unitId);
    setAssignUnitType(unitType);
    setAssignUnitName(name);
    setSelectedMemberId("");
    setRoleTitle("");
    setShowAssignModal(true);
  };

  const handleSaveAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMemberId || !roleTitle.trim() || !activePeriod) return;

    try {
      const nowStr = new Date().toISOString();
      await powerSyncDb.writeTransaction(async (tx) => {
        await tx.execute(
          'INSERT INTO unit_members (id, member_id, unit_id, unit_type, role_title, period_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [crypto.randomUUID(), selectedMemberId, assignUnitId, assignUnitType, roleTitle.trim(), activePeriod.id, nowStr, nowStr]
        );
      });
      setShowAssignModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAssignment = async (id: string) => {
    if (confirm("Remove this person from their role?")) {
      try {
        const nowStr = new Date().toISOString();
        await powerSyncDb.writeTransaction(async (tx) => {
          await tx.execute(
            'UPDATE unit_members SET deleted_at = ?, updated_at = ? WHERE id = ?',
            [nowStr, nowStr, id]
          );
        });
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Removed structural management functions (Save/Delete Bidang/Unit)

  const getAssignedMembers = (unitId: string) => {
    return (unitMembers || [])
      .filter(um => um.unit_id === unitId)
      .map(um => {
        const member = (members || []).find(m => m.id === um.member_id);
        return { ...um, memberName: member?.name || "Unknown Member", memberPhone: member?.phone };
      });
  };

  const filteredMembers = (members || []).filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="py-6 pb-24 max-w-5xl mx-auto">
      <header className="mb-8 pt-4 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2 text-text-high">
            <Users className="text-accent-valor" size={32} /> Organization Structure
          </h1>
          <p className="text-text-muted text-sm mt-1">Manage personnel and unified organizational roles.</p>
        </div>
      </header>

      {!activePeriod && (
        <div className="bg-[oklch(0.96_0.02_90)] border border-border-subtle text-[oklch(0.25_0.06_260)] p-4 rounded-3xl mb-6 flex gap-3 items-center text-sm font-medium">
          <HelpCircle className="text-accent-valor shrink-0" />
          <span>No active 5-Year Membership Period defined. Please create one in Global Settings to assign roles.</span>
        </div>
      )}

      {/* Tabs */}
      <nav className="flex gap-2 p-1 bg-surface-elevated rounded-2xl mb-8 overflow-x-auto border border-border-subtle">
        <button
          onClick={() => setActiveTab('struktur')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all whitespace-nowrap active:scale-95 ${
            activeTab === 'struktur' ? 'bg-surface-base shadow-sm text-text-high border border-border-subtle' : 'text-text-muted hover:text-text-high'
          }`}
        >
          <Layers size={14} className="inline mr-1.5" /> Struktur Organisasi (Terpadu)
        </button>
        <button
          onClick={() => setActiveTab('members')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all whitespace-nowrap active:scale-95 ${
            activeTab === 'members' ? 'bg-surface-base shadow-sm text-text-high border border-border-subtle' : 'text-text-muted hover:text-text-high'
          }`}
        >
          <Users size={14} className="inline mr-1.5" /> Database Anggota
        </button>
      </nav>

      <section className="space-y-6">
        {/* MEMBERS DATABASE TAB */}
        {activeTab === 'members' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div className="relative w-full sm:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Cari anggota..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-2xl bg-surface focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>
              {canManageOrg && (
                <motion.button 
                  onClick={() => {
                    setEditingMember(null);
                    setMName(""); setMPhone(""); setMEmail("");
                    setShowMemberModal(true);
                  }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ duration: 0.1, ease: easings.spring }}
                  className="w-full sm:w-auto flex items-center justify-center gap-1.5 bg-primary-600 hover:bg-primary-700 text-[oklch(0.985_0.005_90)] text-sm font-semibold px-5 py-2.5 rounded-2xl shadow-lg cursor-pointer"
                >
                  <UserPlus size={18} /> Tambah Anggota
                </motion.button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMembers.map(m => (
                <motion.div key={m.id} whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.985 }} transition={{ duration: 0.15, ease: easings.smooth }} className="bg-surface-elevated border border-border-subtle rounded-[var(--radius-lg)] p-5 shadow-[var(--shadow-soft)] flex flex-col gap-3 group cursor-pointer">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[oklch(0.96_0.005_90)] dark:bg-[oklch(0.20_0.02_260)] text-accent-valor rounded-full flex items-center justify-center font-bold text-lg border border-border-subtle">
                        {m.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-semibold text-text-high leading-tight">{m.name}</h3>
                        <span className="text-[10px] font-bold text-[oklch(0.50_0.15_140)] bg-[oklch(0.96_0.02_140)] border border-[oklch(0.9_0.04_140)] dark:bg-[oklch(0.20_0.05_140)] dark:border-[oklch(0.30_0.05_140)] px-2 py-0.5 rounded-full">{m.status}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1 text-sm text-text-muted">
                    {m.phone && <p className="flex items-center gap-2"><Phone size={14}/> {m.phone}</p>}
                    {m.email && <p className="flex items-center gap-2"><Mail size={14}/> {m.email}</p>}
                  </div>
                  {canManageOrg && (
                    <div className="pt-3 border-t border-border-subtle flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { setEditingMember(m); setMName(m.name); setMPhone(m.phone || ""); setMEmail(m.email || ""); setShowMemberModal(true); }} className="text-text-muted hover:text-accent-valor p-1"><Edit3 size={16}/></button>
                      <button onClick={() => handleDeleteMember(m.id)} className="text-text-muted hover:text-[oklch(0.6_0.2_20)] p-1"><Trash2 size={16}/></button>
                    </div>
                  )}
                </motion.div>
              ))}
              {filteredMembers.length === 0 && (
                <div className="col-span-full py-12 text-center text-text-muted">Tidak ada anggota ditemukan.</div>
              )}
            </div>
          </div>
        )}

        {/* UNIFIED STRUCTURE TAB */}
        {activeTab === 'struktur' && (
          <div className="space-y-6 animate-fade-in">
            {(bidangs || []).filter(b => b.period_id === activePeriod?.id).length === 0 ? (
              <div className="text-center py-16 px-6 text-text-muted bg-surface-elevated rounded-3xl border border-border-subtle flex flex-col items-center justify-center max-w-lg mx-auto shadow-[var(--shadow-soft)]">
                <Layers className="text-text-disabled mb-4 animate-pulse" size={48} />
                <h3 className="text-lg font-bold text-text-high mb-1">Struktur Belum Dibuat</h3>
                <p className="text-sm text-text-muted mb-6 max-w-sm">
                  Tidak ada Bidang atau Yayasan untuk periode aktif ini. Silakan konfigurasi struktur organisasi Anda di Pengaturan.
                </p>
                {activePeriod && canManageOrg && (
                  <a 
                    href="/settings"
                    className="flex items-center gap-1.5 bg-brand-primary hover:opacity-90 text-[oklch(0.985_0.005_90)] text-sm font-semibold px-5 py-2.5 rounded-2xl shadow-lg transition-transform active:scale-95"
                  >
                    Konfigurasi Struktur
                  </a>
                )}
              </div>
            ) : (
              (bidangs || []).filter(b => b.period_id === activePeriod?.id).map(bidang => {
                const rootUnits = (units || []).filter(u => u.bidang_id === bidang.id);
                const assignedToBidang = getAssignedMembers(bidang.id);

                return (
                  <div key={bidang.id} className="bg-surface-elevated border border-border-subtle rounded-[var(--radius-lg)] overflow-hidden shadow-[var(--shadow-soft)]">
                    {/* Bidang Header */}
                    <div className="p-5 border-b border-border-subtle bg-[oklch(0.96_0.005_90)]/30 dark:bg-[oklch(0.20_0.02_260)]/10">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h2 className="text-xl font-bold flex items-center gap-2 text-text-high">
                            <Layers className="text-accent-valor" /> [{bidang.code}] {bidang.name}
                          </h2>
                        </div>
                        {activePeriod && canManageOrg && (
                          <div className="flex items-center gap-2">
                            <button onClick={() => openAssignModal(bidang.id, 'BIDANG', bidang.name)} className="flex items-center gap-1 text-accent-valor hover:opacity-90 bg-surface-base border border-border-subtle px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-sm transition-transform active:scale-95">
                              <UserPlus size={14} /> Assign Role
                            </button>
                          </div>
                        )}
                      </div>
                      
                      {/* Bidang Assignments */}
                      {assignedToBidang.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {assignedToBidang.map(um => (
                            <div key={um.id} className="flex items-center gap-2 bg-surface-base border border-border-subtle px-3 py-1.5 rounded-xl text-sm group">
                              <span className="font-semibold text-accent-valor">{um.role_title}:</span>
                              <span className="text-text-high">{um.memberName}</span>
                              {canManageOrg && (
                                <button onClick={() => handleDeleteAssignment(um.id)} className="ml-1 text-text-disabled hover:text-[oklch(0.6_0.2_20)] opacity-0 group-hover:opacity-100 transition-opacity"><X size={14}/></button>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Units under this Bidang */}
                    <div className="divide-y divide-border-subtle">
                      {rootUnits.map(unit => {
                        const childUnits = (units || []).filter(u => u.parent_id === unit.id);
                        const assignedToUnit = getAssignedMembers(unit.id);
                        
                        return (
                          <div key={unit.id} className="flex flex-col hover:bg-[oklch(0.96_0.005_90)]/10 dark:hover:bg-[oklch(0.20_0.02_260)]/10 transition-colors">
                            {/* Level 2 Unit */}
                            <div className="p-5 pl-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h3 className="font-semibold flex items-center gap-2 text-text-high">
                                    <Building2 size={16} className="text-text-disabled" />
                                    {unit.name}
                                  </h3>
                                </div>
                                {assignedToUnit.length > 0 && (
                                  <div className="flex flex-wrap gap-2 mt-2 ml-6">
                                    {assignedToUnit.map(um => (
                                      <div key={um.id} className="flex items-center gap-1.5 bg-surface-base border border-border-subtle px-2.5 py-1 rounded-lg text-xs group">
                                        <span className="font-semibold text-text-high">{um.role_title}:</span>
                                        <span className="text-text-muted">{um.memberName}</span>
                                        {canManageOrg && (
                                          <button onClick={() => handleDeleteAssignment(um.id)} className="ml-1 text-text-disabled hover:text-[oklch(0.6_0.2_20)]"><X size={12}/></button>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                              {activePeriod && canManageOrg && (
                                <div className="flex items-center gap-3 shrink-0">
                                  <button onClick={() => openAssignModal(unit.id, 'UNIT', unit.name)} className="flex items-center gap-1 text-text-muted hover:text-accent-valor text-xs font-semibold">
                                    <UserPlus size={14} /> Assign Role
                                  </button>
                                </div>
                              )}
                            </div>

                            {/* Level 3 Child Units */}
                            {childUnits.map(child => {
                              const assignedToChild = getAssignedMembers(child.id);
                              return (
                                <div key={child.id} className="p-4 pl-16 flex flex-col md:flex-row md:items-center justify-between gap-4 border-t border-border-subtle bg-[oklch(0.96_0.005_90)]/30 dark:bg-[oklch(0.12_0.02_260)]/20">
                                  <div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <h4 className="text-sm font-semibold flex items-center gap-2 text-text-high">
                                        <ChevronRight size={14} className="text-text-disabled" />
                                        {child.name}
                                      </h4>
                                    </div>
                                    {assignedToChild.length > 0 && (
                                      <div className="flex flex-wrap gap-2 mt-2 ml-6">
                                        {assignedToChild.map(um => (
                                          <div key={um.id} className="flex items-center gap-1.5 bg-surface-base border border-border-subtle px-2 py-0.5 rounded-md text-[11px] group">
                                            <span className="font-bold text-text-high">{um.role_title}:</span>
                                            <span className="text-text-muted">{um.memberName}</span>
                                            {canManageOrg && (
                                              <button onClick={() => handleDeleteAssignment(um.id)} className="ml-1 text-text-disabled hover:text-[oklch(0.6_0.2_20)]"><X size={10}/></button>
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                  {activePeriod && canManageOrg && (
                                    <button onClick={() => openAssignModal(child.id, 'UNIT', child.name)} className="shrink-0 flex items-center gap-1 text-text-disabled hover:text-accent-valor text-[10px] font-bold uppercase">
                                      <UserPlus size={12} /> Assign Role
                                    </button>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </section>

      {/* MEMBER FORM MODAL */}
      <AnimatePresence>
        {showMemberModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: easings.smooth }}
              onClick={() => setShowMemberModal(false)}
              className="absolute inset-0 bg-slate-950/65 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.4, ease: easings.spring }}
              className="bg-surface-elevated border border-border-subtle rounded-3xl w-full max-w-md p-6 shadow-2xl relative z-10"
            >
              <button onClick={() => setShowMemberModal(false)} className="absolute top-4 right-4 text-text-muted hover:text-text-high transition-colors p-1.5 rounded-full hover:bg-[oklch(0.96_0.005_90)] dark:hover:bg-[oklch(0.20_0.02_260)]">
                <X size={20} />
              </button>
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-text-high">
                <UserPlus className="text-accent-valor"/> {editingMember ? "Edit Anggota" : "Tambah Anggota Baru"}
              </h2>
              
              <form onSubmit={handleSaveMember} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-text-muted mb-1.5">Nama Lengkap</label>
                  <input required type="text" value={mName} onChange={(e) => setMName(e.target.value)} className="w-full px-4 py-2.5 border border-border-subtle rounded-2xl bg-surface-base focus:ring-2 focus:ring-accent-valor focus:outline-none transition-all duration-200 text-sm font-medium text-text-high"/>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text-muted mb-1.5">Nomor Telepon <span className="text-text-disabled font-normal">(opsional)</span></label>
                  <input type="tel" value={mPhone} onChange={(e) => setMPhone(e.target.value)} className="w-full px-4 py-2.5 border border-border-subtle rounded-2xl bg-surface-base focus:ring-2 focus:ring-accent-valor focus:outline-none transition-all duration-200 text-sm font-medium text-text-high"/>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text-muted mb-1.5">Email <span className="text-text-disabled font-normal">(opsional)</span></label>
                  <input type="email" value={mEmail} onChange={(e) => setMEmail(e.target.value)} className="w-full px-4 py-2.5 border border-border-subtle rounded-2xl bg-surface-base focus:ring-2 focus:ring-accent-valor focus:outline-none transition-all duration-200 text-sm font-medium text-text-high"/>
                </div>
                <motion.button type="submit" whileTap={{ scale: 0.96 }} transition={{ duration: 0.1, ease: easings.spring }} className="w-full py-3 bg-brand-primary hover:brightness-110 text-[oklch(0.985_0.005_90)] rounded-2xl font-semibold mt-4 shadow-lg cursor-pointer text-center">
                  Simpan Data
                </motion.button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ASSIGN ROLE MODAL */}
      <AnimatePresence>
        {showAssignModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: easings.smooth }}
              onClick={() => setShowAssignModal(false)}
              className="absolute inset-0 bg-slate-950/65 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.4, ease: easings.spring }}
              className="bg-surface-elevated border border-border-subtle rounded-3xl w-full max-w-md p-6 shadow-2xl relative z-10"
            >
              <button onClick={() => setShowAssignModal(false)} className="absolute top-4 right-4 text-text-muted hover:text-text-high transition-colors p-1.5 rounded-full hover:bg-[oklch(0.96_0.005_90)] dark:hover:bg-[oklch(0.20_0.02_260)]">
                <X size={20} />
              </button>
              <h2 className="text-xl font-bold mb-1 flex items-center gap-2 text-text-high">
                <UserCheck className="text-accent-valor"/> Assign Role
              </h2>
              <p className="text-sm text-text-muted mb-6">Assigning to: <span className="font-semibold text-text-high">{assignUnitName}</span></p>
              
              <form onSubmit={handleSaveAssignment} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-text-muted mb-1.5">Pilih Anggota</label>
                  <select required value={selectedMemberId} onChange={(e) => setSelectedMemberId(e.target.value)} className="w-full px-4 py-2.5 border border-border-subtle rounded-2xl bg-surface-base focus:ring-2 focus:ring-accent-valor focus:outline-none transition-all duration-200 text-sm font-medium text-text-high">
                    <option value="" disabled>-- Pilih dari Database --</option>
                    {(members || []).map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                  {(members || []).length === 0 && <p className="text-xs text-[oklch(0.6_0.12_80)] mt-1">Database kosong. Silakan tambah anggota di tab Database Anggota terlebih dahulu.</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text-muted mb-1.5">Jabatan / Peran</label>
                  <input required type="text" value={roleTitle} onChange={(e) => setRoleTitle(e.target.value)} placeholder="e.g. Ketua, Anggota, Sekretaris" className="w-full px-4 py-2.5 border border-border-subtle rounded-2xl bg-surface-base focus:ring-2 focus:ring-accent-valor focus:outline-none transition-all duration-200 text-sm font-medium text-text-high"/>
                </div>
                <motion.button type="submit" disabled={!selectedMemberId || !roleTitle} whileTap={{ scale: 0.96 }} transition={{ duration: 0.1, ease: easings.spring }} className="w-full py-3 bg-brand-primary hover:brightness-110 disabled:opacity-50 text-[oklch(0.985_0.005_90)] rounded-2xl font-semibold mt-4 shadow-lg cursor-pointer text-center">
                  Tetapkan Posisi
                </motion.button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
