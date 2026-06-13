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

    if (authError) {
      throw authError;
    }

    console.log('Login successful! Token acquired.');
    console.log(`User ID: ${authData.user.id}`);

    console.log('\nQuerying periods as authenticated user...');
    const { data: periods, error: queryError } = await supabase
      .from('periods')
      .select('*');

    if (queryError) {
      throw queryError;
    }

    console.log('Periods fetched successfully under RLS:');
    console.log(JSON.stringify(periods, null, 2));

  } catch (err) {
    console.error('Error:', err.message);
  }
}

run();
