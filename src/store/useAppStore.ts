import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@supabase/supabase-js';

interface AppState {
  user: User | null;
  activePeriodId: string | null;
  isOnline: boolean;
  setUser: (user: User | null) => void;
  setActivePeriodId: (id: string) => void;
  setOnlineStatus: (status: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      activePeriodId: null,
      isOnline: typeof window !== 'undefined' ? navigator.onLine : true,
      setUser: (user) => set({ user }),
      setActivePeriodId: (id) => set({ activePeriodId: id }),
      setOnlineStatus: (status) => set({ isOnline: status }),
    }),
    {
      name: 'cmp-app-storage',
    }
  )
);
