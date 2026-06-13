const { Client } = require('pg');

const config = {
  host: '2406:da18:e5c:b700:d7eb:a980:c745:47b1',
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
    console.log('Connected to Supabase DB via direct IPv6.');

    // Update program budget from the real anggaran_program table
    console.log('Updating programs.budget from real anggaran_program table...');
    const updateRes = await client.query(`
      UPDATE public.programs p
      SET budget = COALESCE((
          SELECT SUM(sub_total) 
          FROM public.anggaran_program a 
          WHERE a.program_id = p.id AND a.jenis_anggaran = 'PENGELUARAN'
      ), 0.00);
    `);
    
    console.log(`Updated ${updateRes.rowCount} programs.`);

    // Verify
    const res = await client.query(`
      SELECT p.id, p.name, p.budget, 
             (SELECT COUNT(*) FROM public.anggaran_program a WHERE a.program_id = p.id) as line_count
      FROM public.programs p
      WHERE budget > 0
      ORDER BY budget DESC;
    `);
    
    console.log('\nPrograms with updated budgets:');
    console.table(res.rows);

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

run();
