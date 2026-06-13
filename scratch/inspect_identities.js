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

    console.log('Querying auth.identities...');
    const res = await client.query(`
      SELECT 
        id, 
        user_id,
        identity_data,
        provider,
        last_sign_in_at,
        created_at,
        updated_at
      FROM auth.identities;
    `);

    console.log('Identities found:', JSON.stringify(res.rows, null, 2));

  } catch (err) {
    console.error('Failed to query identities:', err);
  } finally {
    await client.end();
  }
}

run();
