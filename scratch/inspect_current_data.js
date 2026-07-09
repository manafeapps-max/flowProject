const { Client } = require('pg');

const config = {
  host: 'aws-1-ap-southeast-1.pooler.supabase.com',
  port: 5432,
  user: 'postgres.ouesnbkrsejuersezzhk',
  password: '8hZ6SectdwpTk6#',
  database: 'postgres',
  ssl: {
    rejectUnauthorized: false
  }
};

async function check() {
  const client = new Client(config);
  try {
    await client.connect();
    
    const periodsRes = await client.query('SELECT id, name, is_active FROM public.periods');
    console.log(`Periods (${periodsRes.rowCount}):`);
    periodsRes.rows.forEach(r => console.log(`- ${r.name} (Active: ${r.is_active}) [ID: ${r.id}]`));

    const unitsRes = await client.query('SELECT id, name FROM public.organization_units');
    console.log(`\nOrganization Units (${unitsRes.rowCount}):`);
    unitsRes.rows.forEach(r => console.log(`- ${r.name}`));

    const bidangsRes = await client.query('SELECT id, name FROM public.bidang');
    console.log(`\nBidang (${bidangsRes.rowCount}):`);
    bidangsRes.rows.forEach(r => console.log(`- ${r.name}`));

    const membersRes = await client.query('SELECT id, name, email FROM public.members');
    console.log(`\nMembers (${membersRes.rowCount}):`);
    membersRes.rows.forEach(r => console.log(`- ${r.name} (${r.email || 'no email'})`));

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

check();
