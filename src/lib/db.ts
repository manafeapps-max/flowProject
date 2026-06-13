import Dexie, { Table } from 'dexie';

export interface Period {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  sync_status: 'SYNCED' | 'PENDING' | 'ERROR';
}

export interface OrganizationUnit {
  id: string;
  period_id: string;
  name: string;
  parent_id: string | null;
  sync_status: 'SYNCED' | 'PENDING' | 'ERROR';
}

export interface TypeProgram {
  id: string;
  name: string;
  description?: string;
  is_active: boolean;
  sort_order: number;
  sync_status: 'SYNCED' | 'PENDING' | 'ERROR';
}

export interface Program {
  id: string;
  period_id: string;
  name: string;
  status: 'DRAFT' | 'UNDER_REVIEW' | 'PROPOSED' | 'APPROVED' | 'REJECTED';
  pjp_unit_id: string;
  pic_membership_id: string;
  type_program_id?: string;
  bidang_id?: string;
  sub_bidang_id?: string;
  anggaran_penerimaan?: number;
  anggaran_pengeluaran?: number;
  sync_status: 'SYNCED' | 'PENDING' | 'ERROR';
  // Detailed metadata
  program_code?: string;
  tujuan_program?: string;
  tahun_anggaran?: string;
  triwulan?: string;
  bulan?: number;
  frekuensi?: number;
  lokasi?: string;
  deskripsi?: string;
  ik_kualitatif?: string;
  catatan_anggaran?: string;
  waktu?: string;
}

export interface Journal {
  id: string;
  period_id: string;
  reference_no: string;
  status: 'DRAFT' | 'POSTED';
  date: string;
  sync_status: 'SYNCED' | 'PENDING' | 'ERROR';
}

export interface AnggaranProgram {
  id: string;
  program_id: string;
  jenis_anggaran: 'PENERIMAAN' | 'PENGELUARAN';
  nama_anggaran: string;
  volume: number;
  satuan?: string;
  harga_satuan: number;
  sumber_harga: 'MANUAL' | 'STANDARD';
  frekuensi_pelaksanaan: number;
  sumber_dana?: string;
  catatan?: string;
  coa_id?: string;
  coa_manual?: string;
  sub_total: number;
  sync_status: 'SYNCED' | 'PENDING' | 'ERROR';
}

export class CMPDatabase extends Dexie {
  periods!: Table<Period, string>;
  organization_units!: Table<OrganizationUnit, string>;
  programs!: Table<Program, string>;
  journals!: Table<Journal, string>;
  anggaran_program!: Table<AnggaranProgram, string>;
  type_program!: Table<TypeProgram, string>;

  constructor() {
    super('CMPDatabase');
    this.version(1).stores({
      periods: 'id, is_active, sync_status',
      organization_units: 'id, period_id, parent_id, sync_status',
      programs: 'id, period_id, status, sync_status',
      journals: 'id, period_id, status, sync_status',
      anggaran_program: 'id, program_id, jenis_anggaran, sync_status',
      type_program: 'id, sync_status',
    });
  }
}

export const db = new CMPDatabase();
