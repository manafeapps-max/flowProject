const crypto = require('crypto');

const anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91ZXNuYmtyc2VqdWVyc2V6emhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEzMzE4ODAsImV4cCI6MjA5NjkwNzg4MH0.GmGWzjUXH34bT45L0TOOnyzUYvGA44Z4tA_6yaqh8hk";
const supabaseJwtSecret = "t3W0pe8NBCOxHmP58t+7W+Wys3EBBjVW1AYch8Y+pjKQcw2Ji5y+U3epuxr8jd3xHN9tymjjaTwWeeyV7jItUQ==";

function verifyHS256(token, secret, secretEncoding = 'utf8') {
  const [headerB64, payloadB64, signatureB64] = token.split('.');
  const signingInput = `${headerB64}.${payloadB64}`;
  const key = Buffer.from(secret, secretEncoding);
  
  const hmac = crypto.createHmac('sha256', key);
  hmac.update(signingInput);
  
  const expectedSignature = hmac.digest('base64url');
  const normalizedSignature = signatureB64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  
  return expectedSignature === normalizedSignature;
}

console.log('Testing anon key verification:');
console.log('UTF-8 Encoding:', verifyHS256(anonKey, supabaseJwtSecret, 'utf8') ? '✅ VALID' : '❌ INVALID');
console.log('Base64 Decoding:', verifyHS256(anonKey, supabaseJwtSecret, 'base64') ? '✅ VALID' : '❌ INVALID');
