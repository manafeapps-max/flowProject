import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import OfflineManager from "@/components/OfflineManager";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CMP v1.1 - Church Management",
  description: "Offline-first Church Management Platform",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
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
    <html lang="en">
      <body className={`${inter.className} bg-background text-foreground antialiased pb-20`}>
        <OfflineManager>
          <main className="min-h-screen">
            {children}
          </main>
          <Navigation />
        </OfflineManager>
      </body>
    </html>
  );
}
