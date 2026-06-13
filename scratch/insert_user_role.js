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

    console.log('Inserting user_role mapping...');
    const res = await client.query(`
      INSERT INTO public.user_role (id, user_id, role, period_id)
      VALUES (
          gen_random_uuid(),
          'de641feb-9990-4057-ba23-6c66253e2fa9',
          'SYSTEM_OWNER'::user_role_enum,
          '550e8400-e29b-41d4-a716-446655440000'
      ) ON CONFLICT DO NOTHING;
    `);

    console.log(`Mapping inserted. Rows affected: ${res.rowCount}`);

  } catch (err) {
    console.error('Failed to insert user role:', err);
  } finally {
    await client.end();
  }
}

run();
