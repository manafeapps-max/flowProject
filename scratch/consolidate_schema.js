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

const ddl = `
-- Drop the redundant sub_bidang table and its policies
DROP TABLE IF EXISTS sub_bidang CASCADE;

-- Add bidang_id to organization_units to link it to the Bidang
ALTER TABLE organization_units ADD COLUMN IF NOT EXISTS bidang_id UUID REFERENCES bidang(id) ON DELETE CASCADE;
`;

async function run() {
  const client = new Client(config);
  try {
    await client.connect();
    console.log('Connected to Supabase. Updating schema...');
    await client.query(ddl);
    console.log('Schema updated successfully!');
  } catch (err) {
    console.error('Failed to update schema:', err);
  } finally {
    await client.end();
  }
}

run();
