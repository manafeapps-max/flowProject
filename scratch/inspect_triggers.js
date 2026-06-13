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
    console.log('Connected to DB...');

    console.log('Querying triggers on auth.users...');
    const res = await client.query(`
      SELECT 
        trigger_name, 
        event_manipulation, 
        action_statement, 
        action_timing
      FROM information_schema.triggers
      WHERE event_object_table = 'users' AND event_object_schema = 'auth';
    `);

    console.log('Triggers found:', JSON.stringify(res.rows, null, 2));

  } catch (err) {
    console.error('Failed to query triggers:', err);
  } finally {
    await client.end();
  }
}

run();
