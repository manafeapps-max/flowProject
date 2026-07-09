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

    // 1. Inspect organization_units columns
    const columnsRes = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'organization_units'
      ORDER BY ordinal_position;
    `);

    console.log('Current columns of organization_units:');
    columnsRes.rows.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
    });

    const hasBidangId = columnsRes.rows.some(col => col.column_name === 'bidang_id');

    if (!hasBidangId) {
      console.log('\nbidang_id column is missing! Adding it...');
      
      // We alter the table to add bidang_id referencing bidang(id)
      await client.query(`
        ALTER TABLE organization_units 
        ADD COLUMN bidang_id UUID REFERENCES bidang(id) ON DELETE SET NULL;
      `);
      console.log('Successfully added bidang_id column.');

      // Reload PostgREST schema cache so Supabase client detects it immediately
      console.log('Reloading PostgREST schema cache...');
      await client.query("NOTIFY pgrst, 'reload schema';");
      console.log('PostgREST schema cache reload signal sent.');
    } else {
      console.log('\nbidang_id column is already present.');
      // Just in case, reload the schema cache
      console.log('Reloading PostgREST schema cache...');
      await client.query("NOTIFY pgrst, 'reload schema';");
      console.log('PostgREST schema cache reload signal sent.');
    }

  } catch (err) {
    console.error('Error during execution:', err);
  } finally {
    await client.end();
  }
}

run();
