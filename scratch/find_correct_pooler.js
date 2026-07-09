const { Client } = require('pg');
const dns = require('dns').promises;

const regions = [
  'ap-southeast-1', // Singapore
];

const indices = [0, 1, 2, 3];

async function run() {
  const password = '8hZ6SectdwpTk6#'; // Or OtUj03yINyj2RvEx
  const passwords = ['8hZ6SectdwpTk6#', 'OtUj03yINyj2RvEx'];

  console.log('Resolving and testing various pooler hosts...');
  
  for (const region of regions) {
    for (const idx of indices) {
      const host = `aws-${idx}-${region}.pooler.supabase.com`;
      try {
        console.log(`\nResolving DNS for ${host}...`);
        const addresses = await dns.resolve4(host);
        console.log(`Resolved IP: ${addresses.join(', ')}`);
        
        for (const pass of passwords) {
          console.log(`Attempting connection to ${host} using user: postgres.ouesnbkrsejuersezzhk and password prefix ${pass.substring(0, 3)}...`);
          const client = new Client({
            host,
            port: 6543,
            user: 'postgres.ouesnbkrsejuersezzhk',
            password: pass,
            database: 'postgres',
            ssl: { rejectUnauthorized: false }
          });
          
          try {
            await Promise.race([
              client.connect(),
              new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 4000))
            ]);
            console.log(`SUCCESS! Connected to ${host} with pass ${pass}`);
            const res = await client.query('SELECT NOW()');
            console.log('DB Time:', res.rows[0].now);
            await client.end();
            return;
          } catch (connErr) {
            console.log(`Failed: ${connErr.message}`);
            try { await client.end(); } catch(e) {}
          }
        }
      } catch (dnsErr) {
        console.log(`Host ${host} could not be resolved: ${dnsErr.message}`);
      }
    }
  }
  
  console.log('\nFinished testing.');
}

run();
