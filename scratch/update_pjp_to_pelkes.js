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

async function run() {
  const client = new Client(config);
  try {
    await client.connect();
    console.log('Connected to DB...');

    console.log('Updating all programs pjp_bidang_id to PELKES...');
    const res = await client.query(`
      UPDATE public.programs
      SET pjp_bidang_id = '550e8400-e29b-41d4-a716-446655440010'
    `);
    console.log(`Successfully updated ${res.rowCount} program records.`);

  } catch (err) {
    console.error('Failed to update database:', err);
  } finally {
    await client.end();
  }
}

run();
