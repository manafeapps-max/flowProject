const fs = require('fs');
const path = require('path');

const url = 'https://ouesnbkrsejuersezzhk.supabase.co/rest/v1/';
const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91ZXNuYmtyc2VqdWVyc2V6emhrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTMzMTg4MCwiZXhwIjoyMDk2OTA3ODgwfQ.QJHCx3LEepFh2pAWNnHmNvT1ceLMhhtT3fB-_IroMaM';

async function run() {
  try {
    const res = await fetch(url, {
      headers: {
        'apikey': apiKey,
        'Authorization': `Bearer ${apiKey}`
      }
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch schema: ${res.statusText}`);
    }
    const data = await res.json();
    fs.writeFileSync(path.join(__dirname, 'schema_openapi.json'), JSON.stringify(data, null, 2));
    console.log('Successfully wrote schema_openapi.json');
    
    // Print summary of tables and views
    const tables = Object.keys(data.paths || {});
    console.log('Exposed endpoints/tables/views:');
    console.log(tables);
  } catch (err) {
    console.error('Error:', err);
  }
}

run();
