const fs = require('fs');
const path = require('path');

const schemaSqlPath = path.join(__dirname, '..', 'olddata_supabase', 'schema.sql');
if (!fs.existsSync(schemaSqlPath)) {
  console.log('Old schema file not found.');
  process.exit(0);
}
const schemaSql = fs.readFileSync(schemaSqlPath, 'utf8');

// Find enum definition of triwulan_enum
const regex = /CREATE TYPE\s+(?:public\.)?triwulan_enum\b[^]*?;/gi;
const match = schemaSql.match(regex);
if (match) {
  console.log('Old triwulan_enum definition:');
  console.log(match[0]);
} else {
  console.log('Old triwulan_enum not found in schema.sql. Searching with regex...');
  const lines = schemaSql.split('\n');
  lines.forEach((line, i) => {
    if (line.toLowerCase().includes('triwulan_enum')) {
      console.log(`Line ${i + 1}: ${line}`);
    }
  });
}
