const fs = require('fs');
const path = require('path');
const https = require('https');
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
    const powersyncUrl = env.NEXT_PUBLIC_POWERSYNC_URL;

    console.log('1. Connecting to Supabase...');
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    console.log('2. Logging in as stolaputih@gmail.com...');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'stolaputih@gmail.com',
      password: 'Le0nard123#'
    });

    if (authError) {
      throw new Error(`Supabase Auth failed: ${authError.message}`);
    }

    const token = authData.session.access_token;
    console.log('✅ Supabase login successful!');
    console.log(`Access Token acquired (starts with: ${token.substring(0, 15)}...)`);

    // Prepare endpoint
    const cleanUrl = powersyncUrl.replace(/\/$/, '');
    const syncStreamUrl = `${cleanUrl}/sync/stream`;
    console.log(`\n3. Sending POST handshake request to PowerSync: ${syncStreamUrl}`);

    const urlObj = new URL(syncStreamUrl);
    
    // PowerSync expected stream request body.
    // The minimal shape requires buckets. Since we don't have local sync state, we can send empty/default.
    const requestBody = JSON.stringify({
      buckets: []
    });

    const options = {
      hostname: urlObj.hostname,
      port: 443,
      path: urlObj.pathname + urlObj.search,
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestBody),
        'Accept': 'application/x-ndjson, application/json',
      }
    };

    const req = https.request(options, (res) => {
      console.log(`\n--- Handshake Response Received ---`);
      console.log(`HTTP Status Code: ${res.statusCode}`);
      console.log('Headers:', res.headers);

      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
        console.log('\n--- Chunk Received ---');
        console.log(chunk.toString());
        console.log('----------------------');
        
        // If we get chunks from a 200, or a specific JSON response, let's process it.
        // If we successfully hit the stream, we close after first chunks to not hang.
        if (res.statusCode === 200) {
          req.destroy();
        }
      });

      res.on('end', () => {
        console.log('\nResponse Stream Ended.');
        if (res.statusCode !== 200) {
          console.log('Full response body received:', body);
        }
      });
    });

    req.on('error', (err) => {
      if (err.code === 'ECONNRESET' || req.destroyed) {
        console.log('\nHandshake test finished (request destroyed manually after receiving chunk).');
        return;
      }
      console.error('\n❌ PowerSync connection error:', err);
    });

    req.write(requestBody);
    req.end();

  } catch (err) {
    console.error('\n❌ Test failed:', err.message);
  }
}

run();
