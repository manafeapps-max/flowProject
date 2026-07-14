const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

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
    console.log('Connected to Supabase PostgreSQL database.');

    const sqlPath = path.join(__dirname, 'powersync_schema_prep.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('Executing powersync_schema_prep.sql...');
    await client.query(sql);
    console.log('Migration executed successfully.');

    console.log('Verifying table changes (checking periods table columns)...');
    const res = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = 'periods'
      AND column_name IN ('updated_at', 'deleted_at');
    `);
    console.log('Verification results:');
    console.log(res.rows);

  } catch (err) {
    console.error('Migration execution failed:', err);
  } finally {
    await client.end();
  }
}

run();
