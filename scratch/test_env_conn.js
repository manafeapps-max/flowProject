const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Helper to parse .env.local
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

    console.log('Testing connection to Supabase...');
    console.log(`URL: ${supabaseUrl}`);
    console.log(`Anon Key Prefix: ${supabaseAnonKey.substring(0, 10)}...`);

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { data: periods, error } = await supabase
      .from('periods')
      .select('*');

    if (error) {
      throw error;
    }

    console.log('\nSupabase connection successful!');
    console.log(`Fetched periods: ${JSON.stringify(periods, null, 2)}`);

  } catch (err) {
    console.error('Error connecting to Supabase:', err.message);
  }
}

run();
