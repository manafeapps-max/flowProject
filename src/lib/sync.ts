import { supabase } from './supabase';
import { db } from './db';
import { useAppStore } from '../store/useAppStore';

// Pull changes from Supabase to Dexie
export async function syncPull() {
  try {
    console.log('Sync Pull: Fetching latest data from Supabase...');

    // 1. Pull periods
    const { data: periods, error: pError } = await supabase.from('periods').select('*');
    if (pError) throw pError;
    if (periods) {
      await db.transaction('rw', db.periods, async () => {
        const remoteIds = new Set(periods.map(p => p.id));
        const localItems = await db.periods.toArray();
        for (const item of localItems) {
          if (!remoteIds.has(item.id) && item.sync_status === 'SYNCED') await db.periods.delete(item.id);
        }
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
        const remoteIds = new Set(units.map(u => u.id));
        const localItems = await db.organization_units.toArray();
        for (const item of localItems) {
          if (!remoteIds.has(item.id) && item.sync_status === 'SYNCED') await db.organization_units.delete(item.id);
        }
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
        const remoteIds = new Set(programs.map(p => p.id));
        const localItems = await db.programs.toArray();
        for (const item of localItems) {
          if (!remoteIds.has(item.id) && item.sync_status === 'SYNCED') await db.programs.delete(item.id);
        }
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
        const remoteIds = new Set(typePrograms.map(t => t.id));
        const localItems = await db.type_program.toArray();
        for (const item of localItems) {
          if (!remoteIds.has(item.id) && item.sync_status === 'SYNCED') await db.type_program.delete(item.id);
        }
        for (const tp of typePrograms) {
          await db.type_program.put({ ...tp, sync_status: 'SYNCED' });
        }
      });
    }

    // 3.6. Pull bidang
    const { data: bidangList, error: bdError } = await supabase.from('bidang').select('*');
    if (bdError) throw bdError;
    if (bidangList) {
      await db.transaction('rw', db.bidang, async () => {
        const remoteIds = new Set(bidangList.map(b => b.id));
        const localItems = await db.bidang.toArray();
        for (const item of localItems) {
          if (!remoteIds.has(item.id) && item.sync_status === 'SYNCED') await db.bidang.delete(item.id);
        }
        for (const bd of bidangList) {
          await db.bidang.put({ ...bd, sync_status: 'SYNCED' });
        }
      });
    }



    // 4. Pull detailed budgets (anggaran_program)
    const { data: budgets, error: bError } = await supabase.from('anggaran_program').select('*');
    if (bError) throw bError;
    if (budgets) {
      await db.transaction('rw', db.anggaran_program, async () => {
        const remoteIds = new Set(budgets.map(b => b.id));
        const localItems = await db.anggaran_program.toArray();
        for (const item of localItems) {
          if (!remoteIds.has(item.id) && item.sync_status === 'SYNCED') await db.anggaran_program.delete(item.id);
        }
        for (const b of budgets) {
          await db.anggaran_program.put({ ...b, sync_status: 'SYNCED' });
        }
      });
    }
    // 5. Pull members
    const { data: members, error: mError } = await supabase.from('members').select('*');
    if (mError) throw mError;
    if (members) {
      await db.transaction('rw', db.members, async () => {
        const remoteIds = new Set(members.map(m => m.id));
        const localItems = await db.members.toArray();
        for (const item of localItems) {
          if (!remoteIds.has(item.id) && item.sync_status === 'SYNCED') await db.members.delete(item.id);
        }
        for (const m of members) {
          await db.members.put({ ...m, sync_status: 'SYNCED' });
        }
      });
    }

    // 6. Pull unit_members
    const { data: unitMembers, error: umError } = await supabase.from('unit_members').select('*');
    if (umError) throw umError;
    if (unitMembers) {
      await db.transaction('rw', db.unit_members, async () => {
        const remoteIds = new Set(unitMembers.map(u => u.id));
        const localItems = await db.unit_members.toArray();
        for (const item of localItems) {
          if (!remoteIds.has(item.id) && item.sync_status === 'SYNCED') await db.unit_members.delete(item.id);
        }
        for (const um of unitMembers) {
          await db.unit_members.put({ ...um, sync_status: 'SYNCED' });
        }
      });
    }

    // 7. Pull user roles
    const { data: userRoles, error: urError } = await supabase.from('user_role').select('*');
    if (urError) throw urError;
    if (userRoles) {
      await db.transaction('rw', db.user_roles, async () => {
        const remoteIds = new Set(userRoles.map(ur => ur.id));
        const localItems = await db.user_roles.toArray();
        for (const item of localItems) {
          if (!remoteIds.has(item.id) && item.sync_status === 'SYNCED') await db.user_roles.delete(item.id);
        }
        for (const ur of userRoles) {
          await db.user_roles.put({ ...ur, sync_status: 'SYNCED' });
        }
      });
    }

    // 7.5. Pull program_responsibility_pp
    const { data: programPPs, error: ppError } = await supabase.from('program_responsibility_pp').select('*');
    if (ppError) throw ppError;
    if (programPPs) {
      await db.transaction('rw', db.program_responsibility_pp, async () => {
        const remoteIds = new Set(programPPs.map(pp => pp.id));
        const localItems = await db.program_responsibility_pp.toArray();
        for (const item of localItems) {
          if (!remoteIds.has(item.id) && item.sync_status === 'SYNCED') await db.program_responsibility_pp.delete(item.id);
        }
        for (const pp of programPPs) {
          await db.program_responsibility_pp.put({ ...pp, sync_status: 'SYNCED' });
        }
      });
    }

    // 8. Pull user profiles (view-based fallback)
    try {
      const { data: userProfiles, error: upvError } = await supabase.from('user_profiles').select('*');
      if (!upvError && userProfiles) {
        await db.transaction('rw', db.user_profiles, async () => {
          const remoteIds = new Set(userProfiles.map(up => up.id));
          const localItems = await db.user_profiles.toArray();
          for (const item of localItems) {
            if (!remoteIds.has(item.id) && item.sync_status === 'SYNCED') await db.user_profiles.delete(item.id);
          }
          for (const up of userProfiles) {
            await db.user_profiles.put({ ...up, sync_status: 'SYNCED' });
          }
        });
      }
    } catch (profileError) {
      console.warn('Sync Pull: user_profiles view not available, skipping.', profileError);
    }

    // 9. Pull occasions
    const { data: occasions, error: ocError } = await supabase.from('occasions').select('*');
    if (ocError) throw ocError;
    if (occasions) {
      await db.transaction('rw', db.occasions, async () => {
        const remoteIds = new Set(occasions.map(o => o.id));
        const localItems = await db.occasions.toArray();
        for (const item of localItems) {
          if (!remoteIds.has(item.id) && item.sync_status === 'SYNCED') await db.occasions.delete(item.id);
        }
        for (const o of occasions) {
          await db.occasions.put({ ...o, sync_status: 'SYNCED' });
        }
      });
    }

    console.log('Sync Pull complete.');
  } catch (err) {
    console.error('Sync Pull failed:', err);
    throw err;
  }
}

