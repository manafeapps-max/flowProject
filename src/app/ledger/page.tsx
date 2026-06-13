"use client";

import { useState } from "react";
import { FileText, Plus, Search, ArrowRightLeft } from "lucide-react";

interface Journal {
  id: string;
  reference_no: string;
  status: 'DRAFT' | 'POSTED';
  date: string;
  total_amount: number;
}

const dummyJournals: Journal[] = [
  { id: "1", reference_no: "JV-2601-001", status: 'POSTED', date: "2026-01-15", total_amount: 15000000 },
  { id: "2", reference_no: "JV-2601-002", status: 'DRAFT', date: "2026-01-20", total_amount: 2500000 },
];

export default function LedgerPage() {
  const [journals] = useState<Journal[]>(dummyJournals);

  return (
    <div className="p-6 pb-24">
      <header className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="text-emerald-600" /> General Ledger
          </h1>
          <p className="text-slate-500 text-sm mt-1">Double-entry journals</p>
        </div>
        <button className="bg-emerald-600 text-white p-3 rounded-full shadow-lg shadow-emerald-500/30 active:scale-95 transition-transform">
          <Plus size={24} />
        </button>
      </header>

      <div className="mb-6 relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400" />
        </div>
        <input
          type="text"
          className="appearance-none block w-full pl-11 pr-4 py-3 border border-border rounded-2xl bg-surface placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all sm:text-sm shadow-sm"
          placeholder="Search reference number..."
        />
      </div>

      <section className="space-y-4">
        {journals.map(journal => (
          <div key={journal.id} className="bg-surface border border-border rounded-3xl p-5 shadow-sm active:scale-[0.99] transition-transform cursor-pointer hover:border-emerald-300">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-lg font-mono text-slate-700 dark:text-slate-300">{journal.reference_no}</h2>
              <div className={`px-3 py-1 rounded-full border text-xs font-semibold ${
                journal.status === 'POSTED' ? 'text-emerald-600 bg-emerald-50 border-emerald-200' : 'text-amber-600 bg-amber-50 border-amber-200'
              }`}>
                {journal.status}
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
              <span>{new Date(journal.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-dashed border-border">
              <div className="flex items-center gap-2 text-slate-500 text-sm">
                <ArrowRightLeft size={16} /> Total Debit/Credit
              </div>
              <div className="font-bold text-lg text-emerald-600">Rp {journal.total_amount.toLocaleString('id-ID')}</div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
