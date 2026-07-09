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

    // 1. Insert fallback/default admin member into members table
    console.log('Inserting default admin member...');
    await client.query(`
      INSERT INTO public.members (id, name, email, status)
      VALUES ('de641feb-9990-4057-ba23-6c66253e2fa9', 'Stola Putih Admin', 'stolaputih@gmail.com', 'ACTIVE')
      ON CONFLICT (id) DO UPDATE SET 
        name = EXCLUDED.name,
        email = EXCLUDED.email;
    `);
    console.log('Default admin member verified.');

    // 2. Drop the old foreign key constraint referencing memberships(id)
    console.log('Dropping old programs_pic_membership_id_fkey constraint...');
    await client.query(`
      ALTER TABLE public.programs 
      DROP CONSTRAINT IF EXISTS programs_pic_membership_id_fkey;
    `);
    console.log('Old constraint dropped.');

    // 3. Add the new foreign key constraint referencing members(id)
    console.log('Adding new programs_pic_membership_id_fkey constraint pointing to public.members(id)...');
    await client.query(`
      ALTER TABLE public.programs 
      ADD CONSTRAINT programs_pic_membership_id_fkey 
      FOREIGN KEY (pic_membership_id) REFERENCES public.members(id);
    `);
    console.log('New constraint added successfully.');

    // 4. Reload PostgREST schema cache
    console.log('Reloading PostgREST schema cache...');
    await client.query("NOTIFY pgrst, 'reload schema';");
    console.log('PostgREST schema cache reload signal sent.');

  } catch (err) {
    console.error('Error during execution:', err);
  } finally {
    await client.end();
  }
}

run();