// Push local changes to Supabase
export async function syncPush(): Promise<boolean> {
  let hasErrors = false;
  try {
    console.log('Sync Push: Pushing pending changes to Supabase...');

    // 1. Push pending periods
    const pendingPeriods = await db.periods.where('sync_status').equals('PENDING').toArray();
    for (const p of pendingPeriods) {
      const { id, sync_status, ...rest } = p;
      const { error } = await supabase.from('periods').upsert({ id, ...rest });
      if (error) {
        hasErrors = true;
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
        hasErrors = true;
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
        hasErrors = true;
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
        hasErrors = true;
        await db.type_program.update(id, { sync_status: 'ERROR' });
        console.error(`Error syncing type program ${id}:`, error.message);
      } else {
        await db.type_program.update(id, { sync_status: 'SYNCED' });
      }
    }

    // 3.6. Push pending bidang
    const pendingBidang = await db.bidang.where('sync_status').equals('PENDING').toArray();
    for (const bd of pendingBidang) {
      const { id, sync_status, ...rest } = bd;
      const { error } = await supabase.from('bidang').upsert({ id, ...rest });
      if (error) {
        hasErrors = true;
        await db.bidang.update(id, { sync_status: 'ERROR' });
        console.error(`Error syncing bidang ${id}:`, error.message);
      } else {
        await db.bidang.update(id, { sync_status: 'SYNCED' });
      }
    }

    // 4. Push pending budgets (anggaran_program)
    const pendingBudgets = await db.anggaran_program.where('sync_status').equals('PENDING').toArray();
    for (const b of pendingBudgets) {
      const { id, sync_status, sub_total, ...rest } = b;
      const { error } = await supabase.from('anggaran_program').upsert({ id, ...rest });
      if (error) {
        hasErrors = true;
        await db.anggaran_program.update(id, { sync_status: 'ERROR' });
        console.error(`Error syncing budget line ${id}:`, error.message);
      } else {
        await db.anggaran_program.update(id, { sync_status: 'SYNCED' });
      }
    }

    // 5. Push pending members
    const pendingMembers = await db.members.where('sync_status').equals('PENDING').toArray();
    for (const m of pendingMembers) {
      const { id, sync_status, ...rest } = m;
      const { error } = await supabase.from('members').upsert({ id, ...rest });
      if (error) {
        hasErrors = true;
        await db.members.update(id, { sync_status: 'ERROR' });
        console.error(`Error syncing member ${id}:`, error.message);
      } else {
        await db.members.update(id, { sync_status: 'SYNCED' });
      }
    }

    // 6. Push pending unit_members
    const pendingUnitMembers = await db.unit_members.where('sync_status').equals('PENDING').toArray();
    for (const um of pendingUnitMembers) {
      const { id, sync_status, ...rest } = um;
      const { error } = await supabase.from('unit_members').upsert({ id, ...rest });
      if (error) {
        hasErrors = true;
        await db.unit_members.update(id, { sync_status: 'ERROR' });
        console.error(`Error syncing unit_member ${id}:`, error.message);
      } else {
        await db.unit_members.update(id, { sync_status: 'SYNCED' });
      }
    }

    // 6.5. Push pending user roles
    const pendingUserRoles = await db.user_roles.where('sync_status').equals('PENDING').toArray();
    for (const ur of pendingUserRoles) {
      const { id, sync_status, ...rest } = ur;
      const { error } = await supabase.from('user_role').upsert({ id, ...rest });
      if (error) {
        hasErrors = true;
        await db.user_roles.update(id, { sync_status: 'ERROR' });
        console.error(`Error syncing user role ${id}:`, error.message);
      } else {
        await db.user_roles.update(id, { sync_status: 'SYNCED' });
      }
    }

    // 6.6. Push pending program_responsibility_pp
    const pendingPPs = await db.program_responsibility_pp.where('sync_status').equals('PENDING').toArray();
    for (const pp of pendingPPs) {
      const { id, sync_status, ...rest } = pp;
      const { error } = await supabase.from('program_responsibility_pp').upsert({ id, ...rest });
      if (error) {
        hasErrors = true;
        await db.program_responsibility_pp.update(id, { sync_status: 'ERROR' });
        console.error(`Error syncing program_responsibility_pp ${id}:`, error.message);
      } else {
        await db.program_responsibility_pp.update(id, { sync_status: 'SYNCED' });
      }
    }

    // 6.7. Push pending occasions
    const pendingOccasions = await db.occasions.where('sync_status').equals('PENDING').toArray();
    for (const o of pendingOccasions) {
      const { id, sync_status, ...rest } = o;
      const { error } = await supabase.from('occasions').upsert({ id, ...rest });
      if (error) {
        hasErrors = true;
        await db.occasions.update(id, { sync_status: 'ERROR' });
        console.error(`Error syncing occasion ${id}:`, error.message);
      } else {
        await db.occasions.update(id, { sync_status: 'SYNCED' });
      }
    }

    // 7. Push deletions (tombstones)
    const pendingDeletes = await db.deleted_records.where('sync_status').equals('PENDING').toArray();
    for (const record of pendingDeletes) {
      const { error } = await supabase.from(record.table_name).delete().eq('id', record.id);
      if (error) {
        hasErrors = true;
        await db.deleted_records.update(record.id, { sync_status: 'ERROR' });
        console.error(`Error deleting from ${record.table_name}:`, error.message);
      } else {
        await db.deleted_records.delete(record.id); // Remove tombstone on success
      }
    }

    console.log('Sync Push complete.');
    return hasErrors;
  } catch (err) {
    console.error('Sync Push failed:', err);
    throw err;
  }
}

