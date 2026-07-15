import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getServerUser } from "@/lib/supabaseServer";
import LandingPage from "@/components/LandingPage";

export const metadata = {
  title: "FLOW - Stewardship, Perfected",
  description: "Offline-first structural and financial church management ecosystem.",
};

export default async function RootPage() {
  const cookieStore = await cookies();
  const isDemo = cookieStore.get("flow_demo_mode")?.value === "true";

  // 1. If logged in via Demo Mode, redirect server-side to prevent dashboard FOUC
  if (isDemo) {
    redirect("/dashboard");
  }

  // 2. Otherwise verify if there's a valid Supabase session server-side
  const user = await getServerUser();
  if (user) {
    redirect("/dashboard");
  }

  // 3. If unauthenticated, render the public landing page (FOUC-free)
  return <LandingPage />;
}
