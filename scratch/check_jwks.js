const https = require('https');

const url = 'https://ouesnbkrsejuersezzhk.supabase.co/auth/v1/.well-known/jwks.json';

console.log(`Fetching JWKS from Supabase: ${url}`);

const req = https.get(url, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    try {
      const jwks = JSON.parse(data);
      console.log('JWKS Keys:', JSON.stringify(jwks, null, 2));
    } catch (e) {
      console.log('Raw response:', data);
    }
  });
});

req.on('error', (err) => {
  console.error('Error fetching JWKS:', err);
});

req.end();
