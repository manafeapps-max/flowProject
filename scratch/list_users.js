const { Client } = require('pg');

const config = {
  host: 'aws-1-ap-southeast-1.pooler.supabase.com',
  port: 5432,
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
    console.log('Connected to DB...');

    console.log('Querying auth.users...');
    const res = await client.query(`
      SELECT 
        id, 
        email, 
        email_confirmed_at, 
        last_sign_in_at
      FROM auth.users;
    `);

    console.table(res.rows);

  } catch (err) {
    console.error('Failed to query users:', err);
  } finally {
    await client.end();
  }
}

run();
