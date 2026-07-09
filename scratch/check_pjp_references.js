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

    const oldBidangId = '550e8400-e29b-41d4-a716-446655440010';

    const res = await client.query(`
      SELECT id, name, pjp_bidang_id 
      FROM public.programs 
      WHERE pjp_bidang_id = $1;
    `, [oldBidangId]);
    console.log(`Programs referencing old bidang as PJP: ${res.rows.length}`);
    console.table(res.rows);

    const res2 = await client.query(`
      SELECT id, name, bidang_id 
      FROM public.programs 
      WHERE bidang_id = $1;
    `, [oldBidangId]);
    console.log(`Programs referencing old bidang as Bidang: ${res2.rows.length}`);
    console.table(res2.rows);

  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

run();
