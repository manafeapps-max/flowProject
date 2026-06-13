const fs = require('fs');
const path = require('path');

const dataSqlPath = path.join(__dirname, '..', 'olddata_supabase', 'data.sql');
const dataSql = fs.readFileSync(dataSqlPath, 'utf8');

console.log('File length:', dataSql.length);
console.log('Contains "anggaran_program":', dataSql.includes('anggaran_program'));
console.log('Contains "anggaran":', dataSql.includes('anggaran'));

// Find lines containing "anggaran"
const lines = dataSql.split('\n');
let count = 0;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].toLowerCase().includes('anggaran')) {
    console.log(`Line ${i + 1}: ${lines[i].substring(0, 120)}`);
    count++;
    if (count > 10) break;
  }
}
