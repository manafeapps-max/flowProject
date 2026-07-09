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

    // 1. Check if user_profiles exists as a view or table
    const checkUserProfiles = await client.query(`
      SELECT table_name, table_type 
      FROM information_schema.tables 
      WHERE table_name = 'user_profiles' AND table_schema = 'public';
    `);
    console.log('\nuser_profiles presence in public schema:', checkUserProfiles.rows);

    // 2. If it is a view, get its definition
    if (checkUserProfiles.rows.length > 0 && checkUserProfiles.rows[0].table_type === 'VIEW') {
      const viewDef = await client.query(`
        SELECT view_definition 
        FROM information_schema.views 
        WHERE table_name = 'user_profiles' AND table_schema = 'public';
      `);
      console.log('\nuser_profiles view definition:');
      console.log(viewDef.rows[0].view_definition);
    } else if (checkUserProfiles.rows.length > 0) {
      // It is a base table, show columns
      const colDef = await client.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'user_profiles' AND table_schema = 'public';
      `);
      console.log('\nuser_profiles table columns:', colDef.rows);
    }

    // 3. Check triggers on auth.users
    const triggers = await client.query(`
      SELECT 
        trigger_name, 
        event_manipulation, 
        action_statement, 
        action_timing
      FROM information_schema.triggers
      WHERE event_object_table = 'users' AND event_object_schema = 'auth';
    `);
    console.log('\nTriggers on auth.users:', triggers.rows);

    // 4. Check auth.users columns
    const authColumns = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND table_schema = 'auth';
    `);
    console.log('\nauth.users columns:', authColumns.rows.map(c => c.column_name));

  } catch (err) {
    console.error('Error during execution:', err);
  } finally {
    await client.end();
  }
}

run();
