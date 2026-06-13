const { Client } = require('pg');

const config = {
  host: 'db.ouesnbkrsejuersezzhk.supabase.co',
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
    
    // Check distinct types, counts, sum of subtotal in anggaran_program
    const res = await client.query(`
      SELECT jenis_anggaran, COUNT(*), SUM(sub_total)
      FROM public.anggaran_program
      GROUP BY jenis_anggaran;
    `);
    
    console.log('Anggaran Program Summary:');
    console.table(res.rows);

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

run();
