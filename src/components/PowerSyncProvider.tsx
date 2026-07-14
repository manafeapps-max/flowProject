'use client';

import { useEffect, useState } from 'react';
import { db, connector } from '@/lib/powersync/client';
import { supabase } from '@/lib/supabase';
import { PowerSyncContext } from '@powersync/react';
import { useAppStore } from '@/store/useAppStore';

export function PowerSyncProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let active = true;
    let sub: { unsubscribe: () => void } | null = null;
    let unsubscribeStatus: (() => void) | null = null;

    const init = async () => {
      try {
        console.log('PowerSync: Initializing local SQLite database...');
        await db.init();
        
        if (!active) return;

        // Listen to PowerSync connection & sync status changes
        unsubscribeStatus = db.registerListener({
          statusChanged: (status) => {
            const store = useAppStore.getState();
            if (status.dataFlowStatus.uploading || status.dataFlowStatus.downloading) {
              store.setSyncStatus('syncing');
            } else if (status.dataFlowStatus.downloadError || status.dataFlowStatus.uploadError) {
              store.setSyncStatus('error');
            } else if (status.connected) {
              store.setSyncStatus('success');
              store.setLastSyncTime(new Date().toISOString());
            } else {
              store.setSyncStatus('idle');
            }
          }
        });

        // Check current session
        const { data: { session } } = await supabase.auth.getSession();
        if (session && active) {
          try {
            console.log('PowerSync: Connecting sync stream...');
            await db.connect(connector);
          } catch (connErr: any) {
            console.error('PowerSync: Connection error on startup:', connErr);
          }
        }

        if (active) {
          setIsReady(true);
        }

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
          if (!active) return;
          
          if (session) {
            try {
              if (!db.connected) {
                console.log('PowerSync: Connecting sync stream on auth change...');
                await db.connect(connector);
              }
            } catch (connErr: any) {
              console.error('PowerSync: Connection error on auth change:', connErr);
            }
          } else {
            try {
              console.log('PowerSync: Disconnecting sync stream on logout...');
              await db.disconnect();
            } catch (discErr) {
              console.error('PowerSync: Disconnect error on sign out:', discErr);
            }
          }
        });
        sub = subscription;

      } catch (error: any) {
        console.error('PowerSync: Initialization failed:', error);
        if (active) {
          setIsReady(true); // Fallback: allow UI to load so users can see login/error states
        }
      }
    };

    init();

    return () => {
      active = false;
      if (sub) {
        sub.unsubscribe();
      }
      if (unsubscribeStatus) {
        unsubscribeStatus();
      }
    };
  }, []);

  if (!isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
          <p className="text-sm font-semibold tracking-wide text-slate-400 font-mono">INITIALIZING POWERSYNC...</p>
        </div>
      </div>
    );
  }

  return (
    <PowerSyncContext.Provider value={db}>
      {children}
    </PowerSyncContext.Provider>
  );
}
export default PowerSyncProvider;
