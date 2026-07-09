const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (!fs.existsSync(envPath)) {
    throw new Error('.env.local file not found');
  }
  const content = fs.readFileSync(envPath, 'utf8');
  const env = {};
  content.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      let value = match[2] ? match[2].trim() : '';
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.substring(1, value.length - 1);
      } else if (value.startsWith("'") && value.endsWith("'")) {
        value = value.substring(1, value.length - 1);
      }
      env[match[1]] = value;
    }
  });
  return env;
}

async function run() {
  try {
    const env = loadEnv();
    const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91ZXNuYmtyc2VqdWVyc2V6emhrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTMzMTg4MCwiZXhwIjoyMDk2OTA3ODgwfQ.QJHCx3LEepFh2pAWNnHmNvT1ceLMhhtT3fB-_IroMaM';

    console.log('Connecting to Supabase using service_role key...');
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const PELKES_BIDANG_ID = '550e8400-e29b-41d4-a716-446655440010';

    console.log(`Updating all programs on Supabase where pjp_bidang_id != '${PELKES_BIDANG_ID}' to PELKES...`);
    
    // First, let's fetch to see how many need updating
    const { data: programsBefore, error: fetchError } = await supabase
      .from('programs')
      .select('id, name, pjp_bidang_id');
    
    if (fetchError) throw fetchError;
    
    console.log(`Total programs found on Supabase: ${programsBefore.length}`);
    const toUpdate = programsBefore.filter(p => p.pjp_bidang_id !== PELKES_BIDANG_ID);
    console.log(`Programs needing update: ${toUpdate.length}`);
    
    if (toUpdate.length === 0) {
      console.log('No programs need updating on Supabase.');
      return;
    }

    const { data: updatedData, error: updateError } = await supabase
      .from('programs')
      .update({ pjp_bidang_id: PELKES_BIDANG_ID })
      .neq('pjp_bidang_id', PELKES_BIDANG_ID)
      .select();

    if (updateError) throw updateError;

    console.log(`Successfully updated ${updatedData.length} programs on Supabase.`);
  } catch (err) {
    console.error('Error:', err.message || err);
  }
}

run();
