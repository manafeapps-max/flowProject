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
  'members',
  'unit_members',
  'user_role',
  'programs',
  'program_responsibility_pp',
  'coa',
  'journals',
  'journal_lines',
  'anggaran_program',
  'type_program',
  'bidang'
];

async function run() {
  const client = new Client(config);
  try {
    await client.connect();
    console.log('Connected to Supabase database.');

    console.log('Updating SELECT policies to allow both authenticated and anon users...');

    for (const table of tables) {
      console.log(`Table: ${table}`);
      try {
        await client.query(`DROP POLICY IF EXISTS "Allow authenticated read" ON "${table}";`);
      } catch (err) {
        console.warn(`  Warning dropping SELECT policy on ${table}: ${err.message}`);
      }

      const query = `
        CREATE POLICY "Allow authenticated read" 
        ON "${table}" 
        FOR SELECT 
        TO authenticated, anon 
        USING (true);
      `;
      try {
        await client.query(query);
        console.log(`  Successfully updated SELECT policy for ${table}.`);
      } catch (err) {
        console.error(`  Error creating SELECT policy on ${table}:`, err.message);
      }
    }

    console.log('Read policies updated successfully!');
  } catch (err) {
    console.error('Failed to update read policies:', err);
  } finally {
    await client.end();
  }
}

run();
