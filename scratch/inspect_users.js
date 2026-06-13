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

    console.log('Querying auth.users...');
    const res = await client.query(`
      SELECT 
        id, 
        email, 
        encrypted_password, 
        email_confirmed_at, 
        confirmed_at,
        last_sign_in_at,
        raw_app_meta_data,
        raw_user_meta_data
      FROM auth.users;
    `);

    console.log('Users found:', JSON.stringify(res.rows, null, 2));

  } catch (err) {
    console.error('Failed to query users:', err);
  } finally {
    await client.end();
  }
}

run();
