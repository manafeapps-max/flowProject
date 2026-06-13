const fs = require('fs');
const path = require('path');

const schemaSqlPath = path.join(__dirname, '..', 'olddata_supabase', 'schema.sql');
if (!fs.existsSync(schemaSqlPath)) {
  console.log('Old schema file not found.');
  process.exit(0);
}
const schemaSql = fs.readFileSync(schemaSqlPath, 'utf8');

// Find table definition of public.program
const regex = /CREATE TABLE\s+(?:public\.)?program\b[^]*?\);/gi;
const match = schemaSql.match(regex);
if (match) {
  console.log('Old program table schema:');
  console.log(match[0]);
} else {
  console.log('Old program table not found in schema.sql. Searching with regex...');
  // Find lines starting with CREATE TABLE
  const lines = schemaSql.split('\n');
  lines.forEach((line, i) => {
    if (line.toLowerCase().includes('create table') && line.toLowerCase().includes('program')) {
      console.log(`Line ${i + 1}: ${line}`);
    }
  });
}
