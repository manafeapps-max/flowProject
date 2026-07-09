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

    // 1. Get user_role columns
    const columns = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'user_role' AND table_schema = 'public';
    `);
    console.log('\n=== user_role Columns ===');
    console.table(columns.rows);

    // 2. Get user_role foreign keys and constraints
    const constraints = await client.query(`
      SELECT
        tc.constraint_name, 
        tc.table_name, 
        kcu.column_name, 
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name 
      FROM 
        information_schema.table_constraints AS tc 
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
          AND tc.table_schema = kcu.table_schema
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
          AND ccu.table_schema = tc.table_schema
      WHERE tc.table_name = 'user_role' AND tc.table_schema = 'public';
    `);
    console.log('\n=== user_role Constraints ===');
    console.table(constraints.rows);

    // 3. Select all user_roles in Supabase DB
    const roles = await client.query(`
      SELECT * FROM public.user_role;
    `);
    console.log('\n=== user_role Rows ===');
    console.log(roles.rows);

  } catch (err) {
    console.error('Error during execution:', err);
  } finally {
    await client.end();
  }
}

run();
