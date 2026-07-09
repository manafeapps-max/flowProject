const { Client } = require('pg');

const config = {
  host: 'aws-0-ap-southeast-1.pooler.supabase.com',
  port: 5432,
  user: 'postgres.ouesnbkrsejuersezzhk',
  password: '8hZ6SectdwpTk6#', // Try first password from scratch files
  database: 'postgres',
  ssl: {
    rejectUnauthorized: false
  }
};

async function test() {
  const client = new Client(config);
  try {
    await client.connect();
    console.log('Connected to pooler on 5432 successfully!');
    const res = await client.query('SELECT NOW()');
    console.log('Time from DB:', res.rows[0].now);
  } catch (err) {
    console.error('Connection failed:', err);
  } finally {
    await client.end();
  }
}

test();
