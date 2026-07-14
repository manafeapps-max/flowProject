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

    console.log('Dropping existing public.user_profiles view...');
    await client.query('DROP VIEW IF EXISTS public.user_profiles;');
    console.log('View dropped.');

    console.log('Creating SECURITY DEFINER function public.get_user_profiles...');
    await client.query(`
      CREATE OR REPLACE FUNCTION public.get_user_profiles()
      RETURNS TABLE (id UUID, email VARCHAR)
      LANGUAGE plpgsql
      SECURITY DEFINER
      SET search_path = public
      AS $$
      BEGIN
        RETURN QUERY SELECT u.id, u.email FROM auth.users u;
      END;
      $$;
    `);
    console.log('Function created successfully.');

    console.log('Re-creating public.user_profiles view pointing to the function...');
    await client.query(`
      CREATE VIEW public.user_profiles AS
      SELECT id, email FROM public.get_user_profiles();
    `);
    console.log('View created successfully.');

    console.log('Granting SELECT ON public.user_profiles TO authenticated, anon...');
    await client.query('GRANT SELECT ON public.user_profiles TO authenticated, anon;');
    console.log('Permissions granted successfully.');

    console.log('Reloading PostgREST schema cache...');
    await client.query("NOTIFY pgrst, 'reload schema';");
    console.log('PostgREST schema cache reload signal sent.');

    console.log('Testing SELECT on public.user_profiles as authenticated role...');
    await client.query('SET ROLE authenticated;');
    
    const res = await client.query('SELECT * FROM public.user_profiles LIMIT 2;');
    console.log('Test SELECT successful! Rows returned:', res.rows.length);
    console.log(res.rows);

  } catch (err) {
    console.error('Error during execution:', err);
  } finally {
    try {
      await client.query('RESET ROLE;');
    } catch(e) {}
    await client.end();
  }
}

run();
