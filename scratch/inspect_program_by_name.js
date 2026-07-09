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
    console.log('Connected.');

    const name1 = 'Pengkajian Kelayakan & Penelitian Pilot Project di Batam Mupel Kepri';
    const name2 = 'Pengkajian Kelayakan & Penelitian Pilot Project di Mupel Jaksel & Banten';

    const res1 = await client.query("SELECT id, name, pjp_bidang_id, bidang_id, sub_bidang_id, program_code FROM programs WHERE name = $1;", [name1]);
    console.log(`\n=== Results for "${name1}" ===`);
    console.log(res1.rows);

    const res2 = await client.query("SELECT id, name, pjp_bidang_id, bidang_id, sub_bidang_id, program_code FROM programs WHERE name = $2;", [name2]);
    console.log(`\n=== Results for "${name2}" ===`);
    console.log(res2.rows);

  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

run();
