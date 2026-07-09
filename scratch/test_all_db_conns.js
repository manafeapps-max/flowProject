const { Client } = require('pg');

const hosts = [
  'db.ouesnbkrsejuersezzhk.supabase.co',
  'aws-0-ap-southeast-1.pooler.supabase.com',
  '2406:da18:e5c:b700:d7eb:a980:c745:47b1'
];

const passwords = [
  '8hZ6SectdwpTk6#',
  'OtUj03yINyj2RvEx',
  'Le0nard123#'
];

const configurations = [];

for (const host of hosts) {
  for (const password of passwords) {
    // Standard connection
    configurations.push({
      name: `Host: ${host}, Port: 5432, User: postgres, Pass: ${password.substring(0, 3)}...`,
      clientConfig: {
        host,
        port: 5432,
        user: 'postgres',
        password,
        database: 'postgres',
        ssl: { rejectUnauthorized: false }
      }
    });

    // Pooler connection
    if (host.includes('pooler')) {
      configurations.push({
        name: `Host: ${host}, Port: 6543, User: postgres.ouesnbkrsejuersezzhk, Pass: ${password.substring(0, 3)}...`,
        clientConfig: {
          host,
          port: 6543,
          user: 'postgres.ouesnbkrsejuersezzhk',
          password,
          database: 'postgres',
          ssl: { rejectUnauthorized: false }
        }
      });
    }
  }
}

async function testAll() {
  console.log(`Testing ${configurations.length} database connection configurations...`);
  for (const config of configurations) {
    console.log(`\nTesting: ${config.name}`);
    const client = new Client(config.clientConfig);
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Connection timeout (5s)')), 5000)
    );
    try {
      await Promise.race([
        client.connect(),
        timeoutPromise
      ]);
      console.log('SUCCESS!');
      const res = await client.query('SELECT NOW()');
      console.log('Time from DB:', res.rows[0].now);
      await client.end();
      // If we find a success, let's stop and report it
      console.log('Found working configuration! Config details:', {
        host: config.clientConfig.host,
        port: config.clientConfig.port,
        user: config.clientConfig.user,
        password: config.clientConfig.password
      });
      return;
    } catch (err) {
      console.log(`FAILED: ${err.message}`);
      try {
        await client.end();
      } catch (e) {}
    }
  }
  console.log('\nAll configuration attempts failed.');
}

testAll();
