import { cookies } from "next/headers";
import { createClient, User } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

/**
 * Creates a server-side Supabase client.
 */
export function createServerClient() {
  return createClient(supabaseUrl, supabaseAnonKey);
}

/**
 * Verifies the user session server-side using the persisted `flow_sb_session` cookie.
 * This prevents Flash of Unauthenticated Content (FOUC).
 */
export async function getServerUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("flow_sb_session")?.value;

    if (!sessionCookie) {
      return null;
    }

    // Decode and parse the session JSON
    const decoded = decodeURIComponent(sessionCookie);
    const session = JSON.parse(decoded);

    // Supabase stores the current session in session.currentSession or as root keys
    const accessToken = session.currentSession?.access_token || session.access_token;
    if (!accessToken) {
      return null;
    }

    // Initialize server-side Supabase client and query the authentication server directly.
    // This is secure and HttpOnly-equivalent because the token signature is verified.
    const client = createServerClient();
    const { data: { user }, error } = await client.auth.getUser(accessToken);

    if (error || !user) {
      return null;
    }

    return user;
  } catch (err) {
    console.error("Error retrieving server user session:", err);
    return null;
  }
}
