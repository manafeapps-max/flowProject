import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import OfflineManager from "@/components/OfflineManager";
import { ThemeProvider } from "next-themes";

const inter = Inter({ subsets: ["latin"] });

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
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-background text-foreground antialiased pb-20`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <OfflineManager>
            <main className="min-h-screen">
              {children}
            </main>
            <Navigation />
          </OfflineManager>
        </ThemeProvider>
      </body>
    </html>
  );
}
