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
  bidang_id?: string; // Links unit directly to a Bidang
  name: string;
  parent_id: string | null;
  description?: string;
  sync_status: 'SYNCED' | 'PENDING' | 'ERROR';
}

export interface Bidang {
  id: string;
  period_id: string;
  name: string;
  code: string;
  description?: string;
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
  pjp_bidang_id: string;
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

export interface Member {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  status: string;
  sync_status: 'SYNCED' | 'PENDING' | 'ERROR';
}

export interface UnitMember {
  id: string;
  member_id: string;
  unit_id: string;
  unit_type: 'BIDANG' | 'SUB_BIDANG' | 'UNIT';
  role_title?: string;
  period_id: string;
  sync_status: 'SYNCED' | 'PENDING' | 'ERROR';
}

export interface UserRole {
  id: string;
  user_id: string;
  role: 'SYSTEM_OWNER' | 'SUPER_ADMIN' | 'ADMIN' | 'STAFF' | 'BENDAHARA' | 'AUDITOR' | 'USER';
  period_id: string;
  sync_status: 'SYNCED' | 'PENDING' | 'ERROR';
}

export interface UserProfile {
  id: string;
  email: string;
  sync_status: 'SYNCED' | 'PENDING' | 'ERROR';
}

export interface ProgramResponsibilityPP {
  id: string;
  program_id: string;
  bidang_id: string;
  period_id: string;
  sync_status: 'SYNCED' | 'PENDING' | 'ERROR';
}

export interface DeletedRecord {
  id: string;
  table_name: string;
  sync_status: 'PENDING' | 'ERROR';
}

export interface Occasion {
  id: string;
  period_id: string;
  title: string;
  date: string;
  description?: string;
  sync_status: 'SYNCED' | 'PENDING' | 'ERROR';
}

export class CMPDatabase extends Dexie {
  periods!: Table<Period, string>;
  organization_units!: Table<OrganizationUnit, string>;
  programs!: Table<Program, string>;
  journals!: Table<Journal, string>;
  anggaran_program!: Table<AnggaranProgram, string>;
  type_program!: Table<TypeProgram, string>;
  bidang!: Table<Bidang, string>;
  deleted_records!: Table<DeletedRecord, string>;
  members!: Table<Member, string>;
  unit_members!: Table<UnitMember, string>;
  user_roles!: Table<UserRole, string>;
  user_profiles!: Table<UserProfile, string>;
  program_responsibility_pp!: Table<ProgramResponsibilityPP, string>;
  occasions!: Table<Occasion, string>;

