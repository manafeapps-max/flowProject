"use client";

import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { Users, Plus, Building2, ChevronRight, X } from "lucide-react";

export default function OrganizationPage() {
  const units = useLiveQuery(() => db.organization_units.toArray());
  const unitList = units || [];

  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const rootUnits = unitList.filter(u => u.parent_id === null);

  const handleAddUnit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSubmitting(true);
    try {
      const newUnit = {
        id: crypto.randomUUID(),
        period_id: "550e8400-e29b-41d4-a716-446655440000", // Default Active Period
        name: name.trim(),
        parent_id: parentId,
        sync_status: "PENDING" as const,
      };

      await db.organization_units.add(newUnit);
      
      setName("");
      setParentId(null);
      setShowAddModal(false);
    } catch (err) {
      console.error("Failed to add organization unit:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 pb-24">
      <header className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="text-primary-600" /> Organization
          </h1>
          <p className="text-slate-500 text-sm mt-1">Manage structural units (Max 2 levels)</p>
        </div>
        <button 
          onClick={() => {
            setParentId(null);
            setShowAddModal(true);
          }}
          className="bg-primary-600 text-white p-3 rounded-full shadow-lg shadow-primary-500/30 active:scale-95 transition-transform"
        >
          <Plus size={24} />
        </button>
      </header>

      <section className="space-y-4">
        {rootUnits.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            No structural units found. Click the + button to add a Bidang.
          </div>
        ) : (
          rootUnits.map(root => (
            <div key={root.id} className="bg-surface border border-border rounded-3xl overflow-hidden shadow-sm">
              <div className="p-5 flex items-center justify-between border-b border-border bg-slate-50/50 dark:bg-slate-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center">
                    <Building2 size={20} />
                  </div>
                  <div>
                    <h2 className="font-semibold text-lg">{root.name}</h2>
                    <span className="text-xs text-slate-400">Sync: {root.sync_status}</span>
                  </div>
                </div>
                <button className="text-primary-600 text-sm font-medium hover:underline">Edit</button>
              </div>
              
              <div className="divide-y divide-border">
                {unitList.filter(u => u.parent_id === root.id).map(child => (
                  <div key={child.id} className="p-4 pl-16 flex items-center justify-between hover:bg-surface-hover transition-colors">
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <ChevronRight size={16} className="text-slate-400" />
                      <div className="flex flex-col">
                        <span className="font-medium">{child.name}</span>
                        <span className="text-[10px] text-slate-400">Sync: {child.sync_status}</span>
                      </div>
                    </div>
                    <button className="text-slate-400 hover:text-primary-600">Edit</button>
                  </div>
                ))}
                <div className="p-4 pl-16 flex items-center">
                  <button 
                    onClick={() => {
                      setParentId(root.id);
                      setShowAddModal(true);
                    }}
                    className="flex items-center gap-2 text-primary-600 text-sm font-medium hover:underline"
                  >
                    <Plus size={16} /> Add Sub-Bidang
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </section>

      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-surface border border-border rounded-3xl w-full max-w-md p-6 shadow-2xl relative">
            <button 
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold mb-4">
              {parentId ? "Add Sub-Bidang" : "Add Bidang"}
            </h2>
            
            <form onSubmit={handleAddUnit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Name
                </label>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-2xl bg-background focus:ring-2 focus:ring-primary-500 focus:outline-none"
                  placeholder={parentId ? "e.g. Sub-Bidang Ibadah" : "e.g. Bidang I: Teologi"}
                />
              </div>

              <button 
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-semibold transition-colors disabled:opacity-50 mt-2"
              >
                {submitting ? "Adding..." : "Add Unit"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
