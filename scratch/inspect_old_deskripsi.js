const fs = require('fs');
const path = require('path');

const dataSqlPath = path.join(__dirname, '..', 'olddata_supabase', 'data.sql');
if (!fs.existsSync(dataSqlPath)) {
  console.log('data.sql not found.');
  process.exit(0);
}
const dataSql = fs.readFileSync(dataSqlPath, 'utf8');

// Find all INSERT INTO public.program statements and print their deskripsi values
const lines = dataSql.split('\n');
console.log('Searching for program insert statements...');

let programInsertLines = [];
lines.forEach(line => {
  if (line.includes('INSERT INTO public.program ')) {
    programInsertLines.push(line);
  } else if (line.includes('INSERT INTO public.program VALUES')) {
    programInsertLines.push(line);
  }
});

console.log(`Found ${programInsertLines.length} insert statements.`);

// Let's print some sample lines to see what they look like
programInsertLines.slice(0, 15).forEach((line, i) => {
  // Extract values inside VALUES (...)
  const match = line.match(/VALUES\s*\((.*)\);/i);
  if (match) {
    const valuesStr = match[1];
    // Split by comma, but respect single quotes (simplified splitter)
    let values = [];
    let current = '';
    let inQuote = false;
    for (let j = 0; j < valuesStr.length; j++) {
      const char = valuesStr[j];
      if (char === "'") {
        inQuote = !inQuote;
        current += char;
      } else if (char === ',' && !inQuote) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    if (current.trim()) {
      values.push(current.trim());
    }

    // According to public.program schema:
    // 0: id
    // 1: program_code
    // 2: title
    // 3: tujuan_program
    // 4: tahun_anggaran
    // 5: triwulan
    // 6: bulan
    // 7: periode_id
    // 8: bidang_id
    // 9: sub_bidang_id
    // 10: type_program_id
    // 11: frekuensi
    // 12: lokasi
    // 13: deskripsi (which is index 13!)
    // 14: ik_kualitatif
    const title = values[2];
    const deskripsi = values[13];
    const ik_kualitatif = values[14];
    console.log(`\nProgram ${i+1}: ${title}`);
    console.log(`- Deskripsi: ${deskripsi}`);
    console.log(`- IK Kualitatif: ${ik_kualitatif}`);
  }
});
