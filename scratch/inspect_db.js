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
    console.log('Connected to PostgreSQL database successfully.');

    // 1. Get all tables in the public schema
    const tablesRes = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);

    const tables = tablesRes.rows.map(r => r.table_name);
    console.log('\nFound tables in public schema:', tables);

    if (tables.length === 0) {
      console.log('No tables found in the public schema.');
      await client.end();
      return;
    }

    // 2. Get columns and row counts for each table
    console.log('\nTable details:');
    for (const table of tables) {
      // Get column details
      const columnsRes = await client.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = $1
        ORDER BY ordinal_position;
      `, [table]);

      // Get row count
      let count = 0;
      try {
        const countRes = await client.query(`SELECT COUNT(*) as count FROM "${table}"`);
        count = parseInt(countRes.rows[0].count, 10);
      } catch (err) {
        console.error(`Error counting rows for table ${table}:`, err.message);
      }

      console.log(`\n----------------------------------------`);
      console.log(`Table: ${table} (${count} rows)`);
      console.log(`Columns:`);
      columnsRes.rows.forEach(col => {
        console.log(`  - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
      });

      // Sample data (first 3 rows) if any
      if (count > 0) {
        const sampleRes = await client.query(`SELECT * FROM "${table}" LIMIT 3`);
        console.log(`Sample data (up to 3 rows):`);
        console.log(JSON.stringify(sampleRes.rows, null, 2));
      }
    }

    // 3. Check for custom types / enums
    const enumsRes = await client.query(`
      SELECT t.typname as enum_name, e.enumlabel as enum_value
      FROM pg_type t 
      JOIN pg_enum e ON t.oid = e.enumtypid  
      JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
      WHERE n.nspname = 'public'
      ORDER BY t.typname, e.enumsortorder;
    `);
    
    if (enumsRes.rows.length > 0) {
      console.log('\n----------------------------------------');
      console.log('Custom Enums:');
      const enums = {};
      enumsRes.rows.forEach(row => {
        if (!enums[row.enum_name]) {
          enums[row.enum_name] = [];
        }
        enums[row.enum_name].push(row.enum_value);
      });
      console.log(JSON.stringify(enums, null, 2));
    }

  } catch (err) {
    console.error('Error connecting or querying database:', err);
  } finally {
    await client.end();
  }
}

run();
