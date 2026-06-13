-- ==============================================================================
-- CMP v1.1 - Database Physical Schema (PostgreSQL DDL)
-- Core Loop: IAM, Organization Setup, Program Budget, Financial Ledger
-- ==============================================================================

-- 1. ENUMS & TYPES
CREATE TYPE user_role_enum AS ENUM ('SYSTEM_OWNER', 'SUPER_ADMIN', 'ADMIN', 'STAFF', 'BENDAHARA', 'AUDITOR', 'USER', 'PUBLIC');
CREATE TYPE program_status_enum AS ENUM ('DRAFT', 'UNDER_REVIEW', 'PROPOSED', 'APPROVED', 'REJECTED');
CREATE TYPE journal_status_enum AS ENUM ('DRAFT', 'POSTED');
CREATE TYPE jenis_anggaran_enum AS ENUM ('PENERIMAAN', 'PENGELUARAN');
CREATE TYPE sumber_harga_enum AS ENUM ('MANUAL', 'STANDARD');

-- 2. CORE TABLES

-- Periods (Data Isolation & Future Partitioning)
CREATE TABLE periods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Organization Units (Bidang / Sub-Bidang)
CREATE TABLE organization_units (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    period_id UUID NOT NULL REFERENCES periods(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    parent_id UUID REFERENCES organization_units(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Memberships
CREATE TABLE memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL, -- References auth.users in Supabase
    period_id UUID NOT NULL REFERENCES periods(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, period_id)
);

-- Positions
-- Cardinality Guard: A User can only hold exactly 1 Position within 1 active Membership for the same structural period.
CREATE TABLE positions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    membership_id UUID NOT NULL REFERENCES memberships(id) ON DELETE CASCADE,
    unit_id UUID NOT NULL REFERENCES organization_units(id) ON DELETE CASCADE,
    period_id UUID NOT NULL REFERENCES periods(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(membership_id, period_id)
);

-- IAM (Many-to-Many Roles)
CREATE TABLE user_role (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL, -- References auth.users
    role user_role_enum NOT NULL,
    period_id UUID NOT NULL REFERENCES periods(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, role, period_id)
);

-- Program Types
CREATE TABLE type_program (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bidang
CREATE TABLE bidang (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    period_id UUID NOT NULL REFERENCES periods(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sub-Bidang
CREATE TABLE sub_bidang (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    period_id UUID NOT NULL REFERENCES periods(id) ON DELETE CASCADE,
    bidang_id UUID NOT NULL REFERENCES bidang(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Programs
CREATE TABLE programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    period_id UUID NOT NULL REFERENCES periods(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    status program_status_enum DEFAULT 'DRAFT',
    pjp_unit_id UUID NOT NULL REFERENCES organization_units(id), -- Penanggung Jawab Program (Structural)
    pic_membership_id UUID NOT NULL REFERENCES memberships(id), -- Person in Charge (Execution)
    type_program_id UUID REFERENCES type_program(id) ON DELETE SET NULL,
    bidang_id UUID REFERENCES bidang(id) ON DELETE SET NULL,
    sub_bidang_id UUID REFERENCES sub_bidang(id) ON DELETE SET NULL,
    anggaran_penerimaan NUMERIC(15, 2) DEFAULT 0.00,
    anggaran_pengeluaran NUMERIC(15, 2) DEFAULT 0.00,
    program_code VARCHAR(100),
    tujuan_program TEXT,
    tahun_anggaran VARCHAR(100),
    bulan INTEGER,
    frekuensi INTEGER DEFAULT 1,
    lokasi TEXT,
    deskripsi TEXT,
    ik_kualitatif TEXT,
    catatan_anggaran TEXT,
    waktu VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Program Responsibility (Penopang Program - PP)
CREATE TABLE program_responsibility_pp (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
    unit_id UUID NOT NULL REFERENCES organization_units(id) ON DELETE CASCADE,
    period_id UUID NOT NULL REFERENCES periods(id) ON DELETE CASCADE,
    UNIQUE(program_id, unit_id)
);

-- Chart of Accounts (COA)
CREATE TABLE coa (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    period_id UUID NOT NULL REFERENCES periods(id) ON DELETE CASCADE,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(code, period_id)
);

-- Detailed Program Budgets (Anggaran Program)
CREATE TABLE anggaran_program (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
    jenis_anggaran jenis_anggaran_enum NOT NULL,
    nama_anggaran VARCHAR(255) NOT NULL,
    volume NUMERIC(15, 2) NOT NULL,
    satuan VARCHAR(50),
    harga_satuan NUMERIC(15, 2) NOT NULL,
    sumber_harga sumber_harga_enum DEFAULT 'MANUAL',
    frekuensi_pelaksanaan INTEGER DEFAULT 1 NOT NULL,
    sumber_dana VARCHAR(255),
    catatan TEXT,
    coa_id UUID REFERENCES coa(id),
    coa_manual VARCHAR(255),
    sub_total NUMERIC(15, 2) GENERATED ALWAYS AS (volume * harga_satuan * frekuensi_pelaksanaan) STORED,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT anggaran_program_frekuensi_pelaksanaan_check CHECK (frekuensi_pelaksanaan >= 1),
    CONSTRAINT anggaran_program_harga_satuan_check CHECK (harga_satuan >= 0),
    CONSTRAINT anggaran_program_volume_check CHECK (volume >= 0),
    CONSTRAINT chk_sumber_dana CHECK (
        (jenis_anggaran = 'PENGELUARAN' AND sumber_dana IS NULL) OR 
        (jenis_anggaran = 'PENERIMAAN')
    )
);

-- Journals
CREATE TABLE journals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    period_id UUID NOT NULL REFERENCES periods(id) ON DELETE CASCADE,
    reference_no VARCHAR(100) NOT NULL,
    status journal_status_enum DEFAULT 'DRAFT',
    date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(reference_no, period_id)
);

-- Journal Lines
CREATE TABLE journal_lines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    journal_id UUID NOT NULL REFERENCES journals(id) ON DELETE CASCADE,
    period_id UUID NOT NULL REFERENCES periods(id) ON DELETE CASCADE,
    coa_id UUID REFERENCES coa(id), -- Nullable during DRAFT
    debit NUMERIC(15, 2) DEFAULT 0.00,
    credit NUMERIC(15, 2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 3. TRIGGERS & FUNCTIONS (ENFORCING INVARIANTS)
-- ==============================================================================

-- A. Hierarchy Constraint: Organization structural units must use a Flat Hierarchy limited to a maximum of 2 levels (Bidang -> Sub-Bidang).
CREATE OR REPLACE FUNCTION check_org_hierarchy_depth() RETURNS TRIGGER AS $$
DECLARE
    parent_count INT := 0;
    current_parent UUID := NEW.parent_id;
BEGIN
    WHILE current_parent IS NOT NULL LOOP
        parent_count := parent_count + 1;
        IF parent_count > 1 THEN
            RAISE EXCEPTION 'Hierarchy constraint violated: maximum 2 levels allowed (Bidang -> Sub-Bidang).';
        END IF;
        SELECT parent_id INTO current_parent FROM organization_units WHERE id = current_parent;
    END LOOP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_org_hierarchy_depth
    BEFORE INSERT OR UPDATE ON organization_units
    FOR EACH ROW EXECUTE FUNCTION check_org_hierarchy_depth();

-- B. Separation Guard: PJP.unit_id != PP.unit_id
CREATE OR REPLACE FUNCTION check_pjp_pp_separation() RETURNS TRIGGER AS $$
DECLARE
    v_pjp_unit_id UUID;
BEGIN
    SELECT pjp_unit_id INTO v_pjp_unit_id FROM programs WHERE id = NEW.program_id;
    IF NEW.unit_id = v_pjp_unit_id THEN
        RAISE EXCEPTION 'Separation Guard violated: PP unit cannot be the same as PJP unit.';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_pjp_pp_separation
    BEFORE INSERT OR UPDATE ON program_responsibility_pp
    FOR EACH ROW EXECUTE FUNCTION check_pjp_pp_separation();

CREATE OR REPLACE FUNCTION check_program_pjp_separation() RETURNS TRIGGER AS $$
DECLARE
    v_pp_count INT;
BEGIN
    IF TG_OP = 'UPDATE' AND NEW.pjp_unit_id != OLD.pjp_unit_id THEN
        SELECT COUNT(*) INTO v_pp_count FROM program_responsibility_pp WHERE program_id = NEW.id AND unit_id = NEW.pjp_unit_id;
        IF v_pp_count > 0 THEN
            RAISE EXCEPTION 'Separation Guard violated: New PJP unit is already assigned as a PP unit for this program.';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_program_pjp_separation
    BEFORE UPDATE ON programs
    FOR EACH ROW EXECUTE FUNCTION check_program_pjp_separation();

-- C. Financial Ledger Double-Entry & COA Guard
CREATE OR REPLACE FUNCTION check_journal_posting() RETURNS TRIGGER AS $$
DECLARE
    v_total_debit NUMERIC;
    v_total_credit NUMERIC;
    v_null_coa_count INT;
BEGIN
    IF NEW.status = 'POSTED' AND OLD.status != 'POSTED' THEN
        SELECT COALESCE(SUM(debit), 0.00), COALESCE(SUM(credit), 0.00), COUNT(*) FILTER (WHERE coa_id IS NULL)
        INTO v_total_debit, v_total_credit, v_null_coa_count
        FROM journal_lines WHERE journal_id = NEW.id;

        IF v_total_debit != v_total_credit THEN
            RAISE EXCEPTION 'Double-Entry violated: Total debit (%) must equal total credit (%).', v_total_debit, v_total_credit;
        END IF;

        IF v_null_coa_count > 0 THEN
            RAISE EXCEPTION 'COA Guard violated: Cannot post journal with missing COA in transaction lines.';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_journal_posting
    BEFORE UPDATE ON journals
    FOR EACH ROW EXECUTE FUNCTION check_journal_posting();

-- Prevent modifications to POSTED journal lines
CREATE OR REPLACE FUNCTION prevent_modifying_posted_journal_lines() RETURNS TRIGGER AS $$
DECLARE
    v_status journal_status_enum;
BEGIN
    IF TG_OP = 'DELETE' THEN
        SELECT status INTO v_status FROM journals WHERE id = OLD.journal_id;
    ELSE
        SELECT status INTO v_status FROM journals WHERE id = NEW.journal_id;
    END IF;

    IF v_status = 'POSTED' THEN
        RAISE EXCEPTION 'Cannot modify journal lines of a POSTED journal.';
    END IF;
    
    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_immutable_posted_journal_lines
    BEFORE INSERT OR UPDATE OR DELETE ON journal_lines
    FOR EACH ROW EXECUTE FUNCTION prevent_modifying_posted_journal_lines();

-- ==============================================================================
-- 4. ROW-LEVEL SECURITY (RLS) FOR PWA OFFLINE-FIRST
-- ==============================================================================
-- Note: Offline-first syncing via Dexie will rely on pulling changes since last sync.
-- Tables must have `updated_at` to support sync pulling. We will enable basic RLS here.

ALTER TABLE periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_role ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE program_responsibility_pp ENABLE ROW LEVEL SECURITY;
ALTER TABLE coa ENABLE ROW LEVEL SECURITY;
ALTER TABLE journals ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE anggaran_program ENABLE ROW LEVEL SECURITY;
ALTER TABLE type_program ENABLE ROW LEVEL SECURITY;
ALTER TABLE bidang ENABLE ROW LEVEL SECURITY;
ALTER TABLE sub_bidang ENABLE ROW LEVEL SECURITY;

-- For MVP, allowing authenticated users to read and update. 
-- In a real scenario, this would be locked down by specific policies derived from `user_role` and permissions.
CREATE POLICY "Allow authenticated read" ON periods FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read" ON organization_units FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read" ON memberships FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read" ON positions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read" ON user_role FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read" ON programs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read" ON program_responsibility_pp FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read" ON coa FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read" ON journals FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read" ON journal_lines FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read" ON anggaran_program FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read" ON type_program FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read" ON bidang FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read" ON sub_bidang FOR SELECT TO authenticated USING (true);

-- (Write policies would follow matching user_roles, simplified for MVP setup)
