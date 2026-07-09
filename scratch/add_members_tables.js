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

const ddl = `
-- Create members table
CREATE TABLE IF NOT EXISTS members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(100),
    email VARCHAR(255),
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for members
ALTER TABLE members ENABLE ROW LEVEL SECURITY;

-- Create policies for members
DROP POLICY IF EXISTS "Allow authenticated read" ON members;
DROP POLICY IF EXISTS "Allow authenticated write" ON members;

CREATE POLICY "Allow authenticated read" ON members FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated write" ON members FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Create unit_members table
CREATE TABLE IF NOT EXISTS unit_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    unit_id UUID NOT NULL,
    unit_type VARCHAR(50) NOT NULL,
    role_title VARCHAR(255),
    period_id UUID NOT NULL REFERENCES periods(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for unit_members
ALTER TABLE unit_members ENABLE ROW LEVEL SECURITY;

-- Create policies for unit_members
DROP POLICY IF EXISTS "Allow authenticated read" ON unit_members;
DROP POLICY IF EXISTS "Allow authenticated write" ON unit_members;

CREATE POLICY "Allow authenticated read" ON unit_members FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated write" ON unit_members FOR ALL TO authenticated USING (true) WITH CHECK (true);
`;

async function run() {
  const client = new Client(config);
  try {
    await client.connect();
    console.log('Connected to Supabase. Creating members tables...');
    await client.query(ddl);
    console.log('Tables and policies created successfully!');
  } catch (err) {
    console.error('Failed to create tables:', err);
  } finally {
    await client.end();
  }
}

run();