// Orchestrate both pull and push
export async function syncAll() {
  const store = useAppStore.getState();

  // Guard against concurrent syncs
  if (store.syncStatus === 'syncing') {
    console.log('Sync is already in progress. Skipping...');
    return;
  }

  store.setSyncStatus('syncing');

  try {
    // Self-healing: Cleanup any orphaned child records locally whose parent period was deleted
    // This prevents foreign key constraint errors during push.
    await db.transaction('rw', [db.periods, db.bidang, db.organization_units, db.unit_members, db.user_roles, db.program_responsibility_pp, db.occasions], async () => {
      const periods = await db.periods.toArray();
      const periodIds = new Set(periods.map(p => p.id));
      
      const orphanedBidangs = (await db.bidang.toArray()).filter(b => !periodIds.has(b.period_id));
      for (const b of orphanedBidangs) await db.bidang.delete(b.id);
      
      const orphanedUnits = (await db.organization_units.toArray()).filter(u => !periodIds.has(u.period_id));
      for (const u of orphanedUnits) await db.organization_units.delete(u.id);

      const orphanedUnitMembers = (await db.unit_members.toArray()).filter(um => !periodIds.has(um.period_id));
      for (const um of orphanedUnitMembers) await db.unit_members.delete(um.id);

      const orphanedUserRoles = (await db.user_roles.toArray()).filter(ur => !periodIds.has(ur.period_id));
      for (const ur of orphanedUserRoles) await db.user_roles.delete(ur.id);

      const orphanedPPs = (await db.program_responsibility_pp.toArray()).filter(pp => !periodIds.has(pp.period_id));
      for (const pp of orphanedPPs) await db.program_responsibility_pp.delete(pp.id);

      // Helper to determine period duration in years
      const getDurationYears = (p: any) => {
        const start = new Date(p.start_date);
        const end = new Date(p.end_date);
        if (isNaN(start.getTime()) || isNaN(end.getTime())) return 1;
        return (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
      };

      const membershipPeriods = periods.filter(p => getDurationYears(p) > 2);
      const fiscalPeriods = periods.filter(p => getDurationYears(p) <= 2);
      
      const activeMembership = periods.find(p => p.is_active && getDurationYears(p) > 2) || membershipPeriods[0] || periods[0];
      const activeFiscal = periods.find(p => p.is_active && getDurationYears(p) <= 2) || fiscalPeriods[0] || periods[0];

      // Self-healing: Re-map child records with errors or referencing invalid/unsynced periods to valid active periods
      const validPeriodIds = new Set(periods.filter(p => p.sync_status !== 'ERROR').map(p => p.id));

      if (activeMembership) {
        // 1. Bidang
        const bidangs = await db.bidang.toArray();
        for (const b of bidangs) {
          if (!validPeriodIds.has(b.period_id) || b.sync_status === 'ERROR') {
            await db.bidang.update(b.id, { period_id: activeMembership.id, sync_status: 'PENDING' });
          }
        }

        // 2. Organization Units
        const units = await db.organization_units.toArray();
        for (const u of units) {
          if (!validPeriodIds.has(u.period_id) || u.sync_status === 'ERROR') {
            await db.organization_units.update(u.id, { period_id: activeMembership.id, sync_status: 'PENDING' });
          }
        }

        // 3. Unit Members
        const unitMembers = await db.unit_members.toArray();
        for (const um of unitMembers) {
          if (!validPeriodIds.has(um.period_id) || um.sync_status === 'ERROR') {
            await db.unit_members.update(um.id, { period_id: activeMembership.id, sync_status: 'PENDING' });
          }
        }

        // 4. User Roles
        const userRoles = await db.user_roles.toArray();
        for (const ur of userRoles) {
          if (!validPeriodIds.has(ur.period_id) || ur.sync_status === 'ERROR') {
            await db.user_roles.update(ur.id, { period_id: activeMembership.id, sync_status: 'PENDING' });
          }
        }

        // 5. Program Responsibility PP
        const pps = await db.program_responsibility_pp.toArray();
        for (const pp of pps) {
          if (!validPeriodIds.has(pp.period_id) || pp.sync_status === 'ERROR') {
            await db.program_responsibility_pp.update(pp.id, { period_id: activeMembership.id, sync_status: 'PENDING' });
          }
        }
      }

      // 6. Occasions (Prefer fiscal active period, fallback to membership)
      const targetOccasionPeriod = activeFiscal || activeMembership;
      if (targetOccasionPeriod) {
        const occasions = await db.occasions.toArray();
        for (const o of occasions) {
          if (!validPeriodIds.has(o.period_id) || o.sync_status === 'ERROR') {
            await db.occasions.update(o.id, { period_id: targetOccasionPeriod.id, sync_status: 'PENDING' });
          }
        }
      }

      const orphanedOccasions = (await db.occasions.toArray()).filter(o => !periodIds.has(o.period_id));
      for (const o of orphanedOccasions) await db.occasions.delete(o.id);
    });
  } catch (err) {
    console.error('Local cleanup failed:', err);
  }

  try {
    const pushErrors = await syncPush();
    await syncPull();
    if (pushErrors) {
      store.setSyncStatus('error');
    } else {
      store.setSyncStatus('success');
    }
    store.setLastSyncTime(new Date().toISOString());
  } catch (err) {
    console.error('syncAll failed:', err);
    store.setSyncStatus('error');
  }
}
