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
    
    // Select programs and their budget values, along with detailed fields
    const res = await client.query(`
      SELECT id, name, deskripsi, catatan_anggaran
      FROM public.programs
      WHERE deskripsi IS NOT NULL OR name LIKE 'Rapat Koordinasi MS%'
      LIMIT 5;
    `);
    
    console.log('Programs description verification:');
    console.log(JSON.stringify(res.rows, null, 2));

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

run();
