const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
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

// HS256 verification helper
function verifyHS256(token, secret, secretEncoding = 'utf8') {
  try {
    const [headerB64, payloadB64, signatureB64] = token.split('.');
    if (!headerB64 || !payloadB64 || !signatureB64) {
      return false;
    }

    const signingInput = `${headerB64}.${payloadB64}`;
    const key = Buffer.from(secret, secretEncoding);
    
    const hmac = crypto.createHmac('sha256', key);
    hmac.update(signingInput);
    
    // base64url encoding
    const expectedSignature = hmac.digest('base64url');
    
    // Normalize signature format (some systems output base64 instead of base64url)
    const normalizedSignature = signatureB64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    
    return expectedSignature === normalizedSignature;
  } catch (err) {
    console.error('Verification error:', err);
    return false;
  }
}

async function run() {
  try {
    const env = loadEnv();
    const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // Supabase JWT secret from generate_secret.js
    const supabaseJwtSecret = "t3W0pe8NBCOxHmP58t+7W+Wys3EBBjVW1AYch8Y+pjKQcw2Ji5y+U3epuxr8jd3xHN9tymjjaTwWeeyV7jItUQ==";

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

    console.log('\nTesting Method A: Verify as plain UTF-8 string secret');
    const verifyA = verifyHS256(token, supabaseJwtSecret, 'utf8');
    console.log(`Method A Result: ${verifyA ? '✅ VALID SIGNATURE' : '❌ INVALID SIGNATURE'}`);

    console.log('\nTesting Method B: Verify as base64-decoded byte secret');
    const verifyB = verifyHS256(token, supabaseJwtSecret, 'base64');
    console.log(`Method B Result: ${verifyB ? '✅ VALID SIGNATURE' : '❌ INVALID SIGNATURE'}`);

  } catch (err) {
    console.error('Error:', err.message);
  }
}

run();
