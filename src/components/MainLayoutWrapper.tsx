"use client";

import { usePathname } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";

export default function MainLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const user = useAppStore((state) => state.user);

  // Full-bleed mode for public landing page and login page
  const isLandingPage = !user && pathname === "/";
  const isLoginPage = pathname === "/auth/login";

  if (isLandingPage || isLoginPage) {
    return <main className="min-h-screen w-full relative">{children}</main>;
  }

  return (
    <main className="min-h-screen px-page-x pt-4 md:pt-24 pb-[var(--spacing-safe-bottom)]">
      {children}
    </main>
  );
}
