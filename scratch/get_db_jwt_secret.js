const { Client } = require('pg');

const passwords = ['8hZ6SectdwpTk6#', 'OtUj03yINyj2RvEx'];
const host = 'aws-1-ap-southeast-1.pooler.supabase.com';

async function test() {
  for (const password of passwords) {
    console.log(`\nAttempting connection to ${host} with password prefix ${password.substring(0, 3)}...`);
    const client = new Client({
      host,
      port: 6543,
      user: 'postgres.ouesnbkrsejuersezzhk',
      password,
      database: 'postgres',
      ssl: {
        rejectUnauthorized: false
      }
    });

    try {
      await client.connect();
      console.log('✅ Connected to PostgreSQL successfully!');
      
      console.log('\n1. Checking show jwt.secret...');
      try {
        const res = await client.query('SHOW jwt.secret');
        console.log('jwt.secret value:', res.rows[0]);
      } catch (e) {
        console.log('Failed to run SHOW jwt.secret:', e.message);
      }

      console.log('\n2. Querying pg_settings for jwt...');
      try {
        const res = await client.query("SELECT name, setting, category, short_desc FROM pg_settings WHERE name LIKE '%jwt%' OR name LIKE '%secret%'");
        console.log('Matching settings:');
        console.log(res.rows);
      } catch (e) {
        console.log('Failed to query pg_settings:', e.message);
      }

      await client.end();
      return; // Stop if succeeded
    } catch (err) {
      console.error(`❌ Connection failed with password ${password.substring(0, 3)}...:`, err.message);
      try {
        await client.end();
      } catch (e) {}
    }
  }
}

test();
