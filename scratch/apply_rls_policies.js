const { Client } = require('pg');

const config = {
  host: 'aws-1-ap-southeast-1.pooler.supabase.com',
  port: 5432,
  user: 'postgres.ouesnbkrsejuersezzhk',
  password: '8hZ6SectdwpTk6#',
  database: 'postgres',
  ssl: {
    rejectUnauthorized: false
  }
};

const tables = [
  'periods',
  'organization_units',
  'memberships',
  'positions',
  'user_role',
  'programs',
  'program_responsibility_pp',
  'coa',
  'journals',
  'journal_lines',
  'anggaran_program',
  'type_program',
  'bidang',
  'sub_bidang'
];

async function run() {
  const client = new Client(config);
  try {
    await client.connect();
    console.log('Connected to Supabase PostgreSQL database.');

    console.log('Adding INSERT, UPDATE, and DELETE policies for authenticated users on all tables...');

    for (const table of tables) {
      console.log(`\nTable: ${table}`);
      
      // Drop existing write policies if they exist (to avoid duplicates)
      try {
        await client.query(`DROP POLICY IF EXISTS "Allow authenticated insert" ON "${table}";`);
        await client.query(`DROP POLICY IF EXISTS "Allow authenticated update" ON "${table}";`);
        await client.query(`DROP POLICY IF EXISTS "Allow authenticated delete" ON "${table}";`);
        await client.query(`DROP POLICY IF EXISTS "Allow authenticated write" ON "${table}";`);
      } catch (err) {
        console.warn(`  Warning dropping old policies on ${table}: ${err.message}`);
      }

      // Create new policies
      // We can use a single policy for ALL (SELECT, INSERT, UPDATE, DELETE) or separate.
      // Since SELECT is already covered by "Allow authenticated read" which uses FOR SELECT,
      // we can add a policy named "Allow authenticated write" FOR ALL.
      const query = `
        CREATE POLICY "Allow authenticated write" 
        ON "${table}" 
        FOR ALL 
        TO authenticated, anon 
        USING (true) 
        WITH CHECK (true);
      `;
      
      try {
        await client.query(query);
        console.log(`  Successfully added "Allow authenticated write" policy on ${table}.`);
      } catch (err) {
        console.error(`  Error adding policy on ${table}:`, err.message);
      }
    }

    console.log('\nRLS policies updated successfully!');

  } catch (err) {
    console.error('Failed to update RLS policies:', err);
  } finally {
    await client.end();
  }
}

run();
