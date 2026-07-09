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

    const res = await client.query(`
      SELECT id, name, pic_membership_id, period_id, pjp_bidang_id, bidang_id
      FROM public.programs
      WHERE id = '550e8400-e29b-41d4-a716-446655440108';
    `);
    
    if (res.rows.length > 0) {
      console.log('Program found in Supabase:', res.rows[0]);
    } else {
      console.log('Program NOT found in Supabase.');
    }

    // Check if the pic_membership_id for this program exists in public.members table
    const picId = 'de641feb-9990-4057-ba23-6c66253e2fa9'; // fallback or let's find out what pic ID the program uses locally.
    const memberRes = await client.query(`
      SELECT id, name, email, status FROM public.members;
    `);
    console.log('\nAll members in Supabase:');
    console.table(memberRes.rows);

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

run();
