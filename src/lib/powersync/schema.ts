import { column, Schema, Table } from '@powersync/web';

const periods = new Table({
  name: column.text,
  start_date: column.text,
  end_date: column.text,
  is_active: column.integer,
  created_at: column.text,
  updated_at: column.text,
  deleted_at: column.text,
}, { indexes: {} });

const bidang = new Table({
  period_id: column.text,
  name: column.text,
  code: column.text,
  description: column.text,
  created_at: column.text,
  updated_at: column.text,
  deleted_at: column.text,
}, {
  indexes: {
    period: ['period_id'],
  }
});

const organizationUnits = new Table({
  period_id: column.text,
  bidang_id: column.text,
  name: column.text,
  parent_id: column.text,
  description: column.text,
  created_at: column.text,
  updated_at: column.text,
  deleted_at: column.text,
}, {
  indexes: {
    period: ['period_id'],
    bidang: ['bidang_id'],
    parent: ['parent_id'],
  }
});

const memberships = new Table({
  user_id: column.text,
  period_id: column.text,
  created_at: column.text,
  updated_at: column.text,
  deleted_at: column.text,
}, {
  indexes: {
    user_period: ['user_id', 'period_id'],
  }
});

const positions = new Table({
  membership_id: column.text,
  unit_id: column.text,
  period_id: column.text,
  created_at: column.text,
  updated_at: column.text,
  deleted_at: column.text,
}, {
  indexes: {
    membership: ['membership_id'],
    unit: ['unit_id'],
    period: ['period_id'],
  }
});

const members = new Table({
  name: column.text,
  phone: column.text,
  email: column.text,
  status: column.text,
  created_at: column.text,
  updated_at: column.text,
  deleted_at: column.text,
}, {
  indexes: {
    email: ['email'],
  }
});

const unitMembers = new Table({
  member_id: column.text,
  unit_id: column.text,
  unit_type: column.text,
  role_title: column.text,
  period_id: column.text,
  created_at: column.text,
  updated_at: column.text,
  deleted_at: column.text,
}, {
  indexes: {
    member: ['member_id'],
    unit: ['unit_id'],
    period: ['period_id'],
  }
});

const userRole = new Table({
  user_id: column.text,
  role: column.text,
  period_id: column.text,
  created_at: column.text,
  updated_at: column.text,
  deleted_at: column.text,
}, {
  indexes: {
    user_period: ['user_id', 'period_id'],
  }
});

const typeProgram = new Table({
  name: column.text,
  description: column.text,
  is_active: column.integer,
  sort_order: column.integer,
  created_at: column.text,
  updated_at: column.text,
  deleted_at: column.text,
}, { indexes: {} });

const programs = new Table({
  period_id: column.text,
  name: column.text,
  status: column.text,
  pjp_bidang_id: column.text,
  pic_membership_id: column.text,
  type_program_id: column.text,
  bidang_id: column.text,
  sub_bidang_id: column.text,
  anggaran_penerimaan: column.real,
  anggaran_pengeluaran: column.real,
  program_code: column.text,
  tujuan_program: column.text,
  tahun_anggaran: column.text,
  bulan: column.integer,
  frekuensi: column.integer,
  lokasi: column.text,
  deskripsi: column.text,
  ik_kualitatif: column.text,
  catatan_anggaran: column.text,
  waktu: column.text,
  created_at: column.text,
  updated_at: column.text,
  deleted_at: column.text,
}, {
  indexes: {
    period: ['period_id'],
    pjp_bidang: ['pjp_bidang_id'],
    pic_membership: ['pic_membership_id'],
    type_program: ['type_program_id'],
    bidang: ['bidang_id'],
    sub_bidang: ['sub_bidang_id'],
  }
});

const programResponsibilityPp = new Table({
  program_id: column.text,
  bidang_id: column.text,
  period_id: column.text,
  created_at: column.text,
  updated_at: column.text,
  deleted_at: column.text,
}, {
  indexes: {
    program: ['program_id'],
    bidang: ['bidang_id'],
    period: ['period_id'],
  }
});

const programIndicators = new Table({
  program_id: column.text,
  type: column.text,
  indicator_text: column.text,
  target: column.real,
  realization: column.real,
  unit: column.text,
  created_at: column.text,
  updated_at: column.text,
  deleted_at: column.text,
}, {
  indexes: {
    program: ['program_id'],
  }
});

const occasions = new Table({
  period_id: column.text,
  title: column.text,
  date: column.text,
  description: column.text,
  created_at: column.text,
  updated_at: column.text,
  deleted_at: column.text,
}, {
  indexes: {
    period: ['period_id'],
  }
});

const coa = new Table({
  period_id: column.text,
  code: column.text,
  name: column.text,
  type: column.text,
  created_at: column.text,
  updated_at: column.text,
  deleted_at: column.text,
}, {
  indexes: {
    period: ['period_id'],
    code_period: ['code', 'period_id'],
  }
});

const anggaranProgram = new Table({
  program_id: column.text,
  jenis_anggaran: column.text,
  nama_anggaran: column.text,
  volume: column.real,
  satuan: column.text,
  harga_satuan: column.real,
  sumber_harga: column.text,
  frekuensi_pelaksanaan: column.integer,
  sumber_dana: column.text,
  catatan: column.text,
  coa_id: column.text,
  coa_manual: column.text,
  sub_total: column.real,
  created_at: column.text,
  updated_at: column.text,
  deleted_at: column.text,
}, {
  indexes: {
    program: ['program_id'],
    coa: ['coa_id'],
  }
});

const journals = new Table({
  period_id: column.text,
  reference_no: column.text,
  status: column.text,
  date: column.text,
  created_at: column.text,
  updated_at: column.text,
  deleted_at: column.text,
}, {
  indexes: {
    period: ['period_id'],
    reference_period: ['reference_no', 'period_id'],
  }
});

const journalLines = new Table({
  journal_id: column.text,
  period_id: column.text,
  coa_id: column.text,
  debit: column.real,
  credit: column.real,
  created_at: column.text,
  updated_at: column.text,
  deleted_at: column.text,
}, {
  indexes: {
    journal: ['journal_id'],
    period: ['period_id'],
    coa: ['coa_id'],
  }
});

export const appSchema = new Schema({
  periods,
  bidang,
  organization_units: organizationUnits,
  memberships,
  positions,
  members,
  unit_members: unitMembers,
  user_role: userRole,
  type_program: typeProgram,
  programs,
  program_responsibility_pp: programResponsibilityPp,
  program_indicators: programIndicators,
  occasions,
  coa,
  anggaran_program: anggaranProgram,
  journals,
  journal_lines: journalLines,
});
