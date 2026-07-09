const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (!fs.existsSync(envPath)) {
    throw new Error('.env.local file not found');
  }
  const content = fs.readFileSync(envPath, 'utf8');
  const env = {};
  content.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      let value = match[2] ? match[2].trim() : '';
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.substring(1, value.length - 1);
      } else if (value.startsWith("'") && value.endsWith("'")) {
        value = value.substring(1, value.length - 1);
      }
      env[match[1]] = value;
    }
  });
  return env;
}

async function run() {
  try {
    const env = loadEnv();
    const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log('Logging in as stolaputih@gmail.com to check synced settings...');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'stolaputih@gmail.com',
      password: 'Le0nard123#'
    });
    if (authError) throw authError;
    console.log('Login successful! Checking settings data in Supabase...\n');


    // 1. Fetch Periods
    const { data: periods, error: pError } = await supabase.from('periods').select('id, name, start_date, end_date, is_active');
    if (pError) throw pError;
    console.log(`=== periods Table (${periods.length} rows in Supabase) ===`);
    console.table(periods);

    // 2. Fetch Bidang
    const { data: bidang, error: bError } = await supabase.from('bidang').select('id, name, code');
    if (bError) throw bError;
    console.log(`\n=== bidang Table (${bidang.length} rows in Supabase) ===`);
    console.table(bidang);

    // 3. Fetch Sub Bidang
    const { data: subBidang, error: sbError } = await supabase.from('sub_bidang').select('id, name, code, bidang_id');
    if (sbError) throw sbError;
    console.log(`\n=== sub_bidang Table (${subBidang.length} rows in Supabase) ===`);
    console.table(subBidang);

    // 4. Fetch Organization Units
    const { data: units, error: uError } = await supabase.from('organization_units').select('id, name, parent_id');
    if (uError) throw uError;
    console.log(`\n=== organization_units Table (${units.length} rows in Supabase) ===`);
    console.table(units);

  } catch (err) {
    console.error('Error querying Supabase:', err.message);
  }
}

run();
