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
    console.log('Connected to Supabase DB.');

    console.log('Updating programs.catatan_anggaran to contain a summary of related budget items...');
    
    const updateRes = await client.query(`
      WITH rev AS (
          SELECT 
              program_id,
              'PENERIMAAN: ' || string_agg(nama_anggaran || ' (Rp ' || trim(to_char(sub_total, '999,999,999,999')) || ')', ', ') AS list
          FROM public.anggaran_program
          WHERE jenis_anggaran = 'PENERIMAAN'
          GROUP BY program_id
      ),
      exp AS (
          SELECT 
              program_id,
              'PENGELUARAN: ' || string_agg(nama_anggaran || ' (Rp ' || trim(to_char(sub_total, '999,999,999,999')) || ')', ', ') AS list
          FROM public.anggaran_program
          WHERE jenis_anggaran = 'PENGELUARAN'
          GROUP BY program_id
      ),
      combined AS (
          SELECT 
              p.id AS program_id,
              CONCAT_WS(E'\n', r.list, e.list) AS notes
          FROM public.programs p
          LEFT JOIN rev r ON p.id = r.program_id
          LEFT JOIN exp e ON p.id = e.program_id
      )
      UPDATE public.programs p
      SET catatan_anggaran = NULLIF(c.notes, '')
      FROM combined c
      WHERE p.id = c.program_id;
    `);
    
    console.log(`Updated ${updateRes.rowCount} programs.`);

    // Verify a few sample rows
    const res = await client.query(`
      SELECT name, catatan_anggaran
      FROM public.programs
      WHERE catatan_anggaran IS NOT NULL
      LIMIT 3;
    `);
    
    console.log('\nVerification Samples:');
    res.rows.forEach((row, i) => {
      console.log(`\nSample ${i + 1}: ${row.name}`);
      console.log('Catatan Anggaran:');
      console.log(row.catatan_anggaran);
    });

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

run();
