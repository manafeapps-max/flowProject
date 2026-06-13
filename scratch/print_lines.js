const fs = require('fs');
const path = require('path');

const dataSqlPath = path.join(__dirname, '..', 'olddata_supabase', 'data.sql');
const dataSql = fs.readFileSync(dataSqlPath, 'utf8');

const lines = dataSql.split('\n');
for (let i = 308; i < 325; i++) {
  console.log(`Line ${i + 1}: ${lines[i]}`);
}
