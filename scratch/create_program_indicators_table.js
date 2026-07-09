const { Client } = require('pg');

const config = {
  host: 'aws-1-ap-southeast-1.pooler.supabase.com',
  port: 6543,
  user: 'postgres.ouesnbkrsejuersezzhk',
  password: '8hZ6SectdwpTk6#',
  database: 'postgres',
  ssl: {
    rejectUnauthorized: false
  }
};

async function run() {
  const client = new Client(config);
  try {
    await client.connect();
    console.log('Connected to PostgreSQL successfully.');

    console.log('Creating public.program_indicators table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.program_indicators (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          program_id UUID NOT NULL REFERENCES public.programs(id) ON DELETE CASCADE,
          type VARCHAR(50) NOT NULL CHECK (type IN ('KUALITATIF', 'KUANTITATIF')),
          indicator_text TEXT NOT NULL,
          target NUMERIC,
          realization NUMERIC,
          unit VARCHAR(50),
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log('Table public.program_indicators created successfully.');

    console.log('Enabling Row Level Security...');
    await client.query(`
      ALTER TABLE public.program_indicators ENABLE ROW LEVEL SECURITY;
    `);
    console.log('RLS enabled.');

    console.log('Creating policies...');
    await client.query(`
      DROP POLICY IF EXISTS "Allow authenticated read" ON public.program_indicators;
      DROP POLICY IF EXISTS "Allow authenticated write" ON public.program_indicators;
    `);
    
    await client.query(`
      CREATE POLICY "Allow authenticated read" ON public.program_indicators 
      FOR SELECT TO authenticated, anon USING (true);
    `);
    
    await client.query(`
      CREATE POLICY "Allow authenticated write" ON public.program_indicators 
      FOR ALL TO authenticated USING (true);
    `);
    console.log('Policies created successfully.');

    console.log('Reloading PostgREST schema cache...');
    await client.query("NOTIFY pgrst, 'reload schema';");
    console.log('PostgREST schema cache reload signal sent.');

  } catch (err) {
    console.error('Error during execution:', err);
  } finally {
    await client.end();
  }
}

run();
