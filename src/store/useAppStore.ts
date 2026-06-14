import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@supabase/supabase-js';

interface AppState {
  user: User | null;
  currentUserRole: string | null;
  activePeriodId: string | null;
  isOnline: boolean;
  syncStatus: 'idle' | 'syncing' | 'success' | 'error';
  lastSyncTime: string | null;
  setUser: (user: User | null) => void;
  setCurrentUserRole: (role: string | null) => void;
  setActivePeriodId: (id: string) => void;
  setOnlineStatus: (status: boolean) => void;
  setSyncStatus: (status: 'idle' | 'syncing' | 'success' | 'error') => void;
  setLastSyncTime: (time: string | null) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      currentUserRole: null,
      activePeriodId: null,
      isOnline: typeof window !== 'undefined' ? navigator.onLine : true,
      syncStatus: 'idle',
      lastSyncTime: null,
      setUser: (user) => set({ user }),
      setCurrentUserRole: (role) => set({ currentUserRole: role }),
      setActivePeriodId: (id) => set({ activePeriodId: id }),
      setOnlineStatus: (status) => set({ isOnline: status }),
      setSyncStatus: (status) => set({ syncStatus: status }),
      setLastSyncTime: (time) => set({ lastSyncTime: time }),
    }),
    {
      name: 'cmp-app-storage',
      partialize: (state) => ({
        user: state.user,
        currentUserRole: state.currentUserRole,
        activePeriodId: state.activePeriodId,
        lastSyncTime: state.lastSyncTime,
      }),
    }
  )
);
