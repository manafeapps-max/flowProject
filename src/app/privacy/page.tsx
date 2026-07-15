"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="bg-[oklch(0.985_0.005_90)] dark:bg-[#050505] text-text-high dark:text-[#e0e0e0] min-h-screen relative overflow-hidden font-sans transition-colors duration-300">
      {/* Decorative background orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[oklch(0.25_0.06_260)] opacity-5 dark:opacity-20 blur-[120px] pointer-events-none select-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-[oklch(0.75_0.14_85)] opacity-5 dark:opacity-10 blur-[120px] pointer-events-none select-none z-0" />

      {/* Main Container */}
      <div className="max-w-3xl mx-auto px-6 pt-24 pb-16 relative z-10">
        {/* Back Link */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-all py-2 px-3.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/5 backdrop-blur-sm shadow-sm active:scale-95 mb-10 cursor-pointer"
        >
          <ArrowLeft size={14} />
          Kembali ke Beranda
        </Link>

        {/* Title */}
        <div className="border-b border-border-subtle dark:border-white/10 pb-6 mb-8">
          <span className="text-[10px] font-bold tracking-widest text-accent-valor uppercase font-mono block mb-2">PRIVACY POLICY</span>
          <h1 className="text-3xl sm:text-4xl font-serif text-text-high dark:text-white tracking-tight">
            Kebijakan Privasi
          </h1>
          <p className="text-xs text-text-muted dark:text-white/40 font-mono mt-2">Terakhir diperbarui: 15 Juli 2026</p>
        </div>

        {/* Contents */}
        <div className="space-y-8 text-sm text-text-muted dark:text-white/70 font-light leading-relaxed">
          <section>
            <h2 className="text-base font-semibold text-text-high dark:text-white mb-3">1. Kebijakan Privasi FLOW</h2>
            <p>
              Kebijakan Privasi ini menjelaskan bagaimana platform FLOW mengelola, memproses, dan melindungi informasi yang diinput ke dalam platform kami untuk mematuhi kedaulatan data gereja secara utuh.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-text-high dark:text-white mb-3">2. Pengumpulan Data Lokal & Keamanan</h2>
            <p>
              FLOW beroperasi secara offline-first. Semua data yang diinput (seperti jurnal ledger, nominal kas, program pelayanan, dan daftar pengurus) disimpan terlebih dahulu secara lokal di memori perangkat Anda menggunakan basis data terenkripsi. Sinkronisasi data ke cloud (Supabase) terenkripsi secara ketat menggunakan protokol transfer SSL/TLS untuk menjamin kerahasiaan penuh.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-text-high dark:text-white mb-3">3. Pemanfaatan Data</h2>
            <p>
              FLOW <strong>tidak pernah</strong> menyebarkan, membagikan, memindahkan, atau menjual data apa pun kepada pihak ketiga. Seluruh informasi keuangan dan keanggotaan murni digunakan untuk visualisasi pelaporan keuangan internal institusi gereja Anda.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-text-high dark:text-white mb-3">4. Hak Pengguna atas Data</h2>
            <p>
              Administrator sistem di gereja Anda memiliki hak penuh untuk mengakses, memodifikasi, mengekspor (mengunduh), dan menghapus catatan data apa pun dari basis data pusat (Supabase) secara mandiri kapan saja.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-text-high dark:text-white mb-3">5. Hubungi Kami</h2>
            <p>
              Jika Anda memiliki pertanyaan mengenai tata kelola kedaulatan data dan kepatuhan privasi platform kami, silakan menghubungi administrator IT utama gereja Anda atau melalui kontak support pengelola FLOW Project.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="border-t border-border-subtle dark:border-white/10 mt-12 pt-8 text-center">
          <div className="flex flex-col items-center gap-1">
            <span className="font-serif font-bold text-base text-text-high dark:text-white">FLOW</span>
            <span className="text-[8px] text-accent-valor font-mono tracking-widest font-extrabold uppercase">PROJECT 2.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}
