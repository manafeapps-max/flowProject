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

    console.log('Creating public.occasions table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.occasions (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          period_id UUID NOT NULL REFERENCES public.periods(id) ON DELETE CASCADE,
          title VARCHAR(255) NOT NULL,
          date DATE NOT NULL,
          description TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log('Table public.occasions created successfully.');

    console.log('Enabling Row Level Security...');
    await client.query(`
      ALTER TABLE public.occasions ENABLE ROW LEVEL SECURITY;
    `);
    console.log('RLS enabled.');

    console.log('Creating policies...');
    // Drop existing policies if they exist to prevent errors
    await client.query(`
      DROP POLICY IF EXISTS "Allow authenticated read" ON public.occasions;
      DROP POLICY IF EXISTS "Allow authenticated write" ON public.occasions;
    `);
    
    await client.query(`
      CREATE POLICY "Allow authenticated read" ON public.occasions 
      FOR SELECT TO authenticated, anon USING (true);
    `);
    
    await client.query(`
      CREATE POLICY "Allow authenticated write" ON public.occasions 
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
