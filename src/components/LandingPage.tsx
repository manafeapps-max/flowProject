"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { 
  Activity, Briefcase, FileText, Users, ArrowRight, Zap, 
  Wifi, WifiOff, Database, Server, RefreshCw, CheckCircle2, ChevronRight,
  Sun, Moon
} from "lucide-react";
import { easings } from "@/lib/motion";

// Simulated Sync Items for the interactive dashboard - lightweight for GPU guards (max 4 logs)
const initialSyncLogs = [
  { id: 1, type: "journal", text: "Jurnal Kas Masuk #J-942 disinkronkan", status: "success" },
  { id: 2, type: "program", text: "Revisi Anggaran Bidang PJP diperbarui", status: "success" },
  { id: 3, type: "member", text: "Database Keanggotaan Unit 04 dimuat lokal", status: "success" },
  { id: 4, type: "ledger", text: "Penutupan Kas Periode 2026 tervalidasi", status: "success" },
];

export default function LandingPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [syncLogs, setSyncLogs] = useState(initialSyncLogs);
  const [activeTab, setActiveTab] = useState("ledger");
  const [syncCount, setSyncCount] = useState(148);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      if (window.scrollY > 80) {
        setShowScrollIndicator(false);
      } else {
        setShowScrollIndicator(true);
      }

      // Track active section using viewport bounding boxes
      const sectionsList = ["hero", "ekosistem", "fitur", "demo", "gabung"];
      const viewportCenter = window.innerHeight / 2;
      for (const id of sectionsList) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= viewportCenter && rect.bottom >= viewportCenter) {
            setActiveSection(id);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    // Run once initially to set correct active state
    setTimeout(handleScroll, 100);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollToId = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 100; // Offset for fixed header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      window.history.pushState(null, "", `#${id}`);
    }
  };

  // Interval to toggle online/offline state to showcase offline capabilities
  useEffect(() => {
    const statusInterval = setInterval(() => {
      setIsOnline(prev => !prev);
    }, 8000);

    // Interval to simulate incoming local modifications and syncing
    const syncInterval = setInterval(() => {
      const types = ["journal", "program", "member", "ledger"];
      const messages = [
        "Kas Masuk Program Sosial tercatat di SQLite",
        "Target Indikator Kuantitatif diperbarui lokal",
        "Otorisasi Pengguna SYSTEM_OWNER diverifikasi",
        "Jurnal Pengeluaran Bidang Pelkes disinkronkan",
      ];
      const randomIdx = Math.floor(Math.random() * messages.length);
      const newLog = {
        id: Date.now(),
        type: types[randomIdx],
        text: messages[randomIdx],
        status: "success",
      };
      setSyncLogs(prev => [newLog, ...prev.slice(0, 3)]);
      setSyncCount(c => c + 1);
    }, 4500);

    return () => {
      clearInterval(statusInterval);
      clearInterval(syncInterval);
    };
  }, []);

  // Handle manual scrolling to hash on load/reload to prevent Next.js hydration scroll cut-off
  useEffect(() => {
    if (mounted && window.location.hash) {
      const id = window.location.hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        const timer = setTimeout(() => {
          const headerOffset = 110; // Header height (80px) + clean spacing (30px)
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          });
        }, 500); // 500ms delay to allow all hydration layouts to finalize height
        return () => clearTimeout(timer);
      }
    }
  }, [mounted]);

  const handleScrollToFeatures = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById("ekosistem");
    if (element) {
      const headerOffset = 110; // Header height (80px) + clean spacing (30px)
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      window.history.pushState(null, "", "#ekosistem");
    }
  };



  return (
    <div className="bg-[oklch(0.985_0.005_90)] dark:bg-[#050505] text-text-high dark:text-[#e0e0e0] min-h-screen relative overflow-hidden font-sans selection:bg-accent-valor selection:text-black transition-colors duration-300">
      {/* Noise Overlay from Amanloka - Guarded from interactions */}
      <div className="noise-overlay pointer-events-none select-none" />

      {/* Decorative Floating Glowing Orbs (Luxury Ambience) - Guarded from interactions */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[oklch(0.25_0.06_260)] opacity-10 dark:opacity-35 blur-[120px] pointer-events-none select-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-[oklch(0.75_0.14_85)] opacity-5 dark:opacity-10 blur-[150px] pointer-events-none select-none z-0" />
      <div className="absolute top-[35%] left-[60%] w-[35vw] h-[35vw] rounded-full bg-[oklch(0.25_0.06_260)] opacity-5 dark:opacity-15 blur-[100px] pointer-events-none select-none z-0" />

      {/* Amanloka Geometric Architectural Grid Guidelines - Guarded from interactions */}
      <div className="absolute top-0 bottom-0 left-[8%] w-[1px] bg-gradient-to-b from-transparent via-black/[0.03] dark:via-white/5 to-transparent pointer-events-none select-none z-10" />
      <div className="absolute top-0 bottom-0 right-[8%] w-[1px] bg-gradient-to-b from-transparent via-black/[0.03] dark:via-white/5 to-transparent pointer-events-none select-none z-10" />
      <div className="absolute top-0 bottom-0 left-[50%] w-[1px] bg-gradient-to-b from-transparent via-black/[0.015] dark:via-white/[0.02] to-transparent pointer-events-none select-none z-10 hidden md:block" />

      {/* Hero Header Navbar */}
      <header className="fixed top-0 left-0 right-0 border-b border-border-subtle dark:border-white/5 backdrop-blur-md bg-[oklch(0.985_0.005_90)]/80 dark:bg-[#050505]/80 z-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
              window.history.pushState(null, "", "/");
            }}
            className="flex items-center gap-3 group bg-transparent border-0 p-0 text-left cursor-pointer"
          >
            <img 
              src="/icon_apps_flow.png" 
              alt="Flow Logo" 
              className="w-11 h-11 object-contain rounded-xl shadow-sm group-hover:scale-105 transition-transform duration-300" 
            />
            <div className="flex flex-col justify-center">
              <span className="font-serif font-bold text-xl tracking-wide leading-none text-text-high dark:text-white">FLOW</span>
              <span className="text-[8px] font-extrabold text-accent-valor tracking-widest uppercase mt-1.5 leading-none">PROJECT 2.0</span>
            </div>
          </button>
          <div className="flex items-center gap-4 md:gap-6">
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2.5 rounded-xl border border-border-subtle dark:border-white/10 bg-surface-elevated/60 dark:bg-white/5 text-text-high dark:text-white hover:border-accent-valor/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                title="Ganti Tema"
              >
                {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
              </button>
            )}
            
            <Link 
              href="/auth/login"
              className="text-xs font-semibold tracking-wider uppercase text-text-muted dark:text-white/70 hover:text-text-high dark:hover:text-white transition-colors py-2 hidden sm:block"
            >
              Portal Demo
            </Link>
            <Link 
              href="/auth/login"
              className="relative px-4 sm:px-6 py-2.5 rounded-xl text-xs font-semibold tracking-wider uppercase bg-brand-primary dark:bg-white text-[oklch(0.985_0.005_90)] dark:text-black hover:opacity-90 hover:scale-105 active:scale-95 transition-all shadow-[0_4px_12px_rgba(0,0,0,0.08)] dark:shadow-[0_0_20px_rgba(255,255,255,0.15)] overflow-hidden group"
            >
              <span className="relative z-10 flex items-center gap-1.5 sm:gap-2">
                <span className="hidden sm:inline">Akses Platform</span>
                <span className="sm:hidden">Masuk</span>
                <ArrowRight size={14} />
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-12 pt-28 md:pt-36 pb-12 z-20">
        
        {/* Animated Dashed Horizontal Line (Amanloka scroll aesthetic) - Guarded from interactions */}
        <div className="w-full h-[1px] animate-dashed-line mb-16 opacity-10 dark:opacity-30 pointer-events-none select-none" />

        {/* Hero Section */}
        <section id="hero" className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start mb-16 sm:mb-24 lg:mb-32">
          {/* Hero Content (Left 7 Cols) */}
          <div className="lg:col-span-7 flex flex-col pt-4">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: easings.smooth }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border-subtle dark:border-white/10 bg-surface-elevated/50 dark:bg-white/5 backdrop-blur-md mb-6">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-valor opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-valor"></span>
                </span>
                <span className="text-[10px] font-bold tracking-widest text-accent-valor uppercase font-mono">OFFLINE-FIRST ARCHITECTURE</span>
              </div>

              {/* Manifesto Typography Enforcement: Serif Heading */}
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif font-light text-text-high dark:text-white tracking-tight leading-[1.1] mb-6">
                FLOW: <br />
                <span className="font-serif italic font-normal text-luxury-gradient pr-2">Stewardship, Perfected.</span>
              </h1>
              
              <p className="text-text-muted dark:text-white/60 text-base md:text-lg font-light leading-relaxed max-w-xl mb-10">
                FLOW 2.0 menyelaraskan tata kelola struktural dan transparansi finansial gereja Anda melalui platform berkinerja tinggi, tangguh secara offline, dan dirancang dengan estetika kelas atas.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                <Link 
                  href="/auth/login"
                  className="flex items-center justify-center gap-3 bg-accent-valor hover:brightness-110 text-text-high dark:text-black font-semibold text-sm px-8 py-4.5 rounded-2xl shadow-lg active:scale-98 transition-all"
                >
                  Masuk Portal Aplikasi <ArrowRight size={16} />
                </Link>
                <a 
                  href="#ekosistem"
                  onClick={handleScrollToFeatures}
                  className="flex items-center justify-center gap-2 text-text-high dark:text-white hover:text-accent-valor dark:hover:text-accent-valor font-semibold text-xs tracking-wider uppercase px-6 py-4 border border-border-subtle dark:border-white/10 hover:border-accent-valor/30 rounded-2xl bg-surface-elevated/40 dark:bg-white/5 backdrop-blur-sm transition-all"
                >
                  Pelajari Fitur
                </a>
              </div>
            </motion.div>

            {/* Quick Metrics (Hero Bottom) - Enforced Serif and Tabular Nums */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="flex flex-col sm:grid sm:grid-cols-3 gap-5 sm:gap-6 mt-12 sm:mt-16 border-t border-border-subtle dark:border-white/10 pt-8"
            >
              {/* Item 1 */}
              <div className="flex items-center justify-between sm:flex-col sm:items-start pb-4 sm:pb-0 border-b border-border-subtle/40 sm:border-b-0 dark:border-white/5">
                <div className="flex flex-col pr-4">
                  <p className="text-[9px] font-bold tracking-widest text-text-disabled dark:text-white/40 uppercase font-mono mb-1">LATENCY RATE</p>
                  <p className="text-[10px] text-text-muted dark:text-white/50 font-light">Local SQLite storage</p>
                </div>
                <p className="text-2xl sm:text-3xl font-serif text-accent-valor tracking-tight tabular-nums sm:mt-2 shrink-0">0.0ms</p>
              </div>

              {/* Item 2 */}
              <div className="flex items-center justify-between sm:flex-col sm:items-start pb-4 sm:pb-0 border-b border-border-subtle/40 sm:border-b-0 dark:border-white/5">
                <div className="flex flex-col pr-4">
                  <p className="text-[9px] font-bold tracking-widest text-text-disabled dark:text-white/40 uppercase font-mono mb-1">AVAILABILITY</p>
                  <p className="text-[10px] text-text-muted dark:text-white/50 font-light">Full offline redundancy</p>
                </div>
                <p className="text-2xl sm:text-3xl font-serif text-accent-valor tracking-tight tabular-nums sm:mt-2 shrink-0">100%</p>
              </div>

              {/* Item 3 */}
              <div className="flex items-center justify-between sm:flex-col sm:items-start">
                <div className="flex flex-col pr-4">
                  <p className="text-[9px] font-bold tracking-widest text-text-disabled dark:text-white/40 uppercase font-mono mb-1">DATA SECURITY</p>
                  <p className="text-[10px] text-text-muted dark:text-white/50 font-light">Local device encryption</p>
                </div>
                <p className="text-2xl sm:text-3xl font-serif text-accent-valor tracking-tight tabular-nums sm:mt-2 shrink-0">AES-256</p>
              </div>
            </motion.div>
          </div>

          {/* Hero Interactive Visualization Widget (Right 5 Cols) - GPU Guarded Animations */}
          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.8, ease: easings.spring }}
              className="bg-surface-elevated/80 dark:bg-black/40 border border-border-strong dark:border-white/10 rounded-3xl p-6 glow-navy backdrop-blur-xl relative overflow-hidden"
            >
              {/* Header inside widget */}
              <div className="flex items-center justify-between pb-4 border-b border-border-subtle dark:border-white/5 mb-4">
                <div className="flex items-center gap-2">
                  <Database size={16} className="text-accent-valor" />
                  <span className="text-xs font-bold font-mono text-text-high dark:text-white tracking-wider">FLOW SYNC ENGINE</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono text-text-disabled dark:text-white/40">Queue Count:</span>
                  <span className="text-xs font-mono font-bold text-accent-valor tabular-nums">{syncCount}</span>
                </div>
              </div>



              {/* Sync Diagram - GPU Guarded with lightweight Framer Motion transitions (no heavy rotates or scales) */}
              <div className="grid grid-cols-7 items-center gap-2 relative bg-surface-base/80 dark:bg-white/[0.02] border border-border-subtle dark:border-white/5 rounded-2xl p-4 mb-6">
                {/* Left Database node */}
                <div className="col-span-2 flex flex-col items-center justify-center p-2 rounded-xl bg-surface-elevated dark:bg-white/5 border border-border-subtle dark:border-white/10 text-center">
                  <Database size={24} className="text-accent-valor mb-1" />
                  <span className="text-[9px] font-bold font-mono text-text-high dark:text-white">SQLite (Local)</span>
                  <span className="text-[8px] text-text-muted dark:text-white/40">Active DB</span>
                </div>

                {/* Animated middle connection - Lightweight packet travel using layout/opacity translations */}
                <div className="col-span-3 flex flex-col items-center justify-center relative py-4">
                  {/* Dashed line */}
                  <div className="w-full h-[1px] border-t border-dashed border-border-subtle dark:border-white/20 absolute top-1/2 -translate-y-1/2" />
                  
                  {/* Moving dot */}
                  <AnimatePresence>
                    {isOnline && (
                      <motion.div
                        key="packet"
                        initial={{ left: "15%" }}
                        animate={{ left: "80%" }}
                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                        className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-accent-valor shadow-[0_0_10px_#c5a855] pointer-events-none select-none"
                      />
                    )}
                  </AnimatePresence>

                  <div className="z-10 bg-surface-elevated dark:bg-[#0c0c0e] px-2 py-0.5 rounded border border-border-subtle dark:border-white/5 text-[8px] font-mono text-text-muted dark:text-white/50 pointer-events-none select-none">
                    {isOnline ? "PowerSync" : "Queueing"}
                  </div>
                </div>

                {/* Right database node */}
                <div className="col-span-2 flex flex-col items-center justify-center p-2 rounded-xl bg-surface-elevated dark:bg-white/5 border border-border-subtle dark:border-white/10 text-center">
                  <Server size={24} className="text-brand-primary mb-1" />
                  <span className="text-[9px] font-bold font-mono text-text-high dark:text-white">Supabase (Cloud)</span>
                  <span className="text-[8px] text-text-muted dark:text-white/40">Central Hub</span>
                </div>
              </div>

              {/* Connection Status Row (Isolated below the diagram to prevent header pulsing) */}
              <div className="flex items-center justify-between mb-6 bg-surface-base/40 dark:bg-white/[0.02] px-3 py-2.5 rounded-xl border border-border-subtle dark:border-white/5 transition-all">
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${isOnline ? "bg-emerald-500 shadow-[0_0_8px_#10b981]" : "bg-amber-500 shadow-[0_0_8px_#f59e0b]"} animate-pulse`} />
                  <span className="text-[10px] font-mono font-bold text-text-high dark:text-white uppercase tracking-wider">
                    {isOnline ? "Online Sync Active" : "Offline Cache Active"}
                  </span>
                </div>
                <div className="flex items-center shrink-0">
                  {isOnline ? (
                    <Wifi size={12} className="text-emerald-500 animate-pulse" />
                  ) : (
                    <WifiOff size={12} className="text-amber-500" />
                  )}
                </div>
              </div>

              {/* Dynamic activity lists inside widget */}
              <div className="space-y-3 h-[220px] overflow-hidden">
                <span className="text-[10px] font-bold font-mono text-text-disabled dark:text-white/30 uppercase tracking-widest block">Local Queue & Synchronization Log</span>
                <AnimatePresence initial={false}>
                  {syncLogs.map((log) => (
                    <motion.div
                      key={log.id}
                      layout
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, y: 15 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center justify-between p-3 rounded-xl bg-surface-base dark:bg-white/[0.02] border border-border-subtle dark:border-white/5"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-surface-elevated dark:bg-white/5 flex items-center justify-center text-accent-valor shrink-0">
                          {log.type === "journal" ? <FileText size={14} /> : 
                           log.type === "program" ? <Briefcase size={14} /> : 
                           log.type === "member" ? <Users size={14} /> : <Activity size={14} />}
                        </div>
                        <span className="text-xs text-text-high dark:text-white/80 line-clamp-1">{log.text}</span>
                      </div>
                      <CheckCircle2 size={14} className="text-emerald-500 shrink-0 ml-2" />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Decorative line patterns - Guarded from interactions */}
              <div className="absolute right-[-20px] bottom-[-20px] w-24 h-24 border border-dashed border-border-subtle dark:border-white/5 rounded-full pointer-events-none select-none" />
            </motion.div>

            {/* Cathedral architectural image card backgdrop - Guarded from interactions */}
            <div className="absolute -z-10 bottom-[-50px] left-[-30px] w-48 h-48 border border-border-subtle dark:border-white/[0.03] rounded-3xl pointer-events-none select-none flex items-center justify-center p-2">
              <div className="w-full h-full border border-dashed border-border-subtle dark:border-white/[0.05] rounded-2xl" />
            </div>
          </div>
        </section>

        {/* Section Divider */}
        <div className="divider-luxury my-12 sm:my-16 lg:my-24" />

        {/* Core Ecosystem Section */}
        <section id="ekosistem" className="mb-16 sm:mb-24 lg:mb-32">
          <div className="max-w-2xl mb-8 sm:mb-12 lg:mb-16">
            <span className="text-[10px] font-bold tracking-widest text-accent-valor uppercase font-mono block mb-2">SYSTEM ARCHITECTURE</span>
            <h2 className="text-3xl sm:text-4xl font-serif text-text-high dark:text-white tracking-tight mb-4">
              Pilar Utama Tata Kelola <span className="font-serif italic font-normal text-luxury-gradient pr-2">FLOW 2.0</span>
            </h2>
            <p className="text-text-muted dark:text-white/50 text-sm md:text-base font-light">
              Arsitektur modular kami dirancang khusus untuk operasional struktural yang dinamis dan pelaporan keuangan yang akuntabel.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <motion.div 
              whileHover={{ y: -8, borderColor: "rgba(197, 168, 85, 0.3)" }}
              transition={{ duration: 0.3, ease: easings.smooth }}
              className="bg-surface-elevated/60 dark:bg-black/20 border border-border-subtle dark:border-white/5 rounded-2xl p-5 glow-gold/5 flex flex-col gap-3.5 transition-colors duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-surface-base dark:bg-white/5 flex items-center justify-center text-accent-valor shrink-0">
                <FileText size={22} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-text-high dark:text-white mb-2">Ledger Finansial</h3>
                <p className="text-text-muted dark:text-white/50 text-xs font-light leading-relaxed">
                  Pencatatan kas masuk & keluar terintegrasi langsung dengan Supabase PostgreSQL melalui transaksi jurnal ganda terenkripsi.
                </p>
              </div>
            </motion.div>

            {/* Card 2 */}
            <motion.div 
              whileHover={{ y: -8, borderColor: "rgba(197, 168, 85, 0.3)" }}
              transition={{ duration: 0.3, ease: easings.smooth }}
              className="bg-surface-elevated/60 dark:bg-black/20 border border-border-subtle dark:border-white/5 rounded-2xl p-5 glow-gold/5 flex flex-col gap-3.5 transition-colors duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-surface-base dark:bg-white/5 flex items-center justify-center text-accent-valor shrink-0">
                <Briefcase size={22} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-text-high dark:text-white mb-2">Manajemen Program</h3>
                <p className="text-text-muted dark:text-white/50 text-xs font-light leading-relaxed">
                  Alokasikan anggaran, ukur indikator kinerja kualitatif/kuantitatif, serta awasi status tinjauan (review) per bidang pelayanan.
                </p>
              </div>
            </motion.div>

            {/* Card 3 */}
            <motion.div 
              whileHover={{ y: -8, borderColor: "rgba(197, 168, 85, 0.3)" }}
              transition={{ duration: 0.3, ease: easings.smooth }}
              className="bg-surface-elevated/60 dark:bg-black/20 border border-border-subtle dark:border-white/5 rounded-2xl p-5 glow-gold/5 flex flex-col gap-3.5 transition-colors duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-surface-base dark:bg-white/5 flex items-center justify-center text-accent-valor shrink-0">
                <Zap size={22} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-text-high dark:text-white mb-2">Offline Resilience</h3>
                <p className="text-text-muted dark:text-white/50 text-xs font-light leading-relaxed">
                  Bekerja tanpa jaringan internet menggunakan database SQLite lokal yang terintegrasi penuh. Data menyinkron otomatis ketika kembali online.
                </p>
              </div>
            </motion.div>

            {/* Card 4 */}
            <motion.div 
              whileHover={{ y: -8, borderColor: "rgba(197, 168, 85, 0.3)" }}
              transition={{ duration: 0.3, ease: easings.smooth }}
              className="bg-surface-elevated/60 dark:bg-black/20 border border-border-subtle dark:border-white/5 rounded-2xl p-5 glow-gold/5 flex flex-col gap-3.5 transition-colors duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-surface-base dark:bg-white/5 flex items-center justify-center text-accent-valor shrink-0">
                <Users size={22} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-text-high dark:text-white mb-2">Struktur Keanggotaan</h3>
                <p className="text-text-muted dark:text-white/50 text-xs font-light leading-relaxed">
                  Kelola keanggotaan bidang, otorisasi staf, serta kepengurusan multi-periode secara berdaulat (Sovereign Role Management).
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Exclusive Feature Focus (Visual Architecture & Details) */}
        <section id="fitur" className="mb-16 sm:mb-24 lg:mb-32 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="relative rounded-3xl overflow-hidden border border-border-subtle dark:border-white/10 glow-navy bg-surface-elevated dark:bg-black/50 aspect-[4/5] sm:aspect-square lg:aspect-auto lg:h-[450px]">
              <img 
                src="/hero_church_architecture.png" 
                alt="Cathedral architectural render generated asset"
                className="w-full h-full object-cover opacity-85 hover:scale-102 transition-transform duration-700 dark:brightness-90" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-elevated dark:from-black via-transparent to-transparent" />
              
              {/* Overlay glass tag */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-surface-elevated/80 dark:bg-black/60 backdrop-blur-md border border-border-subtle dark:border-white/10 z-20">
                <span className="text-[9px] font-bold font-mono tracking-widest text-accent-valor uppercase block mb-1">IMAGE ARTIFACT MOCKUP</span>
                <p className="text-xs text-text-high dark:text-white/80 font-light">Desain antarmuka memadukan prinsip-prinsip geometri arsitektur klasik dengan minimalisme modern.</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 order-1 lg:order-2 flex flex-col justify-center">
            <span className="text-[10px] font-bold tracking-widest text-accent-valor uppercase font-mono block mb-2">EXCLUSIVE HIGHLIGHT</span>
            <h2 className="text-3xl sm:text-4xl font-serif text-text-high dark:text-white tracking-tight mb-6">
              Teknologi Offline-First <br />
              <span className="font-serif italic font-normal text-luxury-gradient pr-2">Tanpa Hambatan Sinkronisasi</span>
            </h2>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full border border-border-subtle dark:border-white/10 flex items-center justify-center text-accent-valor font-mono text-xs shrink-0 mt-0.5">01</div>
                <div>
                  <h4 className="text-sm font-semibold text-text-high dark:text-white mb-1">SQLite Lokal Super Cepat</h4>
                  <p className="text-xs text-text-muted dark:text-white/50 font-light leading-relaxed">
                    Setiap interaksi input jurnal, program baru, atau modifikasi data diproses secara instan di memori perangkat lokal. Sensasi latensi 0ms yang sesungguhnya.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full border border-border-subtle dark:border-white/10 flex items-center justify-center text-accent-valor font-mono text-xs shrink-0 mt-0.5">02</div>
                <div>
                  <h4 className="text-sm font-semibold text-text-high dark:text-white mb-1">PowerSync Realtime Replicator</h4>
                  <p className="text-xs text-text-muted dark:text-white/50 font-light leading-relaxed">
                    Sistem replikator PowerSync melacak perubahan data secara bertahap (incremental) dan mengunggahnya ke Supabase secara otomatis saat koneksi stabil terdeteksi.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full border border-border-subtle dark:border-white/10 flex items-center justify-center text-accent-valor font-mono text-xs shrink-0 mt-0.5">03</div>
                <div>
                  <h4 className="text-sm font-semibold text-text-high dark:text-white mb-1">Resolusi Konflik Cerdas</h4>
                  <p className="text-xs text-text-muted dark:text-white/50 font-light leading-relaxed">
                    Dengan struktur tabel yang dirancang presisi, konflik data tereduksi hingga 99.8%. Memberikan rasa aman penuh bagi bendahara dan pengelola anggaran.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Animated Dashed Horizontal Line - Guarded from interactions */}
        <div className="w-full h-[1px] animate-dashed-line my-12 sm:my-16 opacity-10 dark:opacity-20 pointer-events-none select-none" />

        {/* Interactive Interactive Tabs showcasing UI Features */}
        <section id="demo" className="mb-16 sm:mb-24 lg:mb-32">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 lg:mb-16">
            <span className="text-[10px] font-bold tracking-widest text-accent-valor uppercase font-mono block mb-2">INTERACTIVE DEMONSTRATION</span>
            <h2 className="text-3xl font-serif text-text-high dark:text-white tracking-tight mb-4">
              Jelajahi Antarmuka Pengelolaan
            </h2>
            <p className="text-text-muted dark:text-white/50 text-xs md:text-sm font-light">
              Lihat bagaimana data dikelola secara dinamis di dalam modul-modul utama platform FLOW.
            </p>
          </div>

          <div className="flex justify-center gap-2 mb-8 flex-wrap">
            <button
              onClick={() => setActiveTab("ledger")}
              className={`px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all border ${
                activeTab === "ledger"
                  ? "bg-brand-primary dark:bg-white text-[oklch(0.985_0.005_90)] dark:text-black border-brand-primary dark:border-white"
                  : "bg-transparent text-text-muted dark:text-white/60 border-border-subtle dark:border-white/10 hover:text-text-high dark:hover:text-white hover:bg-surface-elevated/80 dark:hover:bg-white/5"
              }`}
            >
              Ledger Jurnal
            </button>
            <button
              onClick={() => setActiveTab("budget")}
              className={`px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all border ${
                activeTab === "budget"
                  ? "bg-brand-primary dark:bg-white text-[oklch(0.985_0.005_90)] dark:text-black border-brand-primary dark:border-white"
                  : "bg-transparent text-text-muted dark:text-white/60 border-border-subtle dark:border-white/10 hover:text-text-high dark:hover:text-white hover:bg-surface-elevated/80 dark:hover:bg-white/5"
              }`}
            >
              Program Kerja
            </button>
            <button
              onClick={() => setActiveTab("members")}
              className={`px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all border ${
                activeTab === "members"
                  ? "bg-brand-primary dark:bg-white text-[oklch(0.985_0.005_90)] dark:text-black border-brand-primary dark:border-white"
                  : "bg-transparent text-text-muted dark:text-white/60 border-border-subtle dark:border-white/10 hover:text-text-high dark:hover:text-white hover:bg-surface-elevated/80 dark:hover:bg-white/5"
              }`}
            >
              Tata Pengurus
            </button>
          </div>

          <div className="bg-surface-elevated/80 dark:bg-black/50 border border-border-strong dark:border-white/10 rounded-3xl p-4 sm:p-6 md:p-8 max-w-4xl mx-auto glow-navy backdrop-blur-xl relative min-h-[300px]">
            <AnimatePresence mode="wait">
              {activeTab === "ledger" && (
                <motion.div
                  key="ledger-tab"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="flex justify-between items-center pb-4 border-b border-border-subtle dark:border-white/5">
                    <div>
                      <h4 className="text-base font-semibold text-text-high dark:text-white font-serif">Simulasi Jurnal Kas</h4>
                      <p className="text-xs text-text-muted dark:text-white/40">Visualisasi transaksi kas ganda double-entry</p>
                    </div>
                    <span className="text-[10px] font-mono text-accent-valor px-2 py-0.5 rounded border border-accent-valor/30 bg-accent-valor/5">Ledger Live</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono">
                      <thead>
                        <tr className="border-b border-border-subtle dark:border-white/5 text-text-disabled dark:text-white/40">
                          <th className="py-2">No. Referensi</th>
                          <th className="py-2">Keterangan</th>
                          <th className="py-2 text-right">Debit</th>
                          <th className="py-2 text-right">Kredit</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border-subtle dark:divide-white/5 text-text-high dark:text-white/80">
                        <tr>
                          <td className="py-3 text-accent-valor">REF-2026-0092</td>
                          <td className="py-3">Penerimaan Persembahan Ibadah Raya</td>
                          <td className="py-3 text-right text-emerald-600 dark:text-emerald-400">Rp 12,500,000</td>
                          <td className="py-3 text-right">Rp 0</td>
                        </tr>
                        <tr>
                          <td className="py-3 text-accent-valor">REF-2026-0093</td>
                          <td className="py-3">Pengeluaran Logistik Bidang Pelkes</td>
                          <td className="py-3 text-right">Rp 0</td>
                          <td className="py-3 text-right text-red-600 dark:text-red-400">Rp 3,450,000</td>
                        </tr>
                        <tr>
                          <td className="py-3 text-accent-valor">REF-2026-0094</td>
                          <td className="py-3">Penerimaan Donasi Pembangunan</td>
                          <td className="py-3 text-right text-emerald-600 dark:text-emerald-400">Rp 25,000,000</td>
                          <td className="py-3 text-right">Rp 0</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              {activeTab === "budget" && (
                <motion.div
                  key="budget-tab"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="flex justify-between items-center pb-4 border-b border-border-subtle dark:border-white/5">
                    <div>
                      <h4 className="text-base font-semibold text-text-high dark:text-white font-serif">Simulasi Rencana Anggaran Program</h4>
                      <p className="text-xs text-text-muted dark:text-white/40">Pengawasan budget dan realisasi program</p>
                    </div>
                    <span className="text-[10px] font-mono text-accent-valor px-2 py-0.5 rounded border border-accent-valor/30 bg-accent-valor/5">Program Live</span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs mb-1.5 font-mono">
                        <span className="text-text-high dark:text-white/80">Bidang Pelkes - Program Pengobatan Gratis</span>
                        <span className="text-accent-valor">74% Terpakai (Realisasi)</span>
                      </div>
                      <div className="w-full bg-border-subtle dark:bg-white/5 h-2 rounded-full overflow-hidden">
                        <div className="bg-accent-valor h-full rounded-full" style={{ width: "74%" }} />
                      </div>
                      <div className="flex justify-between text-[10px] text-text-disabled dark:text-white/40 font-mono mt-1">
                        <span>Plafon: Rp 15,000,000</span>
                        <span>Realisasi: Rp 11,100,000</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1.5 font-mono">
                        <span className="text-text-high dark:text-white/80">Bidang Pembinaan - Kursus Kepemimpinan Pemuda</span>
                        <span className="text-emerald-600 dark:text-emerald-400">30% Terpakai (Realisasi)</span>
                      </div>
                      <div className="w-full bg-border-subtle dark:bg-white/5 h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-50 dark:bg-emerald-400 h-full rounded-full" style={{ width: "30%" }} />
                      </div>
                      <div className="flex justify-between text-[10px] text-text-disabled dark:text-white/40 font-mono mt-1">
                        <span>Plafon: Rp 8,000,000</span>
                        <span>Realisasi: Rp 2,400,000</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "members" && (
                <motion.div
                  key="members-tab"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="flex justify-between items-center pb-4 border-b border-border-subtle dark:border-white/5">
                    <div>
                      <h4 className="text-base font-semibold text-text-high dark:text-white font-serif">Tata Otoritas & Keanggotaan</h4>
                      <p className="text-xs text-text-muted dark:text-white/40">Multi-period dynamic role mapping</p>
                    </div>
                    <span className="text-[10px] font-mono text-accent-valor px-2 py-0.5 rounded border border-accent-valor/30 bg-accent-valor/5">Roles Live</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
                    <div className="p-3 bg-surface-base dark:bg-white/5 border border-border-subtle dark:border-white/5 rounded-2xl text-center">
                      <span className="text-[9px] text-text-disabled dark:text-white/40 block mb-1">SYSTEM_OWNER</span>
                      <p className="text-xs text-text-high dark:text-white font-semibold mb-1">Pemilik Sistem Utama</p>
                      <p className="text-[9px] text-accent-valor">Full Database Read/Write</p>
                    </div>
                    <div className="p-3 bg-surface-base dark:bg-white/5 border border-border-subtle dark:border-white/5 rounded-2xl text-center">
                      <span className="text-[9px] text-text-disabled dark:text-white/40 block mb-1">BENDAHARA_UMUM</span>
                      <p className="text-xs text-text-high dark:text-white font-semibold mb-1">Otoritas Ledger Kas</p>
                      <p className="text-[9px] text-accent-valor">Journal posting & reporting</p>
                    </div>
                    <div className="p-3 bg-surface-base dark:bg-white/5 border border-border-subtle dark:border-white/5 rounded-2xl text-center">
                      <span className="text-[9px] text-text-disabled dark:text-white/40 block mb-1">STAF_PELAYANAN</span>
                      <p className="text-xs text-text-high dark:text-white font-semibold mb-1">Manajer Program</p>
                      <p className="text-[9px] text-accent-valor">Draft programs & indicators</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* CTA Footer Section */}
        <section id="gabung" className="text-center max-w-3xl mx-auto border border-border-strong dark:border-white/10 rounded-3xl p-6 sm:p-10 md:p-16 glow-gold bg-surface-elevated/80 dark:bg-black/40 relative overflow-hidden">
          <div className="absolute top-[-20%] left-[-20%] w-[40%] h-[40%] rounded-full bg-accent-valor opacity-10 blur-3xl pointer-events-none select-none" />
          
          <span className="text-[10px] font-bold tracking-widest text-accent-valor uppercase font-mono block mb-3">GET STARTED TODAY</span>
          <h2 className="text-3xl sm:text-4xl font-serif text-text-high dark:text-white tracking-tight mb-6">
            Siap Mengorkestrasi <br />
            <span className="font-serif italic font-normal text-luxury-gradient pr-3">Stewardship Gereja Anda?</span>
          </h2>
          <p className="text-text-muted dark:text-white/50 text-sm font-light max-w-lg mx-auto mb-10">
            Dapatkan kontrol penuh atas rencana anggaran kerja dan laporan keuangan secara transparan, aman, dan bekerja penuh dalam kondisi offline sekalipun.
          </p>

          <Link 
            href="/auth/login"
            className="inline-flex items-center gap-3 bg-brand-primary dark:bg-white text-[oklch(0.985_0.005_90)] dark:text-black hover:opacity-90 font-semibold text-sm px-10 py-4.5 rounded-2xl shadow-lg active:scale-95 transition-all group"
          >
            Masuk Portal FLOW 2.0 <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </section>

        {/* Fine Footer */}
        <footer className="mt-12 sm:mt-16 pt-6 border-t border-border-subtle dark:border-white/5 text-center text-text-disabled dark:text-white/30 text-xs flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-text-high dark:text-white tracking-wide">FLOW</span>
            <span className="text-[9px] text-accent-valor font-mono">PROJECT 2.0</span>
          </div>
          <p className="font-light">© 2026 FLOW Platform. All rights reserved. Sovereign Digital Stewardship.</p>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-text-muted hover:text-accent-valor font-mono text-[10px] tracking-wider uppercase transition-colors cursor-pointer"
          >
            Kembali ke Atas ↑
          </button>
        </footer>

      </div>

      {/* Elegant Mobile Scroll Indicator - Amanloka aesthetic */}
      <AnimatePresence>
        {mounted && showScrollIndicator && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.4 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 sm:hidden pointer-events-none select-none"
          >
            <div className="flex flex-col items-center gap-2">
              <span className="text-[8px] font-bold tracking-[0.25em] text-accent-valor/70 uppercase font-mono animate-pulse">SCROLL</span>
              <div className="w-[18px] h-7 rounded-full border border-border-subtle dark:border-white/10 flex justify-center p-1 bg-surface-elevated/40 dark:bg-black/30 backdrop-blur-sm shadow-sm">
                <motion.div 
                  animate={{ 
                    y: [0, 10, 0],
                    opacity: [0.3, 1, 0.3]
                  }}
                  transition={{ 
                    duration: 1.8, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                  className="w-1.5 h-1.5 rounded-full bg-accent-valor"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Vertical Section Dots Indicator */}
      <div className="fixed right-3 sm:right-6 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-4 pointer-events-auto">
        {mounted && [
          { id: "hero", label: "Intro" },
          { id: "ekosistem", label: "System" },
          { id: "fitur", label: "Tech" },
          { id: "demo", label: "Demo" },
          { id: "gabung", label: "Start" }
        ].map((sec) => (
          <button
            key={sec.id}
            onClick={() => handleScrollToId(sec.id)}
            className="group flex items-center justify-end gap-2 bg-transparent border-0 p-1 cursor-pointer focus:outline-none"
            title={sec.label}
          >
            <span className={`text-[8px] font-bold font-mono tracking-widest text-accent-valor uppercase transition-all duration-300 opacity-0 group-hover:opacity-100 hidden md:inline ${
              activeSection === sec.id ? "md:opacity-100 scale-100" : "scale-95"
            }`}>
              {sec.label}
            </span>
            <div className={`w-2 h-2 rounded-full border transition-all duration-300 ${
              activeSection === sec.id 
                ? "bg-accent-valor border-accent-valor scale-125 shadow-[0_0_8px_#c5a855]" 
                : "bg-surface-elevated/80 dark:bg-black/40 border-border-strong dark:border-white/10 group-hover:border-accent-valor/60"
            }`} />
          </button>
        ))}
      </div>
    </div>
  );
};
