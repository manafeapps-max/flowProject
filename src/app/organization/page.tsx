"use client";

import { useState, useEffect } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db, Period, Member, UnitMember, Bidang, OrganizationUnit } from "@/lib/db";
import { useAppStore } from "@/store/useAppStore";
import { 
  Users, UserPlus, Plus, Trash2, Edit3, X, 
  Building2, Layers, ChevronRight, CheckCircle2,
  Phone, Mail, Search, HelpCircle, UserCheck
} from "lucide-react";

export default function OrganizationPage() {
  const periods = useLiveQuery(() => db.periods.toArray());
  const bidangs = useLiveQuery(() => db.bidang.toArray());
  const units = useLiveQuery(() => db.organization_units.toArray());
  const members = useLiveQuery(() => db.members.toArray());
  const unitMembers = useLiveQuery(() => db.unit_members.toArray());

  const periodList = periods || [];
  const activePeriod = periodList.find(p => p.is_active && (new Date(p.end_date).getTime() - new Date(p.start_date).getTime()) > 2 * 365.25 * 24 * 60 * 60 * 1000); // Active Membership Period (5-Year)

  const currentUser = useAppStore(state => state.user);
  const setCurrentUserRole = useAppStore(state => state.setCurrentUserRole);
  const currentUserRole = useAppStore(state => state.currentUserRole);

  const userRolesList = useLiveQuery(() => db.user_roles.toArray()) || [];

  const myRoles = useLiveQuery(
    () => currentUser && activePeriod ? db.user_roles.where({ user_id: currentUser.id, period_id: activePeriod.id }).toArray() : Promise.resolve<any[]>([]),
    [currentUser, activePeriod]
  );

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

  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mName.trim()) return;

    try {
      if (editingMember) {
        await db.members.update(editingMember.id, {
          name: mName.trim(),
          phone: mPhone.trim(),
          email: mEmail.trim(),
          sync_status: 'PENDING'
        });
      } else {
        await db.members.add({
          id: crypto.randomUUID(),
          name: mName.trim(),
          phone: mPhone.trim(),
          email: mEmail.trim(),
          status: 'ACTIVE',
          sync_status: 'PENDING'
        });
      }
      setShowMemberModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteMember = async (id: string) => {
    if (confirm("Delete this member? This will remove them from all assigned roles.")) {
      try {
        await db.transaction('rw', [db.members, db.unit_members, db.deleted_records], async () => {
          const assignments = await db.unit_members.where('member_id').equals(id).toArray();
          for (const a of assignments) {
            await db.unit_members.delete(a.id);
            await db.deleted_records.add({ id: a.id, table_name: 'unit_members', sync_status: 'PENDING' });
          }
          await db.members.delete(id);
          await db.deleted_records.add({ id, table_name: 'members', sync_status: 'PENDING' });
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
      await db.unit_members.add({
        id: crypto.randomUUID(),
        member_id: selectedMemberId,
        unit_id: assignUnitId,
        unit_type: assignUnitType,
        role_title: roleTitle.trim(),
        period_id: activePeriod.id,
        sync_status: 'PENDING'
      });
      setShowAssignModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAssignment = async (id: string) => {
    if (confirm("Remove this person from their role?")) {
      try {
        await db.transaction('rw', [db.unit_members, db.deleted_records], async () => {
          await db.unit_members.delete(id);
          await db.deleted_records.add({ id, table_name: 'unit_members', sync_status: 'PENDING' });
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
    <div className="p-6 pb-24 max-w-5xl mx-auto">
      <header className="mb-8 pt-4 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="text-primary-600" size={32} /> Organization Structure
          </h1>
          <p className="text-slate-500 text-sm mt-1">Manage personnel and unified organizational roles.</p>
        </div>
      </header>

      {!activePeriod && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-3xl mb-6 flex gap-3 items-center text-sm font-medium">
          <HelpCircle className="text-amber-500 shrink-0" />
          <span>No active 5-Year Membership Period defined. Please create one in Global Settings to assign roles.</span>
        </div>
      )}

      {/* Tabs */}
      <nav className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800/60 rounded-2xl mb-8 overflow-x-auto">
        <button
          onClick={() => setActiveTab('struktur')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all whitespace-nowrap active:scale-95 ${
            activeTab === 'struktur' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-800 dark:text-white' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Layers size={14} className="inline mr-1.5" /> Struktur Organisasi (Terpadu)
        </button>
        <button
          onClick={() => setActiveTab('members')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all whitespace-nowrap active:scale-95 ${
            activeTab === 'members' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-800 dark:text-white' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
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
                <button 
                  onClick={() => {
                    setEditingMember(null);
                    setMName(""); setMPhone(""); setMEmail("");
                    setShowMemberModal(true);
                  }}
                  className="w-full sm:w-auto flex items-center justify-center gap-1.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold px-5 py-2.5 rounded-2xl shadow-lg shadow-primary-500/10 transition-transform active:scale-95"
                >
                  <UserPlus size={18} /> Tambah Anggota
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMembers.map(m => (
                <div key={m.id} className="bg-surface border border-border rounded-3xl p-5 shadow-sm flex flex-col gap-3 group">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-bold text-lg">
                        {m.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800 dark:text-slate-100 leading-tight">{m.name}</h3>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{m.status}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1 text-sm text-slate-500">
                    {m.phone && <p className="flex items-center gap-2"><Phone size={14}/> {m.phone}</p>}
                    {m.email && <p className="flex items-center gap-2"><Mail size={14}/> {m.email}</p>}
                  </div>
                  {canManageOrg && (
                    <div className="pt-3 border-t border-border flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { setEditingMember(m); setMName(m.name); setMPhone(m.phone || ""); setMEmail(m.email || ""); setShowMemberModal(true); }} className="text-slate-400 hover:text-primary-600 p-1"><Edit3 size={16}/></button>
                      <button onClick={() => handleDeleteMember(m.id)} className="text-slate-400 hover:text-red-600 p-1"><Trash2 size={16}/></button>
                    </div>
                  )}
                </div>
              ))}
              {filteredMembers.length === 0 && (
                <div className="col-span-full py-12 text-center text-slate-400">Tidak ada anggota ditemukan.</div>
              )}
            </div>
          </div>
        )}

        {/* UNIFIED STRUCTURE TAB */}
        {activeTab === 'struktur' && (
          <div className="space-y-6 animate-fade-in">
            {(bidangs || []).filter(b => b.period_id === activePeriod?.id).length === 0 ? (
              <div className="text-center py-16 px-6 text-slate-400 bg-surface rounded-3xl border border-border flex flex-col items-center justify-center max-w-lg mx-auto shadow-sm">
                <Layers className="text-slate-300 dark:text-slate-600 mb-4 animate-pulse" size={48} />
                <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-1">Struktur Belum Dibuat</h3>
                <p className="text-sm text-slate-500 mb-6 max-w-sm">
                  Tidak ada Bidang atau Yayasan untuk periode aktif ini. Silakan konfigurasi struktur organisasi Anda di Pengaturan.
                </p>
                {activePeriod && canManageOrg && (
                  <a 
                    href="/settings"
                    className="flex items-center gap-1.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold px-5 py-2.5 rounded-2xl shadow-lg shadow-primary-500/15 transition-transform active:scale-95"
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
                  <div key={bidang.id} className="bg-surface border border-border rounded-3xl overflow-hidden shadow-sm">
                    {/* Bidang Header */}
                    <div className="p-5 border-b border-border bg-primary-50/30 dark:bg-primary-900/10">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h2 className="text-xl font-bold flex items-center gap-2">
                            <Layers className="text-primary-600" /> [{bidang.code}] {bidang.name}
                          </h2>
                        </div>
                        {activePeriod && canManageOrg && (
                          <div className="flex items-center gap-2">
                            <button onClick={() => openAssignModal(bidang.id, 'BIDANG', bidang.name)} className="flex items-center gap-1 text-primary-600 hover:text-primary-700 bg-white dark:bg-slate-800 border border-primary-100 dark:border-primary-900/50 px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-sm transition-transform active:scale-95">
                              <UserPlus size={14} /> Assign Role
                            </button>
                          </div>
                        )}
                      </div>
                      
                      {/* Bidang Assignments */}
                      {assignedToBidang.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {assignedToBidang.map(um => (
                            <div key={um.id} className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-border px-3 py-1.5 rounded-xl text-sm group">
                              <span className="font-semibold text-primary-700">{um.role_title}:</span>
                              <span className="text-slate-600 dark:text-slate-300">{um.memberName}</span>
                              {canManageOrg && (
                                <button onClick={() => handleDeleteAssignment(um.id)} className="ml-1 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><X size={14}/></button>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Units under this Bidang */}
                    <div className="divide-y divide-border">
                      {rootUnits.map(unit => {
                        const childUnits = (units || []).filter(u => u.parent_id === unit.id);
                        const assignedToUnit = getAssignedMembers(unit.id);
                        
                        return (
                          <div key={unit.id} className="flex flex-col hover:bg-slate-50/20 transition-colors">
                            {/* Level 2 Unit */}
                            <div className="p-5 pl-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h3 className="font-semibold flex items-center gap-2 text-slate-800 dark:text-slate-200">
                                    <Building2 size={16} className="text-slate-400" />
                                    {unit.name}
                                  </h3>
                                </div>
                                {assignedToUnit.length > 0 && (
                                  <div className="flex flex-wrap gap-2 mt-2 ml-6">
                                    {assignedToUnit.map(um => (
                                      <div key={um.id} className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/60 border border-border px-2.5 py-1 rounded-lg text-xs group">
                                        <span className="font-semibold text-slate-700 dark:text-slate-300">{um.role_title}:</span>
                                        <span className="text-slate-600 dark:text-slate-400">{um.memberName}</span>
                                        {canManageOrg && (
                                          <button onClick={() => handleDeleteAssignment(um.id)} className="ml-1 text-slate-300 hover:text-red-500"><X size={12}/></button>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                              {activePeriod && canManageOrg && (
                                <div className="flex items-center gap-3 shrink-0">
                                  <button onClick={() => openAssignModal(unit.id, 'UNIT', unit.name)} className="flex items-center gap-1 text-slate-500 hover:text-primary-600 text-xs font-semibold">
                                    <UserPlus size={14} /> Assign Role
                                  </button>
                                </div>
                              )}
                            </div>

                            {/* Level 3 Child Units */}
                            {childUnits.map(child => {
                              const assignedToChild = getAssignedMembers(child.id);
                              return (
                                <div key={child.id} className="p-4 pl-16 flex flex-col md:flex-row md:items-center justify-between gap-4 border-t border-border bg-slate-50/30 dark:bg-slate-800/20">
                                  <div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <h4 className="text-sm font-semibold flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                        <ChevronRight size={14} className="text-slate-400" />
                                        {child.name}
                                      </h4>
                                    </div>
                                    {assignedToChild.length > 0 && (
                                      <div className="flex flex-wrap gap-2 mt-2 ml-6">
                                        {assignedToChild.map(um => (
                                          <div key={um.id} className="flex items-center gap-1.5 bg-white dark:bg-slate-800 border border-border px-2 py-0.5 rounded-md text-[11px] group">
                                            <span className="font-bold text-slate-700 dark:text-slate-300">{um.role_title}:</span>
                                            <span className="text-slate-600 dark:text-slate-400">{um.memberName}</span>
                                            {canManageOrg && (
                                              <button onClick={() => handleDeleteAssignment(um.id)} className="ml-1 text-slate-300 hover:text-red-500"><X size={10}/></button>
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                  {activePeriod && canManageOrg && (
                                    <button onClick={() => openAssignModal(child.id, 'UNIT', child.name)} className="shrink-0 flex items-center gap-1 text-slate-400 hover:text-primary-600 text-[10px] font-bold uppercase">
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
      {showMemberModal && (
        <div className="fixed inset-0 bg-slate-950/65 backdrop-blur-md flex items-center justify-center p-4 z-50 transition-opacity duration-300">
          <div className="bg-surface border border-border rounded-3xl w-full max-w-md p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button onClick={() => setShowMemberModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <UserPlus className="text-primary-600"/> {editingMember ? "Edit Anggota" : "Tambah Anggota Baru"}
            </h2>
            
            <form onSubmit={handleSaveMember} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Nama Lengkap</label>
                <input required type="text" value={mName} onChange={(e) => setMName(e.target.value)} className="w-full px-4 py-2.5 border border-border rounded-2xl bg-background focus:ring-2 focus:ring-primary-500 focus:outline-none transition-all duration-200 text-sm font-medium text-slate-900 dark:text-white"/>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Nomor Telepon <span className="text-slate-400 font-normal">(opsional)</span></label>
                <input type="tel" value={mPhone} onChange={(e) => setMPhone(e.target.value)} className="w-full px-4 py-2.5 border border-border rounded-2xl bg-background focus:ring-2 focus:ring-primary-500 focus:outline-none transition-all duration-200 text-sm font-medium text-slate-900 dark:text-white"/>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Email <span className="text-slate-400 font-normal">(opsional)</span></label>
                <input type="email" value={mEmail} onChange={(e) => setMEmail(e.target.value)} className="w-full px-4 py-2.5 border border-border rounded-2xl bg-background focus:ring-2 focus:ring-primary-500 focus:outline-none transition-all duration-200 text-sm font-medium text-slate-900 dark:text-white"/>
              </div>
              <button type="submit" className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-semibold transition-all active:scale-[0.97] mt-4 shadow-lg shadow-primary-500/10">
                Simpan Data
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ASSIGN ROLE MODAL */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-slate-950/65 backdrop-blur-md flex items-center justify-center p-4 z-50 transition-opacity duration-300">
          <div className="bg-surface border border-border rounded-3xl w-full max-w-md p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button onClick={() => setShowAssignModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold mb-1 flex items-center gap-2">
              <UserCheck className="text-primary-600"/> Assign Role
            </h2>
            <p className="text-sm text-slate-500 mb-6">Assigning to: <span className="font-semibold text-slate-800 dark:text-slate-200">{assignUnitName}</span></p>
            
            <form onSubmit={handleSaveAssignment} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Pilih Anggota</label>
                <select required value={selectedMemberId} onChange={(e) => setSelectedMemberId(e.target.value)} className="w-full px-4 py-2.5 border border-border rounded-2xl bg-background focus:ring-2 focus:ring-primary-500 focus:outline-none transition-all duration-200 text-sm font-medium text-slate-900 dark:text-white">
                  <option value="" disabled>-- Pilih dari Database --</option>
                  {(members || []).map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
                {(members || []).length === 0 && <p className="text-xs text-amber-600 mt-1">Database kosong. Silakan tambah anggota di tab Database Anggota terlebih dahulu.</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Jabatan / Peran</label>
                <input required type="text" value={roleTitle} onChange={(e) => setRoleTitle(e.target.value)} placeholder="e.g. Ketua, Anggota, Sekretaris" className="w-full px-4 py-2.5 border border-border rounded-2xl bg-background focus:ring-2 focus:ring-primary-500 focus:outline-none transition-all duration-200 text-sm font-medium text-slate-900 dark:text-white"/>
              </div>
              <button type="submit" disabled={!selectedMemberId || !roleTitle} className="w-full py-3 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white rounded-2xl font-semibold transition-all active:scale-[0.97] mt-4 shadow-lg shadow-primary-500/10">
                Tetapkan Posisi
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
