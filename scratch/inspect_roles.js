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
    console.log('Logging in as stolaputih@gmail.com...');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'stolaputih@gmail.com',
      password: 'Le0nard123#'
    });
    if (authError) throw authError;
    console.log('Login successful!\n');

    // 1. Fetch user_role
    console.log('Fetching user_role from Supabase...');
    const { data: userRoles, error: urError } = await supabase.from('user_role').select('*');
    if (urError) throw urError;
    console.log(`=== user_role Table (${userRoles.length} rows in Supabase) ===`);
    console.log(JSON.stringify(userRoles, null, 2));

    // 2. Fetch periods
    console.log('\nFetching periods from Supabase...');
    const { data: periods, error: pError } = await supabase.from('periods').select('*');
    if (pError) throw pError;
    console.log(`=== periods Table (${periods.length} rows in Supabase) ===`);
    console.log(JSON.stringify(periods, null, 2));

  } catch (err) {
    console.error('Error querying Supabase:', err.message);
  }
}

run();
