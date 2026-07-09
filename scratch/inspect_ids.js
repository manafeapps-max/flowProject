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

    const subBidangRes = await client.query("SELECT * FROM sub_bidang;");
    console.log('=== sub_bidang ===');
    console.table(subBidangRes.rows);

    const orgUnitsRes = await client.query("SELECT * FROM organization_units;");
    console.log('=== organization_units ===');
    console.table(orgUnitsRes.rows);

  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

run();
