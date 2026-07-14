-- ==============================================================================
-- FLOWPROJECT: POWERSYNC DATABASE SCHEMA PREPARATION
-- Adds updated_at and deleted_at to all sync tables, sets up triggers.
-- ==============================================================================

-- 1. Helper trigger function for updating updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 2. Apply alterations and triggers for all 17 tables

-- Table 1: periods
ALTER TABLE public.periods 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();
DROP TRIGGER IF EXISTS update_periods_updated_at ON public.periods;
CREATE TRIGGER update_periods_updated_at 
BEFORE UPDATE ON public.periods
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Table 2: bidang
ALTER TABLE public.bidang 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();
DROP TRIGGER IF EXISTS update_bidang_updated_at ON public.bidang;
CREATE TRIGGER update_bidang_updated_at 
BEFORE UPDATE ON public.bidang
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Table 3: organization_units
ALTER TABLE public.organization_units 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();
DROP TRIGGER IF EXISTS update_organization_units_updated_at ON public.organization_units;
CREATE TRIGGER update_organization_units_updated_at 
BEFORE UPDATE ON public.organization_units
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Table 4: memberships
ALTER TABLE public.memberships 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();
DROP TRIGGER IF EXISTS update_memberships_updated_at ON public.memberships;
CREATE TRIGGER update_memberships_updated_at 
BEFORE UPDATE ON public.memberships
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Table 5: positions
ALTER TABLE public.positions 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();
DROP TRIGGER IF EXISTS update_positions_updated_at ON public.positions;
CREATE TRIGGER update_positions_updated_at 
BEFORE UPDATE ON public.positions
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Table 6: members
ALTER TABLE public.members 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();
DROP TRIGGER IF EXISTS update_members_updated_at ON public.members;
CREATE TRIGGER update_members_updated_at 
BEFORE UPDATE ON public.members
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Table 7: unit_members
ALTER TABLE public.unit_members 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();
DROP TRIGGER IF EXISTS update_unit_members_updated_at ON public.unit_members;
CREATE TRIGGER update_unit_members_updated_at 
BEFORE UPDATE ON public.unit_members
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Table 8: user_role
ALTER TABLE public.user_role 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();
DROP TRIGGER IF EXISTS update_user_role_updated_at ON public.user_role;
CREATE TRIGGER update_user_role_updated_at 
BEFORE UPDATE ON public.user_role
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Table 9: type_program
ALTER TABLE public.type_program 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();
DROP TRIGGER IF EXISTS update_type_program_updated_at ON public.type_program;
CREATE TRIGGER update_type_program_updated_at 
BEFORE UPDATE ON public.type_program
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Table 10: programs
ALTER TABLE public.programs 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();
DROP TRIGGER IF EXISTS update_programs_updated_at ON public.programs;
CREATE TRIGGER update_programs_updated_at 
BEFORE UPDATE ON public.programs
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Table 11: program_responsibility_pp
ALTER TABLE public.program_responsibility_pp 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();
DROP TRIGGER IF EXISTS update_program_responsibility_pp_updated_at ON public.program_responsibility_pp;
CREATE TRIGGER update_program_responsibility_pp_updated_at 
BEFORE UPDATE ON public.program_responsibility_pp
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Table 12: program_indicators
ALTER TABLE public.program_indicators 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();
DROP TRIGGER IF EXISTS update_program_indicators_updated_at ON public.program_indicators;
CREATE TRIGGER update_program_indicators_updated_at 
BEFORE UPDATE ON public.program_indicators
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Table 13: occasions
ALTER TABLE public.occasions 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();
DROP TRIGGER IF EXISTS update_occasions_updated_at ON public.occasions;
CREATE TRIGGER update_occasions_updated_at 
BEFORE UPDATE ON public.occasions
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Table 14: coa
ALTER TABLE public.coa 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();
DROP TRIGGER IF EXISTS update_coa_updated_at ON public.coa;
CREATE TRIGGER update_coa_updated_at 
BEFORE UPDATE ON public.coa
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Table 15: anggaran_program
ALTER TABLE public.anggaran_program 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();
DROP TRIGGER IF EXISTS update_anggaran_program_updated_at ON public.anggaran_program;
CREATE TRIGGER update_anggaran_program_updated_at 
BEFORE UPDATE ON public.anggaran_program
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Table 16: journals
ALTER TABLE public.journals 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();
DROP TRIGGER IF EXISTS update_journals_updated_at ON public.journals;
CREATE TRIGGER update_journals_updated_at 
BEFORE UPDATE ON public.journals
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Table 17: journal_lines
ALTER TABLE public.journal_lines 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();
DROP TRIGGER IF EXISTS update_journal_lines_updated_at ON public.journal_lines;
CREATE TRIGGER update_journal_lines_updated_at 
BEFORE UPDATE ON public.journal_lines
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 3. Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';
