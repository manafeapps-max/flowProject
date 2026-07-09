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
    console.log('Connected to PG.');

    console.log('Attempting to delete old parent unit from organization_units table...');
    const res = await client.query("DELETE FROM organization_units WHERE id = '550e8400-e29b-41d4-a716-446655440010';");
    console.log('Delete succeeded:', res.rowCount);

  } catch (err) {
    console.error('Delete failed:');
    console.error(err);
  } finally {
    await client.end();
  }
}

run();
