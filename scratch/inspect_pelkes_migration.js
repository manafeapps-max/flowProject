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
    console.log('Connected to PostgreSQL.');

    // 1. Fetch all bidang
    const bidangRes = await client.query("SELECT id, name, code, period_id FROM bidang;");
    console.log('\n=== All Bidang in Supabase ===');
    console.table(bidangRes.rows);

    // 2. Fetch all organization_units
    const orgRes = await client.query("SELECT id, name, parent_id, bidang_id, period_id FROM organization_units;");
    console.log('\n=== All Organization Units in Supabase ===');
    console.table(orgRes.rows);

    // 3. Fetch count of programs by pjp_bidang_id, bidang_id, and sub_bidang_id
    const progPjpRes = await client.query(`
      SELECT pjp_bidang_id, COUNT(*) 
      FROM programs 
      GROUP BY pjp_bidang_id;
    `);
    console.log('\n=== Programs by pjp_bidang_id ===');
    console.table(progPjpRes.rows);

    const progBidangRes = await client.query(`
      SELECT bidang_id, COUNT(*) 
      FROM programs 
      GROUP BY bidang_id;
    `);
    console.log('\n=== Programs by bidang_id ===');
    console.table(progBidangRes.rows);

    const progSubBidangRes = await client.query(`
      SELECT sub_bidang_id, COUNT(*) 
      FROM programs 
      GROUP BY sub_bidang_id;
    `);
    console.log('\n=== Programs by sub_bidang_id ===');
    console.table(progSubBidangRes.rows);

  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

run();
