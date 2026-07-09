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
    console.log('Connected to PostgreSQL successfully.');

    // Get policies for periods and user_role
    const policies = await client.query(`
      SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
      FROM pg_policies
      WHERE tablename IN ('periods', 'user_role');
    `);
    console.log('\n=== RLS Policies ===');
    console.log(JSON.stringify(policies.rows, null, 2));

  } catch (err) {
    console.error('Error during execution:', err);
  } finally {
    await client.end();
  }
}

run();
