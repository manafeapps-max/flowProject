'use client';

import { useQuery } from '@powersync/react';
import { db } from '@/lib/powersync/client';
import { useState } from 'react';

export function PowerSyncTest() {
  const [testResult, setTestResult] = useState('');
  const [loading, setLoading] = useState(false);

  // Test read
  const { data: periods, error: readError } = useQuery(
    'SELECT * FROM periods ORDER BY created_at DESC LIMIT 5'
  );

  // Test write
  const handleTestWrite = async () => {
    setLoading(true);
    setTestResult('');
    try {
      const id = crypto.randomUUID();
      const nowStr = new Date().toISOString();
      
      await db.writeTransaction(async (tx: any) => {
        await tx.execute(
          'INSERT INTO periods (id, name, start_date, end_date, is_active, created_at) VALUES (?, ?, ?, ?, ?, ?)',
          [
            id,
            `Test Period - ${new Date().toLocaleTimeString()}`,
            nowStr.split('T')[0],
            nowStr.split('T')[0],
            1, // active
            nowStr,
          ]
        );
      });
      setTestResult('✅ Write successful! Check Supabase dashboard.');
    } catch (error: any) {
      setTestResult(`❌ Write failed: ${error.message || error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-xl max-w-md mx-auto my-8 text-white font-sans">
      <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
        <span className="h-2.5 w-2.5 bg-emerald-500 rounded-full animate-ping"></span>
        PowerSync Diagnostic Panel
      </h2>
      <p className="text-xs text-slate-400 mb-6 font-mono">
        Status: {db.connected ? 'Connected to Stream' : 'Offline / Syncing'}
      </p>

      <button 
        onClick={handleTestWrite}
        disabled={loading}
        className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] disabled:bg-slate-800 disabled:text-slate-500 disabled:scale-100 text-white font-semibold rounded-2xl transition-all shadow-lg shadow-emerald-950/20 mb-6"
      >
        {loading ? 'Writing Transaction...' : 'Write Test Period'}
      </button>

      {testResult && (
        <div className={`p-4 rounded-2xl mb-6 text-sm font-medium ${testResult.startsWith('✅') ? 'bg-emerald-950/40 border border-emerald-900/60 text-emerald-300' : 'bg-red-950/40 border border-red-900/60 text-red-300'}`}>
          {testResult}
        </div>
      )}

      <div>
        <h3 className="font-semibold text-sm uppercase tracking-wider text-slate-400 mb-3 font-mono">
          Recent Local Periods (SQLite):
        </h3>
        {readError && (
          <p className="text-xs text-red-400">Read Error: {readError.message}</p>
        )}
        {periods && periods.length === 0 && (
          <p className="text-xs text-slate-500 italic">No periods stored locally yet.</p>
        )}
        <ul className="space-y-2">
          {periods?.map((p: any) => (
            <li 
              key={p.id} 
              className="p-3 bg-slate-800/40 border border-slate-800/80 rounded-xl text-xs font-mono flex justify-between items-center gap-2"
            >
              <span className="truncate text-slate-300 font-semibold">{p.name}</span>
              <span className="shrink-0 text-slate-500 text-[10px]">{p.created_at?.split('T')[0]}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
export default PowerSyncTest;