  constructor() {
    super('CMPDatabase');
    
    // Version 1 (Original)
    this.version(1).stores({
      periods: 'id, is_active, sync_status',
      organization_units: 'id, period_id, parent_id, sync_status',
      programs: 'id, period_id, status, sync_status',
      journals: 'id, period_id, status, sync_status',
      anggaran_program: 'id, program_id, jenis_anggaran, sync_status',
      type_program: 'id, sync_status',
      bidang: 'id, period_id, sync_status',
      sub_bidang: 'id, period_id, bidang_id, sync_status',
    });

    // Version 2 (Added deleted_records for offline tombstones)
    this.version(2).stores({
      periods: 'id, is_active, sync_status',
      organization_units: 'id, period_id, parent_id, sync_status',
      programs: 'id, period_id, status, sync_status',
      journals: 'id, period_id, status, sync_status',
      anggaran_program: 'id, program_id, jenis_anggaran, sync_status',
      type_program: 'id, sync_status',
      bidang: 'id, period_id, sync_status',
      sub_bidang: 'id, period_id, bidang_id, sync_status',
      deleted_records: 'id, table_name, sync_status'
    });

    // Version 3 (Added members and unit_members)
    this.version(3).stores({
      periods: 'id, is_active, sync_status',
      organization_units: 'id, period_id, parent_id, sync_status',
      programs: 'id, period_id, status, sync_status',
      journals: 'id, period_id, status, sync_status',
      anggaran_program: 'id, program_id, jenis_anggaran, sync_status',
      type_program: 'id, sync_status',
      bidang: 'id, period_id, sync_status',
      sub_bidang: 'id, period_id, bidang_id, sync_status',
      deleted_records: 'id, table_name, sync_status',
      members: 'id, status, sync_status',
      unit_members: 'id, member_id, unit_id, unit_type, period_id, sync_status'
    });

    // Version 4 (Consolidated sub_bidang into organization_units)
    this.version(4).stores({
      periods: 'id, is_active, sync_status',
      organization_units: 'id, period_id, bidang_id, parent_id, sync_status',
      programs: 'id, period_id, status, sync_status',
      journals: 'id, period_id, status, sync_status',
      anggaran_program: 'id, program_id, jenis_anggaran, sync_status',
      type_program: 'id, sync_status',
      bidang: 'id, period_id, sync_status',
      deleted_records: 'id, table_name, sync_status',
      members: 'id, status, sync_status',
      unit_members: 'id, member_id, unit_id, unit_type, period_id, sync_status'
    });

    // Version 5 (Added user_roles and user_profiles stores)
    this.version(5).stores({
      periods: 'id, is_active, sync_status',
      organization_units: 'id, period_id, bidang_id, parent_id, sync_status',
      programs: 'id, period_id, status, sync_status',
      journals: 'id, period_id, status, sync_status',
      anggaran_program: 'id, program_id, jenis_anggaran, sync_status',
      type_program: 'id, sync_status',
      bidang: 'id, period_id, sync_status',
      deleted_records: 'id, table_name, sync_status',
      members: 'id, status, sync_status',
      unit_members: 'id, member_id, unit_id, unit_type, period_id, sync_status',
      user_roles: 'id, user_id, role, period_id, sync_status',
      user_profiles: 'id, email, sync_status'
    });

    // Version 6 (Add email index on members)
    this.version(6).stores({
      periods: 'id, is_active, sync_status',
      organization_units: 'id, period_id, bidang_id, parent_id, sync_status',
      programs: 'id, period_id, status, sync_status',
      journals: 'id, period_id, status, sync_status',
      anggaran_program: 'id, program_id, jenis_anggaran, sync_status',
      type_program: 'id, sync_status',
      bidang: 'id, period_id, sync_status',
      deleted_records: 'id, table_name, sync_status',
      members: 'id, email, status, sync_status',
      unit_members: 'id, member_id, unit_id, unit_type, period_id, sync_status',
      user_roles: 'id, user_id, role, period_id, sync_status',
      user_profiles: 'id, email, sync_status'
    });

    // Version 7 (Added program_responsibility_pp store)
    this.version(7).stores({
      periods: 'id, is_active, sync_status',
      organization_units: 'id, period_id, bidang_id, parent_id, sync_status',
      programs: 'id, period_id, status, sync_status',
      journals: 'id, period_id, status, sync_status',
      anggaran_program: 'id, program_id, jenis_anggaran, sync_status',
      type_program: 'id, sync_status',
      bidang: 'id, period_id, sync_status',
      deleted_records: 'id, table_name, sync_status',
      members: 'id, email, status, sync_status',
      unit_members: 'id, member_id, unit_id, unit_type, period_id, sync_status',
      user_roles: 'id, user_id, role, period_id, sync_status',
      user_profiles: 'id, email, sync_status',
      program_responsibility_pp: 'id, program_id, bidang_id, period_id, sync_status'
    });

    // Version 8 (Added occasions store)
    this.version(8).stores({
      periods: 'id, is_active, sync_status',
      organization_units: 'id, period_id, bidang_id, parent_id, sync_status',
      programs: 'id, period_id, status, sync_status',
      journals: 'id, period_id, status, sync_status',
      anggaran_program: 'id, program_id, jenis_anggaran, sync_status',
      type_program: 'id, sync_status',
      bidang: 'id, period_id, sync_status',
      deleted_records: 'id, table_name, sync_status',
      members: 'id, email, status, sync_status',
      unit_members: 'id, member_id, unit_id, unit_type, period_id, sync_status',
      user_roles: 'id, user_id, role, period_id, sync_status',
      user_profiles: 'id, email, sync_status',
      program_responsibility_pp: 'id, program_id, bidang_id, period_id, sync_status',
      occasions: 'id, period_id, date, sync_status'
    });
  }
}

export const db = new CMPDatabase();
