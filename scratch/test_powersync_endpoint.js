const https = require('https');

const url = 'https://6a4f5b6ac40e98e6c9525e79.powersync.journeyapps.com/';

console.log(`Checking reachability of PowerSync endpoint: ${url}`);

const req = https.get(url, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  console.log('Headers:', res.headers);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response body:', data);
    console.log('Reachability check completed successfully!');
  });
});

req.on('error', (err) => {
  console.error('Error reaching PowerSync endpoint:', err);
});

req.end();
