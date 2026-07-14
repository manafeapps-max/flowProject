export interface Period {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  is_active: number; // SQLite integer 0/1
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface Bidang {
  id: string;
  period_id: string;
  name: string;
  code: string;
  description?: string | null;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface OrganizationUnit {
  id: string;
  period_id: string;
  bidang_id?: string | null;
  name: string;
  parent_id?: string | null;
  description?: string | null;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface Membership {
  id: string;
  user_id: string;
  period_id: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface Position {
  id: string;
  membership_id: string;
  unit_id: string;
  period_id: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface Member {
  id: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  status: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface UnitMember {
  id: string;
  member_id: string;
  unit_id: string;
  unit_type: string;
  role_title?: string | null;
  period_id: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: 'SYSTEM_OWNER' | 'SUPER_ADMIN' | 'ADMIN' | 'STAFF' | 'BENDAHARA' | 'AUDITOR' | 'USER' | 'PUBLIC';
  period_id: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface TypeProgram {
  id: string;
  name: string;
  description?: string | null;
  is_active: number; // SQLite integer 0/1
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface Program {
  id: string;
  period_id: string;
  name: string;
  status: 'DRAFT' | 'UNDER_REVIEW' | 'PROPOSED' | 'APPROVED' | 'REJECTED';
  pjp_bidang_id: string;
  pic_membership_id: string;
  type_program_id?: string | null;
  bidang_id?: string | null;
  sub_bidang_id?: string | null;
  anggaran_penerimaan?: number;
  anggaran_pengeluaran?: number;
  program_code?: string | null;
  tujuan_program?: string | null;
  tahun_anggaran?: string | null;
  bulan?: number | null;
  frekuensi?: number;
  lokasi?: string | null;
  deskripsi?: string | null;
  ik_kualitatif?: string | null;
  catatan_anggaran?: string | null;
  waktu?: string | null;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface ProgramResponsibilityPP {
  id: string;
  program_id: string;
  bidang_id: string;
  period_id: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface ProgramIndicator {
  id: string;
  program_id: string;
  type: 'KUALITATIF' | 'KUANTITATIF';
  indicator_text: string;
  target?: number | null;
  realization?: number | null;
  unit?: string | null;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface Occasion {
  id: string;
  period_id: string;
  title: string;
  date: string;
  description?: string | null;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface Coa {
  id: string;
  period_id: string;
  code: string;
  name: string;
  type: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface AnggaranProgram {
  id: string;
  program_id: string;
  jenis_anggaran: 'PENERIMAAN' | 'PENGELUARAN';
  nama_anggaran: string;
  volume: number;
  satuan?: string | null;
  harga_satuan: number;
  sumber_harga?: 'MANUAL' | 'STANDARD';
  frekuensi_pelaksanaan: number;
  sumber_dana?: string | null;
  catatan?: string | null;
  coa_id?: string | null;
  coa_manual?: string | null;
  sub_total?: number; // Read-only from schema (postgres generated)
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface Journal {
  id: string;
  period_id: string;
  reference_no: string;
  status?: 'DRAFT' | 'POSTED';
  date: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface JournalLine {
  id: string;
  journal_id: string;
  period_id: string;
  coa_id?: string | null;
  debit?: number;
  credit?: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}
