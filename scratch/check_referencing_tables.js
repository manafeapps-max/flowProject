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
    console.log('Connected to Supabase PostgreSQL.');

    const oldBidangId = '550e8400-e29b-41d4-a716-446655440010';
    const oldUnitIds = [
      '550e8400-e29b-41d4-a716-446655440020',
      '550e8400-e29b-41d4-a716-446655440021',
      '550e8400-e29b-41d4-a716-446655440022',
      '550e8400-e29b-41d4-a716-446655440023'
    ];

    // Check program_responsibility_pp references
    console.log('\nChecking program_responsibility_pp...');
    const ppRes = await client.query(`
      SELECT COUNT(*) FROM program_responsibility_pp 
      WHERE bidang_id = $1;
    `, [oldBidangId]);
    console.log(`program_responsibility_pp referencing old bidang: ${ppRes.rows[0].count}`);

    // Check unit_members references to old units
    console.log('\nChecking unit_members...');
    const umRes = await client.query(`
      SELECT COUNT(*), unit_id FROM unit_members 
      WHERE unit_id = ANY($1) 
      GROUP BY unit_id;
    `, [oldUnitIds]);
    console.table(umRes.rows);

    // Check user_role references to old bidang (user_role table has role, user_id, period_id - wait, it doesn't reference bidang directly, only periods)
    // Check organization_units references to old bidang (via parent_id or bidang_id)
    console.log('\nChecking organization_units...');
    const ouRes = await client.query(`
      SELECT COUNT(*), parent_id FROM organization_units 
      WHERE parent_id = $1 OR bidang_id = $1
      GROUP BY parent_id;
    `, [oldBidangId]);
    console.table(ouRes.rows);

  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

run();
