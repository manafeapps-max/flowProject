'use client';
import { PowerSyncDatabase, WASQLiteOpenFactory } from '@powersync/web';
import { appSchema } from './schema';
import { SupabaseConnector } from './connector';

export const connector = new SupabaseConnector();

export const db = new PowerSyncDatabase({
  schema: appSchema,
  database: new WASQLiteOpenFactory({
    dbFilename: 'flowproject.db',
    worker: '/@powersync/worker/WASQLiteDB.umd.js',
  }),
  sync: {
    worker: '/@powersync/worker/SharedSyncImplementation.umd.js',
  },
  flags: {
    enableMultiTabs: true,
  },
});

// Initialize connector
connector.init().then(() => {
  console.log('✅ PowerSync connector initialized');
}).catch((err) => {
  console.error('❌ PowerSync initialization failed:', err);
});

// Patch SSRDBAdapter if we are on the server side (SSR) to prevent "tx.execute is not a function" crash
if (typeof window === 'undefined') {
  try {
    const dbAdapter = db.database;
    const proto = Object.getPrototypeOf(dbAdapter);
    if (proto && typeof proto.generateMockTransactionContext === 'function') {
      const original = proto.generateMockTransactionContext;
      proto.generateMockTransactionContext = function() {
        const ctx = original.call(this);
        // Copy all functions from the prototype to the mock context
        const methods = ['execute', 'executeRaw', 'executeBatch', 'getAll', 'getOptional', 'get'];
        for (const method of methods) {
          if (typeof this[method] === 'function') {
            ctx[method] = this[method].bind(this);
          }
        }
        return ctx;
      };
      console.log('✅ PowerSync SSRDBAdapter patched successfully');
    }
  } catch (e) {
    console.error('❌ Failed to patch PowerSync SSRDBAdapter:', e);
  }
}

if (typeof window !== 'undefined') {
  (window as any).powersyncDb = db;
}