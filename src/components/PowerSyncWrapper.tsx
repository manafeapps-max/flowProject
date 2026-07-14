'use client';

import { useEffect, useState } from 'react';
import { PowerSyncProvider } from './PowerSyncProvider';

export function PowerSyncWrapper({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    // Return a styled loading page or null to defer rendering until browser hydration
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
          <p className="text-sm font-semibold tracking-wide text-slate-400 font-mono">LOADING APPLICATION...</p>
        </div>
      </div>
    );
  }

  return <PowerSyncProvider>{children}</PowerSyncProvider>;
}
export default PowerSyncWrapper;
