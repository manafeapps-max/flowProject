const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const config = {
  host: '2406:da18:e5c:b700:d7eb:a980:c745:47b1',
  port: 5432,
  user: 'postgres',
  password: '8hZ6SectdwpTk6#',
  database: 'postgres',
  ssl: {
    rejectUnauthorized: false
  }
};

function splitSql(sql) {
  const statements = [];
  let current = '';
  let inDollarQuote = false;
  let inSingleQuote = false;
  let inDoubleQuote = false;
  let inComment = false;
  
  for (let i = 0; i < sql.length; i++) {
    const char = sql[i];
    const next = sql[i + 1];
    
    if (inComment) {
      if (char === '\n') {
        inComment = false;
      }
      continue;
    }
    
    if (char === '-' && next === '-') {
      inComment = true;
      i++;
      continue;
    }
    
    if (char === '$' && next === '$') {
      inDollarQuote = !inDollarQuote;
      current += '$$';
      i++;
      continue;
    }
    
    if (char === "'" && !inDoubleQuote && !inDollarQuote) {
      inSingleQuote = !inSingleQuote;
    }
    
    if (char === '"' && !inSingleQuote && !inDollarQuote) {
      inDoubleQuote = !inDoubleQuote;
    }
    
    if (char === ';' && !inDollarQuote && !inSingleQuote && !inDoubleQuote) {
      statements.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  if (current.trim()) {
    statements.push(current.trim());
  }
  return statements.filter(s => s.length > 0);
}

async function run() {
  const client = new Client(config);
  try {
    console.log('Connecting to remote Supabase Postgres instance...');
    await client.connect();
    console.log('Connected successfully.');

    // 1. Reset public schema
    console.log('Resetting public schema...');
    await client.query('DROP SCHEMA IF EXISTS public CASCADE;');
    await client.query('CREATE SCHEMA public;');
    await client.query('GRANT ALL ON SCHEMA public TO postgres;');
    await client.query('GRANT ALL ON SCHEMA public TO public;');
    await client.query('GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;');
    await client.query('ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres, anon, authenticated, service_role;');
    await client.query('ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres, anon, authenticated, service_role;');
    await client.query('ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO postgres, anon, authenticated, service_role;');
    console.log('Public schema reset complete.');

    // 2. Load and run schema.sql
    console.log('Deploying schema.sql...');
    const schemaSqlPath = path.join(__dirname, '..', 'schema.sql');
    const schemaSql = fs.readFileSync(schemaSqlPath, 'utf8');
    const schemaStatements = splitSql(schemaSql);
    
    for (const stmt of schemaStatements) {
      try {
        await client.query(stmt);
      } catch (err) {
        console.error(`Error executing schema statement: \n${stmt}\nError:`, err.message);
        throw err;
      }
    }
    console.log('schema.sql deployed successfully.');

    // 3. Create staging tables
    console.log('Creating staging tables...');
    await client.query(`
      CREATE TABLE public.staging_organization_period (
          id uuid,
          name text,
          start_date date,
          end_date date,
          status text,
          created_at timestamp with time zone,
          updated_at timestamp with time zone
      );
      
      CREATE TABLE public.staging_bidang (
          id uuid,
          period_id uuid,
          name text,
          code text,
          description text,
          created_at timestamp with time zone
      );
      
      CREATE TABLE public.staging_sub_bidang (
          id uuid,
          period_id uuid,
          bidang_id uuid,
          name text,
          code text,
          created_at timestamp with time zone
      );
      
      CREATE TABLE public.staging_type_program (
          id uuid,
          name text,
          description text,
          is_active boolean,
          sort_order integer,
          created_at timestamp with time zone
      );
      
      CREATE TABLE public.staging_program (
          id uuid,
          program_code text,
          title text,
          tujuan_program text,
          tahun_anggaran integer,
          triwulan text,
          bulan integer,
          periode_id uuid,
          bidang_id uuid,
          sub_bidang_id uuid,
          type_program_id uuid,
          frekuensi integer,
          lokasi text,
          deskripsi text,
          ik_kualitatif text,
          status text,
          is_locked boolean,
          rejected_reason text,
          proposed_at timestamp with time zone,
          approved_at timestamp with time zone,
          rejected_at timestamp with time zone,
          created_by uuid,
          updated_by uuid,
          created_at timestamp with time zone,
          updated_at timestamp with time zone
      );

      CREATE TABLE public.staging_anggaran_program (
          id uuid,
          program_id uuid,
          jenis_anggaran text,
          nama_anggaran text,
          volume numeric,
          satuan text,
          harga_satuan numeric,
          sumber_harga text,
          frekuensi_pelaksanaan integer,
          sumber_dana text,
          catatan text,
          coa_id uuid,
          coa_manual text,
          sub_total numeric,
          created_at timestamp with time zone,
          updated_at timestamp with time zone
      );
    `);
    console.log('Staging tables created.');

    // 4. Parse data.sql, rewrite queries to staging tables, and execute
    console.log('Loading data.sql...');
    const dataSqlPath = path.join(__dirname, '..', 'olddata_supabase', 'data.sql');
    let dataSql = fs.readFileSync(dataSqlPath, 'utf8');

    // Rewrite INSERT targets to staging tables (except auth)
    dataSql = dataSql
      .replace(/INSERT INTO public\.organization_period/g, 'INSERT INTO public.staging_organization_period')
      .replace(/INSERT INTO public\.bidang/g, 'INSERT INTO public.staging_bidang')
      .replace(/INSERT INTO public\.sub_bidang/g, 'INSERT INTO public.staging_sub_bidang')
      .replace(/INSERT INTO public\.type_program/g, 'INSERT INTO public.staging_type_program')
      .replace(/INSERT INTO public\.program\b/g, 'INSERT INTO public.staging_program')
      .replace(/INSERT INTO public\.anggaran_program/g, 'INSERT INTO public.staging_anggaran_program');

    const dataStatements = splitSql(dataSql);
    console.log(`Parsed ${dataStatements.length} statements from data.sql. Running them...`);
    
    let successCount = 0;
    for (const stmt of dataStatements) {
      if (stmt.startsWith('\\') || stmt.startsWith('SET') || stmt.startsWith('SELECT pg_catalog')) {
        // Skip psql commands
        continue;
      }
      if (stmt.includes('auth.schema_migrations') || stmt.includes('realtime.schema_migrations') || stmt.includes('storage.migrations')) {
        // Skip migration metadata tables
        continue;
      }
      if (stmt.includes('INSERT INTO')) {
        const allowedTargets = [
          'public.staging_organization_period',
          'public.staging_bidang',
          'public.staging_sub_bidang',
          'public.staging_type_program',
          'public.staging_program',
          'public.staging_anggaran_program',
          'auth.users',
          'auth.identities',
          'auth.sessions',
          'auth.mfa_amr_claims',
          'auth.refresh_tokens'
        ];
        
        const isAllowed = allowedTargets.some(target => stmt.includes(target));
        if (!isAllowed) {
          // Skip unsupported table inserts
          continue;
        }
      }
      try {
        await client.query(stmt);
        successCount++;
      } catch (err) {
        // If auth user already exists, just warning
        if (stmt.includes('auth.users') && err.message.includes('duplicate key')) {
          console.log('Auth user already exists, skipping.');
        } else if (stmt.includes('auth.')) {
          // If other auth table insert fails, log a warning but don't fail the entire run
          console.warn(`Warning inserting into auth table: ${err.message}`);
        } else {
          console.error(`Error executing data statement: \n${stmt.substring(0, 300)}...\nError:`, err.message);
          throw err;
        }
      }
    }
    console.log(`Executed ${successCount} data statements successfully.`);

    // 5. Map staging data to real tables
    console.log('Mapping staging data to clean schema...');

    // A. Periods
    console.log('  Mapping periods...');
    await client.query(`
      INSERT INTO public.periods (id, name, start_date, end_date, is_active, created_at, updated_at)
      SELECT 
          id, 
          name, 
          start_date, 
          end_date, 
          (status = 'ACTIVE') as is_active,
          created_at, 
          updated_at
      FROM public.staging_organization_period;
    `);

    // B. Organization Units (Bidang)
    console.log('  Mapping organization units (Bidang)...');
    await client.query(`
      INSERT INTO public.organization_units (id, period_id, name, parent_id, created_at, updated_at)
      SELECT 
          id, 
          period_id, 
          name, 
          NULL, 
          created_at, 
          created_at
      FROM public.staging_bidang;
    `);

    // C. Organization Units (Sub-Bidang)
    console.log('  Mapping organization units (Sub-Bidang)...');
    await client.query(`
      INSERT INTO public.organization_units (id, period_id, name, parent_id, created_at, updated_at)
      SELECT 
          id, 
          period_id, 
          name, 
          bidang_id, 
          created_at, 
          created_at
      FROM public.staging_sub_bidang;
    `);

     // D. Memberships
    console.log('  Creating default memberships...');
    await client.query(`
      INSERT INTO public.memberships (id, user_id, period_id)
      VALUES (
          'de641feb-9990-4057-ba23-6c66253e2fa9',
          'de641feb-9990-4057-ba23-6c66253e2fa9',
          '550e8400-e29b-41d4-a716-446655440000'
      ) ON CONFLICT DO NOTHING;
    `);

    // D2. User Role Mapping
    console.log('  Mapping default user role...');
    await client.query(`
      INSERT INTO public.user_role (id, user_id, role, period_id)
      VALUES (
          gen_random_uuid(),
          'de641feb-9990-4057-ba23-6c66253e2fa9',
          'SYSTEM_OWNER'::user_role_enum,
          '550e8400-e29b-41d4-a716-446655440000'
      ) ON CONFLICT DO NOTHING;
    `);

    // E. Programs
    console.log('  Mapping programs...');
    await client.query(`
      INSERT INTO public.programs (
          id, period_id, name, status, pjp_unit_id, pic_membership_id,
          anggaran_penerimaan, anggaran_pengeluaran,
          program_code, tujuan_program, tahun_anggaran, triwulan, bulan, frekuensi, lokasi, deskripsi, ik_kualitatif, catatan_anggaran, waktu,
          created_at, updated_at
      )
      SELECT 
          p.id, 
          p.periode_id, 
          p.title, 
          COALESCE(p.status::program_status_enum, 'DRAFT'::program_status_enum), 
          COALESCE(p.sub_bidang_id, p.bidang_id), 
          'de641feb-9990-4057-ba23-6c66253e2fa9',
          0.00,
          0.00,
          p.program_code,
          p.tujuan_program,
          (SELECT name FROM public.periods WHERE id = p.periode_id),
          p.triwulan,
          p.bulan,
          p.frekuensi,
          p.lokasi,
          CASE 
              WHEN p.deskripsi ILIKE 'penerimaan%' OR p.deskripsi ILIKE 'pengeluaran%' THEN NULL
              ELSE p.deskripsi
          END,
          NULL,
          NULL,
          p.ik_kualitatif,
          p.created_at, 
          p.updated_at
      FROM public.staging_program p;
    `);

    // F. Detailed budgets (anggaran_program)
    console.log('  Mapping detailed budgets (anggaran_program)...');
    await client.query(`
      INSERT INTO public.anggaran_program (id, program_id, jenis_anggaran, nama_anggaran, volume, satuan, harga_satuan, sumber_harga, frekuensi_pelaksanaan, sumber_dana, catatan, coa_id, coa_manual, created_at, updated_at)
      SELECT 
          id, 
          program_id, 
          jenis_anggaran::jenis_anggaran_enum, 
          nama_anggaran, 
          volume, 
          satuan, 
          harga_satuan, 
          sumber_harga::sumber_harga_enum, 
          frekuensi_pelaksanaan, 
          sumber_dana, 
          catatan, 
          NULL,
          coa_manual, 
          created_at, 
          updated_at
      FROM public.staging_anggaran_program;
    `);

    // G. Update program budget column aggregates from public.anggaran_program (now populated with generated sub_total values)
    console.log('  Updating program budget column aggregates...');
    await client.query(`
      UPDATE public.programs p
      SET 
          anggaran_penerimaan = COALESCE((
              SELECT SUM(sub_total) 
              FROM public.anggaran_program a 
              WHERE a.program_id = p.id AND a.jenis_anggaran = 'PENERIMAAN'
          ), 0.00),
          anggaran_pengeluaran = COALESCE((
              SELECT SUM(sub_total) 
              FROM public.anggaran_program a 
              WHERE a.program_id = p.id AND a.jenis_anggaran = 'PENGELUARAN'
          ), 0.00);
    `);

    // G2. Update program catatan_anggaran to hold a summary of anggaran_program entries
    console.log('  Generating program budget summary (catatan_anggaran)...');
    await client.query(`
      WITH rev AS (
          SELECT 
              program_id,
              'PENERIMAAN: ' || string_agg(nama_anggaran || ' (Rp ' || trim(to_char(sub_total, '999,999,999,999')) || ')', ', ') AS list
          FROM public.anggaran_program
          WHERE jenis_anggaran = 'PENERIMAAN'
          GROUP BY program_id
      ),
      exp AS (
          SELECT 
              program_id,
              'PENGELUARAN: ' || string_agg(nama_anggaran || ' (Rp ' || trim(to_char(sub_total, '999,999,999,999')) || ')', ', ') AS list
          FROM public.anggaran_program
          WHERE jenis_anggaran = 'PENGELUARAN'
          GROUP BY program_id
      ),
      combined AS (
          SELECT 
              p.id AS program_id,
              CONCAT_WS(E'\n', r.list, e.list) AS notes
          FROM public.programs p
          LEFT JOIN rev r ON p.id = r.program_id
          LEFT JOIN exp e ON p.id = e.program_id
      )
      UPDATE public.programs p
      SET catatan_anggaran = NULLIF(c.notes, '')
      FROM combined c
      WHERE p.id = c.program_id;
    `);

    // H. Drop staging tables
    console.log('Cleaning up staging tables...');
    await client.query(`
      DROP TABLE IF EXISTS public.staging_organization_period CASCADE;
      DROP TABLE IF EXISTS public.staging_bidang CASCADE;
      DROP TABLE IF EXISTS public.staging_sub_bidang CASCADE;
      DROP TABLE IF EXISTS public.staging_type_program CASCADE;
      DROP TABLE IF EXISTS public.staging_program CASCADE;
      DROP TABLE IF EXISTS public.staging_anggaran_program CASCADE;
    `);

    // I. Restore default grants
    console.log('Restoring grants for Supabase roles...');
    await client.query('GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;');
    await client.query('GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;');
    await client.query('GRANT ALL ON ALL ROUTINES IN SCHEMA public TO postgres, anon, authenticated, service_role;');

    console.log('\nMigration completed successfully!');

    // 6. Print verify counts
    const periodsCount = await client.query('SELECT COUNT(*) FROM public.periods');
    const unitsCount = await client.query('SELECT COUNT(*) FROM public.organization_units');
    const programsCount = await client.query('SELECT COUNT(*) FROM public.programs');
    const budgetsCount = await client.query('SELECT COUNT(*) FROM public.anggaran_program');

    console.log('\nRecord verification counts:');
    console.log(`- Periods: ${periodsCount.rows[0].count}`);
    console.log(`- Organization Units: ${unitsCount.rows[0].count}`);
    console.log(`- Programs: ${programsCount.rows[0].count}`);
    console.log(`- Detailed Budget Lines: ${budgetsCount.rows[0].count}`);

  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await client.end();
  }
}

run();
