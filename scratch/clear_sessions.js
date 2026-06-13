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

    console.log('Clearing old session data for user...');
    await client.query('DELETE FROM auth.mfa_amr_claims;');
    await client.query('DELETE FROM auth.refresh_tokens;');
    await client.query('DELETE FROM auth.sessions;');
    console.log('Session data cleared.');

  } catch (err) {
    console.error('Failed to clear sessions:', err);
  } finally {
    await client.end();
  }
}

run();
