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

    const res = await client.query(`
      SELECT id, name, pjp_bidang_id, bidang_id, sub_bidang_id 
      FROM public.programs
      WHERE pjp_bidang_id = '550e8400-e29b-41d4-a716-446655440010' 
         OR bidang_id = '550e8400-e29b-41d4-a716-446655440010';
    `);
    console.log(`Found ${res.rows.length} programs referencing old bidang:`);
    console.table(res.rows);

  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

run();
