"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
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
          <span className="text-[10px] font-bold tracking-widest text-accent-valor uppercase font-mono block mb-2">PROJECT DOCUMENTATION</span>
          <h1 className="text-3xl sm:text-4xl font-serif text-text-high dark:text-white tracking-tight">
            Ketentuan Umum & Layanan
          </h1>
          <p className="text-xs text-text-muted dark:text-white/40 font-mono mt-2">Terakhir diperbarui: 15 Juli 2026</p>
        </div>

        {/* Contents */}
        <div className="space-y-8 text-sm text-text-muted dark:text-white/70 font-light leading-relaxed">
          <section>
            <h2 className="text-base font-semibold text-text-high dark:text-white mb-3">1. Penerimaan Ketentuan</h2>
            <p>
              Dengan mengakses dan menggunakan platform FLOW Project 2.0 (selanjutnya disebut "Layanan"), Anda menyatakan setuju untuk terikat oleh Ketentuan Umum ini. Jika Anda tidak menyetujui bagian mana pun dari ketentuan ini, Anda tidak diperkenankan menggunakan Layanan kami.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-text-high dark:text-white mb-3">2. Lisensi Penggunaan & Kedaulatan Data</h2>
            <p>
              Kami menjunjung tinggi prinsip <strong>Sovereign Digital Stewardship</strong>. Seluruh data keuangan, jurnal kas, data keanggotaan jemaat, dan program kerja gereja yang diinput ke dalam sistem sepenuhnya merupakan milik mutlak institusi gereja Anda. FLOW bertindak murni sebagai penyedia infrastruktur sinkronisasi offline-first.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-text-high dark:text-white mb-3">3. Akun dan Keamanan</h2>
            <p>
              Pengguna bertanggung jawab untuk menjaga kerahasiaan kredensial akun mereka (email dan password). Penggunaan enkripsi tingkat perangkat lokal (AES-256) menjamin keamanan data dalam kondisi luring, namun pengguna wajib memastikan akses fisik ke perangkat terkelola dengan aman.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-text-high dark:text-white mb-3">4. Batasan Tanggung Jawab</h2>
            <p>
              Layanan disediakan "sebagaimana adanya" (as is) tanpa jaminan apa pun, baik tersurat maupun tersirat. FLOW tidak bertanggung jawab atas kegagalan sinkronisasi yang disebabkan oleh gangguan jaringan ekstrem atau kerusakan perangkat keras lokal sebelum data terunggah sepenuhnya ke server pusat.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-text-high dark:text-white mb-3">5. Perubahan Ketentuan</h2>
            <p>
              Kami dapat merevisi Ketentuan Umum ini dari waktu ke waktu. Versi terbaru akan selalu tersedia di halaman ini. Dengan terus mengakses Layanan setelah perubahan berlaku, Anda menyetujui ketentuan yang diperbarui.
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
