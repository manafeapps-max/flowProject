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
    console.log('Connected to PostgreSQL database.');

    console.log('Altering organization_units to add description column...');
    await client.query(`
      ALTER TABLE public.organization_units 
      ADD COLUMN IF NOT EXISTS description TEXT;
    `);
    console.log('Column description added successfully.');

    // Reload PostgREST schema cache
    console.log('Notifying PostgREST to reload schema cache...');
    await client.query("NOTIFY pgrst, 'reload schema';");
    console.log('Cache reload triggered.');

  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await client.end();
  }
}

run();
