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

    console.log('Creating public.user_profiles view...');
    await client.query(`
      CREATE OR REPLACE VIEW public.user_profiles AS
      SELECT id, email
      FROM auth.users;
    `);
    console.log('View created successfully.');

    console.log('Granting SELECT access to authenticated and anon roles...');
    await client.query(`
      GRANT SELECT ON public.user_profiles TO authenticated, anon;
    `);
    console.log('Permissions granted successfully.');

    console.log('Reloading PostgREST schema cache...');
    await client.query("NOTIFY pgrst, 'reload schema';");
    console.log('PostgREST schema cache reload signal sent.');

  } catch (err) {
    console.error('Error during execution:', err);
  } finally {
    await client.end();
  }
}

run();
