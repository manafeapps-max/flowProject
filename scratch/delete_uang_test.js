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

async function run() {
  const client = new Client(config);
  try {
    await client.connect();
    console.log('Connected to Supabase successfully.');

    // Delete item where nama_anggaran is 'uang test'
    const res = await client.query("DELETE FROM anggaran_program WHERE nama_anggaran = 'uang test' OR nama_anggaran = 'uang tes'");
    console.log(`Deleted rows: ${res.rowCount}`);

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

run();
