import { supabase } from './supabase';
import { db } from './db';

// Pull changes from Supabase to Dexie
export async function syncPull() {
  try {
    console.log('Sync Pull: Fetching latest data from Supabase...');

    // 1. Pull periods
    const { data: periods, error: pError } = await supabase.from('periods').select('*');
    if (pError) throw pError;
    if (periods) {
      await db.transaction('rw', db.periods, async () => {
        for (const p of periods) {
          await db.periods.put({ ...p, sync_status: 'SYNCED' });
        }
      });
    }

    // 2. Pull organization units
    const { data: units, error: uError } = await supabase.from('organization_units').select('*');
    if (uError) throw uError;
    if (units) {
      await db.transaction('rw', db.organization_units, async () => {
        for (const u of units) {
          await db.organization_units.put({ ...u, sync_status: 'SYNCED' });
        }
      });
    }

    // 3. Pull programs
    const { data: programs, error: prError } = await supabase.from('programs').select('*');
    if (prError) throw prError;
    if (programs) {
      await db.transaction('rw', db.programs, async () => {
        for (const pr of programs) {
          await db.programs.put({ ...pr, sync_status: 'SYNCED' });
        }
      });
    }

    // 3.5. Pull program types
    const { data: typePrograms, error: tpError } = await supabase.from('type_program').select('*');
    if (tpError) throw tpError;
    if (typePrograms) {
      await db.transaction('rw', db.type_program, async () => {
        for (const tp of typePrograms) {
          await db.type_program.put({ ...tp, sync_status: 'SYNCED' });
        }
      });
    }

    // 4. Pull detailed budgets (anggaran_program)
    const { data: budgets, error: bError } = await supabase.from('anggaran_program').select('*');
    if (bError) throw bError;
    if (budgets) {
      await db.transaction('rw', db.anggaran_program, async () => {
        for (const b of budgets) {
          await db.anggaran_program.put({ ...b, sync_status: 'SYNCED' });
        }
      });
    }

    console.log('Sync Pull complete.');
  } catch (err) {
    console.error('Sync Pull failed:', err);
  }
}

// Push local changes to Supabase
export async function syncPush() {
  try {
    console.log('Sync Push: Pushing pending changes to Supabase...');

    // 1. Push pending periods
    const pendingPeriods = await db.periods.where('sync_status').equals('PENDING').toArray();
    for (const p of pendingPeriods) {
      const { id, sync_status, ...rest } = p;
      const { error } = await supabase.from('periods').upsert({ id, ...rest });
      if (error) {
        await db.periods.update(id, { sync_status: 'ERROR' });
        console.error(`Error syncing period ${id}:`, error.message);
      } else {
        await db.periods.update(id, { sync_status: 'SYNCED' });
      }
    }

    // 2. Push pending organization units
    const pendingUnits = await db.organization_units.where('sync_status').equals('PENDING').toArray();
    for (const u of pendingUnits) {
      const { id, sync_status, ...rest } = u;
      const { error } = await supabase.from('organization_units').upsert({ id, ...rest });
      if (error) {
        await db.organization_units.update(id, { sync_status: 'ERROR' });
        console.error(`Error syncing unit ${id}:`, error.message);
      } else {
        await db.organization_units.update(id, { sync_status: 'SYNCED' });
      }
    }

    // 3. Push pending programs
    const pendingPrograms = await db.programs.where('sync_status').equals('PENDING').toArray();
    for (const pr of pendingPrograms) {
      const { id, sync_status, ...rest } = pr;
      const { error } = await supabase.from('programs').upsert({ id, ...rest });
      if (error) {
        await db.programs.update(id, { sync_status: 'ERROR' });
        console.error(`Error syncing program ${id}:`, error.message);
      } else {
        await db.programs.update(id, { sync_status: 'SYNCED' });
      }
    }

    // 3.5. Push pending program types
    const pendingTypePrograms = await db.type_program.where('sync_status').equals('PENDING').toArray();
    for (const tp of pendingTypePrograms) {
      const { id, sync_status, ...rest } = tp;
      const { error } = await supabase.from('type_program').upsert({ id, ...rest });
      if (error) {
        await db.type_program.update(id, { sync_status: 'ERROR' });
        console.error(`Error syncing type program ${id}:`, error.message);
      } else {
        await db.type_program.update(id, { sync_status: 'SYNCED' });
      }
    }

    // 4. Push pending budgets (anggaran_program)
    const pendingBudgets = await db.anggaran_program.where('sync_status').equals('PENDING').toArray();
    for (const b of pendingBudgets) {
      const { id, sync_status, ...rest } = b;
      const { error } = await supabase.from('anggaran_program').upsert({ id, ...rest });
      if (error) {
        await db.anggaran_program.update(id, { sync_status: 'ERROR' });
        console.error(`Error syncing budget line ${id}:`, error.message);
      } else {
        await db.anggaran_program.update(id, { sync_status: 'SYNCED' });
      }
    }

    console.log('Sync Push complete.');
  } catch (err) {
    console.error('Sync Push failed:', err);
  }
}

// Orchestrate both pull and push
export async function syncAll() {
  await syncPush();
  await syncPull();
}
