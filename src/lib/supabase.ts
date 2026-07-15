import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Custom storage adapter that writes session to both localStorage (for client-side speed) 
// and cookies (so that Next.js Server Components can check user sessions server-side).
const customCookieStorage = {
  getItem: (key: string) => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(key);
  },
  setItem: (key: string, value: string) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, value);
    // Write cookie that expires in 30 days
    const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `flow_sb_session=${encodeURIComponent(value)}; path=/; expires=${expires}; SameSite=Lax; Secure`;
  },
  removeItem: (key: string) => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
    // Remove cookie
    document.cookie = "flow_sb_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: customCookieStorage,
  },
});
