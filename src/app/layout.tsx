import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import OfflineManager from "@/components/OfflineManager";
import { ThemeProvider } from "next-themes";
import PowerSyncWrapper from "@/components/PowerSyncWrapper";
import SyncStatusIndicator from "@/components/SyncStatusIndicator";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import OfflineFallback from "@/components/OfflineFallback";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-sans",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "CMP v1.1 - Church Management",
  description: "Offline-first Church Management Platform",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#0b0c0e",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`} suppressHydrationWarning>
      <body className="antialiased font-sans">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <PowerSyncWrapper>
            <OfflineManager>
              <main className="min-h-screen px-page-x pt-4 md:pt-24 pb-[var(--spacing-safe-bottom)]">
                {children}
              </main>
              <SyncStatusIndicator />
              <PWAInstallPrompt />
              <OfflineFallback />
              <Navigation />
            </OfflineManager>
          </PowerSyncWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
