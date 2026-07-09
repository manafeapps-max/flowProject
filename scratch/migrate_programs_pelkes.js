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

const OLD_BIDANG_ID = '550e8400-e29b-41d4-a716-446655440010'; // Bidang II Pelkes
const NEW_BIDANG_ID = '0afad6c9-335e-443c-904a-be6e797f8caa'; // BD02 PELKES

const UNIT_MAPPING = {
  '550e8400-e29b-41d4-a716-446655440020': '47eb5df9-0d72-41f3-b165-3f096cb645ea', // Pelkes -> DPelkes
  '550e8400-e29b-41d4-a716-446655440021': '1031ddce-5aae-4a77-a940-575bdf54a5f7', // UPB -> UPB
  '550e8400-e29b-41d4-a716-446655440022': '56c5e437-2bf4-4cd8-8125-713e830291c6', // UP2M -> UP2M
  '550e8400-e29b-41d4-a716-446655440023': '272f47c2-e43d-4681-9892-f97f18c25132'  // PMKI -> PMKI
};

const clean = (str) => (str || '').replace(/[^a-zA-Z0-9]+/g, '').toUpperCase();

async function run() {
  const client = new Client(config);
  try {
    await client.connect();
    console.log('Connected to Supabase PostgreSQL.');

    // 1. Fetch lookup data for generating codes
    console.log('Fetching lookup data (bidang, organization_units, type_program)...');
    const bidangRes = await client.query("SELECT id, name FROM bidang;");
    const bidangs = {};
    bidangRes.rows.forEach(b => { bidangs[b.id] = b.name; });

    const orgRes = await client.query("SELECT id, name FROM organization_units;");
    const units = {};
    orgRes.rows.forEach(u => { units[u.id] = u.name; });

    const tpRes = await client.query("SELECT id, name FROM type_program;");
    const types = {};
    tpRes.rows.forEach(t => { types[t.id] = t.name; });

    // 2. Fetch all programs to migrate
    console.log('Fetching programs referencing old bidang...');
    const programRes = await client.query(`
      SELECT * FROM programs 
      WHERE bidang_id = $1 OR pjp_bidang_id = $1;
    `, [OLD_BIDANG_ID]);
    console.log(`Found ${programRes.rows.length} programs to migrate.`);

    // 3. Start transaction
    await client.query('BEGIN;');

    for (const prog of programRes.rows) {
      const newBidangId = NEW_BIDANG_ID;
      const newPjpBidangId = NEW_BIDANG_ID;
      let newSubBidangId = prog.sub_bidang_id;

      if (prog.sub_bidang_id && UNIT_MAPPING[prog.sub_bidang_id]) {
        newSubBidangId = UNIT_MAPPING[prog.sub_bidang_id];
      }

      // Generate new program code
      const suffix = prog.id.slice(-8).toUpperCase();
      const bName = bidangs[newBidangId] || 'GEN';
      const sbName = units[newSubBidangId] || 'GEN';
      const tpName = types[prog.type_program_id] || 'GEN';
      const newCode = `${clean(bName)}-${clean(sbName)}-${clean(tpName)}-${suffix}`;

      console.log(`Migrating program "${prog.name}":`);
      console.log(`  Code: ${prog.program_code} -> ${newCode}`);
      console.log(`  Bidang: ${prog.bidang_id} -> ${newBidangId}`);
      console.log(`  Sub-Bidang: ${prog.sub_bidang_id} -> ${newSubBidangId}`);

      await client.query(`
        UPDATE public.programs 
        SET 
          bidang_id = $1, 
          pjp_bidang_id = $2, 
          sub_bidang_id = $3, 
          program_code = $4,
          updated_at = NOW()
        WHERE id = $5;
      `, [newBidangId, newPjpBidangId, newSubBidangId, newCode, prog.id]);
    }

    await client.query('COMMIT;');
    console.log('\nMigration committed successfully!');

    // Notify postgrest schema reload
    await client.query("NOTIFY pgrst, 'reload schema';");
    console.log('PostgREST schema cache reloaded.');

  } catch (err) {
    console.error('Migration failed, rolling back:', err);
    try {
      await client.query('ROLLBACK;');
    } catch (rbErr) {
      console.error('Rollback failed:', rbErr);
    }
  } finally {
    await client.end();
  }
}

run();
