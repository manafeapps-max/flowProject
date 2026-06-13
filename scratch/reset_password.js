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

    console.log('Resetting password for stolaputih@gmail.com to Le0nard123#...');
    
    // Check if extension exists, create it
    await client.query('CREATE EXTENSION IF NOT EXISTS pgcrypto SCHEMA extensions;');
    
    const res = await client.query(`
      UPDATE auth.users
      SET encrypted_password = extensions.crypt('Le0nard123#', extensions.gen_salt('bf', 10))
      WHERE email = 'stolaputih@gmail.com';
    `);

    console.log(`Password reset complete. Rows updated: ${res.rowCount}`);

  } catch (err) {
    console.error('Failed to reset password:', err);
  } finally {
    await client.end();
  }
}

run();
