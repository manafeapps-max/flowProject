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

    const tables = ['bidang', 'sub_bidang', 'organization_units', 'programs'];

    for (const table of tables) {
      // Get columns
      const cols = await client.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns 
        WHERE table_name = '${table}' AND table_schema = 'public'
        ORDER BY ordinal_position;
      `);
      console.log(`\n=== Table: ${table} ===`);
      console.table(cols.rows);

      // Get count
      const countRes = await client.query(`SELECT COUNT(*) FROM public.${table};`);
      console.log(`Row count: ${countRes.rows[0].count}`);
    }

    // Get relationships between these tables
    const relations = await client.query(`
      SELECT
        tc.constraint_name, 
        tc.table_name, 
        kcu.column_name, 
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name,
        rc.delete_rule
      FROM 
        information_schema.table_constraints AS tc 
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
          AND tc.table_schema = kcu.table_schema
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
          AND ccu.table_schema = tc.table_schema
        JOIN information_schema.referential_constraints AS rc
          ON rc.constraint_name = tc.constraint_name
      WHERE tc.table_schema = 'public' 
        AND tc.table_name IN ('bidang', 'sub_bidang', 'organization_units', 'programs')
        AND ccu.table_name IN ('bidang', 'sub_bidang', 'organization_units', 'programs');
    `);
    console.log('\n=== Direct Foreign Key Relations between these Tables ===');
    console.table(relations.rows);

  } catch (err) {
    console.error('Error during execution:', err);
  } finally {
    await client.end();
  }
}

run();
